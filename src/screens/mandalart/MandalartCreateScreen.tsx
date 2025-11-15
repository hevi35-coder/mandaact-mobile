import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useCreateMandalart } from '@/hooks/useMandalartMutations';
import { supabase } from '@/services/supabase';

type InputMethod = 'manual' | 'image' | 'text';

interface ManualInputData {
  centerGoal: string;
  subGoals: string[];
  actions: { [key: number]: string[] }; // subGoalIndex -> actions[]
}

interface OCRResult {
  center_goal?: string;
  sub_goals?: Array<{ title?: string; actions?: string[] }>;
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

  // Image OCR state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);

  // Text paste state
  const [pastedText, setPastedText] = useState('');
  const [isProcessingText, setIsProcessingText] = useState(false);

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

  // Image OCR functions
  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('권한 필요', '이미지를 선택하려면 갤러리 접근 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Failed to pick image:', error);
      Alert.alert('오류', '이미지 선택 중 오류가 발생했습니다.');
    }
  };

  const handleProcessOCR = async () => {
    if (!selectedImage) return;

    setIsProcessingOCR(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다');

      // 1. Upload image to Supabase Storage
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const fileExt = 'jpg';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('mandalart-images')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('mandalart-images')
        .getPublicUrl(filePath);

      // 2. Call OCR Edge Function
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session) throw new Error('인증 오류가 발생했습니다');

      const ocrResponse = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/ocr-mandalart`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_url: publicUrl,
          }),
        }
      );

      if (!ocrResponse.ok) {
        const errorData = await ocrResponse.json();
        throw new Error(errorData.error || 'OCR 처리 실패');
      }

      const ocrResult: OCRResult = await ocrResponse.json();

      // 3. Convert to manual data format with AI type suggestions
      await convertOCRToManualData(ocrResult);

      Alert.alert('성공', 'OCR 처리가 완료되었습니다. 내용을 확인하고 수정하세요.');
      setInputMethod('manual');
      setStep('center');
    } catch (error: any) {
      console.error('OCR processing error:', error);
      Alert.alert('오류', error.message || 'OCR 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessingOCR(false);
    }
  };

  // Text parsing functions
  const handleProcessText = async () => {
    if (!pastedText.trim()) return;

    setIsProcessingText(true);

    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session) throw new Error('인증 오류가 발생했습니다');

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/parse-mandalart-text`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: pastedText,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '텍스트 분석 실패');
      }

      const result: OCRResult = await response.json();

      // Convert to manual data format with AI type suggestions
      await convertOCRToManualData(result);

      Alert.alert('성공', '텍스트 분석이 완료되었습니다. 내용을 확인하고 수정하세요.');
      setInputMethod('manual');
      setStep('center');
    } catch (error: any) {
      console.error('Text processing error:', error);
      Alert.alert('오류', error.message || '텍스트 분석 중 오류가 발생했습니다.');
    } finally {
      setIsProcessingText(false);
    }
  };

  // Convert OCR/text result to manual data format
  const convertOCRToManualData = async (result: OCRResult) => {
    const newManualData: ManualInputData = {
      centerGoal: result.center_goal || '',
      subGoals: Array(8).fill(''),
      actions: {},
    };

    if (result.sub_goals) {
      result.sub_goals.forEach((sg, index) => {
        if (index < 8 && sg.title) {
          newManualData.subGoals[index] = sg.title;

          if (sg.actions) {
            const actions = Array(8).fill('');
            sg.actions.forEach((actionTitle, actionIndex) => {
              if (actionIndex < 8 && actionTitle) {
                actions[actionIndex] = actionTitle;
              }
            });
            newManualData.actions[index] = actions;
          }
        }
      });
    }

    setManualData(newManualData);
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
          <View style={styles.inputContainer}>
            <Text style={styles.stepTitle}>이미지 업로드</Text>
            <Text style={styles.stepDescription}>
              만다라트 이미지를 업로드하면 자동으로 텍스트를 추출합니다.
            </Text>

            {!selectedImage ? (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handlePickImage}
                disabled={isProcessingOCR}
              >
                <Ionicons name="cloud-upload-outline" size={48} color="#0ea5e9" />
                <Text style={styles.uploadText}>이미지 선택</Text>
                <Text style={styles.uploadSubtext}>갤러리에서 이미지를 선택하세요</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={styles.changeImageButton}
                    onPress={() => setSelectedImage(null)}
                    disabled={isProcessingOCR}
                  >
                    <Text style={styles.changeImageText}>다시 선택</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.processButton}
                    onPress={handleProcessOCR}
                    disabled={isProcessingOCR}
                  >
                    {isProcessingOCR ? (
                      <>
                        <ActivityIndicator color="#fff" size="small" />
                        <Text style={styles.processButtonText}>처리 중...</Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name="scan-outline" size={20} color="#fff" />
                        <Text style={styles.processButtonText}>텍스트 추출</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {inputMethod === 'text' && (
          <View style={styles.inputContainer}>
            <Text style={styles.stepTitle}>텍스트 붙여넣기</Text>
            <Text style={styles.stepDescription}>
              만다라트 텍스트를 붙여넣으면 자동으로 분석합니다.
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder={`예시:\n핵심 목표: 건강한 삶\n\n1. 운동\n   - 매일 30분 걷기\n   - 주 3회 근력 운동\n   - 스트레칭 루틴\n   ...\n\n2. 식습관\n   - 아침 거르지 않기\n   ...\n\n(총 8개 세부 목표, 각 8개 실천 항목)`}
              value={pastedText}
              onChangeText={setPastedText}
              multiline
              textAlignVertical="top"
              editable={!isProcessingText}
            />

            <View style={styles.textActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setPastedText('')}
                disabled={isProcessingText}
              >
                <Text style={styles.clearButtonText}>지우기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.processButton}
                onPress={handleProcessText}
                disabled={isProcessingText || !pastedText.trim()}
              >
                {isProcessingText ? (
                  <>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.processButtonText}>분석 중...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="sparkles-outline" size={20} color="#fff" />
                    <Text style={styles.processButtonText}>텍스트 분석</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
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
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  inputContainer: {
    padding: 20,
  },
  uploadButton: {
    backgroundColor: '#f0f9ff',
    borderWidth: 2,
    borderColor: '#0ea5e9',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0ea5e9',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  imagePreviewContainer: {
    marginTop: 16,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  imageActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  changeImageButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeImageText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  processButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5e9',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    minHeight: 300,
    fontFamily: 'monospace',
    marginTop: 16,
  },
  textActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
