import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import { useAuthStore } from '@/store/authStore';
import { Card, Button, LoadingSpinner } from '@/components/ui';
import { useToast } from '@/components/feedback/Toast';
import { useGenerateWeeklyReport, useWeeklyReports } from '@/hooks/useWeeklyReport';
import { useGenerateGoalDiagnosis, useGoalDiagnosis } from '@/hooks/useGoalDiagnosis';
import { useMandalarts } from '@/hooks/useMandalarts';

type TabType = 'weekly' | 'diagnosis';

const ReportsScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('weekly');
  const [selectedMandalartId, setSelectedMandalartId] = useState<string | null>(null);

  // Hooks
  const generateWeeklyReport = useGenerateWeeklyReport();
  const { data: weeklyReports } = useWeeklyReports(user?.id);
  const { data: mandalarts } = useMandalarts();
  const generateGoalDiagnosis = useGenerateGoalDiagnosis();
  const { data: goalDiagnosis } = useGoalDiagnosis(selectedMandalartId || undefined);

  // Get latest weekly report
  const latestWeeklyReport = weeklyReports?.[0];

  // Get active mandalarts for diagnosis
  const activeMandalarts = mandalarts?.filter(m => m.is_active) || [];

  // Set first active mandalart as default
  React.useEffect(() => {
    if (!selectedMandalartId && activeMandalarts.length > 0) {
      setSelectedMandalartId(activeMandalarts[0].id);
    }
  }, [activeMandalarts, selectedMandalartId]);

  // Generate Weekly Report
  const handleGenerateWeeklyReport = async () => {
    if (!user) {
      showToast('error', '로그인이 필요합니다.');
      return;
    }

    try {
      await generateWeeklyReport.mutateAsync({ userId: user.id });
      showToast('success', '주간 리포트가 생성되었습니다!');
    } catch (error: any) {
      console.error('Weekly report generation error:', error);
      showToast('error', error.message || '리포트 생성 중 오류가 발생했습니다.');
    }
  };

  // Generate Goal Diagnosis
  const handleGenerateDiagnosis = async () => {
    if (!selectedMandalartId) {
      showToast('error', '만다라트를 선택해주세요.');
      return;
    }

    try {
      await generateGoalDiagnosis.mutateAsync({ mandalartId: selectedMandalartId });
      showToast('success', '목표 진단이 완료되었습니다!');
    } catch (error: any) {
      console.error('Diagnosis generation error:', error);
      showToast('error', error.message || '진단 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-6 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">리포트</Text>
        <Text className="text-sm text-gray-600 mt-1">
          AI가 생성하는 분석 리포트
        </Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row px-4 py-3 bg-white border-b border-gray-200">
        <Pressable
          onPress={() => setActiveTab('weekly')}
          className={`flex-1 py-3 rounded-lg mr-2 ${
            activeTab === 'weekly' ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'weekly' ? 'text-white' : 'text-gray-700'
            }`}
          >
            주간 리포트
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('diagnosis')}
          className={`flex-1 py-3 rounded-lg ml-2 ${
            activeTab === 'diagnosis' ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'diagnosis' ? 'text-white' : 'text-gray-700'
            }`}
          >
            목표 진단
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        {activeTab === 'weekly' ? (
          <WeeklyReportTab
            report={latestWeeklyReport?.content || null}
            isGenerating={generateWeeklyReport.isPending}
            onGenerate={handleGenerateWeeklyReport}
          />
        ) : (
          <DiagnosisTab
            diagnosis={goalDiagnosis?.analysis || null}
            smartScore={goalDiagnosis?.smart_score}
            suggestions={goalDiagnosis?.suggestions}
            isGenerating={generateGoalDiagnosis.isPending}
            onGenerate={handleGenerateDiagnosis}
            mandalarts={activeMandalarts}
            selectedMandalartId={selectedMandalartId}
            onSelectMandalart={setSelectedMandalartId}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Weekly Report Tab
interface WeeklyReportTabProps {
  report: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

const WeeklyReportTab: React.FC<WeeklyReportTabProps> = ({
  report,
  isGenerating,
  onGenerate,
}) => {
  return (
    <View className="p-4">
      <Card variant="bordered" padding="md">
        <Text className="text-lg font-bold text-gray-900 mb-2">
          📊 주간 실천 리포트
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          지난 7일간의 활동을 분석하고, AI가 인사이트를 제공합니다.
        </Text>

        {!report && !isGenerating && (
          <Button
            variant="primary"
            fullWidth
            onPress={onGenerate}
          >
            리포트 생성하기
          </Button>
        )}

        {isGenerating && (
          <LoadingSpinner text="AI가 리포트를 생성하고 있습니다..." />
        )}

        {report && !isGenerating && (
          <View>
            <ScrollView className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <Markdown
                style={{
                  heading1: {
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: 12,
                  },
                  heading2: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#374151',
                    marginTop: 16,
                    marginBottom: 8,
                  },
                  body: {
                    fontSize: 14,
                    color: '#4b5563',
                    lineHeight: 22,
                  },
                  bullet_list: {
                    marginBottom: 8,
                  },
                }}
              >
                {report}
              </Markdown>
            </ScrollView>

            <Button
              variant="secondary"
              fullWidth
              onPress={onGenerate}
            >
              새 리포트 생성
            </Button>
          </View>
        )}
      </Card>

      {/* Info Card */}
      <Card variant="bordered" padding="md" className="mt-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          ℹ️ 주간 리포트란?
        </Text>
        <Text className="text-sm text-gray-600">
          • 지난 7일간의 실천 현황을 분석합니다{'\n'}
          • 잘한 점과 개선할 점을 제안합니다{'\n'}
          • 다음 주 전략을 제공합니다
        </Text>
      </Card>
    </View>
  );
};

// Diagnosis Tab
interface DiagnosisTabProps {
  diagnosis: string | null;
  smartScore?: {
    specific: number;
    measurable: number;
    achievable: number;
    relevant: number;
    timeBound: number;
    total: number;
  };
  suggestions?: string[];
  isGenerating: boolean;
  onGenerate: () => void;
  mandalarts: any[];
  selectedMandalartId: string | null;
  onSelectMandalart: (id: string) => void;
}

const DiagnosisTab: React.FC<DiagnosisTabProps> = ({
  diagnosis,
  smartScore,
  suggestions,
  isGenerating,
  onGenerate,
  mandalarts,
  selectedMandalartId,
  onSelectMandalart,
}) => {
  return (
    <View className="p-4">
      {/* Mandalart Selection */}
      {mandalarts.length > 0 && (
        <Card variant="bordered" padding="md" className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-3">
            진단할 만다라트 선택
          </Text>
          {mandalarts.map((mandalart) => (
            <Pressable
              key={mandalart.id}
              onPress={() => onSelectMandalart(mandalart.id)}
              className={`p-3 rounded-lg mb-2 ${
                selectedMandalartId === mandalart.id
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-100'
              }`}
            >
              <Text
                className={`font-semibold ${
                  selectedMandalartId === mandalart.id
                    ? 'text-blue-700'
                    : 'text-gray-700'
                }`}
              >
                {mandalart.center_goal}
              </Text>
            </Pressable>
          ))}
        </Card>
      )}

      <Card variant="bordered" padding="md">
        <Text className="text-lg font-bold text-gray-900 mb-2">
          🎯 목표 진단
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          만다라트 구조를 SMART 기준으로 분석하고, 개선 방향을 제안합니다.
        </Text>

        {!diagnosis && !isGenerating && mandalarts.length === 0 && (
          <View className="py-4">
            <Text className="text-sm text-gray-600 text-center">
              활성 만다라트가 없습니다.{'\n'}
              먼저 만다라트를 생성하고 활성화해주세요.
            </Text>
          </View>
        )}

        {!diagnosis && !isGenerating && mandalarts.length > 0 && (
          <Button
            variant="primary"
            fullWidth
            onPress={onGenerate}
          >
            진단 시작하기
          </Button>
        )}

        {isGenerating && (
          <LoadingSpinner text="AI가 목표를 진단하고 있습니다..." />
        )}

        {diagnosis && !isGenerating && (
          <View>
            {/* SMART Score */}
            {smartScore && (
              <View className="bg-blue-50 rounded-lg p-4 mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-3">
                  SMART 점수
                </Text>
                <View className="space-y-2">
                  <ScoreBar label="Specific" score={smartScore.specific} />
                  <ScoreBar label="Measurable" score={smartScore.measurable} />
                  <ScoreBar label="Achievable" score={smartScore.achievable} />
                  <ScoreBar label="Relevant" score={smartScore.relevant} />
                  <ScoreBar label="Time-bound" score={smartScore.timeBound} />
                </View>
                <View className="mt-3 pt-3 border-t border-blue-200">
                  <Text className="text-lg font-bold text-blue-700">
                    총점: {smartScore.total}/100
                  </Text>
                </View>
              </View>
            )}

            {/* Analysis */}
            <ScrollView className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <Markdown
                style={{
                  heading1: {
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: 12,
                  },
                  heading2: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#374151',
                    marginTop: 16,
                    marginBottom: 8,
                  },
                  body: {
                    fontSize: 14,
                    color: '#4b5563',
                    lineHeight: 22,
                  },
                }}
              >
                {diagnosis}
              </Markdown>
            </ScrollView>

            {/* Suggestions */}
            {suggestions && suggestions.length > 0 && (
              <View className="bg-yellow-50 rounded-lg p-4 mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  💡 개선 제안
                </Text>
                {suggestions.map((suggestion, index) => (
                  <Text key={index} className="text-sm text-gray-600 mb-1">
                    • {suggestion}
                  </Text>
                ))}
              </View>
            )}

            <Button
              variant="secondary"
              fullWidth
              onPress={onGenerate}
            >
              다시 진단하기
            </Button>
          </View>
        )}
      </Card>

      {/* Info Card */}
      <Card variant="bordered" padding="md" className="mt-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          ℹ️ SMART 기준이란?
        </Text>
        <Text className="text-sm text-gray-600">
          • Specific: 구체적인가?{'\n'}
          • Measurable: 측정 가능한가?{'\n'}
          • Achievable: 달성 가능한가?{'\n'}
          • Relevant: 관련성이 있는가?{'\n'}
          • Time-bound: 기한이 명확한가?
        </Text>
      </Card>
    </View>
  );
};

// Score Bar Component
const ScoreBar: React.FC<{ label: string; score: number }> = ({ label, score }) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <View className="mb-2">
      <View className="flex-row justify-between mb-1">
        <Text className="text-xs text-gray-600">{label}</Text>
        <Text className="text-xs font-semibold text-gray-700">{score}/100</Text>
      </View>
      <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <View
          className={`h-full ${getColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </View>
    </View>
  );
};

export default ReportsScreen;
