import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface XPProgressBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  showLabel?: boolean;
  height?: number;
}

const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXP,
  nextLevelXP,
  level,
  showLabel = true,
  height = 12,
}) => {
  const progress = (currentXP / nextLevelXP) * 100;
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  return (
    <View>
      {showLabel && (
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-semibold text-gray-700">
            Level {level}
          </Text>
          <Text className="text-xs text-gray-500">
            {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
          </Text>
        </View>
      )}

      <View
        className="bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        <Animated.View
          className="bg-blue-600 h-full rounded-full"
          style={animatedStyle}
        />
      </View>

      {showLabel && (
        <Text className="text-xs text-gray-500 mt-1 text-right">
          {Math.round(progress)}% 달성
        </Text>
      )}
    </View>
  );
};

export default XPProgressBar;
