import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { trpc } from '../../utils/trpc';
import { AudioPlayer } from '../../components/audio-player';

export default function LectureDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: lecture, isLoading } = trpc.lectures.getById.useQuery({ id: id! });
  const { data: favorites } = trpc.favorites.getAll.useQuery();
  const addFavoriteMutation = trpc.favorites.add.useMutation();
  const removeFavoriteMutation = trpc.favorites.remove.useMutation();
  const markCompletedMutation = trpc.lectures.markCompleted.useMutation();

  // Check if lecture is in favorites
  useEffect(() => {
    if (favorites?.lectures && id) {
      const isInFavorites = favorites.lectures.some(fav => fav.id === id);
      setIsFavorite(isInFavorites);
    }
  }, [favorites, id]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">Loading lecture...</Text>
      </View>
    );
  }

  if (!lecture) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-600">Lecture not found</Text>
      </View>
    );
  }

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavoriteMutation.mutateAsync({
          contentId: id!,
          contentType: 'lecture',
        });
        setIsFavorite(false);
      } else {
        await addFavoriteMutation.mutateAsync({
          contentId: id!,
          contentType: 'lecture',
        });
        setIsFavorite(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleAudioComplete = () => {
    if (!hasCompleted) {
      handleMarkCompleted();
    }
  };

  const handleMarkCompleted = async () => {
    if (hasCompleted) return;

    try {
      const result = await markCompletedMutation.mutateAsync({
        lectureId: id!,
      });

      setHasCompleted(true);

      Alert.alert(
        'Lecture Completed! 🎉',
        `Great job! You earned ${result.xpEarned} XP for completing this lecture.`,
        [
          {
            text: 'Continue',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to mark lecture as completed');
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        <View className="mb-6">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <Text className="text-sm text-deen-primary mb-2" style={{ fontFamily: 'Urbanist_400Regular' }}>
                {lecture.category?.icon} {lecture.category?.name}
              </Text>
              <Text className="text-2xl text-deen-dark mb-2" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
                {lecture.title}
              </Text>
              {lecture.description && (
                <Text className="text-gray-600" style={{ fontFamily: 'Urbanist_400Regular' }}>
                  {lecture.description}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={handleToggleFavorite}
              className="p-2"
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={28}
                color={isFavorite ? "#ef4444" : "#6b7280"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Audio Player */}
        <AudioPlayer
          lectureId={id!}
          audioUrl={lecture.audioUrl}
          title={lecture.title}
          onComplete={handleAudioComplete}
        />

        {/* Text Content */}
        <View className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Story Text
          </Text>
          <Text className="text-gray-700 leading-6">
            {lecture.textContent}
          </Text>
        </View>

        {/* Complete Button */}
        {!hasCompleted && (
          <TouchableOpacity
            className="bg-blue-600 py-4 px-6 rounded-lg mb-4"
            onPress={handleMarkCompleted}
            disabled={markCompletedMutation.isPending}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {markCompletedMutation.isPending ? 'Marking Complete...' : 'Mark as Completed'}
            </Text>
          </TouchableOpacity>
        )}

        {hasCompleted && (
          <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <Text className="text-green-800 text-center font-semibold">
              ✅ Lecture Completed!
            </Text>
          </View>
        )}

        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-500">
            Islamic Story
          </Text>
          <Text className="text-sm text-green-600 font-medium">
            Reward: +{lecture.xpReward} XP
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}