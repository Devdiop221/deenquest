import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useOfflineCategories } from '../../lib/offline-trpc';

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
    <ScrollView className="flex-1 bg-deen-secondary" contentContainerStyle={{ paddingBottom: 120 }}>
      <View className="p-6">
        {/* App Header */}
        <View className="flex-row items-center justify-between mb-6 pt-4">
          <Text className="text-2xl text-deen-dark" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            DeenQuest
          </Text>
          <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
            <Text className="text-2xl">🎓</Text>
          </View>
        </View>

        {/* User Greeting */}
        <View className="mb-8">
          <Text className="text-sm text-deen-primary mb-1" style={{ fontFamily: 'Urbanist_400Regular' }}>
            Hello
          </Text>
          <Text className="text-xl text-deen-dark mb-4" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            Muslim Learner
          </Text>

          <Text className="text-2xl text-deen-dark mb-4" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            What Subject do you want to improve today?
          </Text>

          {/* Search Bar */}
          <TouchableOpacity
            className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm"
            onPress={() => router.push('/search')}
          >
            <Search size={20} color="#6b7280" />
            <Text className="text-gray-400 flex-1 ml-3" style={{ fontFamily: 'Urbanist_400Regular' }}>
              Search here
            </Text>
          </TouchableOpacity>
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
              className={`w-[48%] mb-4 rounded-3xl p-6 shadow-sm ${
                index % 2 === 0 ? 'bg-deen-primary' : 'bg-white'
              }`}
              onPress={() => router.push(`/category/${category.id}`)}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="items-center justify-center h-32">
                <View className={`w-16 h-16 rounded-2xl items-center justify-center mb-3 ${
                  index % 2 === 0 ? 'bg-white/20' : 'bg-deen-secondary'
                }`}>
                  <Text className="text-3xl">{category.icon}</Text>
                </View>
                <Text
                  className={`text-base text-center ${
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