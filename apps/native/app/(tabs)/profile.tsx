import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { trpc } from "../../utils/trpc";
import { SyncStatus } from "../../components/sync-status";

export default function ProfileScreen() {
  const { data: stats, isLoading: statsLoading } =
    trpc.user.getStats.useQuery();
  const { data: badges, isLoading: badgesLoading } =
    trpc.user.getBadges.useQuery();

  if (statsLoading || badgesLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">Loading profile...</Text>
      </View>
    );
  }

  const getXpForNextLevel = (currentXp: number) => {
    const currentLevel = Math.floor(currentXp / 100) + 1;
    return currentLevel * 100 - currentXp;
  };

  const getXpProgress = (currentXp: number) => {
    const levelXp = currentXp % 100;
    return (levelXp / 100) * 100;
  };

  return (
    <ScrollView
      className="flex-1 bg-deen-secondary"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <SyncStatus />

      <View className="p-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text
            className="text-3xl text-deen-dark"
            style={{ fontFamily: "SpaceGrotesk_700Bold" }}
          >
            Leaderboard
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/stats")}
            className="bg-deen-primary px-4 py-2 rounded-xl"
          >
            <Text
              className="text-white"
              style={{ fontFamily: "Urbanist_600SemiBold" }}
            >
              My Stats
            </Text>
          </TouchableOpacity>
        </View>

        {/* Toggle Buttons */}
        <View className="flex-row bg-deen-primary rounded-2xl p-1 mb-6">
          <TouchableOpacity className="flex-1 py-3 bg-deen-primary rounded-2xl">
            <Text
              className="text-white text-center"
              style={{ fontFamily: "Urbanist_600SemiBold" }}
            >
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 py-3">
            <Text
              className="text-white text-center"
              style={{ fontFamily: "Urbanist_400Regular" }}
            >
              All Time
            </Text>
          </TouchableOpacity>
        </View>

        {/* User Position Display */}
        <View className="items-center mb-8">
          <View className="relative">
            {/* User Avatar */}
            <View className="w-20 h-20 bg-deen-primary rounded-full items-center justify-center mb-2">
              <Text
                className="text-white text-2xl"
                style={{ fontFamily: "SpaceGrotesk_700Bold" }}
              >
                U
              </Text>
            </View>
            <View className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-400 rounded-full items-center justify-center">
              <Text
                className="text-white text-sm"
                style={{ fontFamily: "Urbanist_700Bold" }}
              >
                1
              </Text>
            </View>
          </View>
          <Text
            className="text-deen-dark text-lg mt-2"
            style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
          >
            You
          </Text>
        </View>

        {/* Leaderboard */}
        <View className="bg-white rounded-2xl p-4">
          {/* Header */}
          <View className="flex-row bg-deen-primary rounded-xl p-3 mb-4">
            <Text
              className="text-white flex-1 text-center"
              style={{ fontFamily: "Urbanist_600SemiBold" }}
            >
              Rank
            </Text>
            <Text
              className="text-white flex-1 text-center"
              style={{ fontFamily: "Urbanist_600SemiBold" }}
            >
              Name
            </Text>
            <Text
              className="text-white flex-1 text-center"
              style={{ fontFamily: "Urbanist_600SemiBold" }}
            >
              Points
            </Text>
          </View>

          {/* Leaderboard Entries */}
          {[
            { rank: "04", name: "Kristin Watson", points: "290" },
            { rank: "05", name: "Darlene Robertson", points: "190" },
            { rank: "06", name: "Savannah Nguyen", points: "180" },
            { rank: "07", name: "Jenny Wilson", points: "175" },
            { rank: "08", name: "Dianne Russell", points: "160" },
          ].map((entry, index) => (
            <View
              key={index}
              className="flex-row py-3 border-b border-gray-100"
            >
              <Text
                className="text-gray-600 flex-1 text-center"
                style={{ fontFamily: "Urbanist_400Regular" }}
              >
                {entry.rank}
              </Text>
              <Text
                className="text-deen-dark flex-1 text-center"
                style={{ fontFamily: "Urbanist_500Medium" }}
              >
                {entry.name}
              </Text>
              <Text
                className="text-deen-dark flex-1 text-center"
                style={{ fontFamily: "Urbanist_600SemiBold" }}
              >
                {entry.points}
              </Text>
            </View>
          ))}
        </View>

        {/* Stats Summary */}
        <View className="mt-6 bg-white rounded-2xl p-4">
          <Text
            className="text-lg text-deen-dark mb-4"
            style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
          >
            Your Stats
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text
                className="text-2xl text-deen-primary"
                style={{ fontFamily: "SpaceGrotesk_700Bold" }}
              >
                {stats?.quizzesCompleted || 0}
              </Text>
              <Text
                className="text-gray-600 text-sm"
                style={{ fontFamily: "Urbanist_400Regular" }}
              >
                Quizzes
              </Text>
            </View>
            <View className="items-center">
              <Text
                className="text-2xl text-deen-accent"
                style={{ fontFamily: "SpaceGrotesk_700Bold" }}
              >
                {stats?.lecturesCompleted || 0}
              </Text>
              <Text
                className="text-gray-600 text-sm"
                style={{ fontFamily: "Urbanist_400Regular" }}
              >
                Lectures
              </Text>
            </View>
            <View className="items-center">
              <Text
                className="text-2xl text-orange-500"
                style={{ fontFamily: "SpaceGrotesk_700Bold" }}
              >
                {stats?.level || 1}
              </Text>
              <Text
                className="text-gray-600 text-sm"
                style={{ fontFamily: "Urbanist_400Regular" }}
              >
                Level
              </Text>
            </View>
            <View className="items-center">
              <Text
                className="text-2xl text-purple-600"
                style={{ fontFamily: "SpaceGrotesk_700Bold" }}
              >
                {stats?.totalXp || 0}
              </Text>
              <Text
                className="text-gray-600 text-sm"
                style={{ fontFamily: "Urbanist_400Regular" }}
              >
                XP
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
