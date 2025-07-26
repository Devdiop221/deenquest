import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { trpc } from '../../utils/trpc';

export default function FavoritesScreen() {
  const { data: favorites, isLoading, refetch } = trpc.favorites.getAll.useQuery();
  const removeFavoriteMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleRemoveFavorite = async (contentId: string, contentType: 'quiz' | 'lecture') => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFavoriteMutation.mutateAsync({ contentId, contentType });
            } catch (error) {
              Alert.alert('Error', 'Failed to remove favorite');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-deen-secondary">
        <Text className="text-lg" style={{ fontFamily: 'Urbanist_500Medium' }}>Loading favorites...</Text>
      </View>
    );
  }

  const hasNoFavorites = (!favorites?.quizzes?.length && !favorites?.lectures?.length);

  if (hasNoFavorites) {
    return (
      <View className="flex-1 justify-center items-center bg-deen-secondary p-6">
        <Text className="text-6xl mb-4">💝</Text>
        <Text className="text-xl text-deen-dark mb-2" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
          No favorites yet
        </Text>
        <Text className="text-gray-600 text-center" style={{ fontFamily: 'Urbanist_400Regular' }}>
          Start exploring quizzes and lectures to add them to your favorites!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-deen-secondary" contentContainerStyle={{ paddingBottom: 120 }}>
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-3xl text-deen-dark" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            Your Favorites
          </Text>
          <View className="bg-white px-4 py-2 rounded-xl shadow-sm">
            <Text className="text-deen-primary" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
              {((favorites?.quizzes?.length || 0) + (favorites?.lectures?.length || 0))} Items
            </Text>
          </View>
        </View>

        {favorites?.quizzes && favorites.quizzes.length > 0 && (
          <View className="mb-8">
            <Text className="text-xl text-deen-dark mb-4" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
              Favorite Quizzes
            </Text>
            <View className="space-y-3">
              {favorites.quizzes.map((quiz) => (
                <View
                  key={quiz.id}
                  className="bg-white rounded-2xl p-4"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row justify-between items-start">
                    <TouchableOpacity
                      className="flex-1 mr-4"
                      onPress={() => router.push(`/quiz/${quiz.id}`)}
                    >
                      <Text className="text-lg text-deen-dark mb-1" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                        {quiz.title}
                      </Text>
                      <Text className="text-gray-600 mb-2" style={{ fontFamily: 'Urbanist_400Regular' }}>
                        {quiz.question}
                      </Text>
                      <Text className="text-sm text-gray-500" style={{ fontFamily: 'Urbanist_400Regular' }}>
                        {quiz.category?.icon} {quiz.category?.name}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRemoveFavorite(quiz.id, 'quiz')}
                      className="p-2"
                    >
                      <Heart size={24} color="#ef4444" fill="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {favorites?.lectures && favorites.lectures.length > 0 && (
          <View>
            <Text className="text-xl text-deen-dark mb-4" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
              Favorite Lectures
            </Text>
            <View className="space-y-3">
              {favorites.lectures.map((lecture) => (
                <View
                  key={lecture.id}
                  className="bg-white rounded-2xl p-4"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row justify-between items-start">
                    <TouchableOpacity
                      className="flex-1 mr-4"
                      onPress={() => router.push(`/lecture/${lecture.id}`)}
                    >
                      <Text className="text-lg text-deen-dark mb-1" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                        {lecture.title}
                      </Text>
                      {lecture.description && (
                        <Text className="text-gray-600 mb-2" style={{ fontFamily: 'Urbanist_400Regular' }}>
                          {lecture.description}
                        </Text>
                      )}
                      <View className="flex-row items-center">
                        <Text className="text-sm text-gray-500 mr-4" style={{ fontFamily: 'Urbanist_400Regular' }}>
                          {lecture.category?.icon} {lecture.category?.name}
                        </Text>
                        {lecture.duration && (
                          <Text className="text-sm text-gray-500" style={{ fontFamily: 'Urbanist_400Regular' }}>
                            🕐 {Math.floor(lecture.duration / 60)} min
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRemoveFavorite(lecture.id, 'lecture')}
                      className="p-2"
                    >
                      <Heart size={24} color="#ef4444" fill="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}