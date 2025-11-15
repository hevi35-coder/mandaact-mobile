import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import type { Mandalart, SubGoal, Action } from '@/types';

interface CreateMandalartInput {
  centerGoal: string;
  subGoals: Array<{
    title: string;
    actions: Array<{
      content: string;
      type?: 'routine' | 'mission' | 'reference';
    }>;
  }>;
}

export function useCreateMandalart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMandalartInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // 1. Create mandalart
      const { data: mandalart, error: mandalartError } = await supabase
        .from('mandalarts')
        .insert({
          user_id: user.id,
          center_goal: input.centerGoal,
          title: input.centerGoal, // Use center_goal as title for now
          input_method: 'manual',
          is_active: true, // First mandalart is active by default
        })
        .select()
        .single();

      if (mandalartError) throw mandalartError;

      // 2. Create sub-goals and actions
      for (let i = 0; i < input.subGoals.length; i++) {
        const subGoalData = input.subGoals[i];
        if (!subGoalData.title.trim()) continue; // Skip empty sub-goals

        const { data: subGoal, error: subGoalError } = await supabase
          .from('sub_goals')
          .insert({
            mandalart_id: mandalart.id,
            title: subGoalData.title,
            position: i + 1, // 1-indexed
          })
          .select()
          .single();

        if (subGoalError) throw subGoalError;

        // 3. Create actions for this sub-goal
        const actionsToInsert = subGoalData.actions
          .map((action, actionIdx) => {
            if (!action.content.trim()) return null; // Skip empty actions

            return {
              sub_goal_id: subGoal.id,
              content: action.content,
              title: action.content, // Use content as title
              position: actionIdx + 1, // 1-indexed
              type: action.type || 'routine', // Default to routine
            };
          })
          .filter(Boolean);

        if (actionsToInsert.length > 0) {
          const { error: actionsError } = await supabase
            .from('actions')
            .insert(actionsToInsert);

          if (actionsError) throw actionsError;
        }
      }

      return mandalart as Mandalart;
    },
    onSuccess: () => {
      // Invalidate mandalarts query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['mandalarts'] });
    },
  });
}

export function useUpdateMandalart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Mandalart>;
    }) => {
      const { data, error } = await supabase
        .from('mandalarts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Mandalart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mandalarts'] });
    },
  });
}

export function useActivateMandalart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mandalartId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Deactivate all other mandalarts first
      await supabase
        .from('mandalarts')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Activate the selected mandalart
      const { data, error } = await supabase
        .from('mandalarts')
        .update({ is_active: true })
        .eq('id', mandalartId)
        .select()
        .single();

      if (error) throw error;
      return data as Mandalart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mandalarts'] });
      queryClient.invalidateQueries({ queryKey: ['actions', 'today'] });
    },
  });
}

export function useDeleteMandalart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mandalartId: string) => {
      // Cascade delete will handle sub_goals and actions automatically
      const { error } = await supabase
        .from('mandalarts')
        .delete()
        .eq('id', mandalartId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mandalarts'] });
      queryClient.invalidateQueries({ queryKey: ['actions', 'today'] });
    },
  });
}
