import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/services/supabase';
import { useUserStats } from '@/hooks/useUserProfile';
import { useTodayActions } from '@/hooks/useTodayActions';
import { getLevelFromXP } from '@/lib/xpMultipliers';
import { getKSTDate } from '@/lib/timezone';

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
      <View style={[styles.container, styles.centered]}>
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
  const currentLevel = userStats ? getLevelFromXP(userStats.totalXP) : 1;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>홈</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>오늘의 진행상황</Text>
          <Text style={styles.cardSubtitle}>
            체크한 실천 항목: {completedToday} / {totalToday}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>레벨 & XP</Text>
          <Text style={styles.cardSubtitle}>
            Level {currentLevel} ({userStats?.totalXP || 0} XP)
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>스트릭</Text>
          <Text style={styles.cardSubtitle}>
            {userStats?.currentStreak || 0}일 연속 실천 중
          </Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('TodayTab' as never)}
        >
          <Text style={styles.actionButtonText}>실천하러 가기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#0ea5e9',
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  actionButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});