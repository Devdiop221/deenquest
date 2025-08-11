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

export function ScreenHeader({ title, showBack = false, rightAction }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-6">
      {/* Left Side - Back Button */}
      {showBack ? (
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-deen-primary px-4 py-2 rounded-xl flex-row items-center"
          style={{
            shadowColor: '#015055',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name="arrow-back" size={16} color="white" />
          <Text className="text-white ml-1 text-sm" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
            Back
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 80 }} />
      )}

      {/* Center - Title */}
      <View className="flex-1 items-center">
        <Text className="text-xl text-deen-dark text-center" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
          {title}
        </Text>
      </View>

      {/* Right Side - Action or Empty */}
      {rightAction ? (
        <TouchableOpacity
          onPress={rightAction.onPress}
          className="bg-deen-primary px-4 py-2 rounded-xl flex-row items-center"
          style={{
            shadowColor: '#015055',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name={rightAction.icon as any} size={16} color="white" />
          {rightAction.label && (
            <Text className="text-white ml-2 text-sm" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
              {rightAction.label}
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={{ width: 80 }} />
      )}
    </View>
  );
}