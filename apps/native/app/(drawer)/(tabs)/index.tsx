import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useOfflineCategories } from '../../../lib/offline-trpc';

export default function HomeScreen() {
  const { data: categories, isLoading, isOffline } = useOfflineCategories();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">Loading categories...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-deen-secondary">
      <View className="p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-sm text-deen-primary mb-2" style={{ fontFamily: 'Urbanist_400Regular' }}>
            Hello
          </Text>
          <Text className="text-2xl text-deen-dark mb-4" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            Muslim Learner
          </Text>

          <Text className="text-3xl text-deen-dark mb-2" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            What Subject do you want to improve today?
          </Text>

          {/* Search Bar */}
          <View className="bg-white rounded-2xl p-4 mt-4 flex-row items-center">
            <Text className="text-gray-400 flex-1" style={{ fontFamily: 'Urbanist_400Regular' }}>
              Search here
            </Text>
          </View>
        </View>

        {isOffline && (
          <View className="bg-deen-warning/20 border border-deen-warning rounded-2xl p-4 mb-6">
            <Text className="text-deen-warning text-center" style={{ fontFamily: 'Urbanist_500Medium' }}>
              📱 You're offline. Showing cached content.
            </Text>
          </View>
        )}

        {/* Categories Grid */}
        <View className="flex-row flex-wrap justify-between">
          {categories?.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              className={`w-[48%] mb-4 rounded-3xl p-6 ${
                index % 2 === 0 ? 'bg-deen-primary' : 'bg-white'
              }`}
              onPress={() => router.push(`/category/${category.id}`)}
            >
              <View className="items-center">
                <Text className="text-4xl mb-4">{category.icon}</Text>
                <Text
                  className={`text-lg font-semibold text-center ${
                    index % 2 === 0 ? 'text-white' : 'text-deen-dark'
                  }`}
                  style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
                >
                  {category.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}