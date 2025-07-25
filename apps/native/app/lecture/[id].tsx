import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { AudioPlayer } from '../../components/audio-player';

export default function LectureDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [hasCompleted, setHasCompleted] = useState(false);

  const { data: lecture, isLoading } = trpc.lectures.getById.useQuery({ id: id! });
  const markCompletedMutation = trpc.lectures.markCompleted.useMutation();

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
          <Text className="text-sm text-gray-500 mb-2">
            {lecture.category?.icon} {lecture.category?.name}
          </Text>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {lecture.title}
          </Text>
          {lecture.description && (
            <Text className="text-gray-600">
              {lecture.description}
            </Text>
          )}
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