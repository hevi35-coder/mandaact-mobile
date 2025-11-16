import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert as RNAlert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { Card, Button } from '@/components/ui';
import { useToast } from '@/components/feedback/Toast';
import {
  getNotificationSettings,
  updateNotificationSetting,
  registerForPushNotifications,
  type NotificationSettings,
} from '@/services/notifications';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, setUser } = useAuthStore();
  const { showToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    dailyReminder: false,
    badgeNotifications: false,
    reportNotifications: false,
    reminderTime: '21:00',
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Load notification settings on mount
  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const settings = await getNotificationSettings();
      setNotificationSettings(settings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleToggleDailyReminder = async (value: boolean) => {
    try {
      // If enabling, request permission first
      if (value && user) {
        const token = await registerForPushNotifications(user.id);
        if (!token) {
          showToast('error', '알림 권한을 허용해주세요.');
          return;
        }
      }

      await updateNotificationSetting('dailyReminder', value);
      setNotificationSettings((prev) => ({ ...prev, dailyReminder: value }));

      if (value) {
        showToast('success', `매일 ${notificationSettings.reminderTime}에 알림을 받습니다.`);
      } else {
        showToast('info', '일일 리마인더가 꺼졌습니다.');
      }
    } catch (error: any) {
      console.error('Error toggling daily reminder:', error);
      showToast('error', '설정 변경 중 오류가 발생했습니다.');
    }
  };

  const handleToggleBadgeNotifications = async (value: boolean) => {
    try {
      // If enabling, request permission first
      if (value && user) {
        const token = await registerForPushNotifications(user.id);
        if (!token) {
          showToast('error', '알림 권한을 허용해주세요.');
          return;
        }
      }

      await updateNotificationSetting('badgeNotifications', value);
      setNotificationSettings((prev) => ({ ...prev, badgeNotifications: value }));

      if (value) {
        showToast('success', '배지 알림이 켜졌습니다.');
      } else {
        showToast('info', '배지 알림이 꺼졌습니다.');
      }
    } catch (error: any) {
      console.error('Error toggling badge notifications:', error);
      showToast('error', '설정 변경 중 오류가 발생했습니다.');
    }
  };

  const handleToggleReportNotifications = async (value: boolean) => {
    try {
      // If enabling, request permission first
      if (value && user) {
        const token = await registerForPushNotifications(user.id);
        if (!token) {
          showToast('error', '알림 권한을 허용해주세요.');
          return;
        }
      }

      await updateNotificationSetting('reportNotifications', value);
      setNotificationSettings((prev) => ({ ...prev, reportNotifications: value }));

      if (value) {
        showToast('success', '리포트 알림이 켜졌습니다.');
      } else {
        showToast('info', '리포트 알림이 꺼졌습니다.');
      }
    } catch (error: any) {
      console.error('Error toggling report notifications:', error);
      showToast('error', '설정 변경 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    RNAlert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await supabase.auth.signOut();
              setUser(null);
            } catch (error) {
              console.error('Logout error:', error);
              RNAlert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-6 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">설정</Text>
        </View>

        {/* Account Section */}
        <View className="mt-6 px-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 uppercase">
            계정
          </Text>

          <Card variant="bordered" padding="none">
            {/* User Email */}
            <View className="px-4 py-4 border-b border-gray-200">
              <Text className="text-xs text-gray-500 mb-1">이메일</Text>
              <Text className="text-base text-gray-900">{user?.email}</Text>
            </View>

            {/* User ID */}
            <View className="px-4 py-4">
              <Text className="text-xs text-gray-500 mb-1">사용자 ID</Text>
              <Text className="text-sm text-gray-600 font-mono">
                {user?.id.slice(0, 8)}...
              </Text>
            </View>
          </Card>
        </View>

        {/* Notification Section */}
        <View className="mt-6 px-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 uppercase">
            알림
          </Text>

          <Card variant="bordered" padding="none">
            {/* Daily Reminder */}
            <View className="px-4 py-4 border-b border-gray-200 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base text-gray-900 mb-1">
                  일일 리마인더
                </Text>
                <Text className="text-sm text-gray-500">
                  매일 {notificationSettings.reminderTime}에 알림 받기
                </Text>
              </View>
              <Switch
                value={notificationSettings.dailyReminder}
                onValueChange={handleToggleDailyReminder}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={notificationSettings.dailyReminder ? '#ffffff' : '#f3f4f6'}
                disabled={isLoadingSettings}
              />
            </View>

            {/* Badge Notifications */}
            <View className="px-4 py-4 border-b border-gray-200 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base text-gray-900 mb-1">
                  배지 알림
                </Text>
                <Text className="text-sm text-gray-500">
                  새 배지 획득 시 알림 받기
                </Text>
              </View>
              <Switch
                value={notificationSettings.badgeNotifications}
                onValueChange={handleToggleBadgeNotifications}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={notificationSettings.badgeNotifications ? '#ffffff' : '#f3f4f6'}
                disabled={isLoadingSettings}
              />
            </View>

            {/* Report Notifications */}
            <View className="px-4 py-4 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base text-gray-900 mb-1">
                  리포트 알림
                </Text>
                <Text className="text-sm text-gray-500">
                  주간 리포트 생성 시 알림 받기
                </Text>
              </View>
              <Switch
                value={notificationSettings.reportNotifications}
                onValueChange={handleToggleReportNotifications}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={notificationSettings.reportNotifications ? '#ffffff' : '#f3f4f6'}
                disabled={isLoadingSettings}
              />
            </View>
          </Card>
        </View>

        {/* App Info Section */}
        <View className="mt-6 px-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 uppercase">
            앱 정보
          </Text>

          <Card variant="bordered" padding="none">
            {/* Version */}
            <View className="px-4 py-4 border-b border-gray-200">
              <Text className="text-xs text-gray-500 mb-1">버전</Text>
              <Text className="text-base text-gray-900">1.0.0 (Beta)</Text>
            </View>

            {/* Tutorial */}
            <Pressable
              className="px-4 py-4 flex-row items-center justify-between active:bg-gray-50"
              onPress={() => {
                RNAlert.alert(
                  '튜토리얼',
                  '튜토리얼 화면은 곧 추가될 예정입니다.',
                  [{ text: '확인' }]
                );
              }}
            >
              <Text className="text-base text-gray-900">
                튜토리얼 다시 보기
              </Text>
              <Text className="text-gray-400">›</Text>
            </Pressable>
          </Card>
        </View>

        {/* Logout Button */}
        <View className="mt-8 px-4 pb-8">
          <Button
            variant="danger"
            fullWidth
            onPress={handleLogout}
            loading={isLoggingOut}
          >
            로그아웃
          </Button>
        </View>

        {/* Footer */}
        <View className="px-4 pb-8">
          <Text className="text-xs text-gray-400 text-center">
            MandaAct Mobile v1.0.0{'\n'}
            © 2025 All rights reserved
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
