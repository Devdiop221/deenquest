import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { trpc } from '../../../utils/trpc';

export default function LecturesScreen() {
  const { data: lectures, isLoading } = trpc.lectures.getAll.useQuery();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">Loading lectures...</Text>
      </View>
    );
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Islamic Stories & Lectures
        </Text>

        <View className="space-y-4">
          {lectures?.map((lecture) => (
            <TouchableOpacity
              key={lecture.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              onPress={() => router.push(`/lecture/${lecture.id}`)}
            >
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                {lecture.title}
              </Text>

              {lecture.description && (
                <Text className="text-gray-600 mb-3">
                  {lecture.description}
                </Text>
              )}

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-500 mr-4">
                    {lecture.category?.icon} {lecture.category?.name}
                  </Text>
                  {lecture.duration && (
                    <Text className="text-sm text-gray-500">
                      🕐 {formatDuration(lecture.duration)}
                    </Text>
                  )}
                </View>
                <Text className="text-sm text-green-600 font-medium">
                  +{lecture.xpReward} XP
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}