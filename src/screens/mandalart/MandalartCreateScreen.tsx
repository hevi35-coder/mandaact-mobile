import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCreateMandalart } from '@/hooks/useMandalartMutations';

type InputMethod = 'manual' | 'image' | 'text';

interface ManualInputData {
  centerGoal: string;
  subGoals: string[];
  actions: { [key: number]: string[] }; // subGoalIndex -> actions[]
}

export default function MandalartCreateScreen() {
  const navigation = useNavigation();
  const createMandalart = useCreateMandalart();
  const [inputMethod, setInputMethod] = useState<InputMethod>('manual');
  const [step, setStep] = useState<'center' | 'subgoals' | 'actions'>('center');

  // Manual input state
  const [manualData, setManualData] = useState<ManualInputData>({
    centerGoal: '',
    subGoals: Array(8).fill(''),
    actions: {},
  });
  const [currentSubGoalIndex, setCurrentSubGoalIndex] = useState(0);

  const handleBack = () => {
    Alert.alert(
      '만다라트 생성 취소',
      '지금까지 입력한 내용이 사라집니다. 정말 취소하시겠습니까?',
      [
        { text: '계속 작성', style: 'cancel' },
        { text: '취소', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleNextStep = () => {
    if (step === 'center') {
      if (!manualData.centerGoal.trim()) {
        Alert.alert('알림', '핵심 목표를 입력해주세요.');
        return;
      }
      setStep('subgoals');
    } else if (step === 'subgoals') {
      const filledCount = manualData.subGoals.filter((sg) => sg.trim()).length;
      if (filledCount === 0) {
        Alert.alert('알림', '최소 1개 이상의 세부 목표를 입력해주세요.');
        return;
      }
      setStep('actions');
      setCurrentSubGoalIndex(0);
    }
  };

  const handlePrevStep = () => {
    if (step === 'actions') {
      setStep('subgoals');
    } else if (step === 'subgoals') {
      setStep('center');
    }
  };

  const handleSubGoalChange = (index: number, value: string) => {
    const newSubGoals = [...manualData.subGoals];
    newSubGoals[index] = value;
    setManualData({ ...manualData, subGoals: newSubGoals });
  };

  const handleActionChange = (subGoalIndex: number, actionIndex: number, value: string) => {
    const currentActions = manualData.actions[subGoalIndex] || Array(8).fill('');
    const newActions = [...currentActions];
    newActions[actionIndex] = value;

    setManualData({
      ...manualData,
      actions: {
        ...manualData.actions,
        [subGoalIndex]: newActions,
      },
    });
  };

  const handleSaveMandalart = async () => {
    try {
      // Prepare data
      const subGoalsData = manualData.subGoals
        .map((title, index) => {
          if (!title.trim()) return null;

          const actions = (manualData.actions[index] || [])
            .map((content) => ({
              content: content.trim(),
              type: 'routine' as const, // Default type, can be changed later
            }))
            .filter((action) => action.content);

          return {
            title: title.trim(),
            actions,
          };
        })
        .filter(Boolean) as Array<{
          title: string;
          actions: Array<{ content: string; type: 'routine' | 'mission' | 'reference' }>;
        }>;

      if (subGoalsData.length === 0) {
        Alert.alert('알림', '최소 1개 이상의 세부 목표와 실천 항목을 입력해주세요.');
        return;
      }

      // Create mandalart
      await createMandalart.mutateAsync({
        centerGoal: manualData.centerGoal.trim(),
        subGoals: subGoalsData,
      });

      Alert.alert('성공', '만다라트가 생성되었습니다!', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Failed to create mandalart:', error);
      Alert.alert('오류', '만다라트 생성 중 오류가 발생했습니다.');
    }
  };

  const renderProgressIndicator = () => {
    const totalSteps = 3;
    const currentStepIndex = step === 'center' ? 0 : step === 'subgoals' ? 1 : 2;
    const progress = ((currentStepIndex + 1) / totalSteps) * 100;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {step === 'center' && '1/3 핵심 목표'}
          {step === 'subgoals' && '2/3 세부 목표'}
          {step === 'actions' && '3/3 실천 항목'}
        </Text>
      </View>
    );
  };

  const renderCenterGoalInput = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>핵심 목표를 입력하세요</Text>
      <Text style={styles.stepDescription}>
        이루고 싶은 핵심 목표를 명확하게 작성해주세요.
      </Text>

      <TextInput
        style={styles.centerInput}
        placeholder="예: 건강한 삶 만들기"
        value={manualData.centerGoal}
        onChangeText={(text) => setManualData({ ...manualData, centerGoal: text })}
        multiline
        textAlignVertical="top"
        maxLength={50}
      />

      <Text style={styles.charCount}>
        {manualData.centerGoal.length} / 50
      </Text>

      <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
        <Text style={styles.nextButtonText}>다음</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderSubGoalsInput = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>세부 목표 입력 (최대 8개)</Text>
      <Text style={styles.stepDescription}>
        핵심 목표를 이루기 위한 세부 목표들을 작성해주세요.
      </Text>

      <ScrollView style={styles.subGoalsScroll}>
        {manualData.subGoals.map((subGoal, index) => (
          <View key={index} style={styles.subGoalItem}>
            <Text style={styles.subGoalLabel}>{index + 1}</Text>
            <TextInput
              style={styles.subGoalInput}
              placeholder={`세부 목표 ${index + 1}`}
              value={subGoal}
              onChangeText={(text) => handleSubGoalChange(index, text)}
              maxLength={30}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.prevButton} onPress={handlePrevStep}>
          <Ionicons name="arrow-back" size={20} color="#0ea5e9" />
          <Text style={styles.prevButtonText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>다음</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActionsInput = () => {
    const filledSubGoals = manualData.subGoals
      .map((sg, idx) => ({ title: sg, index: idx }))
      .filter((sg) => sg.title.trim());

    if (filledSubGoals.length === 0) {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.emptyText}>세부 목표를 먼저 입력해주세요.</Text>
        </View>
      );
    }

    const currentSubGoal = filledSubGoals[currentSubGoalIndex];
    const currentActions = manualData.actions[currentSubGoal.index] || Array(8).fill('');

    return (
      <View style={styles.stepContainer}>
        <View style={styles.subGoalNav}>
          <TouchableOpacity
            onPress={() => setCurrentSubGoalIndex(Math.max(0, currentSubGoalIndex - 1))}
            disabled={currentSubGoalIndex === 0}
            style={[styles.navButton, currentSubGoalIndex === 0 && styles.navButtonDisabled]}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentSubGoalIndex === 0 ? '#d1d5db' : '#0ea5e9'}
            />
          </TouchableOpacity>

          <View style={styles.subGoalInfo}>
            <Text style={styles.subGoalTitle}>{currentSubGoal.title}</Text>
            <Text style={styles.subGoalCounter}>
              {currentSubGoalIndex + 1} / {filledSubGoals.length}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              setCurrentSubGoalIndex(Math.min(filledSubGoals.length - 1, currentSubGoalIndex + 1))
            }
            disabled={currentSubGoalIndex === filledSubGoals.length - 1}
            style={[
              styles.navButton,
              currentSubGoalIndex === filledSubGoals.length - 1 && styles.navButtonDisabled,
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={
                currentSubGoalIndex === filledSubGoals.length - 1 ? '#d1d5db' : '#0ea5e9'
              }
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.stepDescription}>
          이 세부 목표를 달성하기 위한 실천 항목을 입력하세요. (최대 8개)
        </Text>

        <ScrollView style={styles.actionsScroll}>
          {currentActions.map((action, actionIdx) => (
            <View key={actionIdx} style={styles.actionItem}>
              <Text style={styles.actionLabel}>{actionIdx + 1}</Text>
              <TextInput
                style={styles.actionInput}
                placeholder={`실천 항목 ${actionIdx + 1}`}
                value={action}
                onChangeText={(text) =>
                  handleActionChange(currentSubGoal.index, actionIdx, text)
                }
                maxLength={50}
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.prevButton} onPress={handlePrevStep}>
            <Ionicons name="arrow-back" size={20} color="#0ea5e9" />
            <Text style={styles.prevButtonText}>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveMandalart}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="close" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>만다라트 만들기</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Input Method Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, inputMethod === 'manual' && styles.tabActive]}
          onPress={() => setInputMethod('manual')}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={inputMethod === 'manual' ? '#0ea5e9' : '#6b7280'}
          />
          <Text
            style={[styles.tabText, inputMethod === 'manual' && styles.tabTextActive]}
          >
            직접 입력
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, inputMethod === 'image' && styles.tabActive]}
          onPress={() => setInputMethod('image')}
        >
          <Ionicons
            name="image-outline"
            size={20}
            color={inputMethod === 'image' ? '#0ea5e9' : '#6b7280'}
          />
          <Text style={[styles.tabText, inputMethod === 'image' && styles.tabTextActive]}>
            이미지
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, inputMethod === 'text' && styles.tabActive]}
          onPress={() => setInputMethod('text')}
        >
          <Ionicons
            name="document-text-outline"
            size={20}
            color={inputMethod === 'text' ? '#0ea5e9' : '#6b7280'}
          />
          <Text style={[styles.tabText, inputMethod === 'text' && styles.tabTextActive]}>
            텍스트
          </Text>
        </TouchableOpacity>
      </View>

      {inputMethod === 'manual' && renderProgressIndicator()}

      <ScrollView style={styles.content}>
        {inputMethod === 'manual' && (
          <>
            {step === 'center' && renderCenterGoalInput()}
            {step === 'subgoals' && renderSubGoalsInput()}
            {step === 'actions' && renderActionsInput()}
          </>
        )}

        {inputMethod === 'image' && (
          <View style={styles.comingSoon}>
            <Ionicons name="construct-outline" size={64} color="#d1d5db" />
            <Text style={styles.comingSoonText}>이미지 업로드 기능 준비 중</Text>
          </View>
        )}

        {inputMethod === 'text' && (
          <View style={styles.comingSoon}>
            <Ionicons name="construct-outline" size={64} color="#d1d5db" />
            <Text style={styles.comingSoonText}>텍스트 붙여넣기 기능 준비 중</Text>
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
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 36,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#0ea5e9',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  centerInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 8,
    marginBottom: 24,
  },
  subGoalsScroll: {
    maxHeight: 400,
    marginBottom: 24,
  },
  subGoalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  subGoalLabel: {
    width: 28,
    height: 28,
    backgroundColor: '#0ea5e9',
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  subGoalInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  subGoalNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  navButton: {
    padding: 4,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  subGoalInfo: {
    flex: 1,
    alignItems: 'center',
  },
  subGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subGoalCounter: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionsScroll: {
    maxHeight: 400,
    marginBottom: 24,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  actionLabel: {
    width: 28,
    height: 28,
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 14,
  },
  actionInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5e9',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  prevButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0ea5e9',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  prevButtonText: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  comingSoon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
