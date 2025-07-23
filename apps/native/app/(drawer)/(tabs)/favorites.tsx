import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { trpc } from '../../../utils/trpc';

export default function FavoritesScreen() {
  const { data: favorites, isLoading } = trpc.favorites.getAll.useQuery();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">Loading favorites...</Text>
      </View>
    );
  }

  const hasNoFavorites = (!favorites?.quizzes?.length && !favorites?.lectures?.length);

  if (hasNoFavorites) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-6xl mb-4">💝</Text>
        <Text className="text-xl font-semibold text-gray-800 mb-2">
          No favorites yet
        </Text>
        <Text className="text-gray-600 text-center">
          Start exploring quizzes and lectures to add them to your favorites!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Your Favorites
        </Text>

        {favorites?.quizzes && favorites.quizzes.length > 0 && (
          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Favorite Quizzes
            </Text>
            <View className="space-y-3">
              {favorites.quizzes.map((quiz) => (
                <TouchableOpacity
                  key={quiz.id}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                  onPress={() => router.push(`/quiz/${quiz.id}`)}
                >
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {quiz.title}
                  </Text>
                  <Text className="text-gray-600 mb-2">
                    {quiz.question}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {quiz.category?.icon} {quiz.category?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {favorites?.lectures && favorites.lectures.length > 0 && (
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Favorite Lectures
            </Text>
            <View className="space-y-3">
              {favorites.lectures.map((lecture) => (
                <TouchableOpacity
                  key={lecture.id}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  onPress={() => router.push(`/lecture/${lecture.id}`)}
                >
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {lecture.title}
                  </Text>
                  {lecture.description && (
                    <Text className="text-gray-600 mb-2">
                      {lecture.description}
                    </Text>
                  )}
                  <View className="flex-row items-center">
                    <Text className="text-sm text-gray-500 mr-4">
                      {lecture.category?.icon} {lecture.category?.name}
                    </Text>
                    {lecture.duration && (
                      <Text className="text-sm text-gray-500">
                        🕐 {Math.floor(lecture.duration / 60)} min
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}