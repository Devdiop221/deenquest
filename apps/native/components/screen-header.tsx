import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
    label?: string;
  };
}

export function ScreenHeader({ title, subtitle, showBack = false, rightAction }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-6">
      <View className="flex-1">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="mb-2">
            <Ionicons name="arrow-back" size={24} color="#015055" />
          </TouchableOpacity>
        )}
        <Text className="text-3xl text-deen-dark" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-gray-600 mt-1" style={{ fontFamily: 'Urbanist_400Regular' }}>
            {subtitle}
          </Text>
        )}
      </View>

      {rightAction && (
        <TouchableOpacity
          onPress={rightAction.onPress}
          className="bg-deen-primary px-4 py-2 rounded-xl flex-row items-center"
        >
          <Ionicons name={rightAction.icon as any} size={16} color="white" />
          {rightAction.label && (
            <Text className="text-white ml-2" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
              {rightAction.label}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}