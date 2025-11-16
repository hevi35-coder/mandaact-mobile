import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import BadgeCard from './BadgeCard';

interface Badge {
  id: string;
  key: string;
  title: string;
  description: string;
  xp_reward: number;
  badge_type: string;
}

interface UnlockedBadge {
  achievement_id: string;
  unlocked_at: string;
}

interface BadgeProgress {
  current: number;
  target: number;
  progress: number;
}

interface BadgeGalleryProps {
  badges: Badge[];
  unlockedBadges: UnlockedBadge[];
  badgeProgress: Record<string, BadgeProgress>;
  newlyUnlockedIds?: string[];
  onBadgePress?: (badge: Badge) => void;
}

type FilterType = 'all' | 'unlocked' | 'locked';

const BadgeGallery: React.FC<BadgeGalleryProps> = ({
  badges,
  unlockedBadges,
  badgeProgress,
  newlyUnlockedIds = [],
  onBadgePress,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const unlockedIds = new Set(
    unlockedBadges.map((ub) => ub.achievement_id)
  );

  // Find unlock date for a badge
  const getUnlockedDate = (badgeId: string): string | undefined => {
    const unlocked = unlockedBadges.find((ub) => ub.achievement_id === badgeId);
    return unlocked?.unlocked_at;
  };

  // Filter badges
  const filteredBadges = badges.filter((badge) => {
    const isUnlocked = unlockedIds.has(badge.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  // Stats
  const unlockedCount = unlockedBadges.length;
  const totalCount = badges.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <View className="flex-1">
      {/* Header Stats */}
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          배지 컬렉션
        </Text>
        <Text className="text-sm text-gray-600">
          {unlockedCount} / {totalCount} 획득 ({percentage}%)
        </Text>

        {/* Progress Bar */}
        <View className="mt-3 bg-gray-200 h-3 rounded-full overflow-hidden">
          <View
            className="bg-blue-600 h-full"
            style={{ width: `${percentage}%` }}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row px-4 py-3 bg-white border-b border-gray-200">
        {(['all', 'unlocked', 'locked'] as FilterType[]).map((type) => (
          <Pressable
            key={type}
            onPress={() => setFilter(type)}
            className={`mr-3 px-4 py-2 rounded-lg ${
              filter === type ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                filter === type ? 'text-white' : 'text-gray-700'
              }`}
            >
              {type === 'all' && '전체'}
              {type === 'unlocked' && '획득'}
              {type === 'locked' && '미획득'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Badge Grid */}
      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerClassName="px-4 py-4"
      >
        <View className="flex-row flex-wrap -mx-2">
          {filteredBadges.map((badge) => {
            const isUnlocked = unlockedIds.has(badge.id);
            const unlockedAt = getUnlockedDate(badge.id);
            const progress = badgeProgress[badge.id];
            const showNew = newlyUnlockedIds.includes(badge.id);

            return (
              <View key={badge.id} className="w-1/2 px-2 mb-4">
                <BadgeCard
                  badge={badge}
                  unlocked={isUnlocked}
                  unlockedAt={unlockedAt}
                  progress={progress}
                  onPress={() => onBadgePress?.(badge)}
                  showNew={showNew}
                />
              </View>
            );
          })}
        </View>

        {filteredBadges.length === 0 && (
          <View className="items-center justify-center py-12">
            <Text className="text-gray-400 text-base">
              {filter === 'unlocked' && '아직 획득한 배지가 없습니다'}
              {filter === 'locked' && '모든 배지를 획득했습니다!'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default BadgeGallery;
