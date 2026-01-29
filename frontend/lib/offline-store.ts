'use client';

/**
 * Utility for managing offline market data storage via IndexedDB
 */
class OfflineMarketStore {
  private dbName = 'prophetbase-offline-v1';
  private storeName = 'markets';

  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  public async saveMarkets(markets: any[]) {
    const db = await this.getDB();
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    
    markets.forEach(market => {
      store.put({ ...market, cachedAt: Date.now() });
    });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  public async getMarkets(): Promise<any[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  public async getMarket(id: string): Promise<any> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  public async clearCache() {
    const db = await this.getDB();
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    store.clear();
  }
}

export const offlineMarketStore = new OfflineMarketStore();

/**
 * Hook to automatically cache markets for offline use
 */
import { useEffect } from 'react';

export function useOfflineMarkets(markets: any[]) {
  useEffect(() => {
    if (markets && markets.length > 0) {
      offlineMarketStore.saveMarkets(markets).catch(console.error);
    }
  }, [markets]);

  const loadOffline = async () => {
    return await offlineMarketStore.getMarkets();
  };

  return { loadOffline };
}
