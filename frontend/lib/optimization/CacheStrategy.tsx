'use client';

import { useEffect, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  stale: boolean;
  revalidating: boolean;
}

interface CacheOptions {
  ttl?: number; // Time to live in ms
  staleTime?: number; // Time before data becomes stale
  maxSize?: number; // Maximum cache size
  persistent?: boolean; // Store in localStorage
}

// Smart caching system
export class SmartCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private options: Required<CacheOptions>;
  private storageKey = 'smart-cache';

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes
      staleTime: options.staleTime || 60 * 1000, // 1 minute
      maxSize: options.maxSize || 100,
      persistent: options.persistent || false,
    };

    if (this.options.persistent) {
      this.loadFromStorage();
    }
  }

  set(key: string, data: T): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + this.options.ttl,
      stale: false,
      revalidating: false,
    };

    // Enforce max size
    if (this.cache.size >= this.options.maxSize) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, entry);

    if (this.options.persistent) {
      this.saveToStorage();
    }
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();

    // Check if expired
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Mark as stale if past staleTime
    if (now > entry.timestamp + this.options.staleTime) {
      entry.stale = true;
    }

    return entry.data;
  }

  isStale(key: string): boolean {
    const entry = this.cache.get(key);
    return entry?.stale || false;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    if (this.options.persistent) {
      this.saveToStorage();
    }
  }

  invalidateAll(): void {
    this.cache.clear();
    if (this.options.persistent) {
      this.saveToStorage();
    }
  }

  invalidatePattern(pattern: RegExp): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));

    if (this.options.persistent) {
      this.saveToStorage();
    }
  }

  private getOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    });

    return oldestKey;
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(data);
      }
    } catch (error) {
      console.error('Failed to load cache from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = Array.from(this.cache.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save cache to storage:', error);
    }
  }

  getSize(): number {
    return this.cache.size;
  }

  getStats() {
    const now = Date.now();
    let staleCount = 0;
    let expiredCount = 0;

    this.cache.forEach((entry) => {
      if (entry.stale) staleCount++;
      if (now > entry.expiresAt) expiredCount++;
    });

    return {
      size: this.cache.size,
      staleCount,
      expiredCount,
    };
  }
}

// Stale-while-revalidate hook
export function useSWR<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    cache?: SmartCache<T>;
    revalidateOnFocus?: boolean;
    revalidateInterval?: number;
  } = {}
) {
  const cache = options.cache || new SmartCache<T>();
  const dataRef = useRef<T | null>(cache.get(key));
  const isValidatingRef = useRef(false);

  const revalidate = async () => {
    if (isValidatingRef.current) return;
    isValidatingRef.current = true;

    try {
      const data = await fetcher();
      cache.set(key, data);
      dataRef.current = data;
    } catch (error) {
      console.error('Revalidation failed:', error);
    } finally {
      isValidatingRef.current = false;
    }
  };

  useEffect(() => {
    // Initial fetch if no cached data
    if (!dataRef.current) {
      revalidate();
    } else if (cache.isStale(key)) {
      // Revalidate if stale
      revalidate();
    }

    // Revalidate on focus
    if (options.revalidateOnFocus) {
      const handleFocus = () => revalidate();
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }

    // Periodic revalidation
    if (options.revalidateInterval) {
      const interval = setInterval(revalidate, options.revalidateInterval);
      return () => clearInterval(interval);
    }
  }, [key]);

  return {
    data: dataRef.current,
    isValidating: isValidatingRef.current,
    revalidate,
  };
}

// Cache warming
export class CacheWarmer<T> {
  private cache: SmartCache<T>;
  private warmingQueue: Array<{ key: string; fetcher: () => Promise<T> }> = [];
  private isWarming = false;

  constructor(cache: SmartCache<T>) {
    this.cache = cache;
  }

  addToQueue(key: string, fetcher: () => Promise<T>): void {
    this.warmingQueue.push({ key, fetcher });
  }

  async warm(): Promise<void> {
    if (this.isWarming) return;
    this.isWarming = true;

    while (this.warmingQueue.length > 0) {
      const item = this.warmingQueue.shift();
      if (item) {
        try {
          const data = await item.fetcher();
          this.cache.set(item.key, data);
        } catch (error) {
          console.error(`Failed to warm cache for ${item.key}:`, error);
        }
      }
    }

    this.isWarming = false;
  }

  warmMultiple(
    items: Array<{ key: string; fetcher: () => Promise<T> }>
  ): Promise<void> {
    items.forEach((item) => this.addToQueue(item.key, item.fetcher));
    return this.warm();
  }
}

// Memory management
export class CacheMemoryManager {
  private caches: Map<string, SmartCache<any>> = new Map();
  private maxTotalSize: number;

  constructor(maxTotalSize: number = 1000) {
    this.maxTotalSize = maxTotalSize;
  }

  register(name: string, cache: SmartCache<any>): void {
    this.caches.set(name, cache);
  }

  getTotalSize(): number {
    let total = 0;
    this.caches.forEach((cache) => {
      total += cache.getSize();
    });
    return total;
  }

  cleanup(): void {
    const totalSize = this.getTotalSize();
    if (totalSize > this.maxTotalSize) {
      // Clear caches with most stale entries first
      const cacheStats = Array.from(this.caches.entries()).map(
        ([name, cache]) => ({
          name,
          cache,
          stats: cache.getStats(),
        })
      );

      cacheStats.sort((a, b) => b.stats.staleCount - a.stats.staleCount);

      // Clear stale entries until under limit
      for (const { cache } of cacheStats) {
        if (this.getTotalSize() <= this.maxTotalSize) break;
        // Invalidate stale entries
        // In production, implement more sophisticated cleanup
      }
    }
  }

  getStats() {
    const stats: Record<string, any> = {};
    this.caches.forEach((cache, name) => {
      stats[name] = cache.getStats();
    });
    return {
      totalSize: this.getTotalSize(),
      caches: stats,
    };
  }
}

// LRU Cache implementation
export class LRUCache<T> {
  private capacity: number;
  private cache: Map<string, T>;

  constructor(capacity: number = 100) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: string): T | undefined {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Time-based cache expiration
export class TimeBasedCache<T> {
  private cache: Map<string, { data: T; expires: number }> = new Map();

  set(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  cleanup(): void {
    const now = Date.now();
    this.cache.forEach((entry, key) => {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    });
  }

  startAutoCleanup(interval: number = 60000): () => void {
    const timer = setInterval(() => this.cleanup(), interval);
    return () => clearInterval(timer);
  }
}

// Export singleton instances
export const apiCache = new SmartCache<any>({
  ttl: 5 * 60 * 1000,
  maxSize: 200,
});
export const imageCache = new SmartCache<string>({
  ttl: 30 * 60 * 1000,
  maxSize: 500,
});
export const cacheMemoryManager = new CacheMemoryManager(1000);

// Register caches with memory manager
cacheMemoryManager.register('api', apiCache);
cacheMemoryManager.register('image', imageCache);
