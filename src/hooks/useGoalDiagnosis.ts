import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';

interface SMARTScore {
  specific: number;
  measurable: number;
  achievable: number;
  relevant: number;
  timeBound: number;
  total: number;
}

interface GoalDiagnosis {
  id: string;
  mandalart_id: string;
  user_id: string;
  smart_score: SMARTScore;
  analysis: string;
  suggestions: string[];
  created_at: string;
}

interface GenerateGoalDiagnosisParams {
  mandalartId: string;
}

/**
 * Hook for generating goal diagnosis using Supabase Edge Function
 */
export function useGenerateGoalDiagnosis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mandalartId }: GenerateGoalDiagnosisParams) => {
      const { data, error } = await supabase.functions.invoke('generate-goal-diagnosis', {
        body: { mandalart_id: mandalartId },
      });

      if (error) throw error;
      return data as GoalDiagnosis;
    },
    onSuccess: (data) => {
      // Invalidate diagnoses query to refetch
      queryClient.invalidateQueries({ queryKey: ['goalDiagnoses'] });
      // Also invalidate specific mandalart diagnosis
      queryClient.invalidateQueries({ queryKey: ['goalDiagnosis', data.mandalart_id] });
    },
  });
}

/**
 * Hook for fetching goal diagnosis history
 */
export function useGoalDiagnoses(userId: string | undefined) {
  return useQuery({
    queryKey: ['goalDiagnoses', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('goal_diagnoses')
        .select('*, mandalart:mandalarts(center_goal)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as GoalDiagnosis[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching a specific goal diagnosis by mandalart ID
 */
export function useGoalDiagnosis(mandalartId: string | undefined) {
  return useQuery({
    queryKey: ['goalDiagnosis', mandalartId],
    queryFn: async () => {
      if (!mandalartId) return null;

      const { data, error } = await supabase
        .from('goal_diagnoses')
        .select('*')
        .eq('mandalart_id', mandalartId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no diagnosis exists yet, return null instead of throwing
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data as GoalDiagnosis;
    },
    enabled: !!mandalartId,
  });
}
