import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTodayActions } from '@/hooks/useTodayActions';
import { useCheckAction, useUncheckAction } from '@/hooks/useActionMutations';
import { getKSTDate } from '@/lib/timezone';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/feedback/Toast';

export default function TodayScreen() {
  const navigation = useNavigation();
  const { data: todayActions, isLoading, refetch } = useTodayActions();
  const checkAction = useCheckAction();
  const uncheckAction = useUncheckAction();
  const { showToast } = useToast();

  const onRefresh = async () => {
    await refetch();
  };

  const handleToggleCheck = async (actionId: string, isChecked: boolean, actionContent: string) => {
    try {
      if (isChecked) {
        // Uncheck
        await uncheckAction.mutateAsync(actionId);
        showToast('info', '체크가 취소되었습니다');
      } else {
        // Check
        const result = await checkAction.mutateAsync(actionId);

        let message = `+${result.xpAwarded} XP 획득!`;
        if (result.leveledUp) {
          message = `🎉 레벨 ${result.newLevel}로 레벨업! +${result.xpAwarded} XP 획득!`;
        }

        showToast('success', message);
      }
    } catch (error: any) {
      showToast('error', error.message || '체크 처리 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  // Calculate today's progress
  const today = getKSTDate(new Date());
  const dateStr = today.toISOString().split('T')[0];
  const completedToday =
    todayActions?.filter((action) => {
      const todayChecks = action.check_history.filter((check) => {
        const checkDate = getKSTDate(new Date(check.checked_at))
          .toISOString()
          .split('T')[0];
        return checkDate === dateStr;
      });
      return todayChecks.length > 0;
    }).length || 0;

  const totalToday = todayActions?.length || 0;
  const progressPercent =
    totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Format date in Korean
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const formattedDate = `${year}년 ${month}월 ${day}일`;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-16 pb-5 border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900 mb-1">오늘의 실천</Text>
        <Text className="text-sm text-gray-600">{formattedDate}</Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        {/* Progress Card */}
        <Card className="m-4">
          <Text className="text-base font-semibold text-gray-900 mb-2">
            오늘의 진행상황
          </Text>
          <Text className="text-2xl font-bold text-sky-500 mb-3">
            {completedToday} / {totalToday} 완료
          </Text>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-sky-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </Card>

        {totalToday === 0 ? (
          <View className="items-center justify-center py-16 px-5">
            <Ionicons name="checkmark-circle-outline" size={64} color="#d1d5db" />
            <Text className="text-lg font-semibold text-gray-700 mt-4 mb-2">
              오늘 실천할 항목이 없습니다
            </Text>
            <Text className="text-sm text-gray-600 text-center mb-6">
              만다라트를 생성하고 실천 항목을 추가해보세요
            </Text>
            <Button
              variant="primary"
              onPress={() => navigation.navigate('MandalartCreate' as never)}
            >
              만다라트 만들기
            </Button>
          </View>
        ) : (
          <View className="px-4 pb-4">
            {todayActions?.map((action) => {
              const todayChecks = action.check_history.filter((check) => {
                const checkDate = getKSTDate(new Date(check.checked_at))
                  .toISOString()
                  .split('T')[0];
                return checkDate === dateStr;
              });
              const isChecked = todayChecks.length > 0;

              return (
                <Card key={action.id} className="mb-3">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-xs text-gray-600 flex-1">
                      {action.sub_goal.mandalart.center_goal}
                    </Text>
                    <View
                      className={`px-2 py-1 rounded ml-2 ${
                        action.type === 'routine'
                          ? 'bg-blue-100'
                          : action.type === 'mission'
                          ? 'bg-pink-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Text className="text-xs font-semibold text-gray-700">
                        {action.type === 'routine' ? '루틴' : action.type === 'mission' ? '미션' : '참고'}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-base text-gray-900 mb-3">
                    {action.content}
                  </Text>
                  <TouchableOpacity
                    className={`flex-row items-center justify-center p-3 rounded-lg ${
                      isChecked ? 'bg-green-100' : 'bg-gray-50'
                    }`}
                    onPress={() => handleToggleCheck(action.id, isChecked, action.content)}
                    disabled={checkAction.isPending || uncheckAction.isPending}
                  >
                    <Ionicons
                      name={isChecked ? 'checkmark-circle' : 'checkmark-circle-outline'}
                      size={24}
                      color={isChecked ? '#10b981' : '#9ca3af'}
                    />
                    <Text
                      className={`text-sm font-semibold ml-2 ${
                        isChecked ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      {checkAction.isPending || uncheckAction.isPending
                        ? '처리중...'
                        : isChecked
                        ? '완료'
                        : '체크'}
                    </Text>
                  </TouchableOpacity>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}