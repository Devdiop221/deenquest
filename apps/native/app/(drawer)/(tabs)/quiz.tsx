import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useOfflineQuizzes } from '../../../lib/offline-trpc';

export default function QuizScreen() {
  const { data: quizzes, isLoading, isOffline } = useOfflineQuizzes();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">Loading quizzes...</Text>
      </View>
    );
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Unknown';
    }
  };

  return (
    <ScrollView className="flex-1 bg-deen-secondary">
      <View className="p-6">
        {isOffline && (
          <View className="bg-deen-warning/20 border border-deen-warning rounded-2xl p-4 mb-6">
            <Text className="text-deen-warning text-center" style={{ fontFamily: 'Urbanist_500Medium' }}>
              📱 Offline mode. Quiz results will sync when reconnected.
            </Text>
          </View>
        )}

        <Text className="text-3xl text-deen-dark mb-8" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
          Islamic Quizzes
        </Text>

        <View className="space-y-4">
          {quizzes?.map((quiz) => (
            <TouchableOpacity
              key={quiz.id}
              className="bg-white rounded-2xl p-6 shadow-sm"
              onPress={() => router.push(`/quiz/${quiz.id}`)}
            >
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-xl text-deen-dark flex-1" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                  {quiz.title}
                </Text>
                <View className={`px-3 py-1 rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                  <Text className="text-xs" style={{ fontFamily: 'Urbanist_500Medium' }}>
                    {getDifficultyText(quiz.difficulty)}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-600 mb-4" style={{ fontFamily: 'Urbanist_400Regular' }}>
                {quiz.question}
              </Text>

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-500 mr-4" style={{ fontFamily: 'Urbanist_400Regular' }}>
                    {quiz.category?.icon} {quiz.category?.name}
                  </Text>
                </View>
                <Text className="text-sm text-deen-accent" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
                  +{quiz.xpReward} XP
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}