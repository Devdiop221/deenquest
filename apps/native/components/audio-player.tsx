import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { audioStorage } from '../lib/offline-storage';

interface AudioPlayerProps {
  lectureId: string;
  audioUrl: string;
  title: string;
  onComplete?: () => void;
}

export function AudioPlayer({ lectureId, audioUrl, title, onComplete }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration] = useState(1200000); // Mock 20 minutes
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    checkIfDownloaded();
  }, []);

  const checkIfDownloaded = async () => {
    const localPath = await audioStorage.getLocalAudioPath(lectureId);
    setIsDownloaded(!!localPath);
  };

  const downloadAudio = async () => {
    setIsLoading(true);
    try {
      const localPath = await audioStorage.downloadAudio(lectureId, audioUrl);
      if (localPath) {
        setIsDownloaded(true);
        Alert.alert('Success', 'Audio downloaded for offline listening!');
      } else {
        Alert.alert('Error', 'Failed to download audio');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download audio');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    setIsPlaying(!isPlaying);

    // Simulate audio playback
    if (!isPlaying) {
      // Start mock playback
      const interval = setInterval(() => {
        setPosition(prev => {
          const newPos = prev + 1000;
          if (newPos >= duration) {
            clearInterval(interval);
            setIsPlaying(false);
            setPosition(0);
            onComplete?.();
            return 0;
          }
          return newPos;
        });
      }, 1000);
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {title}
      </Text>

      {/* Main Play Button */}
      <View className="items-center mb-4">
        <TouchableOpacity
          className={`w-16 h-16 rounded-full items-center justify-center ${
            isPlaying ? 'bg-red-500' : 'bg-green-500'
          }`}
          onPress={togglePlayPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <Ionicons name="hourglass" size={24} color="white" />
          ) : (
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color="white"
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View className="mb-4">
        <View className="bg-gray-300 h-2 rounded-full">
          <View
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className="text-sm text-gray-600">
            {formatTime(position)}
          </Text>
          <Text className="text-sm text-gray-600">
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Download Button */}
      <View className="flex-row justify-center">
        {isDownloaded ? (
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text className="text-green-600 ml-2">Downloaded</Text>
          </View>
        ) : (
          <TouchableOpacity
            className="flex-row items-center bg-blue-500 px-4 py-2 rounded-lg"
            onPress={downloadAudio}
            disabled={isLoading}
          >
            <Ionicons name="download" size={16} color="white" />
            <Text className="text-white ml-2">
              {isLoading ? 'Downloading...' : 'Download for Offline'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}