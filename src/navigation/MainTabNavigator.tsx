import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '@/screens/home/HomeScreen';
import TodayScreen from '@/screens/home/TodayScreen';
import MandalartListScreen from '@/screens/mandalart/MandalartListScreen';
import StatsScreen from '@/screens/stats/StatsScreen';
import ReportsScreen from '@/screens/reports/ReportsScreen';
import SettingsScreen from '@/screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'TodayTab') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'MandalartTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'StatsTab') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'ReportsTab') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: '홈' }}
      />
      <Tab.Screen
        name="TodayTab"
        component={TodayScreen}
        options={{ tabBarLabel: '오늘의 실천' }}
      />
      <Tab.Screen
        name="MandalartTab"
        component={MandalartListScreen}
        options={{ tabBarLabel: '만다라트' }}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{ tabBarLabel: '통계' }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={ReportsScreen}
        options={{ tabBarLabel: '리포트' }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ tabBarLabel: '설정' }}
      />
    </Tab.Navigator>
  );
}