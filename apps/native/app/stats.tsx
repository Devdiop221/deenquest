import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Trophy, Target, Clock, Star, Award, TrendingUp } from 'lucide-react-native';
import { trpc } from '../lib/trpc';

export default function StatsScreen() {
  const { data: stats, isLoading } = trpc.user.getStats.useQuery();
  const { data: badges } = trpc.user.getBadges.useQuery();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-deen-secondary">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg" style={{ fontFamily: 'Urbanist_500Medium' }}>
            Loading stats...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentLevel = Math.floor((stats?.totalXp || 0) / 100) + 1;
  const xpInCurrentLevel = (stats?.totalXp || 0) % 100;
  const xpForNextLevel = 100 - xpInCurrentLevel;
  const accuracy = stats?.quizzesCompleted ? Math.round(((stats?.correctAnswers || 0) / stats.quizzesCompleted) * 100) : 0;

  return (
    <SafeAreaView className="flex-1 bg-deen-secondary">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="p-6">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2 bg-white rounded-xl"
            >
              <ArrowLeft size={24} color="#015055" />
            </TouchableOpacity>
            <Text
              className="text-2xl text-deen-dark flex-1"
              style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
            >
              My Statistics
            </Text>
          </View>

          {/* Level Card */}
          <View className="bg-gradient-to-r from-deen-primary to-deen-accent rounded-2xl p-6 mb-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  className="text-white text-lg"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Current Level
                </Text>
                <Text
                  className="text-white text-4xl"
                  style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
                >
                  {currentLevel}
                </Text>
              </View>
              <View className="items-center">
                <Star size={48} color="#FFF" fill="#FFF" />
                <Text
                  className="text-white text-sm mt-2"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  {xpForNextLevel} XP to next level
                </Text>
              </View>
            </View>

            <View className="mt-4">
              <View className="bg-white/20 rounded-full h-3">
                <View
                  className="bg-white rounded-full h-3"
                  style={{ width: `${xpInCurrentLevel}%` }}
                />
              </View>
            </View>
          </View>

          {/* Main Stats Grid */}
          <View className="flex-row flex-wrap justify-between mb-6">
            <View className="bg-white rounded-2xl p-4 w-[48%] mb-4">
              <View className="items-center">
                <Trophy size={32} color="#F59E0B" />
                <Text
                  className="text-2xl text-deen-dark mt-2"
                  style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
                >
                  {stats?.quizzesCompleted || 0}
                </Text>
                <Text
                  className="text-gray-600 text-sm text-center"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Quizzes Completed
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-4 w-[48%] mb-4">
              <View className="items-center">
                <Target size={32} color="#10B981" />
                <Text
                  className="text-2xl text-deen-dark mt-2"
                  style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
                >
                  {accuracy}%
                </Text>
                <Text
                  className="text-gray-600 text-sm text-center"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Accuracy Rate
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-4 w-[48%] mb-4">
              <View className="items-center">
                <Clock size={32} color="#8B5CF6" />
                <Text
                  className="text-2xl text-deen-dark mt-2"
                  style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
                >
                  {Math.floor((stats?.totalTimeSpent || 0) / 60)}m
                </Text>
                <Text
                  className="text-gray-600 text-sm text-center"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Time Spent
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-4 w-[48%] mb-4">
              <View className="items-center">
                <TrendingUp size={32} color="#EF4444" />
                <Text
                  className="text-2xl text-deen-dark mt-2"
                  style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
                >
                  {stats?.lecturesCompleted || 0}
                </Text>
                <Text
                  className="text-gray-600 text-sm text-center"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Lectures Watched
                </Text>
              </View>
            </View>
          </View>

          {/* Detailed Stats */}
          <View className="bg-white rounded-2xl p-6 mb-6">
            <Text
              className="text-xl text-deen-dark mb-4"
              style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
            >
              Detailed Statistics
            </Text>

            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-gray-600"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Total XP Earned
                </Text>
                <Text
                  className="text-deen-primary"
                  style={{ fontFamily: 'Urbanist_600SemiBold' }}
                >
                  {stats?.totalXp || 0} XP
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text
                  className="text-gray-600"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Correct Answers
                </Text>
                <Text
                  className="text-green-600"
                  style={{ fontFamily: 'Urbanist_600SemiBold' }}
                >
                  {stats?.correctAnswers || 0}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text
                  className="text-gray-600"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Average Time per Quiz
                </Text>
                <Text
                  className="text-purple-600"
                  style={{ fontFamily: 'Urbanist_600SemiBold' }}
                >
                  {stats?.quizzesCompleted ? Math.round((stats?.totalTimeSpent || 0) / stats.quizzesCompleted) : 0}s
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text
                  className="text-gray-600"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Current Streak
                </Text>
                <Text
                  className="text-orange-600"
                  style={{ fontFamily: 'Urbanist_600SemiBold' }}
                >
                  {stats?.currentStreak || 0} days
                </Text>
              </View>
            </View>
          </View>

          {/* Badges */}
          <View className="bg-white rounded-2xl p-6">
            <Text
              className="text-xl text-deen-dark mb-4"
              style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
            >
              Achievements
            </Text>

            {badges && badges.length > 0 ? (
              <View className="flex-row flex-wrap">
                {badges.map((badge, index) => (
                  <View key={index} className="w-1/3 items-center mb-4">
                    <View className="w-16 h-16 bg-deen-secondary rounded-full items-center justify-center mb-2">
                      <Award size={32} color="#015055" />
                    </View>
                    <Text
                      className="text-deen-dark text-center text-sm"
                      style={{ fontFamily: 'Urbanist_500Medium' }}
                    >
                      {badge.name}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center py-8">
                <Text className="text-6xl mb-2">🏆</Text>
                <Text
                  className="text-gray-500 text-center"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Complete more quizzes to earn badges!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}