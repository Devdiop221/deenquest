import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { trpc } from "../../lib/trpc";

export default function QuizScreen() {
  const { data: quizzes, isLoading: quizzesLoading } = trpc.quizzes.getAll.useQuery();
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.getAll.useQuery();

  if (quizzesLoading || categoriesLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-deen-secondary">
        <Text className="text-lg" style={{ fontFamily: 'Urbanist_500Medium' }}>
          Loading quizzes...
        </Text>
      </View>
    );
  }

  // Group quizzes by category
  const quizzesByCategory = categories?.map(category => ({
    ...category,
    quizzes: quizzes?.filter(quiz => quiz.category?.id === category.id) || []
  })) || [];

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-yellow-100 text-yellow-800";
      case 3:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return "Unknown";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-deen-secondary">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="p-6">
          <View className="flex-row items-center justify-between mb-8">
            <Text
              className="text-3xl text-deen-dark"
              style={{ fontFamily: "SpaceGrotesk_700Bold" }}
            >
              Islamic Quizzes
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/quiz-progress")}
              className="bg-white px-4 py-2 rounded-xl shadow-sm"
            >
              <Text
                className="text-deen-primary"
                style={{ fontFamily: "Urbanist_600SemiBold" }}
              >
                Progress
              </Text>
            </TouchableOpacity>
          </View>

          {/* Categories with Quizzes */}
          {quizzesByCategory.map((category) => (
            <View key={category.id} className="mb-8">
              {/* Category Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Text className="text-3xl mr-3">{category.icon}</Text>
                  <View>
                    <Text
                      className="text-xl text-deen-dark"
                      style={{ fontFamily: "SpaceGrotesk_700Bold" }}
                    >
                      {category.name}
                    </Text>
                    <Text
                      className="text-sm text-gray-600"
                      style={{ fontFamily: "Urbanist_400Regular" }}
                    >
                      {category.quizzes.length} questions
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="bg-deen-primary px-4 py-2 rounded-xl"
                  onPress={() => router.push(`/quiz/category?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`)}
                  style={{
                    shadowColor: '#015055',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Text
                    className="text-white text-sm"
                    style={{ fontFamily: "Urbanist_600SemiBold" }}
                  >
                    Start Quiz
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Quiz List for Category */}
              <View className="space-y-3">
                {category.quizzes.slice(0, 3).map((quiz) => (
                  <TouchableOpacity
                    key={quiz.id}
                    className="bg-white rounded-2xl p-4 mb-3"
                    onPress={() => router.push(`/quiz/${quiz.id}`)}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <Text
                        className="text-lg text-deen-dark flex-1 mr-3"
                        style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
                      >
                        {quiz.title}
                      </Text>
                      <View
                        className={`px-2 py-1 rounded-full ${getDifficultyColor(
                          quiz.difficulty
                        )}`}
                      >
                        <Text
                          className="text-xs"
                          style={{ fontFamily: "Urbanist_500Medium" }}
                        >
                          {getDifficultyText(quiz.difficulty)}
                        </Text>
                      </View>
                    </View>

                    <Text
                      className="text-gray-600 mb-3 text-sm"
                      style={{ fontFamily: "Urbanist_400Regular" }}
                      numberOfLines={2}
                    >
                      {quiz.question}
                    </Text>

                    <View className="flex-row justify-between items-center">
                      <Text
                        className="text-xs text-gray-500"
                        style={{ fontFamily: "Urbanist_400Regular" }}
                      >
                        Individual Question
                      </Text>
                      <Text
                        className="text-sm text-deen-accent"
                        style={{ fontFamily: "Urbanist_600SemiBold" }}
                      >
                        +{quiz.xpReward} XP
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}

                {/* Show More Button */}
                {category.quizzes.length > 3 && (
                  <TouchableOpacity
                    className="bg-gray-100 rounded-2xl p-4 items-center"
                    onPress={() => router.push(`/category/${category.id}`)}
                  >
                    <Text
                      className="text-gray-600"
                      style={{ fontFamily: "Urbanist_500Medium" }}
                    >
                      +{category.quizzes.length - 3} more questions
                    </Text>
                    <Text
                      className="text-gray-500 text-sm mt-1"
                      style={{ fontFamily: "Urbanist_400Regular" }}
                    >
                      View all {category.name} questions
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
