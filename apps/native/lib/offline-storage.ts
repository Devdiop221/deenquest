import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const OFFLINE_KEYS = {
  QUIZZES: '@deenquest_offline_quizzes',
  LECTURES: '@deenquest_offline_lectures',
  CATEGORIES: '@deenquest_offline_categories',
  USER_PROGRESS: '@deenquest_offline_progress',
  LAST_SYNC: '@deenquest_last_sync',
};

export interface OfflineQuiz {
  id: string;
  title: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  categoryId: string;
  xpReward: number;
}

export interface OfflineLecture {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  categoryId: string;
  duration: number;
}

export interface OfflineCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

class OfflineStorageManager {
  // Check if device is online
  async isOnline(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected ?? false;
  }

  // Store data offline
  async storeQuizzes(quizzes: OfflineQuiz[]): Promise<void> {
    try {
      await AsyncStorage.setItem(OFFLINE_KEYS.QUIZZES, JSON.stringify(quizzes));
    } catch (error) {
      console.error('Failed to store quizzes offline:', error);
    }
  }

  async storeLectures(lectures: OfflineLecture[]): Promise<void> {
    try {
      await AsyncStorage.setItem(OFFLINE_KEYS.LECTURES, JSON.stringify(lectures));
    } catch (error) {
      console.error('Failed to store lectures offline:', error);
    }
  }

  async storeCategories(categories: OfflineCategory[]): Promise<void> {
    try {
      await AsyncStorage.setItem(OFFLINE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Failed to store categories offline:', error);
    }
  }

  // Retrieve data offline
  async getOfflineQuizzes(): Promise<OfflineQuiz[]> {
    try {
      const data = await AsyncStorage.getItem(OFFLINE_KEYS.QUIZZES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get offline quizzes:', error);
      return [];
    }
  }

  async getOfflineLectures(): Promise<OfflineLecture[]> {
    try {
      const data = await AsyncStorage.getItem(OFFLINE_KEYS.LECTURES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get offline lectures:', error);
      return [];
    }
  }

  async getOfflineCategories(): Promise<OfflineCategory[]> {
    try {
      const data = await AsyncStorage.getItem(OFFLINE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get offline categories:', error);
      return [];
    }
  }

  // Sync management
  async setLastSyncTime(): Promise<void> {
    try {
      await AsyncStorage.setItem(OFFLINE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error('Failed to set last sync time:', error);
    }
  }

  async getLastSyncTime(): Promise<Date | null> {
    try {
      const data = await AsyncStorage.getItem(OFFLINE_KEYS.LAST_SYNC);
      return data ? new Date(data) : null;
    } catch (error) {
      console.error('Failed to get last sync time:', error);
      return null;
    }
  }

  // Clear offline data
  async clearOfflineData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        OFFLINE_KEYS.QUIZZES,
        OFFLINE_KEYS.LECTURES,
        OFFLINE_KEYS.CATEGORIES,
        OFFLINE_KEYS.USER_PROGRESS,
        OFFLINE_KEYS.LAST_SYNC,
      ]);
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }

  // Store user progress offline (for sync later)
  async storeOfflineProgress(progress: any): Promise<void> {
    try {
      const existingProgress = await AsyncStorage.getItem(OFFLINE_KEYS.USER_PROGRESS);
      const progressArray = existingProgress ? JSON.parse(existingProgress) : [];
      progressArray.push({
        ...progress,
        timestamp: new Date().toISOString(),
        synced: false,
      });
      await AsyncStorage.setItem(OFFLINE_KEYS.USER_PROGRESS, JSON.stringify(progressArray));
    } catch (error) {
      console.error('Failed to store offline progress:', error);
    }
  }

  async getUnsyncedProgress(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(OFFLINE_KEYS.USER_PROGRESS);
      const progressArray = data ? JSON.parse(data) : [];
      return progressArray.filter((item: any) => !item.synced);
    } catch (error) {
      console.error('Failed to get unsynced progress:', error);
      return [];
    }
  }

  async markProgressAsSynced(progressIds: string[]): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(OFFLINE_KEYS.USER_PROGRESS);
      const progressArray = data ? JSON.parse(data) : [];
      const updatedProgress = progressArray.map((item: any) => {
        if (progressIds.includes(item.id)) {
          return { ...item, synced: true };
        }
        return item;
      });
      await AsyncStorage.setItem(OFFLINE_KEYS.USER_PROGRESS, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Failed to mark progress as synced:', error);
    }
  }
}

export const offlineStorage = new OfflineStorageManager();