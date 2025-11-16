import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/services/supabase';
import { useUserStats } from '@/hooks/useUserProfile';
import { useTodayActions } from '@/hooks/useTodayActions';
import { getLevelFromXP, calculateXPForLevel } from '@/lib/xpMultipliers';
import { getKSTDate } from '@/lib/timezone';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { XPProgressBar, LevelBadge } from '@/components/gamification';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { data: userStats, isLoading: statsLoading } = useUserStats();
  const { data: todayActions, isLoading: actionsLoading } = useTodayActions();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isLoading = statsLoading || actionsLoading;

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  // Calculate today's completion
  const today = getKSTDate(new Date()).toISOString().split('T')[0];
  const completedToday =
    todayActions?.filter((action) => {
      const todayChecks = action.check_history.filter((check) => {
        const checkDate = getKSTDate(new Date(check.checked_at))
          .toISOString()
          .split('T')[0];
        return checkDate === today;
      });
      return todayChecks.length > 0;
    }).length || 0;

  const totalToday = todayActions?.length || 0;
  const totalXP = userStats?.totalXP || 0;
  const currentLevel = getLevelFromXP(totalXP);

  // Calculate XP progress for current level
  const currentLevelXP = calculateXPForLevel(currentLevel);
  const nextLevelXP = calculateXPForLevel(currentLevel + 1);
  const currentXP = totalXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-16 pb-5 bg-white">
        <Text className="text-3xl font-bold text-gray-900">홈</Text>
        <Button variant="ghost" size="sm" onPress={handleLogout}>
          로그아웃
        </Button>
      </View>

      {/* Content */}
      <View className="p-5">
        {/* Level & XP Card */}
        <Card className="mb-4 items-center">
          <View className="flex-row items-center justify-center mb-4">
            <LevelBadge level={currentLevel} size="lg" />
            <View className="ml-4">
              <Text className="text-lg font-semibold text-gray-900">
                Level {currentLevel}
              </Text>
              <Text className="text-sm text-gray-600">
                {totalXP.toLocaleString()} Total XP
              </Text>
            </View>
          </View>
          <XPProgressBar
            currentXP={currentXP}
            nextLevelXP={xpNeeded}
            level={currentLevel}
          />
        </Card>

        {/* Today's Progress Card */}
        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            오늘의 진행상황
          </Text>
          <View className="flex-row items-end">
            <Text className="text-4xl font-bold text-sky-500">
              {completedToday}
            </Text>
            <Text className="text-lg text-gray-600 ml-1 mb-1">
              / {totalToday}
            </Text>
          </View>
          <Text className="text-sm text-gray-600 mt-1">
            체크한 실천 항목
          </Text>
        </Card>

        {/* Streak Card */}
        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            스트릭
          </Text>
          <View className="flex-row items-center">
            <Text className="text-4xl mr-2">🔥</Text>
            <View>
              <Text className="text-3xl font-bold text-orange-500">
                {userStats?.currentStreak || 0}
              </Text>
              <Text className="text-sm text-gray-600">일 연속 실천 중</Text>
            </View>
          </View>
        </Card>

        {/* Action Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => navigation.navigate('TodayTab' as never)}
          className="mt-2"
        >
          실천하러 가기
        </Button>
      </View>
    </ScrollView>
  );
}