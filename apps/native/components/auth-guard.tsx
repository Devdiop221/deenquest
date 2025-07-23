import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../lib/auth-context';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      fallback || (
        <View className="flex-1 justify-center items-center bg-white">
          <Text className="text-lg text-gray-600">Loading...</Text>
        </View>
      )
    );
  }

  // For demo purposes, always show content
  // if (!user) {
  //   return <Redirect href="/auth/sign-in" />;
  // }

  return <>{children}</>;
}