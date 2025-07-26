import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { trpc } from '../utils/trpc';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'quizzes' | 'lectures'>('all');

  const { data: quizzes } = trpc.quizzes.getAll.useQuery();
  const { data: lectures } = trpc.lectures.getAll.useQuery();

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return { quizzes: [], lectures: [] };

    const query = searchQuery.toLowerCase();

    const filteredQuizzes = quizzes?.filter(quiz =>
      quiz.title.toLowerCase().includes(query) ||
      quiz.question.toLowerCase().includes(query) ||
      quiz.category?.name.toLowerCase().includes(query)
    ) || [];

    const filteredLectures = lectures?.filter(lecture =>
      lecture.title.toLowerCase().includes(query) ||
      lecture.description?.toLowerCase().includes(query) ||
      lecture.category?.name.toLowerCase().includes(query)
    ) || [];

    return {
      quizzes: activeFilter === 'lectures' ? [] : filteredQuizzes,
      lectures: activeFilter === 'quizzes' ? [] : filteredLectures,
    };
  }, [searchQuery, quizzes, lectures, activeFilter]);

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

  const totalResults = filteredResults.quizzes.length + filteredResults.lectures.length;

  return (
    <View className="flex-1 bg-deen-secondary">
      <View className="p-6">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#015055" />
          </TouchableOpacity>
          <Text className="text-3xl text-deen-dark" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            Search
          </Text>
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-2xl p-4 mb-6 flex-row items-center">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-lg"
            placeholder="Search quizzes and lectures..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ fontFamily: 'Urbanist_400Regular' }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View className="flex-row bg-white rounded-2xl p-1 mb-6">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ${
              activeFilter === 'all' ? 'bg-deen-primary' : ''
            }`}
            onPress={() => setActiveFilter('all')}
          >
            <Text
              className={`text-center ${
                activeFilter === 'all' ? 'text-white' : 'text-deen-dark'
              }`}
              style={{ fontFamily: 'Urbanist_600SemiBold' }}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ${
              activeFilter === 'quizzes' ? 'bg-deen-primary' : ''
            }`}
            onPress={() => setActiveFilter('quizzes')}
          >
            <Text
              className={`text-center ${
                activeFilter === 'quizzes' ? 'text-white' : 'text-deen-dark'
              }`}
              style={{ fontFamily: 'Urbanist_600SemiBold' }}
            >
              Quizzes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ${
              activeFilter === 'lectures' ? 'bg-deen-primary' : ''
            }`}
            onPress={() => setActiveFilter('lectures')}
          >
            <Text
              className={`text-center ${
                activeFilter === 'lectures' ? 'text-white' : 'text-deen-dark'
              }`}
              style={{ fontFamily: 'Urbanist_600SemiBold' }}
            >
              Lectures
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {searchQuery.trim() && (
          <Text className="text-gray-600 mb-4" style={{ fontFamily: 'Urbanist_400Regular' }}>
            {totalResults} result{totalResults !== 1 ? 's' : ''} found
          </Text>
        )}
      </View>

      <ScrollView className="flex-1 px-6">
        {searchQuery.trim() === '' ? (
          <View className="items-center justify-center py-20">
            <Text className="text-6xl mb-4">🔍</Text>
            <Text className="text-xl text-deen-dark mb-2" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
              Search DeenQuest
            </Text>
            <Text className="text-gray-600 text-center" style={{ fontFamily: 'Urbanist_400Regular' }}>
              Find quizzes and lectures on Islamic topics
            </Text>
          </View>
        ) : totalResults === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-6xl mb-4">😔</Text>
            <Text className="text-xl text-deen-dark mb-2" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
              No results found
            </Text>
            <Text className="text-gray-600 text-center" style={{ fontFamily: 'Urbanist_400Regular' }}>
              Try different keywords or browse categories
            </Text>
          </View>
        ) : (
          <View className="space-y-4 pb-6">
            {/* Quiz Results */}
            {filteredResults.quizzes.map((quiz) => (
              <TouchableOpacity
                key={`quiz-${quiz.id}`}
                className="bg-white rounded-2xl p-6 shadow-sm"
                onPress={() => router.push(`/quiz/${quiz.id}`)}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="help-circle" size={16} color="#10b981" />
                      <Text className="text-deen-accent ml-1 text-sm" style={{ fontFamily: 'Urbanist_500Medium' }}>
                        Quiz
                      </Text>
                    </View>
                    <Text className="text-xl text-deen-dark" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                      {quiz.title}
                    </Text>
                  </View>
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
                    {quiz.category?.icon} {quiz.category?.name}
                  </Text>
                  <Text className="text-sm text-deen-accent" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
                    +{quiz.xpReward} XP
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Lecture Results */}
            {filteredResults.lectures.map((lecture) => (
              <TouchableOpacity
                key={`lecture-${lecture.id}`}
                className="bg-white rounded-2xl p-6 shadow-sm"
                onPress={() => router.push(`/lecture/${lecture.id}`)}
              >
                <View className="flex-row items-center mb-2">
                  <Ionicons name="play-circle" size={16} color="#3b82f6" />
                  <Text className="text-blue-500 ml-1 text-sm" style={{ fontFamily: 'Urbanist_500Medium' }}>
                    Lecture
                  </Text>
                </View>

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
                      {lecture.category?.icon} {lecture.category?.name}
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
      </ScrollView>
    </View>
  );
}