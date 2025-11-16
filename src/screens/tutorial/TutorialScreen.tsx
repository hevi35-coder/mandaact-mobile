import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button, Card } from '@/components/ui';

const { width } = Dimensions.get('window');

interface TutorialStep {
  title: string;
  description: string;
  icon: string;
  details: string[];
}

const tutorialSteps: TutorialStep[] = [
  {
    title: '만다라트에 오신 것을 환영합니다!',
    description: '9x9 목표 달성 프레임워크로 체계적인 실천을 시작하세요',
    icon: '👋',
    details: [
      '만다라트는 일본의 디자이너 이마이즈미 히로아키가 만든 목표 달성 도구입니다',
      '큰 목표를 작은 실천으로 나누어 체계적으로 관리할 수 있습니다',
      '메이저리그 스타 오타니 쇼헤이도 사용한 방법입니다',
    ],
  },
  {
    title: '만다라트 구조 이해하기',
    description: '9x9 = 81개 셀로 구성된 체계적인 목표 프레임워크',
    icon: '🎯',
    details: [
      '중앙(1개): 핵심 목표를 작성합니다',
      '주변(8개): 핵심 목표 달성을 위한 세부 목표',
      '각 세부 목표마다 8개씩 실천 항목 (총 64개)',
    ],
  },
  {
    title: '3가지 만다라트 생성 방법',
    description: '이미지, 텍스트, 수동 입력 중 편한 방법을 선택하세요',
    icon: '📝',
    details: [
      '이미지 OCR: 작성된 만다라트를 사진으로 찍어 자동 인식',
      '텍스트 붙여넣기: 표 형식 텍스트를 복사해서 자동 파싱',
      '수동 입력: 빈 템플릿에 직접 작성 (AI 타입 추천 포함)',
    ],
  },
  {
    title: '실천 항목 타입 시스템',
    description: '루틴, 미션, 참고로 구분하여 효율적으로 관리',
    icon: '🎨',
    details: [
      '루틴: 반복되는 습관 (매일, 매주, 매월)',
      '미션: 완료 목표 (한 번 또는 주기적)',
      '참고: 마음가짐, 원칙 등 (체크 불가)',
    ],
  },
  {
    title: '오늘의 실천으로 체크하기',
    description: '매일 실천 항목을 체크하고 XP를 획득하세요',
    icon: '✅',
    details: [
      '타입별 필터로 원하는 항목만 보기',
      '체크하면 즉시 XP 획득',
      '어제까지의 누락된 체크도 가능',
    ],
  },
  {
    title: 'XP & 배지 시스템',
    description: '게임처럼 재미있게 목표를 달성하세요',
    icon: '🏆',
    details: [
      'XP 획득: 체크할 때마다 10 XP 기본 지급',
      '배율 시스템: 주말, 복귀, 레벨업, 완벽한 주',
      '배지 21개: 실천, 스트릭, 월간, 특별 배지 수집',
    ],
  },
  {
    title: '시작할 준비 완료!',
    description: '이제 나만의 만다라트를 만들고 실천을 시작하세요',
    icon: '🚀',
    details: [
      '첫 만다라트를 생성해보세요',
      '매일 오늘의 실천에서 체크하세요',
      '주간 리포트로 인사이트를 받아보세요',
    ],
  },
];

const TutorialScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      // Complete tutorial and navigate to home
      navigation.goBack();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  const step = tutorialSteps[currentStep];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header with Progress */}
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-bold text-gray-900">
            튜토리얼
          </Text>
          <Text className="text-sm text-gray-500">
            {currentStep + 1} / {tutorialSteps.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
          <View
            className="bg-blue-600 h-full"
            style={{
              width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`,
            }}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Icon */}
          <View className="items-center mb-6">
            <View className="w-32 h-32 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Text className="text-6xl">{step.icon}</Text>
            </View>

            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
              {step.title}
            </Text>

            <Text className="text-base text-gray-600 text-center">
              {step.description}
            </Text>
          </View>

          {/* Details */}
          <Card variant="bordered" padding="md">
            {step.details.map((detail, index) => (
              <View key={index} className="flex-row mb-3 last:mb-0">
                <Text className="text-blue-600 mr-3">•</Text>
                <Text className="flex-1 text-sm text-gray-700 leading-6">
                  {detail}
                </Text>
              </View>
            ))}
          </Card>

          {/* Step Indicators */}
          <View className="flex-row justify-center items-center mt-6 mb-4">
            {tutorialSteps.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="px-4 py-4 bg-white border-t border-gray-200">
        <View className="flex-row space-x-3">
          {!isFirstStep && (
            <Button
              variant="secondary"
              onPress={handlePrevious}
              className="flex-1"
            >
              이전
            </Button>
          )}

          {isFirstStep && (
            <Button
              variant="ghost"
              onPress={handleSkip}
              className="flex-1"
            >
              건너뛰기
            </Button>
          )}

          <Button
            variant="primary"
            onPress={handleNext}
            className="flex-1"
          >
            {isLastStep ? '시작하기' : '다음'}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TutorialScreen;
