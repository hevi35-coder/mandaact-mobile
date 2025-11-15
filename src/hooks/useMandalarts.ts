import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import type { Mandalart } from '@/types';

interface UseMandalartsOptions {
  onlyActive?: boolean;
}

export function useMandalarts(options: UseMandalartsOptions = {}) {
  const { onlyActive = false } = options;

  return useQuery({
    queryKey: ['mandalarts', { onlyActive }],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('mandalarts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (onlyActive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Mandalart[];
    },
  });
}

export function useActiveMandalart() {
  return useQuery({
    queryKey: ['mandalarts', 'active'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('mandalarts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data as Mandalart | null;
    },
  });
}

export function useMandalartDetail(mandalartId: string) {
  return useQuery({
    queryKey: ['mandalarts', mandalartId, 'detail'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('mandalarts')
        .select(`
          *,
          sub_goals (
            *,
            actions (*)
          )
        `)
        .eq('id', mandalartId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as Mandalart & { sub_goals: Array<any> };
    },
    enabled: !!mandalartId,
  });
}
