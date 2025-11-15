import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { shouldShowToday } from '@/lib/actionTypes';
import { getKSTDate } from '@/lib/timezone';
import type { Action, SubGoal, Mandalart, CheckHistory } from '@/types';

interface ActionWithRelations extends Action {
  sub_goal: SubGoal & {
    mandalart: Mandalart;
  };
  check_history: CheckHistory[];
}

export function useTodayActions() {
  return useQuery({
    queryKey: ['actions', 'today'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch all actions from active mandalarts
      const { data: actions, error } = await supabase
        .from('actions')
        .select(`
          *,
          sub_goal:sub_goals (
            *,
            mandalart:mandalarts (*)
          ),
          check_history (*)
        `)
        .eq('sub_goal.mandalart.user_id', user.id)
        .eq('sub_goal.mandalart.is_active', true)
        .order('position');

      if (error) throw error;

      const typedActions = actions as unknown as ActionWithRelations[];

      // Filter actions that should show today
      const today = getKSTDate(new Date());
      const todayActions = typedActions.filter((action) => {
        // Filter check history for today
        const todayChecks = action.check_history.filter((check) => {
          const checkDate = getKSTDate(new Date(check.checked_at));
          return checkDate.toISOString().split('T')[0] === today.toISOString().split('T')[0];
        });

        return shouldShowToday(action);
      });

      return todayActions;
    },
  });
}

export function useActionCheckHistory(actionId: string, date?: Date) {
  const targetDate = date || new Date();
  const kstDate = getKSTDate(targetDate);
  const dateStr = kstDate.toISOString().split('T')[0];

  return useQuery({
    queryKey: ['check-history', actionId, dateStr],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('check_history')
        .select('*')
        .eq('action_id', actionId)
        .eq('user_id', user.id)
        .gte('checked_at', `${dateStr}T00:00:00+09:00`)
        .lt('checked_at', `${dateStr}T23:59:59+09:00`)
        .order('checked_at', { ascending: false });

      if (error) throw error;
      return data as CheckHistory[];
    },
  });
}
