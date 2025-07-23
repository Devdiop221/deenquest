import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { useOfflineQuizSubmission } from "../../lib/offline-trpc";

export default function QuizDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  const { data: quiz, isLoading } = trpc.quizzes.getById.useQuery({ id: id! });
  const {
    submitAnswer,
    isLoading: isSubmitting,
    isOffline,
  } = useOfflineQuizSubmission();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">Loading quiz...</Text>
      </View>
    );
  }

  if (!quiz) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-600">Quiz not found</Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (selectedAnswer === null) {
      Alert.alert("Please select an answer");
      return;
    }

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    try {
      const result = await submitAnswer({
        quizId: id!,
        selectedAnswer,
        timeSpent,
      });

      setShowResult(true);

      // Show result alert
      Alert.alert(
        result.isCorrect ? "Correct! 🎉" : "Incorrect 😔",
        `${result.explanation}\n\n${
          result.isCorrect
            ? `You earned ${result.xpEarned} XP!`
            : "Better luck next time!"
        }`,
        [
          {
            text: "Continue",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit answer");
    }
  };

  const options = quiz.options as string[];

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text
            className="text-sm text-deen-primary mb-2"
            style={{ fontFamily: "Urbanist_400Regular" }}
          >
            {quiz.category?.icon} {quiz.category?.name}
          </Text>
          <Text
            className="text-2xl text-deen-dark mb-4"
            style={{ fontFamily: "SpaceGrotesk_700Bold" }}
          >
            {quiz.title}
          </Text>
          <Text
            className="text-sm text-gray-500"
            style={{ fontFamily: "Urbanist_400Regular" }}
          >
            30 Questions
          </Text>
        </View>

        {/* Question Number */}
        <Text
          className="text-sm text-gray-500 mb-2"
          style={{ fontFamily: "Urbanist_400Regular" }}
        >
          Question 1
        </Text>

        {/* Question */}
        <Text
          className="text-xl text-deen-dark mb-6"
          style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
        >
          {quiz.question}
        </Text>

        {/* Options */}
        <View className="space-y-3 mb-8">
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`p-4 rounded-2xl ${
                selectedAnswer === index ? "bg-deen-secondary" : "bg-gray-100"
              }`}
              onPress={() => !showResult && setSelectedAnswer(index)}
              disabled={showResult}
            >
              <Text
                className="text-lg text-deen-dark text-center"
                style={{ fontFamily: "Urbanist_500Medium" }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Basic Explanation */}
        {showResult && (
          <View className="mb-6">
            <Text
              className="text-lg text-deen-dark mb-2"
              style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
            >
              Basic Explanation:
            </Text>
            <Text
              className="text-gray-600 mb-2"
              style={{ fontFamily: "Urbanist_400Regular" }}
            >
              Step 1: 2x+3 =11
            </Text>
            <Text
              className="text-gray-600 mb-2"
              style={{ fontFamily: "Urbanist_400Regular" }}
            >
              Step 2: 2x = 11-3 = 8
            </Text>
            <Text
              className="text-gray-600 mb-4"
              style={{ fontFamily: "Urbanist_400Regular" }}
            >
              Step 3: x = 8/2 = 4
            </Text>
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-deen-accent rounded-full mr-2" />
              <Text
                className="text-deen-dark"
                style={{ fontFamily: "Urbanist_500Medium" }}
              >
                Your answer is correct.
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row space-x-4">
          {!showResult ? (
            <TouchableOpacity
              className={`flex-1 py-4 px-6 rounded-2xl ${
                selectedAnswer !== null ? "bg-deen-primary" : "bg-gray-300"
              }`}
              onPress={handleSubmit}
              disabled={selectedAnswer === null || isSubmitting}
            >
              <Text
                className="text-white text-center text-lg"
                style={{ fontFamily: "Urbanist_600SemiBold" }}
              >
                {isSubmitting
                  ? "Submitting..."
                  : isOffline
                  ? "Submit (Offline)"
                  : "Save & Next"}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity className="flex-1 py-4 px-6 rounded-2xl border border-gray-300">
                <Text
                  className="text-deen-dark text-center text-lg"
                  style={{ fontFamily: "Urbanist_600SemiBold" }}
                >
                  Skip
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 py-4 px-6 rounded-2xl bg-deen-primary">
                <Text
                  className="text-white text-center text-lg"
                  style={{ fontFamily: "Urbanist_600SemiBold" }}
                >
                  Save & Next
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View className="mt-6 flex-row justify-between items-center">
          <Text
            className="text-sm text-gray-500"
            style={{ fontFamily: "Urbanist_400Regular" }}
          >
            Difficulty:{" "}
            {quiz.difficulty === 1
              ? "Easy"
              : quiz.difficulty === 2
              ? "Medium"
              : "Hard"}
          </Text>
          <Text
            className="text-sm text-deen-accent"
            style={{ fontFamily: "Urbanist_600SemiBold" }}
          >
            Reward: +{quiz.xpReward} XP
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
