import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { trpc } from '../../lib/trpc';
import { Award, Play } from 'lucide-react-native';
import { ScreenHeader } from '../../components/screen-header';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  // Force hide header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { data: category, isLoading: categoryLoading } = trpc.categories.getById.useQuery({ id: id! });
  const { data: categoryQuizzes, isLoading: quizzesLoading } = trpc.quizzes.getByCategory.useQuery({ categoryId: id! });

  if (categoryLoading || quizzesLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-deen-secondary">
        <Text className="text-lg" style={{ fontFamily: 'Urbanist_500Medium' }}>
          Loading category...
        </Text>
      </View>
    );
  }

  if (!category) {
    return (
      <View className="flex-1 justify-center items-center bg-deen-secondary">
        <Text className="text-lg text-red-600" style={{ fontFamily: 'Urbanist_500Medium' }}>
          Category not found
        </Text>
      </View>
    );
  }

  const startCategoryQuiz = () => {
    // Start quiz with questions from this category only
    router.push(`/quiz/category?categoryId=${id}&categoryName=${encodeURIComponent(category.name)}`);
  };

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
    <SafeAreaView className="flex-1 bg-deen-secondary">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="p-6">
          {/* Custom Header */}
          <ScreenHeader
            title={category.name}
            showBack={true}
          />

          {/* Category Info */}
          <View className="bg-white rounded-3xl p-6 mb-8 shadow-sm">
            <View className="items-center mb-6">
              <Text className="text-6xl mb-4">{category.icon}</Text>
              <Text
                className="text-gray-600 text-center leading-6"
                style={{ fontFamily: 'Urbanist_400Regular' }}
              >
                {category.description}
              </Text>
            </View>

            <View className="flex-row items-center justify-between w-full">
              <View className="items-center">
                <Text
                  className="text-2xl text-deen-primary"
                  style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
                >
                  {categoryQuizzes?.length || 0}
                </Text>
                <Text
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Questions
                </Text>
              </View>

              <TouchableOpacity
                className="bg-deen-primary px-8 py-4 rounded-2xl flex-row items-center"
                onPress={startCategoryQuiz}
                style={{
                  shadowColor: '#015055',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Play size={20} color="white" fill="white" />
                <Text
                  className="text-white ml-2"
                  style={{ fontFamily: 'Urbanist_700Bold' }}
                >
                  Start Quiz
                </Text>
              </TouchableOpacity>

              <View className="items-center">
                <Text
                  className="text-2xl text-deen-accent"
                  style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
                >
                  {categoryQuizzes?.reduce((sum, q) => sum + (q.xpReward || 0), 0) || 0}
                </Text>
                <Text
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: 'Urbanist_400Regular' }}
                >
                  Total XP
                </Text>
              </View>
            </View>
          </View>

          {/* Questions Preview */}
          <View className="mb-8">
            <Text
              className="text-xl text-deen-dark mb-6"
              style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
            >
              📚 Questions in this category
            </Text>

            <View className="space-y-5">
              {categoryQuizzes?.slice(0, 5).map((quiz, index) => (
                <View
                  key={quiz.id}
                  className="bg-white rounded-2xl p-6 mb-5 shadow-sm"
                >
                  <View className="flex-row justify-between items-start mb-4">
                    <Text
                      className="text-lg text-deen-dark flex-1 mr-4"
                      style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
                    >
                      {quiz.title}
                    </Text>
                    <View className={`px-3 py-1 rounded-full ${getDifficultyColor(quiz.difficulty || 1)}`}>
                      <Text
                        className="text-xs"
                        style={{ fontFamily: 'Urbanist_500Medium' }}
                      >
                        {getDifficultyText(quiz.difficulty || 1)}
                      </Text>
                    </View>
                  </View>

                  <Text
                    className="text-gray-600 mb-4 leading-6"
                    style={{ fontFamily: 'Urbanist_400Regular' }}
                  >
                    {quiz.question}
                  </Text>

                  <View className="flex-row items-center justify-between">
                    <Text
                      className="text-sm text-gray-500"
                      style={{ fontFamily: 'Urbanist_400Regular' }}
                    >
                      Question {index + 1}
                    </Text>
                    <View className="flex-row items-center">
                      <Award size={14} color="#10b981" />
                      <Text
                        className="text-deen-accent ml-1 text-sm"
                        style={{ fontFamily: 'Urbanist_600SemiBold' }}
                      >
                        +{quiz.xpReward} XP
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              {(categoryQuizzes?.length || 0) > 5 && (
                <View className="bg-gray-100 rounded-2xl p-6 items-center mt-2">
                  <Text
                    className="text-gray-600 text-lg"
                    style={{ fontFamily: 'Urbanist_500Medium' }}
                  >
                    +{(categoryQuizzes?.length || 0) - 5} more questions
                  </Text>
                  <Text
                    className="text-gray-500 text-sm mt-2"
                    style={{ fontFamily: 'Urbanist_400Regular' }}
                  >
                    Start the quiz to see all questions
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}