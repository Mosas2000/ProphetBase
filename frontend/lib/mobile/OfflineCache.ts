/**
 * OfflineCache - Utility for mobile offline mode and local cache
 * Features:
 * - Cache market and portfolio data in localStorage
 * - Retrieve cached data when offline
 * - Sync cache on reconnect
 */

export class OfflineCache {
  static set(key: string, data: any) {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify({
        data,
        ts: Date.now(),
      }));
    } catch {}
  }

  static get<T = any>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`offline_${key}`);
      if (!raw) return null;
      return JSON.parse(raw).data as T;
    } catch {
      return null;
    }
  }

  static clear(key: string) {
    try {
      localStorage.removeItem(`offline_${key}`);
    } catch {}
  }

  static cacheMarkets(markets: any) {
    OfflineCache.set('markets', markets);
  }

  static getCachedMarkets<T = any[]>(): T | null {
    return OfflineCache.get<T>('markets');
  }

  static cachePortfolio(portfolio: any) {
    OfflineCache.set('portfolio', portfolio);
  }

  static getCachedPortfolio<T = any>(): T | null {
    return OfflineCache.get<T>('portfolio');
  }
}
