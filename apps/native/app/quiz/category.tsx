import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useState, useEffect, useLayoutEffect } from "react";
import { Award, Shuffle } from "lucide-react-native";
import { trpc } from "../../lib/trpc";
import { ScreenHeader } from "../../components/screen-header";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryQuizScreen() {
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
  }>();
  const navigation = useNavigation();

  // Force hide header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const { data: categoryQuizzes, isLoading } = trpc.quizzes.getByCategory.useQuery({
    categoryId: categoryId!
  });
  const updateStatsMutation = trpc.badges.updateStats.useMutation();
  const checkBadgesMutation = trpc.badges.checkBadges.useMutation();

  const currentQuiz = categoryQuizzes?.[currentQuestionIndex];
  const totalQuestions = categoryQuizzes?.length || 0;

  // Reset state when moving to next question
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
  }, [currentQuestionIndex]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-deen-secondary">
        <Shuffle size={48} color="#015055" />
        <Text className="text-lg mt-4" style={{ fontFamily: 'Urbanist_500Medium' }}>
          Loading {categoryName} quiz...
        </Text>
      </View>
    );
  }

  if (!currentQuiz && !quizCompleted) {
    return (
      <View className="flex-1 justify-center items-center bg-deen-secondary">
        <Text className="text-lg text-red-600" style={{ fontFamily: 'Urbanist_500Medium' }}>
          No questions available for this category
        </Text>
      </View>
    );
  }

  // Quiz completion screen
  if (quizCompleted) {
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    let performanceEmoji = "🎉";
    let performanceText = "Excellent!";

    if (percentage < 50) {
      performanceEmoji = "📚";
      performanceText = "Keep Learning!";
    } else if (percentage < 75) {
      performanceEmoji = "👍";
      performanceText = "Good Job!";
    }

    return (
      <View className="flex-1 bg-deen-secondary p-6 justify-center">
        <View className="bg-white rounded-3xl p-8 items-center shadow-sm">
          <Text className="text-6xl mb-4">{performanceEmoji}</Text>
          <Text
            className="text-2xl text-deen-dark mb-2 text-center"
            style={{ fontFamily: "SpaceGrotesk_700Bold" }}
          >
            {categoryName} Quiz Complete!
          </Text>
          <Text
            className="text-lg text-gray-600 mb-6 text-center"
            style={{ fontFamily: "Urbanist_400Regular" }}
          >
            {performanceText}
          </Text>

          <View className="bg-deen-secondary rounded-2xl p-6 mb-6 w-full">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-deen-primary"
                style={{ fontFamily: "Urbanist_600SemiBold" }}
              >
                Your Results:
              </Text>
              <Text
                className="text-deen-primary text-xl"
                style={{ fontFamily: "SpaceGrotesk_700Bold" }}
              >
                {percentage}%
              </Text>
            </View>

            <View className="flex-row justify-between items-center mb-2">
              <Text
                className="text-gray-600"
                style={{ fontFamily: "Urbanist_400Regular" }}
              >
                Correct Answers:
              </Text>
              <Text
                className="text-deen-dark"
                style={{ fontFamily: "Urbanist_600SemiBold" }}
              >
                {correctAnswers}/{totalQuestions}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text
                className="text-gray-600"
                style={{ fontFamily: "Urbanist_400Regular" }}
              >
                XP Earned:
              </Text>
              <Text
                className="text-deen-accent"
                style={{ fontFamily: "Urbanist_700Bold" }}
              >
                {score} XP
              </Text>
            </View>
          </View>

          <View className="flex-row space-x-4 w-full">
            <TouchableOpacity
              className="flex-1 bg-gray-100 py-4 px-6 rounded-2xl"
              onPress={() => router.back()}
            >
              <Text
                className="text-deen-dark text-center"
                style={{ fontFamily: "Urbanist_600SemiBold" }}
              >
                Back to Category
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-deen-primary py-4 px-6 rounded-2xl"
              onPress={() => {
                // Reset and start new quiz
                setCurrentQuestionIndex(0);
                setScore(0);
                setCorrectAnswers(0);
                setQuizCompleted(false);
              }}
              style={{
                shadowColor: '#015055',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Text
                className="text-white text-center"
                style={{ fontFamily: "Urbanist_700Bold" }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      Alert.alert("Please select an answer");
      return;
    }

    const isCorrect = selectedAnswer === currentQuiz?.correctAnswerIndex;
    const xpEarned = isCorrect ? (currentQuiz?.xpReward || 10) : 0;

    setScore(score + xpEarned);
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex + 1 >= totalQuestions) {
      setQuizCompleted(true);

      // Award XP and update stats
      const xpGained = correctAnswers * 10; // 10 XP per correct answer
      try {
        await updateStatsMutation.mutateAsync({
          userId: 'demo-user', // Using demo user for now
          xpGained,
          quizCompleted: true,
        });

        // Check for new badges
        await checkBadgesMutation.mutateAsync({
          userId: 'demo-user',
        });
      } catch (error) {
        console.error('Failed to update stats:', error);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const options = currentQuiz?.options as string[] || [];
  const isCorrect = selectedAnswer === currentQuiz?.correctAnswerIndex;

  return (
    <SafeAreaView className="flex-1 bg-deen-secondary">
      <ScrollView className="flex-1">
        <View className="p-6">
          <ScreenHeader
            title={`${categoryName} Quiz`}
            showBack={true}
          />

          {/* Quiz Info Card */}
          <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-gray-600 text-sm"
                style={{ fontFamily: "Urbanist_400Regular" }}
              >
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Text>
              <View className="flex-row items-center space-x-4">
                <Text
                  className="text-deen-primary text-sm"
                  style={{ fontFamily: "Urbanist_600SemiBold" }}
                >
                  {score} XP
                </Text>
                <Text
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "Urbanist_400Regular" }}
                >
                  Correct: {correctAnswers}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="mb-2">
              <View className="flex-row items-center justify-between mb-2">
                <Text
                  className="text-deen-primary text-sm"
                  style={{ fontFamily: "Urbanist_600SemiBold" }}
                >
                  Progress
                </Text>
                <Text
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "Urbanist_400Regular" }}
                >
                  {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
                </Text>
              </View>
              <View className="bg-gray-200 rounded-full h-2">
                <View
                  className="bg-deen-primary rounded-full h-2"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </View>
            </View>
          </View>
   {/* Question Card */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <View className="bg-deen-secondary px-3 py-1 rounded-full">
                <Text
                  className="text-deen-primary text-sm"
                  style={{ fontFamily: "Urbanist_600SemiBold" }}
                >
                  {categoryName}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Award size={16} color="#10b981" />
                <Text
                  className="text-deen-accent ml-1 text-sm"
                  style={{ fontFamily: "Urbanist_600SemiBold" }}
                >
                  +{currentQuiz?.xpReward} XP
                </Text>
              </View>
            </View>

            <Text
              className="text-xl text-deen-dark leading-7"
              style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
            >
              {currentQuiz?.question}
            </Text>
          </View>

          {/* Options */}
          <View className="mb-8">
            {options.map((option, index) => {
              let optionStyle = "bg-white border-gray-200";
              let textStyle = "text-deen-dark";

              if (showResult) {
                if (index === currentQuiz?.correctAnswerIndex) {
                  optionStyle = "bg-green-100 border-green-500";
                  textStyle = "text-green-800";
                } else if (index === selectedAnswer) {
                  optionStyle = "bg-red-100 border-red-500";
                  textStyle = "text-red-800";
                }
              } else if (selectedAnswer === index) {
                optionStyle = "bg-deen-primary border-deen-primary";
                textStyle = "text-white";
              }

              return (
                <TouchableOpacity
                  key={index}
                  className={`p-5 rounded-2xl mb-4 border-2 ${optionStyle}`}
                  onPress={() => !showResult && setSelectedAnswer(index)}
                  disabled={showResult}
                  style={{
                    shadowColor: selectedAnswer === index ? '#015055' : '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: selectedAnswer === index ? 0.15 : 0.05,
                    shadowRadius: 8,
                    elevation: selectedAnswer === index ? 5 : 2,
                  }}
                >
                  <View className="flex-row items-center">
                    <View className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
                      showResult && index === currentQuiz?.correctAnswerIndex
                        ? "bg-green-500 border-green-500"
                        : showResult && index === selectedAnswer && index !== currentQuiz?.correctAnswerIndex
                        ? "bg-red-500 border-red-500"
                        : selectedAnswer === index && !showResult
                        ? "bg-white border-white"
                        : "border-gray-300"
                    }`}>
                      {showResult && index === currentQuiz?.correctAnswerIndex && (
                        <Text className="text-white text-xs">✓</Text>
                      )}
                      {showResult && index === selectedAnswer && index !== currentQuiz?.correctAnswerIndex && (
                        <Text className="text-white text-xs">✗</Text>
                      )}
                      {selectedAnswer === index && !showResult && (
                        <View className="w-3 h-3 bg-deen-primary rounded-full" />
                      )}
                    </View>
                    <Text
                      className={`text-lg flex-1 ${textStyle}`}
                      style={{ fontFamily: "Urbanist_500Medium" }}
                    >
                      {option}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
         {/* Explanation */}
          {showResult && (
            <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
              <View className="flex-row items-center mb-4">
                <Text className="text-2xl mr-2">
                  {isCorrect ? "🎉" : "😔"}
                </Text>
                <Text
                  className={`text-lg ${isCorrect ? "text-green-600" : "text-red-600"}`}
                  style={{ fontFamily: "SpaceGrotesk_700Bold" }}
                >
                  {isCorrect ? "Correct!" : "Incorrect"}
                </Text>
              </View>

              <View className="bg-deen-secondary rounded-2xl p-4 mb-4">
                <Text
                  className="text-deen-primary"
                  style={{ fontFamily: "Urbanist_600SemiBold" }}
                >
                  {currentQuiz?.explanation || "Thank you for your answer!"}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className={`w-4 h-4 rounded-full mr-3 ${isCorrect ? "bg-green-500" : "bg-red-500"}`} />
                <Text
                  className="text-deen-dark flex-1"
                  style={{ fontFamily: "Urbanist_500Medium" }}
                >
                  {isCorrect
                    ? `Great job! You earned ${currentQuiz?.xpReward || 10} XP!`
                    : "Don't worry, keep learning and you'll improve!"
                  }
                </Text>
              </View>
            </View>
          )}

          {/* Action Button */}
          <View className="mb-6">
            {!showResult ? (
              <TouchableOpacity
                className={`py-5 px-6 rounded-2xl ${
                  selectedAnswer !== null ? "bg-deen-primary" : "bg-gray-300"
                }`}
                onPress={handleSubmit}
                disabled={selectedAnswer === null}
                style={{
                  shadowColor: selectedAnswer !== null ? '#015055' : '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: selectedAnswer !== null ? 0.2 : 0.1,
                  shadowRadius: 12,
                  elevation: selectedAnswer !== null ? 8 : 3,
                }}
              >
                <Text
                  className="text-white text-center text-lg"
                  style={{ fontFamily: "Urbanist_700Bold" }}
                >
                  Submit Answer
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="py-5 px-6 rounded-2xl bg-deen-primary"
                onPress={handleNextQuestion}
                style={{
                  shadowColor: '#015055',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Text
                  className="text-white text-center text-lg"
                  style={{ fontFamily: "Urbanist_700Bold" }}
                >
                  {currentQuestionIndex + 1 >= totalQuestions ? "Finish Quiz" : "Next Question"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}