import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

// Storage keys
const STORAGE_KEYS = {
  CATEGORIES: 'deenquest_categories',
  QUIZZES: 'deenquest_quizzes',
  LECTURES: 'deenquest_lectures',
  USER_PROGRESS: 'deenquest_user_progress',
  FAVORITES: 'deenquest_favorites',
  OFFLINE_QUEUE: 'deenquest_offline_queue',
  LAST_SYNC: 'deenquest_last_sync',
} as const;

// Types
interface OfflineAction {
  id: string;
  type: 'quiz_answer' | 'lecture_complete' | 'favorite_add' | 'favorite_remove';
  data: any;
  timestamp: number;
}

interface AudioFile {
  id: string;
  url: string;
  localPath: string;
  downloaded: boolean;
}

// Generic storage functions
export const offlineStorage = {
  // Get data from storage
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  },

  // Set data in storage
  async set<T>(key: string, data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
    }
  },

  // Remove data from storage
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  },

  // Clear all app data
  async clear(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

// Content-specific storage functions
export const contentStorage = {
  // Categories
  async getCategories() {
    return await offlineStorage.get(STORAGE_KEYS.CATEGORIES);
  },

  async setCategories(categories: any[]) {
    await offlineStorage.set(STORAGE_KEYS.CATEGORIES, categories);
  },

  // Quizzes
  async getQuizzes() {
    return await offlineStorage.get(STORAGE_KEYS.QUIZZES);
  },

  async setQuizzes(quizzes: any[]) {
    await offlineStorage.set(STORAGE_KEYS.QUIZZES, quizzes);
  },

  // Lectures
  async getLectures() {
    return await offlineStorage.get(STORAGE_KEYS.LECTURES);
  },

  async setLectures(lectures: any[]) {
    await offlineStorage.set(STORAGE_KEYS.LECTURES, lectures);
  },

  // User progress
  async getUserProgress() {
    return await offlineStorage.get(STORAGE_KEYS.USER_PROGRESS) || [];
  },

  async setUserProgress(progress: any[]) {
    await offlineStorage.set(STORAGE_KEYS.USER_PROGRESS, progress);
  },

  // Favorites
  async getFavorites() {
    return await offlineStorage.get(STORAGE_KEYS.FAVORITES) || { quizzes: [], lectures: [] };
  },

  async setFavorites(favorites: any) {
    await offlineStorage.set(STORAGE_KEYS.FAVORITES, favorites);
  },
};

// Offline queue management
export const offlineQueue = {
  async getQueue(): Promise<OfflineAction[]> {
    return await offlineStorage.get(STORAGE_KEYS.OFFLINE_QUEUE) || [];
  },

  async addAction(action: Omit<OfflineAction, 'id' | 'timestamp'>) {
    const queue = await this.getQueue();
    const newAction: OfflineAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    queue.push(newAction);
    await offlineStorage.set(STORAGE_KEYS.OFFLINE_QUEUE, queue);
  },

  async removeAction(actionId: string) {
    const queue = await this.getQueue();
    const filteredQueue = queue.filter(action => action.id !== actionId);
    await offlineStorage.set(STORAGE_KEYS.OFFLINE_QUEUE, filteredQueue);
  },

  async clearQueue() {
    await offlineStorage.set(STORAGE_KEYS.OFFLINE_QUEUE, []);
  },
};

// Audio file management
export const audioStorage = {
  async downloadAudio(lectureId: string, audioUrl: string): Promise<string | null> {
    try {
      const fileName = `lecture_${lectureId}.mp3`;
      const localPath = `${FileSystem.documentDirectory}audio/${fileName}`;

      // Create audio directory if it doesn't exist
      const audioDir = `${FileSystem.documentDirectory}audio/`;
      const dirInfo = await FileSystem.getInfoAsync(audioDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });
      }

      // Download the file
      const downloadResult = await FileSystem.downloadAsync(audioUrl, localPath);

      if (downloadResult.status === 200) {
        // Store audio file info
        const audioFiles = await this.getAudioFiles();
        audioFiles[lectureId] = {
          id: lectureId,
          url: audioUrl,
          localPath,
          downloaded: true,
        };
        await this.setAudioFiles(audioFiles);

        return localPath;
      }

      return null;
    } catch (error) {
      console.error('Error downloading audio:', error);
      return null;
    }
  },

  async getAudioFiles(): Promise<Record<string, AudioFile>> {
    return await offlineStorage.get('audio_files') || {};
  },

  async setAudioFiles(audioFiles: Record<string, AudioFile>) {
    await offlineStorage.set('audio_files', audioFiles);
  },

  async getLocalAudioPath(lectureId: string): Promise<string | null> {
    const audioFiles = await this.getAudioFiles();
    const audioFile = audioFiles[lectureId];

    if (audioFile && audioFile.downloaded) {
      // Check if file still exists
      const fileInfo = await FileSystem.getInfoAsync(audioFile.localPath);
      if (fileInfo.exists) {
        return audioFile.localPath;
      }
    }

    return null;
  },

  async deleteAudio(lectureId: string) {
    const audioFiles = await this.getAudioFiles();
    const audioFile = audioFiles[lectureId];

    if (audioFile) {
      try {
        await FileSystem.deleteAsync(audioFile.localPath);
        delete audioFiles[lectureId];
        await this.setAudioFiles(audioFiles);
      } catch (error) {
        console.error('Error deleting audio file:', error);
      }
    }
  },
};

// Sync management
export const syncManager = {
  async getLastSync(): Promise<number> {
    return await offlineStorage.get(STORAGE_KEYS.LAST_SYNC) || 0;
  },

  async setLastSync(timestamp: number) {
    await offlineStorage.set(STORAGE_KEYS.LAST_SYNC, timestamp);
  },

  async shouldSync(): Promise<boolean> {
    const lastSync = await this.getLastSync();
    const now = Date.now();
    const syncInterval = 5 * 60 * 1000; // 5 minutes

    return (now - lastSync) > syncInterval;
  },
};