import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSyncManager } from '../lib/offline-trpc';

export function SyncStatus() {
  const { syncOfflineActions, isSyncing, lastSyncTime, isConnected } = useSyncManager();

  const formatLastSync = (timestamp: number) => {
    if (timestamp === 0) return 'Never';

    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!isConnected) {
    return (
      <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 m-4">
        <View className="flex-row items-center">
          <Ionicons name="cloud-offline" size={20} color="#d97706" />
          <Text className="text-yellow-800 ml-2 flex-1">
            You're offline. Changes will sync when reconnected.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-green-50 border border-green-200 rounded-lg p-3 m-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Ionicons
            name={isSyncing ? "sync" : "cloud-done"}
            size={20}
            color="#059669"
          />
          <Text className="text-green-800 ml-2">
            {isSyncing ? 'Syncing...' : `Last sync: ${formatLastSync(lastSyncTime)}`}
          </Text>
        </View>

        {!isSyncing && (
          <TouchableOpacity
            onPress={syncOfflineActions}
            className="bg-green-600 px-3 py-1 rounded"
          >
            <Text className="text-white text-sm">Sync Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}