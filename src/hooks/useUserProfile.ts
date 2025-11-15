import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import type { UserGamification } from '@/types';

export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('User not authenticated');

      return {
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
      };
    },
  });
}

export function useUserGamification() {
  return useQuery({
    queryKey: ['user', 'gamification'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If no gamification record exists, return default values
        if (error.code === 'PGRST116') {
          return {
            user_id: user.id,
            total_xp: 0,
            current_level: 1,
            current_streak: 0,
            max_streak: 0,
            freeze_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as UserGamification;
        }
        throw error;
      }

      return data as UserGamification;
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['user', 'stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch gamification data
      const { data: gamification } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch total check count
      const { count: totalChecks } = await supabase
        .from('check_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch total badges
      const { count: totalBadges } = await supabase
        .from('user_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      return {
        totalChecks: totalChecks || 0,
        currentLevel: gamification?.current_level || 1,
        totalXP: gamification?.total_xp || 0,
        currentStreak: gamification?.current_streak || 0,
        maxStreak: gamification?.max_streak || 0,
        totalBadges: totalBadges || 0,
      };
    },
  });
}
