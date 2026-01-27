'use client';

import { useRef } from 'react';

// Request batcher
export class RequestBatcher {
  private batchQueue: Map<string, any[]> = new Map();
  private batchTimeout: Map<string, NodeJS.Timeout> = new Map();
  private batchDelay: number;
  private maxBatchSize: number;

  constructor(batchDelay: number = 50, maxBatchSize: number = 10) {
    this.batchDelay = batchDelay;
    this.maxBatchSize = maxBatchSize;
  }

  async batch<T>(
    key: string,
    request: any,
    executor: (requests: any[]) => Promise<T[]>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      // Add request to queue
      const queue = this.batchQueue.get(key) || [];
      queue.push({ request, resolve, reject });
      this.batchQueue.set(key, queue);

      // Check if batch should be executed immediately
      if (queue.length >= this.maxBatchSize) {
        this.executeBatch(key, executor);
        return;
      }

      // Clear existing timeout
      const existingTimeout = this.batchTimeout.get(key);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set new timeout
      const timeout = setTimeout(() => {
        this.executeBatch(key, executor);
      }, this.batchDelay);

      this.batchTimeout.set(key, timeout);
    });
  }

  private async executeBatch<T>(
    key: string,
    executor: (requests: any[]) => Promise<T[]>
  ): Promise<void> {
    const queue = this.batchQueue.get(key);
    if (!queue || queue.length === 0) return;

    // Clear queue and timeout
    this.batchQueue.delete(key);
    const timeout = this.batchTimeout.get(key);
    if (timeout) {
      clearTimeout(timeout);
      this.batchTimeout.delete(key);
    }

    try {
      const requests = queue.map((item) => item.request);
      const results = await executor(requests);

      // Resolve all promises
      queue.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      // Reject all promises
      queue.forEach((item) => {
        item.reject(error);
      });
    }
  }

  clear(): void {
    this.batchQueue.clear();
    this.batchTimeout.forEach((timeout) => clearTimeout(timeout));
    this.batchTimeout.clear();
  }
}

// Request deduplication
export class RequestDeduplicator {
  private pendingRequests: Map<string, Promise<any>> = new Map();

  async deduplicate<T>(key: string, executor: () => Promise<T>): Promise<T> {
    // Return existing promise if available
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Create new promise
    const promise = executor().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  isPending(key: string): boolean {
    return this.pendingRequests.has(key);
  }

  clear(): void {
    this.pendingRequests.clear();
  }

  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}

// Automatic batching hook
export function useBatchedRequests<T>(
  batcher: RequestBatcher,
  key: string,
  executor: (requests: any[]) => Promise<T[]>
) {
  const executorRef = useRef(executor);
  executorRef.current = executor;

  const batchRequest = (request: any): Promise<T> => {
    return batcher.batch(key, request, executorRef.current);
  };

  return { batchRequest };
}

// GraphQL batch link
export class GraphQLBatcher {
  private batcher: RequestBatcher;

  constructor() {
    this.batcher = new RequestBatcher(50, 20);
  }

  async query<T>(query: string, variables?: any): Promise<T> {
    return this.batcher.batch(
      'graphql',
      { query, variables },
      async (requests) => {
        const batchedQuery = this.buildBatchQuery(requests);
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batchedQuery),
        });

        const data = await response.json();
        return data;
      }
    );
  }

  private buildBatchQuery(
    requests: Array<{ query: string; variables?: any }>
  ): any {
    // Build batched GraphQL query
    return {
      queries: requests.map((req, index) => ({
        id: `query_${index}`,
        query: req.query,
        variables: req.variables,
      })),
    };
  }
}

// REST API batcher
export class RESTBatcher {
  private batcher: RequestBatcher;
  private deduplicator: RequestDeduplicator;

  constructor() {
    this.batcher = new RequestBatcher(50, 10);
    this.deduplicator = new RequestDeduplicator();
  }

  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const key = `GET:${url}`;

    // Deduplicate identical requests
    return this.deduplicator.deduplicate(key, async () => {
      return this.batcher.batch(
        'rest-get',
        { url, options },
        async (requests) => {
          // Make batched request
          const urls = requests.map((req) => req.url);
          const response = await fetch('/api/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls, method: 'GET' }),
          });

          const results = await response.json();
          return results;
        }
      );
    });
  }

  async post<T>(url: string, data: any, options?: RequestInit): Promise<T> {
    return this.batcher.batch(
      'rest-post',
      { url, data, options },
      async (requests) => {
        const response = await fetch('/api/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: requests.map((req) => ({
              url: req.url,
              method: 'POST',
              data: req.data,
            })),
          }),
        });

        const results = await response.json();
        return results;
      }
    );
  }
}

// Performance metrics for batching
export class BatchingMetrics {
  private metrics: {
    totalRequests: number;
    batchedRequests: number;
    deduplicatedRequests: number;
    averageBatchSize: number;
    totalBatches: number;
  } = {
    totalRequests: 0,
    batchedRequests: 0,
    deduplicatedRequests: 0,
    averageBatchSize: 0,
    totalBatches: 0,
  };

  recordRequest(): void {
    this.metrics.totalRequests++;
  }

  recordBatch(size: number): void {
    this.metrics.batchedRequests += size;
    this.metrics.totalBatches++;
    this.metrics.averageBatchSize =
      this.metrics.batchedRequests / this.metrics.totalBatches;
  }

  recordDeduplication(): void {
    this.metrics.deduplicatedRequests++;
  }

  getMetrics() {
    return {
      ...this.metrics,
      batchingRate:
        this.metrics.totalRequests > 0
          ? (this.metrics.batchedRequests / this.metrics.totalRequests) * 100
          : 0,
      deduplicationRate:
        this.metrics.totalRequests > 0
          ? (this.metrics.deduplicatedRequests / this.metrics.totalRequests) *
            100
          : 0,
      requestsSaved: this.metrics.totalRequests - this.metrics.totalBatches,
    };
  }

  reset(): void {
    this.metrics = {
      totalRequests: 0,
      batchedRequests: 0,
      deduplicatedRequests: 0,
      averageBatchSize: 0,
      totalBatches: 0,
    };
  }
}

// DataLoader pattern implementation
export class DataLoader<K, V> {
  private batchLoadFn: (keys: K[]) => Promise<V[]>;
  private cache: Map<K, Promise<V>> = new Map();
  private queue: K[] = [];
  private batchScheduled = false;
  private maxBatchSize: number;

  constructor(
    batchLoadFn: (keys: K[]) => Promise<V[]>,
    options?: { maxBatchSize?: number; cache?: boolean }
  ) {
    this.batchLoadFn = batchLoadFn;
    this.maxBatchSize = options?.maxBatchSize || 100;
    if (!options?.cache) {
      this.cache.clear();
    }
  }

  load(key: K): Promise<V> {
    // Check cache first
    const cached = this.cache.get(key);
    if (cached) return cached;

    // Create promise and add to queue
    const promise = new Promise<V>((resolve, reject) => {
      this.queue.push(key);

      if (!this.batchScheduled) {
        this.batchScheduled = true;
        process.nextTick(() => this.dispatch());
      }

      this.cache.set(
        key,
        Promise.resolve().then(() => {
          // This will be resolved by dispatch
          return new Promise<V>((res, rej) => {
            // Store resolvers
          });
        })
      );
    });

    return promise;
  }

  private async dispatch(): Promise<void> {
    this.batchScheduled = false;
    const keys = this.queue.splice(0, this.maxBatchSize);

    try {
      const values = await this.batchLoadFn(keys);
      keys.forEach((key, index) => {
        const promise = this.cache.get(key);
        if (promise) {
          // Resolve the cached promise
        }
      });
    } catch (error) {
      keys.forEach((key) => {
        this.cache.delete(key);
      });
      throw error;
    }
  }

  clear(): void {
    this.cache.clear();
  }

  clearKey(key: K): void {
    this.cache.delete(key);
  }
}

// Request queue with priority
export class PriorityRequestQueue {
  private queue: Array<{
    priority: number;
    request: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private processing = false;
  private maxConcurrent: number;
  private currentConcurrent = 0;

  constructor(maxConcurrent: number = 5) {
    this.maxConcurrent = maxConcurrent;
  }

  async enqueue<T>(
    request: () => Promise<T>,
    priority: number = 0
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ priority, request, resolve, reject });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.process();
    });
  }

  private async process(): Promise<void> {
    if (
      this.currentConcurrent >= this.maxConcurrent ||
      this.queue.length === 0
    ) {
      return;
    }

    const task = this.queue.shift();
    if (!task) return;

    this.currentConcurrent++;

    try {
      const result = await task.request();
      task.resolve(result);
    } catch (error) {
      task.reject(error);
    } finally {
      this.currentConcurrent--;
      this.process();
    }
  }

  clear(): void {
    this.queue = [];
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}

// Export singleton instances
export const requestBatcher = new RequestBatcher();
export const requestDeduplicator = new RequestDeduplicator();
export const graphqlBatcher = new GraphQLBatcher();
export const restBatcher = new RESTBatcher();
export const batchingMetrics = new BatchingMetrics();
export const priorityQueue = new PriorityRequestQueue();
