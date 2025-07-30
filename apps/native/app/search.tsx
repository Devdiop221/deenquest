import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Search, X, BookOpen, HelpCircle } from 'lucide-react-native';
import { trpc } from '../lib/trpc';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    quizzes: any[];
    lectures: any[];
  }>({ quizzes: [], lectures: [] });

  const { data: allQuizzes } = trpc.quizzes.getAll.useQuery();
  const { data: allLectures } = trpc.lectures.getAll.useQuery();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults({ quizzes: [], lectures: [] });
      return;
    }

    const query = searchQuery.toLowerCase();

    const filteredQuizzes = allQuizzes?.filter(quiz =>
      quiz.title.toLowerCase().includes(query) ||
      quiz.question.toLowerCase().includes(query) ||
      quiz.category?.name.toLowerCase().includes(query)
    ) || [];

    const filteredLectures = allLectures?.filter(lecture =>
      lecture.title.toLowerCase().includes(query) ||
      lecture.description?.toLowerCase().includes(query) ||
      lecture.category?.name.toLowerCase().includes(query)
    ) || [];

    setSearchResults({
      quizzes: filteredQuizzes.slice(0, 10),
      lectures: filteredLectures.slice(0, 10),
    });
  }, [searchQuery, allQuizzes, allLectures]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ quizzes: [], lectures: [] });
  };

  return (
    <View className="flex-1 bg-deen-secondary">
      <View className="p-6 pt-12">
        {/* Search Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2"
          >
            <X size={24} color="#015055" />
          </TouchableOpacity>
          <Text
            className="text-xl text-deen-dark"
            style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
          >
            Search DeenQuest
          </Text>
        </View>
     {/* Search Input */}
        <View className="bg-white rounded-2xl p-4 flex-row items-center mb-6 shadow-sm">
          <Search size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-lg"
            placeholder="Search quizzes, stories, topics..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ fontFamily: 'Urbanist_400Regular' }}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="p-1">
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {searchQuery.trim() === '' ? (
            <View className="items-center justify-center py-20">
              <Search size={64} color="#9ca3af" />
              <Text
                className="text-gray-500 text-center mt-4"
                style={{ fontFamily: 'Urbanist_400Regular' }}
              >
                Start typing to search for quizzes and stories
              </Text>
            </View>
          ) : (
            <View>
              {/* Quiz Results */}
              {searchResults.quizzes.length > 0 && (
                <View className="mb-6">
                  <Text
                    className="text-lg text-deen-dark mb-4"
                    style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
                  >
                    🧠 Quizzes ({searchResults.quizzes.length})
                  </Text>
                  {searchResults.quizzes.map((quiz) => (
                    <TouchableOpacity
                      key={quiz.id}
                      className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
                      onPress={() => router.push(`/quiz/${quiz.id}`)}
                    >
                      <View className="flex-row items-start">
                        <View className="bg-deen-secondary p-2 rounded-xl mr-3">
                          <HelpCircle size={20} color="#015055" />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-deen-dark mb-1"
                            style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
                          >
                            {quiz.title}
                          </Text>
                          <Text
                            className="text-gray-600 text-sm mb-2"
                            style={{ fontFamily: 'Urbanist_400Regular' }}
                          >
                            {quiz.question}
                          </Text>
                          <View className="flex-row items-center">
                            <Text
                              className="text-xs text-gray-500 mr-3"
                              style={{ fontFamily: 'Urbanist_400Regular' }}
                            >
                              {quiz.category?.icon} {quiz.category?.name}
                            </Text>
                            <Text
                              className="text-xs text-deen-accent"
                              style={{ fontFamily: 'Urbanist_600SemiBold' }}
                            >
                              +{quiz.xpReward} XP
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Lecture Results */}
              {searchResults.lectures.length > 0 && (
                <View className="mb-6">
                  <Text
                    className="text-lg text-deen-dark mb-4"
                    style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
                  >
                    📚 Stories ({searchResults.lectures.length})
                  </Text>
                  {searchResults.lectures.map((lecture) => (
                    <TouchableOpacity
                      key={lecture.id}
                      className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
                      onPress={() => router.push(`/lecture/${lecture.id}`)}
                    >
                      <View className="flex-row items-start">
                        <View className="bg-deen-secondary p-2 rounded-xl mr-3">
                          <BookOpen size={20} color="#015055" />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-deen-dark mb-1"
                            style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
                          >
                            {lecture.title}
                          </Text>
                          {lecture.description && (
                            <Text
                              className="text-gray-600 text-sm mb-2"
                              style={{ fontFamily: 'Urbanist_400Regular' }}
                            >
                              {lecture.description}
                            </Text>
                          )}
                          <View className="flex-row items-center">
                            <Text
                              className="text-xs text-gray-500 mr-3"
                              style={{ fontFamily: 'Urbanist_400Regular' }}
                            >
                              {lecture.category?.icon} {lecture.category?.name}
                            </Text>
                            <Text
                              className="text-xs text-deen-accent"
                              style={{ fontFamily: 'Urbanist_600SemiBold' }}
                            >
                              +{lecture.xpReward} XP
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* No Results */}
              {searchResults.quizzes.length === 0 && searchResults.lectures.length === 0 && (
                <View className="items-center justify-center py-20">
                  <Text className="text-6xl mb-4">🔍</Text>
                  <Text
                    className="text-gray-500 text-center"
                    style={{ fontFamily: 'Urbanist_500Medium' }}
                  >
                    No results found for "{searchQuery}"
                  </Text>
                  <Text
                    className="text-gray-400 text-center mt-2"
                    style={{ fontFamily: 'Urbanist_400Regular' }}
                  >
                    Try searching for different keywords
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}