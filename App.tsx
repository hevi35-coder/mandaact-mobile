import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import QueryProvider from '@/providers/QueryProvider';
import RootNavigator from '@/navigation/RootNavigator';
import { ToastProvider } from '@/components/ui';

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <ToastProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </ToastProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
