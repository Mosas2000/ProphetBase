'use client';

import { useEffect, useRef, useState } from 'react';

// Web Worker manager
export class WebWorkerManager {
  private workers: Map<string, Worker> = new Map();
  private availableWorkers: Worker[] = [];
  private poolSize: number;

  constructor(poolSize: number = 4) {
    this.poolSize = poolSize;
  }

  createWorker(name: string, workerUrl: string): Worker {
    if (this.workers.has(name)) {
      return this.workers.get(name)!;
    }

    const worker = new Worker(workerUrl);
    this.workers.set(name, worker);
    return worker;
  }

  terminateWorker(name: string): void {
    const worker = this.workers.get(name);
    if (worker) {
      worker.terminate();
      this.workers.delete(name);
    }
  }

  terminateAll(): void {
    this.workers.forEach((worker) => worker.terminate());
    this.workers.clear();
    this.availableWorkers = [];
  }

  getWorker(name: string): Worker | undefined {
    return this.workers.get(name);
  }
}

// Worker pool for heavy computations
export class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{
    data: any;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private busyWorkers: Set<Worker> = new Set();

  constructor(workerUrl: string, size: number = navigator.hardwareConcurrency || 4) {
    for (let i = 0; i < size; i++) {
      const worker = new Worker(workerUrl);
      this.workers.push(worker);
      this.setupWorker(worker);
    }
  }

  private setupWorker(worker: Worker): void {
    worker.onmessage = (e) => {
      this.busyWorkers.delete(worker);
      this.processQueue();
    };

    worker.onerror = (error) => {
      console.error('Worker error:', error);
      this.busyWorkers.delete(worker);
      this.processQueue();
    };
  }

  execute<T>(data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      this.processQueue();
    });
  }

  private processQueue(): void {
    if (this.queue.length === 0) return;

    const availableWorker = this.workers.find((w) => !this.busyWorkers.has(w));
    if (!availableWorker) return;

    const task = this.queue.shift();
    if (!task) return;

    this.busyWorkers.add(availableWorker);

    availableWorker.onmessage = (e) => {
      task.resolve(e.data);
      this.busyWorkers.delete(availableWorker);
      this.processQueue();
    };

    availableWorker.onerror = (error) => {
      task.reject(error);
      this.busyWorkers.delete(availableWorker);
      this.processQueue();
    };

    availableWorker.postMessage(task.data);
  }

  terminate(): void {
    this.workers.forEach((worker) => worker.terminate());
    this.workers = [];
    this.queue = [];
    this.busyWorkers.clear();
  }

  getStats() {
    return {
      totalWorkers: this.workers.length,
      busyWorkers: this.busyWorkers.size,
      queuedTasks: this.queue.length,
      utilization: (this.busyWorkers.size / this.workers.length) * 100,
    };
  }
}

// Heavy calculation worker
export const heavyCalculationWorker = `
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch(type) {
    case 'fibonacci':
      const result = fibonacci(data.n);
      self.postMessage({ type, result });
      break;
    
    case 'primeFactors':
      const factors = primeFactors(data.n);
      self.postMessage({ type, result: factors });
      break;
    
    case 'sort':
      const sorted = data.array.sort((a, b) => a - b);
      self.postMessage({ type, result: sorted });
      break;
    
    default:
      self.postMessage({ type: 'error', error: 'Unknown operation' });
  }
};

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function primeFactors(n) {
  const factors = [];
  let divisor = 2;
  
  while (n >= 2) {
    if (n % divisor === 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  
  return factors;
}
`;

// Data parsing worker
export const dataParsingWorker = `
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch(type) {
    case 'parseJSON':
      try {
        const parsed = JSON.parse(data);
        self.postMessage({ type, result: parsed });
      } catch (error) {
        self.postMessage({ type: 'error', error: error.message });
      }
      break;
    
    case 'parseCSV':
      const rows = data.split('\\n').map(row => row.split(','));
      self.postMessage({ type, result: rows });
      break;
    
    case 'processLargeArray':
      const processed = data.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now()
      }));
      self.postMessage({ type, result: processed });
      break;
    
    default:
      self.postMessage({ type: 'error', error: 'Unknown operation' });
  }
};
`;

// React hook for web workers
export function useWebWorker<T>(workerUrl: string) {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    workerRef.current = new Worker(workerUrl);
    setIsReady(true);

    return () => {
      workerRef.current?.terminate();
    };
  }, [workerUrl]);

  const execute = (data: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      workerRef.current.onmessage = (e) => resolve(e.data);
      workerRef.current.onerror = (error) => reject(error);
      workerRef.current.postMessage(data);
    });
  };

  return { execute, isReady };
}

// Shared worker for cross-tab communication
export class SharedWorkerManager {
  private sharedWorker: SharedWorker | null = null;

  constructor(workerUrl: string) {
    if (typeof SharedWorker !== 'undefined') {
      this.sharedWorker = new SharedWorker(workerUrl);
      this.sharedWorker.port.start();
    }
  }

  postMessage(data: any): void {
    if (this.sharedWorker) {
      this.sharedWorker.port.postMessage(data);
    }
  }

  onMessage(callback: (data: any) => void): void {
    if (this.sharedWorker) {
      this.sharedWorker.port.onmessage = (e) => callback(e.data);
    }
  }

  close(): void {
    if (this.sharedWorker) {
      this.sharedWorker.port.close();
    }
  }
}

// Thread communication helper
export class ThreadCommunicator {
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  registerHandler(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  handleMessage(event: MessageEvent): void {
    const { type, data } = event.data;
    const handler = this.messageHandlers.get(type);
    if (handler) {
      handler(data);
    }
  }

  sendMessage(worker: Worker, type: string, data: any): void {
    worker.postMessage({ type, data });
  }
}

// Worker task scheduler
export class WorkerScheduler {
  private tasks: Array<{
    id: string;
    priority: number;
    worker: Worker;
    data: any;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private processing = false;

  addTask(
    id: string,
    worker: Worker,
    data: any,
    priority: number = 0
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tasks.push({ id, priority, worker, data, resolve, reject });
      this.tasks.sort((a, b) => b.priority - a.priority);
      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.processing || this.tasks.length === 0) return;
    this.processing = true;

    while (this.tasks.length > 0) {
      const task = this.tasks.shift();
      if (!task) continue;

      try {
        const result = await this.executeTask(task.worker, task.data);
        task.resolve(result);
      } catch (error) {
        task.reject(error);
      }
    }

    this.processing = false;
  }

  private executeTask(worker: Worker, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      worker.onmessage = (e) => resolve(e.data);
      worker.onerror = (error) => reject(error);
      worker.postMessage(data);
    });
  }

  cancelTask(id: string): void {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }

  getPendingTasks(): string[] {
    return this.tasks.map((task) => task.id);
  }
}

// Performance monitoring for workers
export class WorkerPerformanceMonitor {
  private metrics: Map<
    string,
    {
      executionCount: number;
      totalTime: number;
      averageTime: number;
      errors: number;
    }
  > = new Map();

  recordExecution(workerName: string, executionTime: number): void {
    const metric = this.metrics.get(workerName) || {
      executionCount: 0,
      totalTime: 0,
      averageTime: 0,
      errors: 0,
    };

    metric.executionCount++;
    metric.totalTime += executionTime;
    metric.averageTime = metric.totalTime / metric.executionCount;

    this.metrics.set(workerName, metric);
  }

  recordError(workerName: string): void {
    const metric = this.metrics.get(workerName);
    if (metric) {
      metric.errors++;
    }
  }

  getMetrics(workerName: string) {
    return this.metrics.get(workerName);
  }

  getAllMetrics() {
    return Array.from(this.metrics.entries()).map(([name, metric]) => ({
      name,
      ...metric,
    }));
  }

  reset(): void {
    this.metrics.clear();
  }
}

// Create worker from function
export function createWorkerFromFunction(fn: Function): Worker {
  const blob = new Blob([`(${fn.toString()})()`], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

// Export singleton instances
export const workerManager = new WebWorkerManager();
export const workerScheduler = new WorkerScheduler();
export const workerMonitor = new WorkerPerformanceMonitor();
