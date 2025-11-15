import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStats } from '@/hooks/useUserProfile';
import { getLevelFromXP } from '@/lib/xpMultipliers';
import { supabase } from '@/services/supabase';
import { getKSTDate } from '@/lib/timezone';

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
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  const currentLevel = userStats ? getLevelFromXP(userStats.totalXP) : 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>통계</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={32} color="#10b981" />
            <Text style={styles.statValue}>{userStats?.totalChecks || 0}</Text>
            <Text style={styles.statLabel}>총 체크</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="flame" size={32} color="#f59e0b" />
            <Text style={styles.statValue}>{userStats?.currentStreak || 0}일</Text>
            <Text style={styles.statLabel}>현재 스트릭</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="trophy" size={32} color="#8b5cf6" />
            <Text style={styles.statValue}>Lv.{currentLevel}</Text>
            <Text style={styles.statLabel}>레벨</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="star" size={32} color="#eab308" />
            <Text style={styles.statValue}>{userStats?.totalBadges || 0}</Text>
            <Text style={styles.statLabel}>획득 배지</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주간 진행률</Text>
          <View style={styles.weekGrid}>
            {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
              <View key={index} style={styles.dayCell}>
                <Text style={styles.dayLabel}>{day}</Text>
                <View style={[styles.dayDot, { backgroundColor: '#e5e7eb' }]} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>최근 4주 활동</Text>
          {loadingHeatmap ? (
            <View style={styles.heatmapPlaceholder}>
              <ActivityIndicator size="small" color="#0ea5e9" />
            </View>
          ) : (
            <>
              <View style={styles.heatmapGrid}>
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
                      style={[
                        styles.heatmapCell,
                        { backgroundColor: color },
                        isToday && styles.heatmapCellToday,
                      ]}
                      activeOpacity={0.7}
                    />
                  );
                })}
              </View>
              <View style={styles.heatmapLegend}>
                <Text style={styles.legendText}>0%</Text>
                <View style={styles.legendGradient}>
                  <View style={[styles.legendDot, { backgroundColor: '#e5e7eb' }]} />
                  <View style={[styles.legendDot, { backgroundColor: '#a7f3d0' }]} />
                  <View style={[styles.legendDot, { backgroundColor: '#6ee7b7' }]} />
                  <View style={[styles.legendDot, { backgroundColor: '#34d399' }]} />
                  <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
                </View>
                <Text style={styles.legendText}>100%</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  heatmapPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  heatmapCell: {
    width: '12.5%',
    aspectRatio: 1,
    borderRadius: 4,
  },
  heatmapCellToday: {
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  legendGradient: {
    flexDirection: 'row',
    gap: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  placeholderText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
});