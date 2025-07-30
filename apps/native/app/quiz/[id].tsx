import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { useState, useEffect, useLayoutEffect } from "react";
import { Heart, ArrowLeft, Award } from "lucide-react-native";
import { trpc } from "../../lib/trpc";

export default function QuizDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const { data: allQuizzes, isLoading } = trpc.quizzes.getAll.useQuery();

  // Get current quiz from all quizzes
  const currentQuiz = allQuizzes?.[currentQuestionIndex];
  const totalQuestions = Math.min(allQuizzes?.length || 0, 30);

  // Reset state when moving to next question
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
  }, [currentQuestionIndex]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">Loading quiz...</Text>
      </View>
    );
  }

  if (!currentQuiz && !quizCompleted) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-600">No questions available</Text>
      </View>
    );
  }

  // Quiz completion screen
  if (quizCompleted) {
    return (
      <View className="flex-1 bg-deen-secondary p-6 justify-center">
        <View className="bg-white rounded-3xl p-8 items-center shadow-sm">
          <Text className="text-6xl mb-4">🎉</Text>
          <Text
            className="text-2xl text-deen-dark mb-4 text-center"
            style={{ fontFamily: "SpaceGrotesk_700Bold" }}
          >
            Quiz Completed!
          </Text>
          <Text
            className="text-lg text-gray-600 mb-6 text-center"
            style={{ fontFamily: "Urbanist_400Regular" }}
          >
            You answered {correctAnswers} out of {totalQuestions} questions
            correctly
          </Text>
          <View className="bg-deen-secondary rounded-2xl p-4 mb-6 w-full">
            <Text
              className="text-deen-primary text-center text-xl"
              style={{ fontFamily: "Urbanist_700Bold" }}
            >
              Final Score: {score} XP
            </Text>
          </View>
          <TouchableOpacity
            className="bg-deen-primary py-4 px-8 rounded-2xl"
            onPress={() => router.back()}
            style={{
              shadowColor: "#015055",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text
              className="text-white text-lg"
              style={{ fontFamily: "Urbanist_700Bold" }}
            >
              Back to Quizzes
            </Text>
          </TouchableOpacity>
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
    const xpEarned = isCorrect ? currentQuiz?.xpReward || 10 : 0;

    // Update score and answers
    setUserAnswers([...userAnswers, selectedAnswer]);
    setScore(score + xpEarned);
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 >= totalQuestions) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const options = (currentQuiz?.options as string[]) || [];
  const isCorrect = selectedAnswer === currentQuiz?.correctAnswerIndex;

  return (
    <View className="flex-1 bg-deen-secondary">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Score Card */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  className="text-deen-dark text-lg"
                  style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
                >
                  Current Score
                </Text>
                <Text
                  className="text-deen-primary text-2xl"
                  style={{ fontFamily: "SpaceGrotesk_700Bold" }}
                >
                  {score} XP
                </Text>
              </View>
              <View className="items-end">
                <Text
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "Urbanist_400Regular" }}
                >
                  Correct: {correctAnswers}/
                  {currentQuestionIndex + (showResult ? 1 : 0)}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Award size={16} color="#10b981" />
                  <Text
                    className="text-deen-accent ml-1 text-sm"
                    style={{ fontFamily: "Urbanist_600SemiBold" }}
                  >
                    +{currentQuiz?.xpReward || 10} XP per correct
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Question Card */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <View className="bg-deen-primary px-3 py-1 rounded-full">
                <Text
                  className="text-white text-sm"
                  style={{ fontFamily: "Urbanist_600SemiBold" }}
                >
                  Question {currentQuestionIndex + 1}
                </Text>
              </View>
              <Text
                className="text-gray-500 text-sm"
                style={{ fontFamily: "Urbanist_400Regular" }}
              >
                {currentQuestionIndex + 1} of {totalQuestions}
              </Text>
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
                    shadowColor: selectedAnswer === index ? "#015055" : "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: selectedAnswer === index ? 0.15 : 0.05,
                    shadowRadius: 8,
                    elevation: selectedAnswer === index ? 5 : 2,
                  }}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
                        showResult && index === currentQuiz?.correctAnswerIndex
                          ? "bg-green-500 border-green-500"
                          : showResult &&
                            index === selectedAnswer &&
                            index !== currentQuiz?.correctAnswerIndex
                          ? "bg-red-500 border-red-500"
                          : selectedAnswer === index && !showResult
                          ? "bg-white border-white"
                          : "border-gray-300"
                      }`}
                    >
                      {showResult &&
                        index === currentQuiz?.correctAnswerIndex && (
                          <Text className="text-white text-xs">✓</Text>
                        )}
                      {showResult &&
                        index === selectedAnswer &&
                        index !== currentQuiz?.correctAnswerIndex && (
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

          {/* Explanation - Always visible after submission */}
          {showResult && (
            <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
              <View className="flex-row items-center mb-4">
                <Text className="text-2xl mr-2">{isCorrect ? "🎉" : "😔"}</Text>
                <Text
                  className={`text-lg ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
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
                <View
                  className={`w-4 h-4 rounded-full mr-3 ${
                    isCorrect ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <Text
                  className="text-deen-dark flex-1"
                  style={{ fontFamily: "Urbanist_500Medium" }}
                >
                  {isCorrect
                    ? `Great job! You earned ${currentQuiz?.xpReward || 10} XP!`
                    : "Don't worry, keep learning and you'll improve!"}
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
                  shadowColor: selectedAnswer !== null ? "#015055" : "#000",
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
                  shadowColor: "#015055",
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
                  {currentQuestionIndex + 1 >= totalQuestions
                    ? "Finish Quiz"
                    : "Next Question"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
