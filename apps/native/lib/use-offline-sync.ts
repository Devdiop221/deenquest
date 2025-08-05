import { useEffect, useState } from 'react';
import { offlineStorage } from './offline-storage';
import { trpc } from './trpc';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: categories } = trpc.categories.getAll.useQuery();
  const { data: quizzes } = trpc.quizzes.getAll.useQuery();
  const { data: lectures } = trpc.lectures.getAll.useQuery();

  // Check online status
  useEffect(() => {
    const checkOnlineStatus = async () => {
      const online = await offlineStorage.isOnline();
      setIsOnline(online);
    };

    checkOnlineStatus();
    const interval = setInterval(checkOnlineStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Load last sync time
  useEffect(() => {
    const loadLastSyncTime = async () => {
      const lastSync = await offlineStorage.getLastSyncTime();
      setLastSyncTime(lastSync);
    };

    loadLastSyncTime();
  }, []);

  // Sync data when online and data is available
  useEffect(() => {
    if (isOnline && categories && quizzes && lectures) {
      syncDataToOffline();
    }
  }, [isOnline, categories, quizzes, lectures]);

  const syncDataToOffline = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      // Store data offline
      if (categories) {
        await offlineStorage.storeCategories(categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || '',
          icon: cat.icon || 'BookOpen',
        })));
      }

      if (quizzes) {
        await offlineStorage.storeQuizzes(quizzes.map(quiz => ({
          id: quiz.id,
          title: quiz.title,
          question: quiz.question,
          options: quiz.options as string[],
          correctAnswerIndex: quiz.correctAnswerIndex,
          explanation: quiz.explanation || '',
          categoryId: quiz.categoryId,
          xpReward: quiz.xpReward || 10,
        })));
      }

      if (lectures) {
        await offlineStorage.storeLectures(lectures.map(lecture => ({
          id: lecture.id,
          title: lecture.title,
          content: lecture.content,
          audioUrl: lecture.audioUrl,
          categoryId: lecture.categoryId,
          duration: lecture.duration || 0,
        })));
      }

      await offlineStorage.setLastSyncTime();
      const newLastSync = await offlineStorage.getLastSyncTime();
      setLastSyncTime(newLastSync);
    } catch (error) {
      console.error('Failed to sync data offline:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getOfflineData = async () => {
    const [offlineCategories, offlineQuizzes, offlineLectures] = await Promise.all([
      offlineStorage.getOfflineCategories(),
      offlineStorage.getOfflineQuizzes(),
      offlineStorage.getOfflineLectures(),
    ]);

    return {
      categories: offlineCategories,
      quizzes: offlineQuizzes,
      lectures: offlineLectures,
    };
  };

  const clearOfflineData = async () => {
    await offlineStorage.clearOfflineData();
    setLastSyncTime(null);
  };

  return {
    isOnline,
    lastSyncTime,
    isSyncing,
    syncDataToOffline,
    getOfflineData,
    clearOfflineData,
  };
}