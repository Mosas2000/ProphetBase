'use client';

import { lazy } from 'react';

// Code splitting configuration
export interface SplitConfig {
  chunkName?: string;
  preload?: boolean;
  prefetch?: boolean;
}

// Dynamic chunk loader
export class ChunkLoader {
  private loadedChunks: Set<string> = new Set();
  private loadingChunks: Map<string, Promise<any>> = new Map();

  async loadChunk(
    chunkName: string,
    importFn: () => Promise<any>
  ): Promise<any> {
    // Return if already loaded
    if (this.loadedChunks.has(chunkName)) {
      return Promise.resolve();
    }

    // Return existing promise if currently loading
    if (this.loadingChunks.has(chunkName)) {
      return this.loadingChunks.get(chunkName);
    }

    // Start loading
    const loadPromise = importFn().then((module) => {
      this.loadedChunks.add(chunkName);
      this.loadingChunks.delete(chunkName);
      return module;
    });

    this.loadingChunks.set(chunkName, loadPromise);
    return loadPromise;
  }

  isLoaded(chunkName: string): boolean {
    return this.loadedChunks.has(chunkName);
  }

  isLoading(chunkName: string): boolean {
    return this.loadingChunks.has(chunkName);
  }

  getLoadedChunks(): string[] {
    return Array.from(this.loadedChunks);
  }
}

// Vendor splitting utility
export const vendorChunks = {
  react: () => import('react'),
  reactDom: () => import('react-dom'),
  // Add more vendor splits as needed
};

// Feature-based splitting
export const featureChunks = {
  charts: () => import('@/components/charts'),
  game: () => import('@/components/game'),
  market: () => import('@/components/market'),
  // Add more feature splits
};

// Route-based splitting
export function createRouteSplit(route: string, config?: SplitConfig) {
  const importFn = () => {
    switch (route) {
      case '/market':
        return import('@/app/market/page');
      case '/admin':
        return import('@/app/admin/page');
      case '/profile':
        return import('@/app/profile/page');
      default:
        return Promise.reject(new Error(`Unknown route: ${route}`));
    }
  };

  const LazyComponent = lazy(importFn);

  // Preload if specified
  if (config?.preload) {
    importFn();
  }

  // Add prefetch hint
  if (config?.prefetch) {
    addPrefetchHint(route);
  }

  return LazyComponent;
}

// Add prefetch/preload hints
function addPrefetchHint(href: string) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

function addPreloadHint(href: string, as: string = 'script') {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

// Bundle analyzer utilities
export class BundleAnalyzer {
  private chunks: Map<
    string,
    {
      size: number;
      loadTime: number;
      dependencies: string[];
    }
  > = new Map();

  recordChunk(
    name: string,
    size: number,
    loadTime: number,
    deps: string[] = []
  ) {
    this.chunks.set(name, {
      size,
      loadTime,
      dependencies: deps,
    });
  }

  getChunkInfo(name: string) {
    return this.chunks.get(name);
  }

  getTotalSize(): number {
    let total = 0;
    this.chunks.forEach((chunk) => {
      total += chunk.size;
    });
    return total;
  }

  getAverageLoadTime(): number {
    if (this.chunks.size === 0) return 0;
    let total = 0;
    this.chunks.forEach((chunk) => {
      total += chunk.loadTime;
    });
    return total / this.chunks.size;
  }

  getLargestChunks(count: number = 5) {
    return Array.from(this.chunks.entries())
      .sort((a, b) => b[1].size - a[1].size)
      .slice(0, count)
      .map(([name, info]) => ({ name, ...info }));
  }

  getSlowestChunks(count: number = 5) {
    return Array.from(this.chunks.entries())
      .sort((a, b) => b[1].loadTime - a[1].loadTime)
      .slice(0, count)
      .map(([name, info]) => ({ name, ...info }));
  }

  generateReport() {
    return {
      totalChunks: this.chunks.size,
      totalSize: this.getTotalSize(),
      averageLoadTime: this.getAverageLoadTime(),
      largestChunks: this.getLargestChunks(),
      slowestChunks: this.getSlowestChunks(),
    };
  }
}

// Chunk preloader
export class ChunkPreloader {
  private preloadQueue: Array<() => Promise<any>> = [];
  private maxConcurrent: number;
  private currentlyLoading: number = 0;

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  addToQueue(importFn: () => Promise<any>): void {
    this.preloadQueue.push(importFn);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    while (
      this.preloadQueue.length > 0 &&
      this.currentlyLoading < this.maxConcurrent
    ) {
      const importFn = this.preloadQueue.shift();
      if (!importFn) continue;

      this.currentlyLoading++;
      try {
        await importFn();
      } catch (error) {
        console.error('Chunk preload failed:', error);
      } finally {
        this.currentlyLoading--;
      }

      // Continue processing
      if (this.preloadQueue.length > 0) {
        this.processQueue();
      }
    }
  }

  preloadMultiple(importFns: Array<() => Promise<any>>): void {
    importFns.forEach((fn) => this.addToQueue(fn));
  }

  clear(): void {
    this.preloadQueue = [];
  }
}

// Dynamic import with metadata
export async function dynamicImportWithMetadata<T>(
  chunkName: string,
  importFn: () => Promise<T>
): Promise<{ module: T; metadata: { loadTime: number; size?: number } }> {
  const startTime = performance.now();

  try {
    const module = await importFn();
    const loadTime = performance.now() - startTime;

    // Try to get chunk size from performance API
    const entries = performance.getEntriesByType('resource');
    const chunkEntry = entries.find((entry) => entry.name.includes(chunkName));
    const size = chunkEntry ? (chunkEntry as any).transferSize : undefined;

    return {
      module,
      metadata: {
        loadTime,
        size,
      },
    };
  } catch (error) {
    throw new Error(`Failed to load chunk ${chunkName}: ${error}`);
  }
}

// Critical CSS extraction
export function extractCriticalCSS(): string {
  if (typeof document === 'undefined') return '';

  const styles: string[] = [];
  const styleSheets = Array.from(document.styleSheets);

  styleSheets.forEach((sheet) => {
    try {
      const rules = Array.from(sheet.cssRules || []);
      rules.forEach((rule) => {
        // Check if rule applies to above-the-fold content
        if (isRuleCritical(rule)) {
          styles.push(rule.cssText);
        }
      });
    } catch (e) {
      // Cross-origin stylesheets
      console.warn('Cannot access stylesheet:', e);
    }
  });

  return styles.join('\n');
}

function isRuleCritical(rule: CSSRule): boolean {
  // Simplified critical check
  // In production, use a proper critical CSS tool
  return true;
}

// Module federation helper
export class ModuleFederationHelper {
  private remotes: Map<string, string> = new Map();

  registerRemote(name: string, url: string): void {
    this.remotes.set(name, url);
  }

  async loadRemote<T>(name: string, module: string): Promise<T> {
    const remoteUrl = this.remotes.get(name);
    if (!remoteUrl) {
      throw new Error(`Remote ${name} not registered`);
    }

    // Load remote container
    const container = await this.loadRemoteContainer(remoteUrl);
    const factory = await container.get(module);
    return factory();
  }

  private async loadRemoteContainer(url: string): Promise<any> {
    // Simplified implementation
    // In production, use proper module federation setup
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve((window as any)[url]);
      document.head.appendChild(script);
    });
  }
}

// Webpack stats analyzer
export interface WebpackStats {
  chunks: Array<{
    id: string;
    names: string[];
    size: number;
    files: string[];
  }>;
  assets: Array<{
    name: string;
    size: number;
  }>;
  modules: Array<{
    id: string;
    name: string;
    size: number;
  }>;
}

export function analyzeWebpackStats(stats: WebpackStats) {
  const totalSize = stats.assets.reduce((sum, asset) => sum + asset.size, 0);
  const largestAssets = stats.assets
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);
  const largestChunks = stats.chunks
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);

  return {
    totalSize,
    totalAssets: stats.assets.length,
    totalChunks: stats.chunks.length,
    totalModules: stats.modules.length,
    largestAssets,
    largestChunks,
  };
}

// Export singleton instances
export const chunkLoader = new ChunkLoader();
export const bundleAnalyzer = new BundleAnalyzer();
export const chunkPreloader = new ChunkPreloader(3);
export const moduleFederation = new ModuleFederationHelper();
