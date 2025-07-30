import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { trpc } from "../../lib/trpc";

export default function QuizScreen() {
  const { data: quizzes, isLoading } = trpc.quizzes.getAll.useQuery();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">Loading quizzes...</Text>
      </View>
    );
  }

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

          <View className="space-y-4">
            {quizzes?.map((quiz) => (
              <TouchableOpacity
                key={quiz.id}
                className="bg-white rounded-2xl p-6 mb-4"
                onPress={() => router.push(`/quiz/${quiz.id}`)}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <Text
                    className="text-xl text-deen-dark flex-1"
                    style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
                  >
                    {quiz.title}
                  </Text>
                  <View
                    className={`px-3 py-1 rounded-full ${getDifficultyColor(
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
                  className="text-gray-600 mb-4"
                  style={{ fontFamily: "Urbanist_400Regular" }}
                >
                  {quiz.question}
                </Text>

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Text
                      className="text-sm text-gray-500 mr-4"
                      style={{ fontFamily: "Urbanist_400Regular" }}
                    >
                      {quiz.category?.icon} {quiz.category?.name}
                    </Text>
                  </View>
                  <Text
                    className="text-sm text-deen-accent"
                    style={{ fontFamily: "Urbanist_600SemiBold" }}
                  >
                    +{quiz.xpReward} XP
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
