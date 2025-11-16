import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface Badge {
  id: string;
  key: string;
  title: string;
  description: string;
  xp_reward: number;
  badge_type: string;
}

interface BadgeUnlockModalProps {
  visible: boolean;
  badge: Badge | null;
  onClose: () => void;
}

const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({
  visible,
  badge,
  onClose,
}) => {
  const { width } = Dimensions.get('window');
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible && badge) {
      // Reset values
      scale.value = 0;
      rotate.value = 0;
      opacity.value = 0;

      // Animate in
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSequence(
        withSpring(1.2, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );
      rotate.value = withSequence(
        withDelay(200, withSpring(360, { damping: 15 }))
      );
    }
  }, [visible, badge]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  if (!badge) return null;

  // Badge type icons
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70 items-center justify-center px-6">
        <Pressable
          className="absolute inset-0"
          onPress={onClose}
        />

        <View
          className="bg-white rounded-3xl overflow-hidden"
          style={{ width: Math.min(width * 0.85, 400) }}
        >
          {/* Celebration Header */}
          <View className="bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-8 items-center">
            <Text className="text-3xl mb-2">🎉</Text>
            <Text className="text-white text-2xl font-bold mb-1">
              배지 획득!
            </Text>
            <Text className="text-blue-100 text-sm">
              축하합니다!
            </Text>
          </View>

          {/* Badge Icon (Animated) */}
          <View className="items-center -mt-12 mb-6">
            <Animated.View
              style={animatedStyle}
              className="w-24 h-24 bg-blue-600 rounded-full items-center justify-center border-4 border-white shadow-xl"
            >
              <Text className="text-5xl">
                {getBadgeIcon(badge.badge_type)}
              </Text>
            </Animated.View>
          </View>

          {/* Badge Info */}
          <View className="px-6 pb-6">
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
              {badge.title}
            </Text>

            <Text className="text-base text-gray-600 text-center mb-4">
              {badge.description}
            </Text>

            {/* XP Reward */}
            <View className="bg-blue-50 rounded-xl px-4 py-3 items-center mb-6">
              <Text className="text-blue-600 font-bold text-lg">
                +{badge.xp_reward} XP 획득
              </Text>
            </View>

            {/* Close Button */}
            <Pressable
              onPress={onClose}
              className="bg-blue-600 rounded-xl py-4 items-center active:bg-blue-700"
            >
              <Text className="text-white font-semibold text-base">
                확인
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BadgeUnlockModal;
