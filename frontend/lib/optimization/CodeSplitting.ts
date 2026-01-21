/**
 * Code Splitting and Bundle Optimization
 * Handles route-based splitting and component lazy loading
 */

import React, { lazy, ComponentType } from 'react';

interface CodeSplitOptions {
  preload?: boolean;
  retry?: number;
  timeout?: number;
}

class CodeSplitting {
  private loadedChunks: Set<string> = new Set();
  private preloadedChunks: Set<string> = new Set();
  private chunkErrors: Map<string, number> = new Map();

  /**
   * Lazy load component with retry logic
   */
  lazyLoad<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    chunkName: string,
    options: CodeSplitOptions = {}
  ): React.LazyExoticComponent<T> {
    const { retry = 3, timeout = 10000 } = options;

    return lazy(() => this.loadWithRetry(importFn, chunkName, retry, timeout));
  }

  /**
   * Load chunk with retry logic
   */
  private async loadWithRetry<T>(
    importFn: () => Promise<{ default: T }>,
    chunkName: string,
    retries: number,
    timeout: number
  ): Promise<{ default: T }> {
    const errors = this.chunkErrors.get(chunkName) || 0;

    try {
      const result = await Promise.race([
        importFn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Chunk load timeout')), timeout)
        ),
      ]);

      this.loadedChunks.add(chunkName);
      this.chunkErrors.delete(chunkName);
      return result;
    } catch (error) {
      this.chunkErrors.set(chunkName, errors + 1);

      if (retries > 0) {
        console.warn(`Retrying chunk load: ${chunkName} (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.loadWithRetry(importFn, chunkName, retries - 1, timeout);
      }

      throw error;
    }
  }

  /**
   * Preload component
   */
  async preload(
    importFn: () => Promise<any>,
    chunkName: string
  ): Promise<void> {
    if (this.preloadedChunks.has(chunkName)) return;

    try {
      await importFn();
      this.preloadedChunks.add(chunkName);
    } catch (error) {
      console.error(`Failed to preload chunk: ${chunkName}`, error);
    }
  }

  /**
   * Preload route
   */
  preloadRoute(route: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  }

  /**
   * Get bundle statistics
   */
  getStats() {
    return {
      loaded: this.loadedChunks.size,
      preloaded: this.preloadedChunks.size,
      errors: this.chunkErrors.size,
      chunks: Array.from(this.loadedChunks),
    };
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.loadedChunks.clear();
    this.preloadedChunks.clear();
    this.chunkErrors.clear();
  }
}

// Export singleton
export const codeSplitting = new CodeSplitting();

// Route-based code splitting helper
export function createRouteLoader(routes: Record<string, () => Promise<any>>) {
  const loaders: Record<string, React.LazyExoticComponent<any>> = {};

  Object.entries(routes).forEach(([path, importFn]) => {
    loaders[path] = codeSplitting.lazyLoad(importFn, `route-${path}`);
  });

  return loaders;
}

// Component lazy loading with preload
export function lazyWithPreload<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  chunkName: string
) {
  const LazyComponent = codeSplitting.lazyLoad(importFn, chunkName);

  return {
    Component: LazyComponent,
    preload: () => codeSplitting.preload(importFn, chunkName),
  };
}

// Dynamic import with error boundary
export function dynamicImport<T>(
  importFn: () => Promise<T>,
  options: { onError?: (error: Error) => void } = {}
): Promise<T> {
  return importFn().catch((error) => {
    options.onError?.(error);
    throw error;
  });
}

// Webpack magic comments helper
export function createChunkName(name: string): string {
  return `/* webpackChunkName: "${name}" */`;
}

// Bundle size analyzer
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return null;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  return {
    scripts: scripts.map((s) => ({
      src: (s as HTMLScriptElement).src,
      async: (s as HTMLScriptElement).async,
      defer: (s as HTMLScriptElement).defer,
    })),
    styles: styles.map((s) => ({
      href: (s as HTMLLinkElement).href,
    })),
    total: scripts.length + styles.length,
  };
}

// React Suspense wrapper with fallback
export function SuspenseWrapper({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <React.Suspense
      fallback={
        fallback || (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        )
      }
    >
      {children}
    </React.Suspense>
  );
}
