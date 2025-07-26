import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { trpc } from '../../utils/trpc';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'quizzes' | 'lectures'>('quizzes');

  const { data: category } = trpc.categories.getById.useQuery({ id: id! });
  const { data: quizzes } = trpc.quizzes.getByCategory.useQuery({ categoryId: id! });
  const { data: lectures } = trpc.lectures.getByCategory.useQuery({ categoryId: id! });

  if (!category) {
    return (
      <View className="flex-1 justify-center items-center bg-deen-secondary">
        <Text className="text-lg" style={{ fontFamily: 'Urbanist_500Medium' }}>
          Category not found
        </Text>
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <ScrollView className="flex-1 bg-deen-secondary">
      <View className="p-6">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#015055" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-4xl mb-2">{category.icon}</Text>
            <Text className="text-3xl text-deen-dark" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
              {category.name}
            </Text>
            <Text className="text-gray-600" style={{ fontFamily: 'Urbanist_400Regular' }}>
              {category.description}
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row bg-white rounded-2xl p-1 mb-6">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ${
              activeTab === 'quizzes' ? 'bg-deen-primary' : ''
            }`}
            onPress={() => setActiveTab('quizzes')}
          >
            <Text
              className={`text-center ${
                activeTab === 'quizzes' ? 'text-white' : 'text-deen-dark'
              }`}
              style={{ fontFamily: 'Urbanist_600SemiBold' }}
            >
              Quizzes ({quizzes?.length || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ${
              activeTab === 'lectures' ? 'bg-deen-primary' : ''
            }`}
            onPress={() => setActiveTab('lectures')}
          >
            <Text
              className={`text-center ${
                activeTab === 'lectures' ? 'text-white' : 'text-deen-dark'
              }`}
              style={{ fontFamily: 'Urbanist_600SemiBold' }}
            >
              Lectures ({lectures?.length || 0})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'quizzes' && (
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
                  <Text className="text-sm text-gray-500" style={{ fontFamily: 'Urbanist_400Regular' }}>
                    Islamic Quiz
                  </Text>
                  <Text className="text-sm text-deen-accent" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
                    +{quiz.xpReward} XP
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'lectures' && (
          <View className="space-y-4">
            {lectures?.map((lecture) => (
              <TouchableOpacity
                key={lecture.id}
                className="bg-white rounded-2xl p-6 shadow-sm"
                onPress={() => router.push(`/lecture/${lecture.id}`)}
              >
                <Text className="text-xl text-deen-dark mb-2" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                  {lecture.title}
                </Text>

                {lecture.description && (
                  <Text className="text-gray-600 mb-4" style={{ fontFamily: 'Urbanist_400Regular' }}>
                    {lecture.description}
                  </Text>
                )}

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Text className="text-sm text-gray-500 mr-4" style={{ fontFamily: 'Urbanist_400Regular' }}>
                      🎧 Audio Story
                    </Text>
                    {lecture.duration && (
                      <Text className="text-sm text-gray-500" style={{ fontFamily: 'Urbanist_400Regular' }}>
                        🕐 {formatDuration(lecture.duration)}
                      </Text>
                    )}
                  </View>
                  <Text className="text-sm text-deen-accent" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
                    +{lecture.xpReward} XP
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}