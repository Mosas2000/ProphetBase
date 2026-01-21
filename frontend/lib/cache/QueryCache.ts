/**
 * Smart Query Cache with stale-while-revalidate strategy
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  staleTime: number;
  cacheTime: number;
}

interface CacheOptions {
  staleTime?: number; // Time before data is considered stale (ms)
  cacheTime?: number; // Time before cache is garbage collected (ms)
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
}

class QueryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private subscribers: Map<string, Set<() => void>> = new Map();
  private defaultOptions: CacheOptions = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  };

  constructor() {
    this.setupEventListeners();
    this.startGarbageCollector();
  }

  /**
   * Get data from cache or fetch if not available
   */
  async query<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const opts = { ...this.defaultOptions, ...options };
    const cached = this.cache.get(key);

    // Return cached data if fresh
    if (cached && !this.isStale(cached)) {
      return cached.data;
    }

    // Return stale data while revalidating in background
    if (cached && this.isStale(cached)) {
      this.revalidate(key, fetcher, opts);
      return cached.data;
    }

    // Fetch fresh data
    const data = await fetcher();
    this.set(key, data, opts);
    return data;
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, options?: CacheOptions): void {
    const opts = { ...this.defaultOptions, ...options };
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      staleTime: opts.staleTime!,
      cacheTime: opts.cacheTime!,
    });
    this.notifySubscribers(key);
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | undefined {
    const cached = this.cache.get(key);
    if (!cached) return undefined;
    if (this.isExpired(cached)) {
      this.cache.delete(key);
      return undefined;
    }
    return cached.data;
  }

  /**
   * Invalidate cache entry
   */
  invalidate(key: string | string[]): void {
    const keys = Array.isArray(key) ? key : [key];
    keys.forEach(k => {
      this.cache.delete(k);
      this.notifySubscribers(k);
    });
  }

  /**
   * Invalidate all cache entries matching pattern
   */
  invalidatePattern(pattern: RegExp): void {
    const keysToInvalidate: string[] = [];
    this.cache.forEach((_, key) => {
      if (pattern.test(key)) {
        keysToInvalidate.push(key);
      }
    });
    this.invalidate(keysToInvalidate);
  }

  /**
   * Subscribe to cache changes
   */
  subscribe(key: string, callback: () => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.get(key)?.delete(callback);
    };
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.subscribers.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      memory: this.estimateMemoryUsage(),
    };
  }

  // Private methods

  private isStale(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.staleTime;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.cacheTime;
  }

  private async revalidate<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions
  ): Promise<void> {
    try {
      const data = await fetcher();
      this.set(key, data, options);
    } catch (error) {
      console.error(`Failed to revalidate cache for key: ${key}`, error);
    }
  }

  private notifySubscribers(key: string): void {
    this.subscribers.get(key)?.forEach(callback => callback());
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Revalidate on focus
    window.addEventListener('focus', () => {
      this.cache.forEach((entry, key) => {
        if (this.isStale(entry)) {
          this.notifySubscribers(key);
        }
      });
    });

    // Revalidate on reconnect
    window.addEventListener('online', () => {
      this.cache.forEach((_, key) => {
        this.notifySubscribers(key);
      });
    });
  }

  private startGarbageCollector(): void {
    setInterval(() => {
      const now = Date.now();
      this.cache.forEach((entry, key) => {
        if (this.isExpired(entry)) {
          this.cache.delete(key);
        }
      });
    }, 60 * 1000); // Run every minute
  }

  private estimateMemoryUsage(): string {
    const size = JSON.stringify(Array.from(this.cache.entries())).length;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
}

// Export singleton instance
export const queryCache = new QueryCache();

// Export hook for React
export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: CacheOptions
) {
  const [data, setData] = React.useState<T | undefined>(queryCache.get(key));
  const [isLoading, setIsLoading] = React.useState(!data);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await queryCache.query(key, fetcher, options);
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Subscribe to cache updates
    const unsubscribe = queryCache.subscribe(key, () => {
      const cached = queryCache.get<T>(key);
      if (cached) setData(cached);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [key]);

  return { data, isLoading, error, refetch: () => queryCache.invalidate(key) };
}

import React from 'react';
