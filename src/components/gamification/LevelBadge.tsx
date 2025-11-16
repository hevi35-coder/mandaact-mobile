import React from 'react';
import { View, Text } from 'react-native';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size = 'md' }) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-12 h-12',
      text: 'text-base',
      label: 'text-xs',
    },
    md: {
      container: 'w-16 h-16',
      text: 'text-xl',
      label: 'text-sm',
    },
    lg: {
      container: 'w-24 h-24',
      text: 'text-3xl',
      label: 'text-base',
    },
  };

  const config = sizeConfig[size];

  // Level tier colors
  const getLevelColor = (level: number): string => {
    if (level >= 30) return 'bg-purple-600 border-purple-700'; // Master
    if (level >= 20) return 'bg-red-600 border-red-700'; // Expert
    if (level >= 10) return 'bg-orange-600 border-orange-700'; // Advanced
    if (level >= 5) return 'bg-blue-600 border-blue-700'; // Intermediate
    return 'bg-gray-600 border-gray-700'; // Beginner
  };

  return (
    <View className="items-center">
      <View
        className={`${config.container} ${getLevelColor(
          level
        )} rounded-full items-center justify-center border-4 shadow-lg`}
      >
        <Text className={`${config.text} font-bold text-white`}>
          {level}
        </Text>
      </View>
      <Text className={`${config.label} text-gray-600 mt-1`}>
        Level
      </Text>
    </View>
  );
};

export default LevelBadge;
