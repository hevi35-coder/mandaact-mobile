import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useMandalartDetail } from '@/hooks/useMandalarts';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CELL_SIZE = Math.floor((SCREEN_WIDTH - 32) / 9); // 9 columns with padding

interface RouteParams {
  mandalartId: string;
}

export default function MandalartDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { mandalartId } = route.params as RouteParams;

  const { data: mandalart, isLoading } = useMandalartDetail(mandalartId);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (!mandalart) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>만다라트를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  // Build 9x9 grid structure
  const grid: Array<Array<{ type: 'center' | 'subgoal' | 'action'; content: string; id?: string }>> = Array(9)
    .fill(null)
    .map(() => Array(9).fill({ type: 'action', content: '', id: undefined }));

  // Center cell (4,4) - Center goal
  grid[4][4] = {
    type: 'center',
    content: mandalart.center_goal,
    id: mandalart.id,
  };

  // Sub-goals positions (surrounding center)
  const subGoalPositions = [
    [3, 3], // Top-left
    [3, 4], // Top
    [3, 5], // Top-right
    [4, 5], // Right
    [5, 5], // Bottom-right
    [5, 4], // Bottom
    [5, 3], // Bottom-left
    [4, 3], // Left
  ];

  mandalart.sub_goals?.forEach((subGoal, index) => {
    if (index < 8) {
      const [row, col] = subGoalPositions[index];
      grid[row][col] = {
        type: 'subgoal',
        content: subGoal.title,
        id: subGoal.id,
      };

      // Calculate which 3x3 section this sub-goal belongs to
      const sectionRow = Math.floor(index / 3);
      const sectionCol = index % 3;
      const baseRow = sectionRow * 3;
      const baseCol = sectionCol * 3;

      // Place actions in the 3x3 section
      const actionPositions = [
        [0, 0], [0, 1], [0, 2],
        [1, 2], [2, 2], [2, 1],
        [2, 0], [1, 0],
      ];

      subGoal.actions?.forEach((action: any, actionIndex: number) => {
        if (actionIndex < 8) {
          const [offsetRow, offsetCol] = actionPositions[actionIndex];
          const gridRow = baseRow + offsetRow;
          const gridCol = baseCol + offsetCol;

          // Skip if it's the center position of this 3x3 section (sub-goal)
          if (!(gridRow === row && gridCol === col)) {
            grid[gridRow][gridCol] = {
              type: 'action',
              content: action.content || action.title,
              id: action.id,
            };
          }
        }
      });
    }
  });

  const getCellStyle = (type: 'center' | 'subgoal' | 'action') => {
    switch (type) {
      case 'center':
        return styles.centerCell;
      case 'subgoal':
        return styles.subgoalCell;
      default:
        return styles.actionCell;
    }
  };

  const getCellTextStyle = (type: 'center' | 'subgoal' | 'action') => {
    switch (type) {
      case 'center':
        return styles.centerText;
      case 'subgoal':
        return styles.subgoalText;
      default:
        return styles.actionText;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {mandalart.center_goal}
        </Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          <View style={styles.gridContainer}>
            {grid.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {row.map((cell, colIndex) => (
                  <TouchableOpacity
                    key={`${rowIndex}-${colIndex}`}
                    style={[
                      styles.gridCell,
                      getCellStyle(cell.type),
                      {
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                      },
                    ]}
                    onPress={() => {
                      if (cell.id && cell.type === 'action') {
                        // TODO: Open action edit modal
                      }
                    }}
                  >
                    <Text
                      style={getCellTextStyle(cell.type)}
                      numberOfLines={cell.type === 'center' ? 2 : 3}
                      adjustsFontSizeToFit
                    >
                      {cell.content}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.centerCell]} />
            <Text style={styles.legendText}>핵심 목표</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.subgoalCell]} />
            <Text style={styles.legendText}>세부 목표</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.actionCell]} />
            <Text style={styles.legendText}>실천 항목</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>만다라트 활용 팁</Text>
          <Text style={styles.infoText}>
            • 각 실천 항목을 탭하여 상세 내용을 확인하세요{'\n'}
            • 세부 목표별로 실천 항목이 그룹화되어 있습니다{'\n'}
            • 중앙의 핵심 목표를 항상 기억하세요
          </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 12,
    textAlign: 'center',
  },
  menuButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  horizontalScroll: {
    alignItems: 'center',
  },
  gridContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    borderWidth: 0.5,
    borderColor: '#d1d5db',
  },
  centerCell: {
    backgroundColor: '#dbeafe',
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  subgoalCell: {
    backgroundColor: '#fef3c7',
    borderWidth: 1.5,
    borderColor: '#f59e0b',
  },
  actionCell: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
  },
  centerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0c4a6e',
    textAlign: 'center',
  },
  subgoalText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78350f',
    textAlign: 'center',
  },
  actionText: {
    fontSize: 9,
    color: '#374151',
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
});
