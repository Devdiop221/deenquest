import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { trpc } from "@/utils/trpc";

export default function Home() {
  const { data: healthCheck } = trpc.healthCheck.useQuery();

  return (
    <View className="flex-1 items-center justify-center bg-deen-secondary p-6">
      <Text className="text-3xl text-deen-dark mb-4" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
        Welcome to DeenQuest!
      </Text>
      <Text className="text-lg text-gray-600 mb-8 text-center" style={{ fontFamily: 'Urbanist_400Regular' }}>
        Your Islamic learning journey starts here
      </Text>

      <Text className="text-sm text-gray-500 mb-4" style={{ fontFamily: 'Urbanist_400Regular' }}>
        Server Status: {healthCheck || 'Connecting...'}
      </Text>

      <TouchableOpacity
        className="bg-deen-primary py-4 px-8 rounded-2xl"
        onPress={() => router.push('/(drawer)/(tabs)')}
      >
        <Text className="text-white text-lg" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
          Start Learning
        </Text>
      </TouchableOpacity>
    </View>
  );
}
