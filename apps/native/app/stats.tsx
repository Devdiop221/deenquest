import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { trpc } from '../utils/trpc';

export default function StatsScreen() {
  const { data: stats } = trpc.user.getStats.useQuery();
  const { data: progress } = trpc.user.getProgress.useQuery();
  const { data: badges } = trpc.user.getBadges.useQuery();

  const getXpForNextLevel = (currentXp: number) => {
    const currentLevel = Math.floor(currentXp / 100) + 1;
    return (currentLevel * 100) - currentXp;
  };

  const getXpProgress = (currentXp: number) => {
    const levelXp = currentXp % 100;
    return (levelXp / 100) * 100;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView className="flex-1 bg-deen-secondary">
      <View className="p-6">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#015055" />
          </TouchableOpacity>
          <Text className="text-3xl text-deen-dark" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            Your Statistics
          </Text>
        </View>

        {/* XP Progress Card */}
        <View className="bg-gradient-to-r from-deen-primary to-deen-accent rounded-2xl p-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-white text-2xl" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
                Level {stats?.level || 1}
              </Text>
              <Text className="text-deen-secondary" style={{ fontFamily: 'Urbanist_400Regular' }}>
                {stats?.totalXp || 0} XP
              </Text>
            </View>
            <Text className="text-4xl">🎓</Text>
          </View>

          {/* XP Progress Bar */}
          <View className="bg-white/20 rounded-full h-3 mb-2">
            <View
              className="bg-white rounded-full h-3"
              style={{ width: `${getXpProgress(stats?.totalXp || 0)}%` }}
            />
          </View>
          <Text className="text-deen-secondary text-sm" style={{ fontFamily: 'Urbanist_400Regular' }}>
            {getXpForNextLevel(stats?.totalXp || 0)} XP to next level
          </Text>
        </View>

        {/* Activity Overview */}
        <View className="bg-white rounded-2xl p-6 mb-6">
          <Text className="text-xl text-deen-dark mb-4" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
            Activity Overview
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-3xl text-deen-primary" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
                {stats?.quizzesCompleted || 0}
              </Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Urbanist_400Regular' }}>
                Quizzes Completed
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl text-deen-accent" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
                {stats?.lecturesCompleted || 0}
              </Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Urbanist_400Regular' }}>
                Lectures Completed
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl text-orange-500" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
                {badges?.length || 0}
              </Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Urbanist_400Regular' }}>
                Badges Earned
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Progress */}
        <View className="bg-white rounded-2xl p-6 mb-6">
          <Text className="text-xl text-deen-dark mb-4" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
            Recent Activity
          </Text>
          {progress && progress.length > 0 ? (
            <View className="space-y-3">
              {progress.slice(0, 5).map((item) => (
                <View key={item.id} className="flex-row justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <View className="flex-1">
                    <Text className="text-deen-dark" style={{ fontFamily: 'Urbanist_500Medium' }}>
                      Quiz Completed
                    </Text>
                    <Text className="text-gray-500 text-sm" style={{ fontFamily: 'Urbanist_400Regular' }}>
                      {formatDate(item.completedAt)}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-deen-accent" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
                      {item.score}%
                    </Text>
                    <Text className="text-gray-500 text-sm" style={{ fontFamily: 'Urbanist_400Regular' }}>
                      {item.timeSpent}s
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center py-8">
              <Text className="text-4xl mb-2">📊</Text>
              <Text className="text-gray-600" style={{ fontFamily: 'Urbanist_400Regular' }}>
                No activity yet
              </Text>
            </View>
          )}
        </View>

        {/* Badges */}
        <View className="bg-white rounded-2xl p-6">
          <Text className="text-xl text-deen-dark mb-4" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
            Earned Badges
          </Text>

          {badges && badges.length > 0 ? (
            <View className="space-y-3">
              {badges.map((userBadge) => (
                <View key={userBadge.id} className="flex-row items-center p-4 bg-yellow-50 rounded-xl">
                  <Text className="text-3xl mr-4">{userBadge.badge.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-deen-dark" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                      {userBadge.badge.name}
                    </Text>
                    <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Urbanist_400Regular' }}>
                      {userBadge.badge.description}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500" style={{ fontFamily: 'Urbanist_400Regular' }}>
                    {formatDate(userBadge.earnedAt)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center py-8">
              <Text className="text-4xl mb-2">🏆</Text>
              <Text className="text-gray-600" style={{ fontFamily: 'Urbanist_400Regular' }}>
                No badges earned yet
              </Text>
              <Text className="text-gray-500 text-sm text-center mt-2" style={{ fontFamily: 'Urbanist_400Regular' }}>
                Complete quizzes and lectures to earn badges!
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}