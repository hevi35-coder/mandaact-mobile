import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTodayActions } from '@/hooks/useTodayActions';
import { getKSTDate } from '@/lib/timezone';

export default function TodayScreen() {
  const navigation = useNavigation();
  const { data: todayActions, isLoading, refetch } = useTodayActions();

  const onRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>오늘의 실천</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>오늘의 진행상황</Text>
          <Text style={styles.progressText}>
            {completedToday} / {totalToday} 완료
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {totalToday === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>오늘 실천할 항목이 없습니다</Text>
            <Text style={styles.emptySubtext}>
              만다라트를 생성하고 실천 항목을 추가해보세요
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('MandalartCreate' as never)}
            >
              <Text style={styles.emptyButtonText}>만다라트 만들기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionsList}>
            {todayActions?.map((action) => {
              const todayChecks = action.check_history.filter((check) => {
                const checkDate = getKSTDate(new Date(check.checked_at))
                  .toISOString()
                  .split('T')[0];
                return checkDate === dateStr;
              });
              const isChecked = todayChecks.length > 0;

              return (
                <View key={action.id} style={styles.actionCard}>
                  <View style={styles.actionHeader}>
                    <Text style={styles.mandalartName}>
                      {action.sub_goal.mandalart.center_goal}
                    </Text>
                    <View style={[styles.typeBadge, styles[`type_${action.type}`]]}>
                      <Text style={styles.typeBadgeText}>
                        {action.type === 'routine' ? '루틴' : action.type === 'mission' ? '미션' : '참고'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.actionContent}>{action.content}</Text>
                  <TouchableOpacity
                    style={[styles.checkButton, isChecked && styles.checkButtonChecked]}
                    onPress={() => {
                      // TODO: Implement check/uncheck
                    }}
                  >
                    <Ionicons
                      name={isChecked ? 'checkmark-circle' : 'checkmark-circle-outline'}
                      size={24}
                      color={isChecked ? '#10b981' : '#9ca3af'}
                    />
                    <Text style={[styles.checkButtonText, isChecked && styles.checkButtonTextChecked]}>
                      {isChecked ? '완료' : '체크'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
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
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
  },
  content: {
    flex: 1,
  },
  progressCard: {
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
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsList: {
    padding: 16,
    paddingTop: 0,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mandalartName: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  type_routine: {
    backgroundColor: '#dbeafe',
  },
  type_mission: {
    backgroundColor: '#fce7f3',
  },
  type_reference: {
    backgroundColor: '#f3f4f6',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
  actionContent: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    gap: 8,
  },
  checkButtonChecked: {
    backgroundColor: '#d1fae5',
  },
  checkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  checkButtonTextChecked: {
    color: '#10b981',
  },
});