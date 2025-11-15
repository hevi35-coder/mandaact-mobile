import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>통계</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={32} color="#10b981" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>총 체크</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="flame" size={32} color="#f59e0b" />
            <Text style={styles.statValue}>0일</Text>
            <Text style={styles.statLabel}>현재 스트릭</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="trophy" size={32} color="#8b5cf6" />
            <Text style={styles.statValue}>Lv.1</Text>
            <Text style={styles.statLabel}>레벨</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="star" size={32} color="#eab308" />
            <Text style={styles.statValue}>0</Text>
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
          <Text style={styles.sectionTitle}>월간 히트맵</Text>
          <View style={styles.heatmapPlaceholder}>
            <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
            <Text style={styles.placeholderText}>
              체크 데이터가 쌓이면 히트맵이 표시됩니다
            </Text>
          </View>
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
  placeholderText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
});