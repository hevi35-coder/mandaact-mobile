import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NOTIFICATION_SETTINGS_KEY = '@notification_settings';

export interface NotificationSettings {
  dailyReminder: boolean;
  badgeNotifications: boolean;
  reportNotifications: boolean;
  reminderTime: string; // HH:mm format (e.g., "21:00")
}

const DEFAULT_SETTINGS: NotificationSettings = {
  dailyReminder: true,
  badgeNotifications: true,
  reportNotifications: true,
  reminderTime: '21:00', // 9 PM
};

/**
 * Request notification permissions from the user
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return false;
  }

  return true;
}

/**
 * Get Expo push token and save to Supabase
 */
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    // Get push token
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    // Save token to Supabase
    const { error } = await supabase
      .from('user_push_tokens')
      .upsert({
        user_id: userId,
        push_token: token,
        platform: Platform.OS,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving push token:', error);
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
}

/**
 * Get notification settings from AsyncStorage
 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const settingsJson = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save notification settings to AsyncStorage
 */
export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving notification settings:', error);
  }
}

/**
 * Update a specific notification setting
 */
export async function updateNotificationSetting(
  key: keyof NotificationSettings,
  value: boolean | string
): Promise<void> {
  const settings = await getNotificationSettings();
  settings[key] = value as never;
  await saveNotificationSettings(settings);

  // If daily reminder is enabled, schedule it
  if (key === 'dailyReminder' && value === true) {
    await scheduleDailyReminder(settings.reminderTime);
  } else if (key === 'dailyReminder' && value === false) {
    await cancelDailyReminder();
  }

  // If reminder time is changed, reschedule
  if (key === 'reminderTime' && settings.dailyReminder) {
    await scheduleDailyReminder(value as string);
  }
}

/**
 * Schedule daily reminder notification
 */
export async function scheduleDailyReminder(time: string = '21:00'): Promise<void> {
  try {
    // Cancel existing reminder
    await cancelDailyReminder();

    // Parse time (HH:mm)
    const [hours, minutes] = time.split(':').map(Number);

    // Schedule notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 오늘의 실천 체크!',
        body: '오늘 목표를 달성하셨나요? 지금 확인해보세요!',
        data: { type: 'daily_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });

    console.log('Daily reminder scheduled for', time);
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
  }
}

/**
 * Cancel daily reminder notification
 */
export async function cancelDailyReminder(): Promise<void> {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    const dailyReminders = notifications.filter(
      (n) => n.content.data?.type === 'daily_reminder'
    );

    for (const notification of dailyReminders) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }

    console.log('Daily reminder cancelled');
  } catch (error) {
    console.error('Error cancelling daily reminder:', error);
  }
}

/**
 * Send a local notification immediately
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
}

/**
 * Handle notification received while app is foregrounded
 */
export function addNotificationReceivedListener(
  handler: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(handler);
}

/**
 * Handle notification response (user tapped on notification)
 */
export function addNotificationResponseReceivedListener(
  handler: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(handler);
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
