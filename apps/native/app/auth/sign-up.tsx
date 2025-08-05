import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { authClient } from '../../lib/auth-client';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        Alert.alert('Sign Up Failed', result.error.message);
      } else {
        Alert.alert(
          'Success!',
          'Account created successfully. You can now sign in.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/auth/sign-in'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-deen-secondary px-6 justify-center">
      <View className="mb-8">
        <Text className="text-4xl text-center text-deen-dark mb-2" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
          Join DeenQuest
        </Text>
        <Text className="text-lg text-center text-gray-600" style={{ fontFamily: 'Urbanist_400Regular' }}>
          Create your account to start your Islamic learning journey.
        </Text>
      </View>

      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-deen-dark mb-2" style={{ fontFamily: 'Urbanist_500Medium' }}>Full Name</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-lg"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoComplete="name"
            style={{ fontFamily: 'Urbanist_400Regular' }}
          />
        </View>

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
            autoComplete="new-password"
            style={{ fontFamily: 'Urbanist_400Regular' }}
          />
        </View>

        <View>
          <Text className="text-deen-dark mb-2" style={{ fontFamily: 'Urbanist_500Medium' }}>Confirm Password</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-lg"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoComplete="new-password"
            style={{ fontFamily: 'Urbanist_400Regular' }}
          />
        </View>
      </View>

      <TouchableOpacity
        className={`py-4 rounded-2xl mb-4 ${
          isLoading ? 'bg-gray-400' : 'bg-deen-primary'
        }`}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text className="text-white text-center text-lg" style={{ fontFamily: 'Urbanist_600SemiBold' }}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600" style={{ fontFamily: 'Urbanist_400Regular' }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
          <Text className="text-deen-primary" style={{ fontFamily: 'Urbanist_600SemiBold' }}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}