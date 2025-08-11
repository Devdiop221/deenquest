import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart, BookOpen } from 'lucide-react-native';
import { trpc } from '../../lib/trpc';
import { ScreenHeader } from '../../components/screen-header';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LectureScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  // Force hide header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: lecture, isLoading } = trpc.lectures.getById.useQuery({ id: id! });
  const { data: favorites } = trpc.favorites.getAll.useQuery();
  const addFavoriteMutation = trpc.favorites.add.useMutation();
  const removeFavoriteMutation = trpc.favorites.remove.useMutation();

  // Check if lecture is in favorites
  useEffect(() => {
    if (favorites?.lectures && id) {
      const isInFavorites = favorites.lectures.some(fav => fav.id === id);
      setIsFavorite(isInFavorites);
    }
  }, [favorites, id]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-deen-secondary">
        <BookOpen size={48} color="#015055" />
        <Text className="text-lg mt-4" style={{ fontFamily: 'Urbanist_500Medium' }}>
          Loading story...
        </Text>
      </View>
    );
  }

  if (!lecture) {
    return (
      <View className="flex-1 justify-center items-center bg-deen-secondary">
        <Text className="text-lg text-red-600" style={{ fontFamily: 'Urbanist_500Medium' }}>
          Story not found
        </Text>
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

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Here you would integrate with actual audio player
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const duration = lecture.duration || 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <SafeAreaView className="flex-1 bg-deen-secondary">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Custom Header */}
          <ScreenHeader
            title={lecture.title}
            showBack={true}
          />

          {/* Lecture Info */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <View className="bg-deen-secondary px-3 py-1 rounded-full">
                <Text
                  className="text-deen-primary text-sm"
                  style={{ fontFamily: "Urbanist_600SemiBold" }}
                >
                  {lecture.category?.icon} {lecture.category?.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleToggleFavorite}
                className="p-2 rounded-xl bg-gray-50"
              >
                <Heart
                  size={24}
                  color={isFavorite ? "#ef4444" : "#6b7280"}
                  fill={isFavorite ? "#ef4444" : "transparent"}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>

            {lecture.description && (
              <Text
                className="text-gray-600 mb-4"
                style={{ fontFamily: "Urbanist_400Regular" }}
              >
                {lecture.description}
              </Text>
            )}

            <View className="flex-row items-center justify-between">
              <Text
                className="text-gray-500 text-sm"
                style={{ fontFamily: "Urbanist_400Regular" }}
              >
                Duration: {formatTime(duration)}
              </Text>
              <View className="flex-row items-center">
                <BookOpen size={16} color="#10b981" />
                <Text
                  className="text-deen-accent ml-1 text-sm"
                  style={{ fontFamily: "Urbanist_600SemiBold" }}
                >
                  +{lecture.xpReward} XP
                </Text>
              </View>
            </View>
          </View>

          {/* Audio Player */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
            <Text
              className="text-lg text-deen-dark mb-4 text-center"
              style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
            >
              🎧 Audio Player
            </Text>

            {/* Progress Bar */}
            <View className="mb-6">
              <View className="bg-gray-200 rounded-full h-2 mb-2">
                <View
                  className="bg-deen-primary rounded-full h-2"
                  style={{ width: `${progress}%` }}
                />
              </View>
              <View className="flex-row justify-between">
                <Text
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "Urbanist_400Regular" }}
                >
                  {formatTime(currentTime)}
                </Text>
                <Text
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "Urbanist_400Regular" }}
                >
                  {formatTime(duration)}
                </Text>
              </View>
            </View>

            {/* Player Controls */}
            <View className="flex-row items-center justify-center space-x-6">
              <TouchableOpacity
                className="p-3 rounded-full bg-gray-100"
                onPress={() => setCurrentTime(Math.max(0, currentTime - 15))}
              >
                <SkipBack size={24} color="#015055" />
              </TouchableOpacity>

              <TouchableOpacity
                className="p-4 rounded-full bg-deen-primary"
                onPress={togglePlayPause}
                style={{
                  shadowColor: '#015055',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                {isPlaying ? (
                  <Pause size={32} color="white" fill="white" />
                ) : (
                  <Play size={32} color="white" fill="white" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="p-3 rounded-full bg-gray-100"
                onPress={() => setCurrentTime(Math.min(duration, currentTime + 15))}
              >
                <SkipForward size={24} color="#015055" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Story Text */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
            <Text
              className="text-lg text-deen-dark mb-4"
              style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
            >
              📖 Story Text
            </Text>

            <ScrollView
              className="max-h-96"
              showsVerticalScrollIndicator={false}
            >
              <Text
                className="text-gray-700 leading-7"
                style={{ fontFamily: "Urbanist_400Regular" }}
              >
                {lecture.textContent}
              </Text>
            </ScrollView>
          </View>

          {/* Complete Button */}
          <TouchableOpacity
            className="bg-deen-primary py-5 px-6 rounded-2xl mb-6"
            onPress={() => {
              // Mark as completed and award XP
              Alert.alert(
                "Story Completed! 🎉",
                `You earned ${lecture.xpReward} XP for listening to this story!`,
                [
                  {
                    text: "Continue Learning",
                    onPress: () => router.back(),
                  },
                ]
              );
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
              className="text-white text-center text-lg"
              style={{ fontFamily: "Urbanist_700Bold" }}
            >
              Mark as Completed
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}