import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { Card, Button, LoadingSpinner } from '@/components/ui';

type TabType = 'weekly' | 'diagnosis';

const ReportsScreen: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('weekly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);

  // Generate Weekly Report
  const generateWeeklyReport = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        'generate-weekly-report',
        {
          body: { user_id: user.id },
        }
      );

      if (error) throw error;

      if (data?.report) {
        setWeeklyReport(data.report);
      }
    } catch (error) {
      console.error('Weekly report generation error:', error);
      setWeeklyReport('# 오류\n\n리포트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Goal Diagnosis (placeholder)
  const generateDiagnosis = async () => {
    setIsGenerating(true);
    try {
      // TODO: Implement when user has active mandalart
      setTimeout(() => {
        setDiagnosis(
          '# 목표 진단\n\n활성 만다라트가 선택되지 않았습니다.\n\n만다라트 관리에서 먼저 만다라트를 활성화해주세요.'
        );
        setIsGenerating(false);
      }, 1000);
    } catch (error) {
      console.error('Diagnosis generation error:', error);
      setDiagnosis('# 오류\n\n진단 생성 중 오류가 발생했습니다.');
      setIsGenerating(false);
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
            report={weeklyReport}
            isGenerating={isGenerating}
            onGenerate={generateWeeklyReport}
          />
        ) : (
          <DiagnosisTab
            diagnosis={diagnosis}
            isGenerating={isGenerating}
            onGenerate={generateDiagnosis}
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
  isGenerating: boolean;
  onGenerate: () => void;
}

const DiagnosisTab: React.FC<DiagnosisTabProps> = ({
  diagnosis,
  isGenerating,
  onGenerate,
}) => {
  return (
    <View className="p-4">
      <Card variant="bordered" padding="md">
        <Text className="text-lg font-bold text-gray-900 mb-2">
          🎯 목표 진단
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          만다라트 구조를 SMART 기준으로 분석하고, 개선 방향을 제안합니다.
        </Text>

        {!diagnosis && !isGenerating && (
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

export default ReportsScreen;
