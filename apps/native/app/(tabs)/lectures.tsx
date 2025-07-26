import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useOfflineLectures } from '../../lib/offline-trpc';

export default function LecturesScreen() {
  const { data: lectures, isLoading, isOffline } = useOfflineLectures();

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
    <ScrollView className="flex-1 bg-deen-secondary" contentContainerStyle={{ paddingBottom: 120 }}>
      <View className="p-6">
        {isOffline && (
          <View className="bg-deen-warning/20 border border-deen-warning rounded-2xl p-4 mb-6">
            <Text className="text-deen-warning text-center" style={{ fontFamily: 'Urbanist_500Medium' }}>
              📱 Offline mode. Downloaded lectures available.
            </Text>
          </View>
        )}

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
          {lectures?.map((lecture) => (
            <TouchableOpacity
              key={lecture.id}
              className="bg-white rounded-2xl p-6"
              onPress={() => router.push(`/lecture/${lecture.id}`)}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text className="text-xl text-deen-dark mb-2" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                {lecture.title}
              </Text>

              {lecture.description && (
                <Text className="text-gray-600 mb-4" style={{ fontFamily: 'Urbanist_400Regular' }}>
                  {lecture.description}
                </Text>
              )}

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-500 mr-4" style={{ fontFamily: 'Urbanist_400Regular' }}>
                    {lecture.category?.icon} {lecture.category?.name}
                  </Text>
                  {lecture.duration && (
                    <Text className="text-sm text-gray-500" style={{ fontFamily: 'Urbanist_400Regular' }}>
                      🕐 {formatDuration(lecture.duration)}
                    </Text>
                  )}
                </View>
                <Text className="text-sm text-deen-accent" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
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