import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMandalarts } from '@/hooks/useMandalarts';
import { useActivateMandalart } from '@/hooks/useMandalartMutations';

export default function MandalartListScreen() {
  const navigation = useNavigation();
  const { data: mandalarts, isLoading } = useMandalarts();
  const activateMandalart = useActivateMandalart();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  const hasMandalarts = mandalarts && mandalarts.length > 0;

  const handleActivateMandalart = async (mandalartId: string, centerGoal: string) => {
    try {
      await activateMandalart.mutateAsync(mandalartId);
      Alert.alert('성공', `"${centerGoal}" 만다라트가 활성화되었습니다.`);
    } catch (error) {
      console.error('Failed to activate mandalart:', error);
      Alert.alert('오류', '만다라트 활성화 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>만다라트 관리</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('MandalartCreate' as never)}
        >
          <Ionicons name="add-circle" size={28} color="#0ea5e9" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {!hasMandalarts ? (
          <>
            <View style={styles.emptyState}>
              <Ionicons name="grid-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>만다라트가 없습니다</Text>
              <Text style={styles.emptySubtext}>
                첫 번째 만다라트를 생성하여{'\n'}목표 달성을 시작해보세요
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('MandalartCreate' as never)}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.createButtonText}>만다라트 만들기</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>만다라트란?</Text>
              <Text style={styles.infoText}>
                9x9 그리드로 목표를 체계적으로 관리하는 일본식 목표 설정 도구입니다.
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.mandalartList}>
            {mandalarts.map((mandalart) => (
              <TouchableOpacity key={mandalart.id} style={styles.mandalartCard}>
                <View style={styles.mandalartHeader}>
                  <Text style={styles.mandalartTitle}>{mandalart.center_goal}</Text>
                  {mandalart.is_active && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>활성</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.mandalartDate}>
                  생성일: {new Date(mandalart.created_at).toLocaleDateString('ko-KR')}
                </Text>
                <View style={styles.mandalartActions}>
                  <TouchableOpacity style={styles.viewButton}>
                    <Ionicons name="eye-outline" size={18} color="#0ea5e9" />
                    <Text style={styles.viewButtonText}>보기</Text>
                  </TouchableOpacity>
                  {!mandalart.is_active && (
                    <TouchableOpacity
                      style={styles.activateButton}
                      onPress={() => handleActivateMandalart(mandalart.id, mandalart.center_goal)}
                    >
                      <Text style={styles.activateButtonText}>활성화</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    padding: 4,
  },
  content: {
    flex: 1,
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
    lineHeight: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
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
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#0ea5e9',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  mandalartList: {
    padding: 16,
  },
  mandalartCard: {
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
  mandalartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mandalartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  activeBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  mandalartDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  mandalartActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  viewButtonText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '600',
  },
  activateButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#0ea5e9',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});