import AsyncStorage from '@react-native-async-storage/async-storage';
import { offlineStorage, OfflineQuiz, OfflineLecture, OfflineCategory } from '../offline-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

describe('OfflineStorageManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isOnline', () => {
    it('returns true when connected', async () => {
      const result = await offlineStorage.isOnline();
      expect(result).toBe(true);
    });
  });

  describe('storeQuizzes', () => {
    it('stores quizzes correctly', async () => {
      const mockQuizzes: OfflineQuiz[] = [
        {
          id: '1',
          title: 'Test Quiz',
          question: 'Test Question?',
          options: ['A', 'B', 'C', 'D'],
          correctAnswerIndex: 0,
          explanation: 'Test explanation',
          categoryId: 'cat1',
          xpReward: 10,
        },
      ];

      await offlineStorage.storeQuizzes(mockQuizzes);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@deenquest_offline_quizzes',
        JSON.stringify(mockQuizzes)
      );
    });

    it('handles storage errors gracefully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await offlineStorage.storeQuizzes([]);

      expect(consoleSpy).toHaveBeenCalledWith('Failed to store quizzes offline:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('getOfflineQuizzes', () => {
    it('retrieves stored quizzes', async () => {
      const mockQuizzes: OfflineQuiz[] = [
        {
          id: '1',
          title: 'Test Quiz',
          question: 'Test Question?',
          options: ['A', 'B', 'C', 'D'],
          correctAnswerIndex: 0,
          explanation: 'Test explanation',
          categoryId: 'cat1',
          xpReward: 10,
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockQuizzes));

      const result = await offlineStorage.getOfflineQuizzes();

      expect(result).toEqual(mockQuizzes);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@deenquest_offline_quizzes');
    });

    it('returns empty array when no data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await offlineStorage.getOfflineQuizzes();

      expect(result).toEqual([]);
    });

    it('handles retrieval errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Retrieval error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await offlineStorage.getOfflineQuizzes();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get offline quizzes:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('storeLectures', () => {
    it('stores lectures correctly', async () => {
      const mockLectures: OfflineLecture[] = [
        {
          id: '1',
          title: 'Test Lecture',
          content: 'Test content',
          categoryId: 'cat1',
          duration: 300,
        },
      ];

      await offlineStorage.storeLectures(mockLectures);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@deenquest_offline_lectures',
        JSON.stringify(mockLectures)
      );
    });
  });

  describe('storeCategories', () => {
    it('stores categories correctly', async () => {
      const mockCategories: OfflineCategory[] = [
        {
          id: '1',
          name: 'Test Category',
          description: 'Test description',
          icon: 'BookOpen',
        },
      ];

      await offlineStorage.storeCategories(mockCategories);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@deenquest_offline_categories',
        JSON.stringify(mockCategories)
      );
    });
  });

  describe('sync management', () => {
    it('sets and gets last sync time', async () => {
      const mockDate = new Date('2024-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      await offlineStorage.setLastSyncTime();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@deenquest_last_sync',
        mockDate.toISOString()
      );

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockDate.toISOString());

      const result = await offlineStorage.getLastSyncTime();

      expect(result).toEqual(mockDate);
    });
  });

  describe('clearOfflineData', () => {
    it('clears all offline data', async () => {
      await offlineStorage.clearOfflineData();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@deenquest_offline_quizzes',
        '@deenquest_offline_lectures',
        '@deenquest_offline_categories',
        '@deenquest_offline_progress',
        '@deenquest_last_sync',
      ]);
    });
  });

  describe('offline progress', () => {
    it('stores offline progress correctly', async () => {
      const mockProgress = {
        id: '1',
        quizId: 'quiz1',
        score: 80,
        completed: true,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await offlineStorage.storeOfflineProgress(mockProgress);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@deenquest_offline_progress',
        expect.stringContaining('"synced":false')
      );
    });

    it('gets unsynced progress', async () => {
      const mockProgress = [
        { id: '1', synced: false },
        { id: '2', synced: true },
        { id: '3', synced: false },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockProgress));

      const result = await offlineStorage.getUnsyncedProgress();

      expect(result).toHaveLength(2);
      expect(result.every(item => !item.synced)).toBe(true);
    });
  });
});