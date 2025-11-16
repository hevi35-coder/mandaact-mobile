import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface Badge {
  id: string;
  key: string;
  title: string;
  description: string;
  xp_reward: number;
  badge_type: string;
}

interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
    progress: number;
  };
  onPress?: () => void;
  showNew?: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  unlocked,
  unlockedAt,
  progress,
  onPress,
  showNew = false,
}) => {
  // Badge type icons (emoji)
  const getBadgeIcon = (type: string): string => {
    switch (type) {
      case 'practice':
        return '✓';
      case 'streak':
        return '🔥';
      case 'consistency':
        return '📅';
      case 'monthly':
        return '🏆';
      case 'completion':
        return '⭐';
      case 'special':
        return '💎';
      default:
        return '🎖️';
    }
  };

  const icon = getBadgeIcon(badge.badge_type);

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-xl p-4 border-2 ${
        unlocked
          ? 'bg-blue-50 border-blue-300'
          : 'bg-gray-100 border-gray-300'
      }`}
    >
      {/* NEW Indicator */}
      {showNew && unlocked && (
        <View className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">NEW</Text>
        </View>
      )}

      {/* Badge Icon */}
      <View
        className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${
          unlocked ? 'bg-blue-600' : 'bg-gray-400'
        }`}
      >
        <Text className="text-3xl">{unlocked ? icon : '🔒'}</Text>
      </View>

      {/* Badge Title */}
      <Text
        className={`text-base font-bold mb-1 ${
          unlocked ? 'text-gray-900' : 'text-gray-500'
        }`}
      >
        {badge.title}
      </Text>

      {/* Badge Description */}
      <Text
        className={`text-sm mb-2 ${
          unlocked ? 'text-gray-700' : 'text-gray-400'
        }`}
        numberOfLines={2}
      >
        {badge.description}
      </Text>

      {/* XP Reward */}
      <View className="flex-row items-center">
        <Text
          className={`text-xs font-semibold ${
            unlocked ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          +{badge.xp_reward} XP
        </Text>
      </View>

      {/* Progress (if locked) */}
      {!unlocked && progress && (
        <View className="mt-3">
          <View className="bg-gray-300 h-2 rounded-full overflow-hidden">
            <View
              className="bg-blue-600 h-full"
              style={{ width: `${progress.progress}%` }}
            />
          </View>
          <Text className="text-xs text-gray-500 mt-1">
            {progress.current} / {progress.target}
          </Text>
        </View>
      )}

      {/* Unlocked Date */}
      {unlocked && unlockedAt && (
        <Text className="text-xs text-gray-400 mt-2">
          {new Date(unlockedAt).toLocaleDateString('ko-KR')}
        </Text>
      )}
    </Pressable>
  );
};

export default BadgeCard;
