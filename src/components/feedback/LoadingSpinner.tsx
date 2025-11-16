import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

type SpinnerSize = 'small' | 'large';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#3b82f6',
  text,
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size={size} color={color} />
        {text && (
          <Text className="text-gray-600 mt-4 text-base">
            {text}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="items-center justify-center py-8">
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text className="text-gray-600 mt-4 text-base">
          {text}
        </Text>
      )}
    </View>
  );
};

export default LoadingSpinner;
