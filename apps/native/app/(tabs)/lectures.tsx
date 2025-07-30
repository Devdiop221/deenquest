import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trpc } from '../../lib/trpc';

export default function LecturesScreen() {
  const { data: lectures, isLoading } = trpc.lectures.getAll.useQuery();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-deen-secondary">
        <Text className="text-lg" style={{ fontFamily: 'Urbanist_500Medium' }}>Loading lectures...</Text>
      </View>
    );
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <SafeAreaView className="flex-1 bg-deen-secondary">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="p-6">

        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-3xl text-deen-dark" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            Stories & Lectures
          </Text>
          <View className="bg-white px-4 py-2 rounded-xl shadow-sm">
            <Text className="text-deen-primary" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
              {lectures?.length || 0} Stories
            </Text>
          </View>
        </View>

        <View className="space-y-4">
          {lectures?.map((lecture, index) => (
            <TouchableOpacity
              key={lecture.id}
              className="bg-white rounded-2xl p-6 mb-4"
              onPress={() => router.push(`/lecture/${lecture.id}`)}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-start mb-3">
                <View className="bg-deen-secondary w-12 h-12 rounded-2xl items-center justify-center mr-4">
                  <Text className="text-2xl">{lecture.category?.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xl text-deen-dark mb-1" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                    {lecture.title}
                  </Text>
                  <Text className="text-sm text-deen-primary" style={{ fontFamily: 'Urbanist_500Medium' }}>
                    {lecture.category?.name}
                  </Text>
                </View>
                <View className="bg-deen-primary px-3 py-1 rounded-full">
                  <Text className="text-white text-xs" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
                    Story {index + 1}
                  </Text>
                </View>
              </View>

              {lecture.description && (
                <Text className="text-gray-600 mb-4 leading-6" style={{ fontFamily: 'Urbanist_400Regular' }}>
                  {lecture.description}
                </Text>
              )}

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  {lecture.duration && (
                    <View className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full mr-3">
                      <Text className="text-xs text-gray-600" style={{ fontFamily: 'Urbanist_500Medium' }}>
                        🎧 {formatDuration(lecture.duration)}
                      </Text>
                    </View>
                  )}
                  <View className="flex-row items-center bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-xs text-green-700" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
                      +{lecture.xpReward} XP
                    </Text>
                  </View>
                </View>
                <View className="bg-deen-primary p-2 rounded-full">
                  <Text className="text-white text-xs">▶️</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}