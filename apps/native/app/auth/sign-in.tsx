import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { authClient } from '../../lib/auth-client';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        Alert.alert('Sign In Failed', result.error.message);
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-deen-secondary px-6 justify-center">
      <View className="mb-8">
        <Text className="text-4xl text-center text-deen-dark mb-2" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
          DeenQuest
        </Text>
        <Text className="text-lg text-center text-gray-600" style={{ fontFamily: 'Urbanist_400Regular' }}>
          Welcome back! Sign in to continue your Islamic learning journey.
        </Text>
      </View>

      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-deen-dark mb-2" style={{ fontFamily: 'Urbanist_500Medium' }}>Email</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-lg"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={{ fontFamily: 'Urbanist_400Regular' }}
          />
        </View>

        <View>
          <Text className="text-deen-dark mb-2" style={{ fontFamily: 'Urbanist_500Medium' }}>Password</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-lg"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            style={{ fontFamily: 'Urbanist_400Regular' }}
          />
        </View>
      </View>

      <TouchableOpacity
        className={`py-4 rounded-2xl mb-4 ${
          isLoading ? 'bg-gray-400' : 'bg-deen-primary'
        }`}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        <Text className="text-white text-center text-lg" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600" style={{ fontFamily: 'Urbanist_400Regular' }}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/sign-up')}>
          <Text className="text-deen-primary" style={{ fontFamily: 'Urbanist_600SemiBold' }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}