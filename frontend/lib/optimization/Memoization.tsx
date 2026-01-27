'use client';

import { memo, ReactNode, useCallback, useMemo } from 'react';

// Smart memoization utility
export class MemoizationCache<T> {
  private cache: Map<string, { value: T; timestamp: number }> = new Map();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize: number = 100, ttl: number = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  memoize(key: string, fn: () => T): T {
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached value if valid
    if (cached && now - cached.timestamp < this.ttl) {
      return cached.value;
    }

    // Compute new value
    const value = fn();

    // Enforce max size
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, { value, timestamp: now });
    return value;
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

  clear(): void {
    this.cache.clear();
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  getSize(): number {
    return this.cache.size;
  }
}

// Expensive computation memoizer
export function memoizeExpensive<T>(
  fn: (...args: any[]) => T,
  options?: { maxSize?: number; ttl?: number }
): (...args: any[]) => T {
  const cache = new MemoizationCache<T>(
    options?.maxSize || 100,
    options?.ttl || 5 * 60 * 1000
  );

  return (...args: any[]) => {
    const key = JSON.stringify(args);
    return cache.memoize(key, () => fn(...args));
  };
}

// React.memo with custom comparison
export function memoComponent<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) {
  return memo(Component, propsAreEqual);
}

// Custom useMemo with dependencies tracking
export function useSmartMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  options?: {
    name?: string;
    debug?: boolean;
  }
): T {
  if (options?.debug) {
    console.log(`[useSmartMemo:${options.name}] Computing...`);
  }

  return useMemo(() => {
    const startTime = performance.now();
    const result = factory();
    const endTime = performance.now();

    if (options?.debug) {
      console.log(
        `[useSmartMemo:${options.name}] Computed in ${endTime - startTime}ms`
      );
    }

    return result;
  }, deps);
}

// Custom useCallback with performance tracking
export function useSmartCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  options?: {
    name?: string;
    debug?: boolean;
  }
): T {
  return useCallback((...args: any[]) => {
    if (options?.debug) {
      const startTime = performance.now();
      const result = callback(...args);
      const endTime = performance.now();
      console.log(
        `[useSmartCallback:${options.name}] Executed in ${
          endTime - startTime
        }ms`
      );
      return result;
    }
    return callback(...args);
  }, deps) as T;
}

// Fibonacci with memoization
const fibCache = new Map<number, number>();

export function fibonacci(n: number): number {
  if (n <= 1) return n;

  if (fibCache.has(n)) {
    return fibCache.get(n)!;
  }

  const result = fibonacci(n - 1) + fibonacci(n - 2);
  fibCache.set(n, result);
  return result;
}

// LRU memoization
export class LRUMemoizer<T> {
  private cache: Map<string, T>;
  private capacity: number;

  constructor(capacity: number = 50) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  memoize(key: string, fn: () => T): T {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)!;
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }

    const value = fn();

    if (this.cache.size >= this.capacity) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
    return value;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Memoization with weak references
export class WeakMemoizer<K extends object, V> {
  private cache: WeakMap<K, V> = new WeakMap();

  memoize(key: K, fn: () => V): V {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const value = fn();
    this.cache.set(key, value);
    return value;
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }
}

// Shallow equal comparison
export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
  if (obj1 === null || obj2 === null) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}

// Deep equal comparison with memoization
const deepEqualCache = new Map<string, boolean>();

export function deepEqual(obj1: any, obj2: any): boolean {
  const key = `${JSON.stringify(obj1)}_${JSON.stringify(obj2)}`;

  if (deepEqualCache.has(key)) {
    return deepEqualCache.get(key)!;
  }

  const result = JSON.stringify(obj1) === JSON.stringify(obj2);
  deepEqualCache.set(key, result);
  return result;
}

// Memoized selector
export function createSelector<T, R>(
  selector: (state: T) => R,
  equalityFn: (a: R, b: R) => boolean = shallowEqual
): (state: T) => R {
  let lastState: T | undefined;
  let lastResult: R | undefined;

  return (state: T): R => {
    if (lastState === state) {
      return lastResult!;
    }

    const result = selector(state);

    if (lastResult !== undefined && equalityFn(result, lastResult)) {
      return lastResult;
    }

    lastState = state;
    lastResult = result;
    return result;
  };
}

// Memoization performance monitor
export class MemoizationMonitor {
  private stats: Map<
    string,
    {
      hits: number;
      misses: number;
      computeTime: number;
    }
  > = new Map();

  recordHit(key: string): void {
    const stat = this.stats.get(key) || { hits: 0, misses: 0, computeTime: 0 };
    stat.hits++;
    this.stats.set(key, stat);
  }

  recordMiss(key: string, computeTime: number): void {
    const stat = this.stats.get(key) || { hits: 0, misses: 0, computeTime: 0 };
    stat.misses++;
    stat.computeTime += computeTime;
    this.stats.set(key, stat);
  }

  getStats(key: string) {
    const stat = this.stats.get(key);
    if (!stat) return null;

    const total = stat.hits + stat.misses;
    return {
      ...stat,
      total,
      hitRate: total > 0 ? (stat.hits / total) * 100 : 0,
      averageComputeTime: stat.misses > 0 ? stat.computeTime / stat.misses : 0,
    };
  }

  getAllStats() {
    return Array.from(this.stats.entries()).map(([key, stat]) => ({
      key,
      ...this.getStats(key),
    }));
  }

  reset(): void {
    this.stats.clear();
  }
}

// Memoized component wrapper
export function withMemoization<P extends object>(
  Component: React.ComponentType<P>,
  displayName?: string
) {
  const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
    return shallowEqual(prevProps, nextProps);
  });

  if (displayName) {
    MemoizedComponent.displayName = `Memoized(${displayName})`;
  }

  return MemoizedComponent;
}

// Expensive list renderer with memoization
export const MemoizedList = memo(
  ({
    items,
    renderItem,
  }: {
    items: any[];
    renderItem: (item: any) => ReactNode;
  }) => {
    return (
      <>
        {items.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.items.length === nextProps.items.length &&
      prevProps.items.every((item, index) => item === nextProps.items[index])
    );
  }
);

// Cache strategies
export const CacheStrategies = {
  // Time-based invalidation
  timeBasedInvalidation: (ttl: number) => {
    const cache = new Map<string, { value: any; expires: number }>();

    return {
      get: (key: string) => {
        const entry = cache.get(key);
        if (!entry) return undefined;
        if (Date.now() > entry.expires) {
          cache.delete(key);
          return undefined;
        }
        return entry.value;
      },
      set: (key: string, value: any) => {
        cache.set(key, { value, expires: Date.now() + ttl });
      },
    };
  },

  // Access-based invalidation (LRU)
  lruInvalidation: (maxSize: number) => {
    const cache = new Map<string, any>();

    return {
      get: (key: string) => {
        if (!cache.has(key)) return undefined;
        const value = cache.get(key);
        cache.delete(key);
        cache.set(key, value);
        return value;
      },
      set: (key: string, value: any) => {
        if (cache.size >= maxSize) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
        cache.set(key, value);
      },
    };
  },
};

// Export singleton instances
export const globalMemoCache = new MemoizationCache<any>();
export const lruMemoizer = new LRUMemoizer<any>();
export const memoMonitor = new MemoizationMonitor();
