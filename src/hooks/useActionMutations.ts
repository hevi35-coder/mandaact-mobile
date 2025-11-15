import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { getKSTDate } from '@/lib/timezone';
import { getActiveMultipliers, calculateXPWithMultipliers, getLevelFromXP } from '@/lib/xpMultipliers';
import type { CheckHistory } from '@/types';

const BASE_XP_PER_CHECK = 10;

interface CheckActionResult {
  checkHistory: CheckHistory;
  xpAwarded: number;
  newTotalXP: number;
  newLevel: number;
  leveledUp: boolean;
}

export function useCheckAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (actionId: string): Promise<CheckActionResult> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const now = new Date();
      const kstNow = getKSTDate(now);
      const today = kstNow.toISOString().split('T')[0];

      // 1. Check if already checked today
      const { data: existingChecks } = await supabase
        .from('check_history')
        .select('*')
        .eq('action_id', actionId)
        .eq('user_id', user.id)
        .gte('checked_at', `${today}T00:00:00+09:00`)
        .lt('checked_at', `${today}T23:59:59+09:00`);

      if (existingChecks && existingChecks.length > 0) {
        throw new Error('이미 오늘 체크한 항목입니다.');
      }

      // 2. Create check history
      const { data: checkHistory, error: checkError } = await supabase
        .from('check_history')
        .insert({
          action_id: actionId,
          user_id: user.id,
          checked_at: now.toISOString(),
        })
        .select()
        .single();

      if (checkError) throw checkError;

      // 3. Get active multipliers
      const multipliers = await getActiveMultipliers(user.id);
      const finalXP = calculateXPWithMultipliers(BASE_XP_PER_CHECK, multipliers);

      // 4. Update user gamification
      const { data: gamification, error: gamificationError } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (gamificationError && gamificationError.code !== 'PGRST116') {
        throw gamificationError;
      }

      let currentXP = gamification?.total_xp || 0;
      let currentLevel = gamification ? getLevelFromXP(gamification.total_xp) : 1;
      const newTotalXP = currentXP + finalXP;
      const newLevel = getLevelFromXP(newTotalXP);
      const leveledUp = newLevel > currentLevel;

      if (gamification) {
        // Update existing gamification record
        const { error: updateError } = await supabase
          .from('user_gamification')
          .update({
            total_xp: newTotalXP,
            current_level: newLevel,
            updated_at: now.toISOString(),
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Create new gamification record
        const { error: insertError } = await supabase
          .from('user_gamification')
          .insert({
            user_id: user.id,
            total_xp: newTotalXP,
            current_level: newLevel,
            current_streak: 0,
            max_streak: 0,
            freeze_count: 0,
          });

        if (insertError) throw insertError;
      }

      return {
        checkHistory: checkHistory as CheckHistory,
        xpAwarded: finalXP,
        newTotalXP,
        newLevel,
        leveledUp,
      };
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['actions', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'gamification'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['check-history'] });
    },
  });
}

export function useUncheckAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (actionId: string): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const now = new Date();
      const kstNow = getKSTDate(now);
      const today = kstNow.toISOString().split('T')[0];

      // 1. Find today's check history
      const { data: checkHistory } = await supabase
        .from('check_history')
        .select('*')
        .eq('action_id', actionId)
        .eq('user_id', user.id)
        .gte('checked_at', `${today}T00:00:00+09:00`)
        .lt('checked_at', `${today}T23:59:59+09:00`)
        .order('checked_at', { ascending: false })
        .limit(1);

      if (!checkHistory || checkHistory.length === 0) {
        throw new Error('오늘 체크한 기록이 없습니다.');
      }

      const latestCheck = checkHistory[0];

      // 2. Delete check history
      const { error: deleteError } = await supabase
        .from('check_history')
        .delete()
        .eq('id', latestCheck.id);

      if (deleteError) throw deleteError;

      // 3. Deduct XP
      const { data: gamification } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (gamification) {
        // Get multipliers at the time of check
        const multipliers = await getActiveMultipliers(user.id);
        const deductXP = calculateXPWithMultipliers(BASE_XP_PER_CHECK, multipliers);

        const newTotalXP = Math.max(0, gamification.total_xp - deductXP);
        const newLevel = getLevelFromXP(newTotalXP);

        const { error: updateError } = await supabase
          .from('user_gamification')
          .update({
            total_xp: newTotalXP,
            current_level: newLevel,
            updated_at: now.toISOString(),
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['actions', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'gamification'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['check-history'] });
    },
  });
}

export function useToggleAction() {
  const checkAction = useCheckAction();
  const uncheckAction = useUncheckAction();

  return {
    toggle: async (actionId: string, isChecked: boolean): Promise<CheckActionResult | void> => {
      if (isChecked) {
        return await uncheckAction.mutateAsync(actionId);
      } else {
        return await checkAction.mutateAsync(actionId);
      }
    },
    isLoading: checkAction.isPending || uncheckAction.isPending,
  };
}
