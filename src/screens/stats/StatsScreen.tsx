import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStats } from '@/hooks/useUserProfile';
import { getLevelFromXP } from '@/lib/xpMultipliers';
import { supabase } from '@/services/supabase';
import { getKSTDate } from '@/lib/timezone';
import { Card } from '@/components/ui/Card';

interface HeatmapData {
  date: string;
  count: number;
  percentage: number;
}

export default function StatsScreen() {
  const { data: userStats, isLoading } = useUserStats();
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [loadingHeatmap, setLoadingHeatmap] = useState(true);

  useEffect(() => {
    loadHeatmapData();
  }, []);

  const loadHeatmapData = async () => {
    setLoadingHeatmap(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get last 28 days of check history
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 28);

      const { data: checks } = await supabase
        .from('check_history')
        .select('checked_at')
        .eq('user_id', user.id)
        .gte('checked_at', startDate.toISOString());

      // Get total actions count for percentage calculation
      const { data: actions } = await supabase
        .from('actions')
        .select('id, sub_goal:sub_goals!inner(mandalart:mandalarts!inner(user_id, is_active))')
        .eq('sub_goal.mandalart.user_id', user.id)
        .eq('sub_goal.mandalart.is_active', true);

      const totalActions = actions?.length || 0;

      // Group checks by date
      const dateMap: Record<string, number> = {};
      checks?.forEach((check) => {
        const date = getKSTDate(new Date(check.checked_at));
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
      });

      // Convert to array
      const heatmap: HeatmapData[] = Object.entries(dateMap).map(([date, count]) => ({
        date,
        count,
        percentage: totalActions > 0 ? Math.round((count / totalActions) * 100) : 0,
      }));

      setHeatmapData(heatmap);
    } catch (error) {
      console.error('Failed to load heatmap data:', error);
    } finally {
      setLoadingHeatmap(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  const currentLevel = userStats ? getLevelFromXP(userStats.totalXP) : 1;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-16 pb-5 border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900">통계</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Stats Grid */}
        <View className="flex-row flex-wrap p-3 gap-3">
          <Card className="flex-1 min-w-[45%] items-center">
            <Ionicons name="checkmark-circle" size={32} color="#10b981" />
            <Text className="text-2xl font-bold mt-2 mb-1 text-gray-900">
              {userStats?.totalChecks || 0}
            </Text>
            <Text className="text-xs text-gray-600">총 체크</Text>
          </Card>

          <Card className="flex-1 min-w-[45%] items-center">
            <Ionicons name="flame" size={32} color="#f59e0b" />
            <Text className="text-2xl font-bold mt-2 mb-1 text-gray-900">
              {userStats?.currentStreak || 0}일
            </Text>
            <Text className="text-xs text-gray-600">현재 스트릭</Text>
          </Card>

          <Card className="flex-1 min-w-[45%] items-center">
            <Ionicons name="trophy" size={32} color="#8b5cf6" />
            <Text className="text-2xl font-bold mt-2 mb-1 text-gray-900">
              Lv.{currentLevel}
            </Text>
            <Text className="text-xs text-gray-600">레벨</Text>
          </Card>

          <Card className="flex-1 min-w-[45%] items-center">
            <Ionicons name="star" size={32} color="#eab308" />
            <Text className="text-2xl font-bold mt-2 mb-1 text-gray-900">
              {userStats?.totalBadges || 0}
            </Text>
            <Text className="text-xs text-gray-600">획득 배지</Text>
          </Card>
        </View>

        {/* Weekly Progress */}
        <Card className="mx-4 mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-4">
            주간 진행률
          </Text>
          <View className="flex-row justify-between">
            {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
              <View key={index} className="items-center gap-2">
                <Text className="text-xs text-gray-600">{day}</Text>
                <View className="w-8 h-8 bg-gray-200 rounded-full" />
              </View>
            ))}
          </View>
        </Card>

        {/* Heatmap */}
        <Card className="mx-4 mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-4">
            최근 4주 활동
          </Text>
          {loadingHeatmap ? (
            <View className="items-center py-10">
              <ActivityIndicator size="small" color="#0ea5e9" />
            </View>
          ) : (
            <>
              <View className="flex-row flex-wrap gap-1">
                {Array.from({ length: 28 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (27 - i));
                  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  const data = heatmapData.find((d) => d.date === dateStr);

                  const today = getKSTDate(new Date());
                  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                  const isToday = dateStr === todayStr;

                  let color = '#e5e7eb'; // none
                  if (data) {
                    if (data.percentage >= 80) {
                      color = '#10b981'; // high - green-500
                    } else if (data.percentage >= 50) {
                      color = '#34d399'; // medium - green-400
                    } else if (data.percentage >= 20) {
                      color = '#6ee7b7'; // low - green-300
                    } else {
                      color = '#a7f3d0'; // minimal - green-200
                    }
                  }

                  return (
                    <TouchableOpacity
                      key={dateStr}
                      className={`w-[12.5%] aspect-square rounded ${isToday ? 'border-2 border-sky-500' : ''}`}
                      style={{ backgroundColor: color }}
                      activeOpacity={0.7}
                    />
                  );
                })}
              </View>
              <View className="flex-row items-center justify-center mt-4 gap-2">
                <Text className="text-xs text-gray-600">0%</Text>
                <View className="flex-row gap-1">
                  <View className="w-3 h-3 bg-gray-200 rounded" />
                  <View className="w-3 h-3 bg-green-200 rounded" />
                  <View className="w-3 h-3 bg-green-300 rounded" />
                  <View className="w-3 h-3 bg-green-400 rounded" />
                  <View className="w-3 h-3 bg-green-500 rounded" />
                </View>
                <Text className="text-xs text-gray-600">100%</Text>
              </View>
            </>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}