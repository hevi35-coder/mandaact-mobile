import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';

interface WeeklyReport {
  id: string;
  user_id: string;
  content: string;
  week_start: string;
  week_end: string;
  created_at: string;
}

interface GenerateWeeklyReportParams {
  userId: string;
}

/**
 * Hook for generating weekly reports using Supabase Edge Function
 */
export function useGenerateWeeklyReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: GenerateWeeklyReportParams) => {
      const { data, error } = await supabase.functions.invoke('generate-weekly-report', {
        body: { user_id: userId },
      });

      if (error) throw error;
      return data as WeeklyReport;
    },
    onSuccess: () => {
      // Invalidate weekly reports query to refetch
      queryClient.invalidateQueries({ queryKey: ['weeklyReports'] });
    },
  });
}

/**
 * Hook for fetching weekly report history
 */
export function useWeeklyReports(userId: string | undefined) {
  return useQuery({
    queryKey: ['weeklyReports', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('weekly_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as WeeklyReport[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching a single weekly report
 */
export function useWeeklyReport(reportId: string | undefined) {
  return useQuery({
    queryKey: ['weeklyReport', reportId],
    queryFn: async () => {
      if (!reportId) return null;

      const { data, error } = await supabase
        .from('weekly_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error) throw error;
      return data as WeeklyReport;
    },
    enabled: !!reportId,
  });
}
