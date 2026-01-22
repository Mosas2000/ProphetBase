'use client';

import { useEffect, useState } from 'react';

export default function OfflineMode() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState<any[]>([]);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending actions from IndexedDB
    loadPendingActions();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPendingActions = async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['pendingActions'], 'readonly');
      const store = transaction.objectStore('pendingActions');
      const request = store.getAll();

      request.onsuccess = () => {
        setPendingActions(request.result || []);
      };
    } catch (error) {
      console.error('Failed to load pending actions:', error);
    }
  };

  const syncPendingActions = async () => {
    if (pendingActions.length === 0) return;

    for (const action of pendingActions) {
      try {
        await fetch(action.endpoint, {
          method: action.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data),
        });

        // Remove from IndexedDB after successful sync
        const db = await openDB();
        const transaction = db.transaction(['pendingActions'], 'readwrite');
        const store = transaction.objectStore('pendingActions');
        store.delete(action.id);
      } catch (error) {
        console.error('Failed to sync action:', error);
      }
    }

    loadPendingActions();
  };

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('prophetbase-offline', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('pendingActions')) {
          db.createObjectStore('pendingActions', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains('cachedData')) {
          db.createObjectStore('cachedData', { keyPath: 'key' });
        }
      };
    });
  };

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white p-3 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">You're offline</span>
          </div>
          {pendingActions.length > 0 && (
            <span className="text-sm">
              {pendingActions.length} action
              {pendingActions.length !== 1 ? 's' : ''} pending
            </span>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// Offline Data Manager
export class OfflineDataManager {
  private dbName = 'prophetbase-offline';
  private version = 1;

  async cacheData(key: string, data: any): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(['cachedData'], 'readwrite');
    const store = transaction.objectStore('cachedData');

    await store.put({
      key,
      data,
      timestamp: Date.now(),
    });
  }

  async getCachedData(key: string): Promise<any | null> {
    const db = await this.openDB();
    const transaction = db.transaction(['cachedData'], 'readonly');
    const store = transaction.objectStore('cachedData');

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;
        if (result && Date.now() - result.timestamp < 86400000) {
          // 24 hours
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async addPendingAction(
    endpoint: string,
    method: string,
    data: any
  ): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(['pendingActions'], 'readwrite');
    const store = transaction.objectStore('pendingActions');

    await store.add({
      endpoint,
      method,
      data,
      timestamp: Date.now(),
    });
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('pendingActions')) {
          db.createObjectStore('pendingActions', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains('cachedData')) {
          db.createObjectStore('cachedData', { keyPath: 'key' });
        }
      };
    });
  }
}

// Hook for offline-first data fetching
export function useOfflineData<T>(
  key: string,
  fetcher: () => Promise<T>
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const manager = new OfflineDataManager();

    async function fetchData() {
      try {
        // Try to get cached data first
        const cached = await manager.getCachedData(key);
        if (cached) {
          setData(cached);
          setLoading(false);
        }

        // Then fetch fresh data if online
        if (navigator.onLine) {
          const fresh = await fetcher();
          setData(fresh);
          await manager.cacheData(key, fresh);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [key]);

  return { data, loading, error };
}
