import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Trophy, Target, Clock } from 'lucide-react-native';
import { trpc } from '../lib/trpc';

export default function QuizProgressScreen() {
  const { data: stats, isLoading } = trpc.user.getStats.useQuery();
  const { data: progress, isLoading: progressLoading } = trpc.user.getProgress.useQuery();

  if (isLoading || progressLoading) {
    return (
      <SafeAreaView className="flex-1 bg-deen-secondary">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg" style={{ fontFamily: 'Urbanist_500Medium' }}>
            Loading progress...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
              Quiz Progress
            </Text>
          </View>

          {/* Stats Cards */}
          <View className="flex-row justify-between mb-6">
            <View className="bg-white rounded-2xl p-4 flex-1 mr-2">
              <View className="items-center">
                <Trophy size={32} color="#F59E0B" />
                <Text
                  className="text-2xl text-deen-dark mt-2"
                  style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
                >
                  {stats?.quizzesCompleted || 0}
                </Text>
                <Text
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Completed
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-4 flex-1 mx-1">
              <View className="items-center">
                <Target size={32} color="#10B981" />
                <Text
                  className="text-2xl text-deen-dark mt-2"
                  style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
                >
                  {stats?.correctAnswers || 0}
                </Text>
                <Text
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Correct
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-4 flex-1 ml-2">
              <View className="items-center">
                <Clock size={32} color="#8B5CF6" />
                <Text
                  className="text-2xl text-deen-dark mt-2"
                  style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
                >
                  {Math.floor((stats?.totalTimeSpent || 0) / 60)}m
                </Text>
                <Text
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Time Spent
                </Text>
              </View>
            </View>
          </View>

          {/* Progress Overview */}
          <View className="bg-white rounded-2xl p-6 mb-6">
            <Text
              className="text-xl text-deen-dark mb-4"
              style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
            >
              Overall Progress
            </Text>

            <View className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text
                  className="text-gray-600"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Quiz Accuracy
                </Text>
                <Text
                  className="text-deen-primary"
                  style={{ fontFamily: 'Urbanist_600SemiBold' }}
                >
                  {stats?.quizzesCompleted ? Math.round(((stats?.correctAnswers || 0) / stats.quizzesCompleted) * 100) : 0}%
                </Text>
              </View>
              <View className="bg-gray-200 rounded-full h-3">
                <View
                  className="bg-deen-primary rounded-full h-3"
                  style={{
                    width: `${stats?.quizzesCompleted ? Math.round(((stats?.correctAnswers || 0) / stats.quizzesCompleted) * 100) : 0}%`
                  }}
                />
              </View>
            </View>

            <View className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text
                  className="text-gray-600"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Level Progress
                </Text>
                <Text
                  className="text-deen-accent"
                  style={{ fontFamily: 'Urbanist_600SemiBold' }}
                >
                  Level {Math.floor((stats?.totalXp || 0) / 100) + 1}
                </Text>
              </View>
              <View className="bg-gray-200 rounded-full h-3">
                <View
                  className="bg-deen-accent rounded-full h-3"
                  style={{
                    width: `${((stats?.totalXp || 0) % 100)}%`
                  }}
                />
              </View>
              <Text
                className="text-gray-500 text-sm mt-1"
                style={{ fontFamily: 'Urbanist_400Regular' }}
              >
                {100 - ((stats?.totalXp || 0) % 100)} XP to next level
              </Text>
            </View>
          </View>

          {/* Recent Activity */}
          <View className="bg-white rounded-2xl p-6">
            <Text
              className="text-xl text-deen-dark mb-4"
              style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
            >
              Recent Activity
            </Text>

            {progress && progress.length > 0 ? (
              <View className="space-y-3">
                {progress.slice(0, 5).map((item, index) => (
                  <View key={index} className="flex-row items-center justify-between py-2">
                    <View className="flex-1">
                      <Text
                        className="text-deen-dark"
                        style={{ fontFamily: 'Urbanist_500Medium' }}
                      >
                        Quiz Completed
                      </Text>
                      <Text
                        className="text-gray-500 text-sm"
                        style={{ fontFamily: 'Urbanist_400Regular' }}
                      >
                        Score: {item.score}/100
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text
                        className={`text-sm ${item.score >= 70 ? 'text-green-600' : 'text-red-600'}`}
                        style={{ fontFamily: 'Urbanist_600SemiBold' }}
                      >
                        {item.score >= 70 ? 'Passed' : 'Failed'}
                      </Text>
                      <Text
                        className="text-gray-400 text-xs"
                        style={{ fontFamily: 'Urbanist_400Regular' }}
                      >
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center py-8">
                <Text
                  className="text-gray-500"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  No quiz activity yet
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/quiz')}
                  className="bg-deen-primary px-6 py-3 rounded-xl mt-4"
                >
                  <Text
                    className="text-white"
                    style={{ fontFamily: 'Urbanist_600SemiBold' }}
                  >
                    Start Your First Quiz
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}