import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { trpc } from '../../lib/trpc';

export default function HomeScreen() {
  const { data: categoriesData, isLoading } = trpc.categories.getAll.useQuery();

  // Deduplicate categories by name to avoid redundancy and ensure unique display
  const categories = categoriesData?.reduce((unique, category) => {
    const existingCategory = unique.find(c => c.name === category.name);
    if (!existingCategory) {
      unique.push(category);
    }
    return unique;
  }, [] as typeof categoriesData) || [];

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">Loading categories...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-deen-secondary">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="p-6">
          {/* App Header */}
          <View className="flex-row items-center justify-between mb-6">
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
            <Pressable
              className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm"
              onPress={() => router.push('/search')}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                }
              ]}
            >
              <Search size={20} color="#6b7280" />
              <Text className="text-gray-400 flex-1 ml-3" style={{ fontFamily: 'Urbanist_400Regular' }}>
                Search here
              </Text>
            </Pressable>
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Pressable
              className="bg-deen-primary rounded-2xl p-6 items-center"
              onPress={() => router.push('/quiz/random')}
              style={({ pressed }) => [
                {
                  shadowColor: '#015055',
                  shadowOffset: { width: 0, height: pressed ? 3 : 6 },
                  shadowOpacity: pressed ? 0.15 : 0.25,
                  shadowRadius: pressed ? 8 : 15,
                  elevation: pressed ? 5 : 10,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                }
              ]}
            >
              <View className="flex-row items-center mb-3">
                <Text className="text-3xl mr-3">🎯</Text>
                <Text className="text-3xl mr-3">📚</Text>
              </View>
              <Text
                className="text-white text-center text-xl mb-2"
                style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
              >
                Start Learning
              </Text>
              <Text
                className="text-white/80 text-center text-sm"
                style={{ fontFamily: 'Urbanist_400Regular' }}
              >
                Random quiz from all categories • Browse all questions
              </Text>
            </Pressable>
          </View>

          {/* Categories Section */}
          <View className="mb-4">
            <Text
              className="text-xl text-deen-dark mb-4"
              style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
            >
              📖 Choose a Category
            </Text>

            {/* Categories Grid */}
            <View className="flex-row flex-wrap justify-between">
              {categories?.map((category, index) => (
                <Pressable
                  key={category.id}
                  className={`w-[48%] mb-4 rounded-3xl p-6 shadow-sm ${
                    index % 2 === 0 ? 'bg-deen-primary' : 'bg-white'
                  }`}
                  onPress={() => router.push(`/category/${category.id}`)}
                  style={({ pressed }) => [
                    {
                      shadowColor: index % 2 === 0 ? '#015055' : '#000',
                      shadowOffset: { width: 0, height: pressed ? 1 : 2 },
                      shadowOpacity: pressed ? 0.05 : 0.1,
                      shadowRadius: pressed ? 4 : 8,
                      elevation: pressed ? 1 : 3,
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                      opacity: pressed ? 0.8 : 1,
                    }
                  ]}
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
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}