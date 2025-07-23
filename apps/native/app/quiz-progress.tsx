import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function QuizProgressScreen() {
  // Mock data for quiz progress
  const quizProgress = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    completed: i < 19, // First 19 are completed
    current: i === 19, // 20th is current
  }));

  const completedCount = quizProgress.filter(q => q.completed).length;
  const currentQuestion = quizProgress.find(q => q.current)?.id || 1;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#015055" />
          </TouchableOpacity>
          <Text className="text-2xl text-deen-dark" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            Quiz Progress
          </Text>
        </View>

        {/* Progress Grid */}
        <View className="flex-row flex-wrap justify-between mb-8">
          {quizProgress.map((quiz) => (
            <TouchableOpacity
              key={quiz.id}
              className={`w-[18%] aspect-square rounded-2xl mb-3 items-center justify-center ${
                quiz.completed
                  ? 'bg-deen-secondary'
                  : quiz.current
                    ? 'bg-deen-primary'
                    : 'bg-gray-100'
              }`}
              disabled={!quiz.completed && !quiz.current}
            >
              <Text
                className={`text-lg ${
                  quiz.completed
                    ? 'text-deen-dark'
                    : quiz.current
                      ? 'text-white'
                      : 'text-gray-400'
                }`}
                style={{ fontFamily: 'Urbanist_600SemiBold' }}
              >
                {quiz.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Legend */}
        <View className="bg-gray-50 rounded-2xl p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-4 h-4 bg-deen-secondary rounded mr-2" />
              <Text className="text-deen-dark" style={{ fontFamily: 'Urbanist_500Medium' }}>
                Solved
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-4 h-4 bg-deen-primary rounded-full mr-2" />
              <Text className="text-deen-dark" style={{ fontFamily: 'Urbanist_500Medium' }}>
                Current Question
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-4 h-4 bg-gray-300 rounded mr-2" />
              <Text className="text-gray-600" style={{ fontFamily: 'Urbanist_500Medium' }}>
                Unsolved
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="mt-6 bg-white border border-gray-200 rounded-2xl p-4">
          <Text className="text-lg text-deen-dark mb-4" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
            Progress Summary
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl text-deen-primary" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
                {completedCount}
              </Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Urbanist_400Regular' }}>
                Completed
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl text-deen-accent" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
                {currentQuestion}
              </Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Urbanist_400Regular' }}>
                Current
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl text-gray-400" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
                {30 - completedCount - 1}
              </Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Urbanist_400Regular' }}>
                Remaining
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}