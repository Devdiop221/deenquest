import { useEffect, useState } from 'react';
import * as Network from 'expo-network';
import { trpc } from '../utils/trpc';
import { contentStorage, offlineQueue, syncManager } from './offline-storage';

// Network status hook
export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected ?? false);
    };

    checkNetworkStatus();

    // Check network status periodically
    const interval = setInterval(checkNetworkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return isConnected;
}

// Offline-aware categories hook
export function useOfflineCategories() {
  const [offlineData, setOfflineData] = useState<any>(null);
  const isConnected = useNetworkStatus();

  const onlineQuery = trpc.categories.getAll.useQuery(undefined, {
    enabled: isConnected,
  });

  // Handle caching when data is available
  useEffect(() => {
    if (onlineQuery.data && isConnected) {
      const cacheData = async () => {
        await contentStorage.setCategories(onlineQuery.data);
        setOfflineData(onlineQuery.data);
      };
      cacheData();
    }
  }, [onlineQuery.data, isConnected]);

  useEffect(() => {
    // Load cached data on mount
    const loadCachedData = async () => {
      const cached = await contentStorage.getCategories();
      if (cached) {
        setOfflineData(cached);
      }
    };

    if (!isConnected) {
      loadCachedData();
    }
  }, [isConnected]);

  return {
    data: isConnected ? onlineQuery.data : offlineData,
    isLoading: isConnected ? onlineQuery.isLoading : false,
    isOffline: !isConnected,
  };
}

// Offline-aware quizzes hook
export function useOfflineQuizzes() {
  const [offlineData, setOfflineData] = useState<any>(null);
  const isConnected = useNetworkStatus();

  const onlineQuery = trpc.quizzes.getAll.useQuery(undefined, {
    enabled: isConnected,
  });

  // Handle caching when data is available
  useEffect(() => {
    if (onlineQuery.data && isConnected) {
      const cacheData = async () => {
        await contentStorage.setQuizzes(onlineQuery.data);
        setOfflineData(onlineQuery.data);
      };
      cacheData();
    }
  }, [onlineQuery.data, isConnected]);

  useEffect(() => {
    const loadCachedData = async () => {
      const cached = await contentStorage.getQuizzes();
      if (cached) {
        setOfflineData(cached);
      }
    };

    if (!isConnected) {
      loadCachedData();
    }
  }, [isConnected]);

  return {
    data: isConnected ? onlineQuery.data : offlineData,
    isLoading: isConnected ? onlineQuery.isLoading : false,
    isOffline: !isConnected,
  };
}

// Offline-aware lectures hook
export function useOfflineLectures() {
  const [offlineData, setOfflineData] = useState<any>(null);
  const isConnected = useNetworkStatus();

  const onlineQuery = trpc.lectures.getAll.useQuery(undefined, {
    enabled: isConnected,
  });

  // Handle caching when data is available
  useEffect(() => {
    if (onlineQuery.data && isConnected) {
      const cacheData = async () => {
        await contentStorage.setLectures(onlineQuery.data);
        setOfflineData(onlineQuery.data);
      };
      cacheData();
    }
  }, [onlineQuery.data, isConnected]);

  useEffect(() => {
    const loadCachedData = async () => {
      const cached = await contentStorage.getLectures();
      if (cached) {
        setOfflineData(cached);
      }
    };

    if (!isConnected) {
      loadCachedData();
    }
  }, [isConnected]);

  return {
    data: isConnected ? onlineQuery.data : offlineData,
    isLoading: isConnected ? onlineQuery.isLoading : false,
    isOffline: !isConnected,
  };
}

// Offline-aware quiz submission
export function useOfflineQuizSubmission() {
  const isConnected = useNetworkStatus();
  const onlineMutation = trpc.quizzes.submitAnswer.useMutation();

  const submitAnswer = async (data: {
    quizId: string;
    selectedAnswer: number;
    timeSpent?: number;
  }) => {
    if (isConnected) {
      // Submit online
      return await onlineMutation.mutateAsync(data);
    } else {
      // Queue for later submission
      await offlineQueue.addAction({
        type: 'quiz_answer',
        data,
      });

      // Return mock response for offline
      return {
        isCorrect: true, // We'll determine this when syncing
        correctAnswer: 0,
        explanation: 'Answer submitted offline. Results will be available when you reconnect.',
        xpEarned: 0,
      };
    }
  };

  return {
    submitAnswer,
    isLoading: onlineMutation.isPending,
    isOffline: !isConnected,
  };
}

// Sync manager hook
export function useSyncManager() {
  const isConnected = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);

  const submitAnswerMutation = trpc.quizzes.submitAnswer.useMutation();
  const markLectureCompleteMutation = trpc.lectures.markCompleted.useMutation();
  const addFavoriteMutation = trpc.favorites.add.useMutation();
  const removeFavoriteMutation = trpc.favorites.remove.useMutation();

  const syncOfflineActions = async () => {
    if (!isConnected || isSyncing) return;

    setIsSyncing(true);
    try {
      const queue = await offlineQueue.getQueue();

      for (const action of queue) {
        try {
          switch (action.type) {
            case 'quiz_answer':
              await submitAnswerMutation.mutateAsync(action.data);
              break;
            case 'lecture_complete':
              await markLectureCompleteMutation.mutateAsync(action.data);
              break;
            case 'favorite_add':
              await addFavoriteMutation.mutateAsync(action.data);
              break;
            case 'favorite_remove':
              await removeFavoriteMutation.mutateAsync(action.data);
              break;
          }

          // Remove successfully synced action
          await offlineQueue.removeAction(action.id);
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error);
          // Keep action in queue for retry
        }
      }

      // Update last sync time
      const now = Date.now();
      await syncManager.setLastSync(now);
      setLastSyncTime(now);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Load last sync time
    const loadLastSync = async () => {
      const lastSync = await syncManager.getLastSync();
      setLastSyncTime(lastSync);
    };

    loadLastSync();

    // Auto-sync when coming online
    if (isConnected) {
      syncOfflineActions();
    }
  }, [isConnected]);

  return {
    syncOfflineActions,
    isSyncing,
    lastSyncTime,
    isConnected,
  };
}