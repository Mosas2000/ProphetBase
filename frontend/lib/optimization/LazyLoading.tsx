'use client';

import { Loader2 } from 'lucide-react';
import {
  ComponentType,
  lazy,
  ReactNode,
  Suspense,
  useEffect,
  useState,
} from 'react';

interface LazyLoadConfig {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactNode;
  priority?: 'high' | 'medium' | 'low';
  preload?: boolean;
  delay?: number;
}

interface RouteConfig {
  path: string;
  component: () => Promise<{ default: ComponentType<any> }>;
  preload?: boolean;
}

// Default loading fallback
const DefaultLoader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  </div>
);

// Lazy load with suspense boundary
export function lazyLoad({
  component,
  fallback = <DefaultLoader />,
  priority = 'medium',
  preload = false,
  delay = 0,
}: LazyLoadConfig) {
  const LazyComponent = lazy(() => {
    if (delay > 0) {
      return new Promise((resolve) => {
        setTimeout(() => {
          component().then(resolve);
        }, delay);
      });
    }
    return component();
  });

  // Preload if specified
  if (preload) {
    component();
  }

  return (props: any) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Route-based code splitting
export class RouteManager {
  private routes: Map<string, LazyLoadConfig> = new Map();
  private preloadedRoutes: Set<string> = new Set();

  registerRoute(path: string, config: LazyLoadConfig) {
    this.routes.set(path, config);
  }

  preloadRoute(path: string) {
    if (this.preloadedRoutes.has(path)) return;

    const config = this.routes.get(path);
    if (config) {
      config.component();
      this.preloadedRoutes.add(path);
    }
  }

  preloadRoutes(paths: string[]) {
    paths.forEach((path) => this.preloadRoute(path));
  }

  getRoute(path: string) {
    const config = this.routes.get(path);
    if (!config) return null;
    return lazyLoad(config);
  }
}

// Priority-based loading
export class LoadingPriorityManager {
  private highPriority: (() => Promise<any>)[] = [];
  private mediumPriority: (() => Promise<any>)[] = [];
  private lowPriority: (() => Promise<any>)[] = [];
  private loading = false;

  addTask(
    task: () => Promise<any>,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ) {
    switch (priority) {
      case 'high':
        this.highPriority.push(task);
        break;
      case 'medium':
        this.mediumPriority.push(task);
        break;
      case 'low':
        this.lowPriority.push(task);
        break;
    }
    this.process();
  }

  private async process() {
    if (this.loading) return;
    this.loading = true;

    // Process high priority first
    while (this.highPriority.length > 0) {
      const task = this.highPriority.shift();
      if (task) await task();
    }

    // Then medium priority
    while (this.mediumPriority.length > 0) {
      const task = this.mediumPriority.shift();
      if (task) await task();
    }

    // Finally low priority
    while (this.lowPriority.length > 0) {
      const task = this.lowPriority.shift();
      if (task) await task();
    }

    this.loading = false;
  }
}

// Dynamic import with retry
export async function dynamicImportWithRetry<T>(
  importFn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await importFn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return dynamicImportWithRetry(importFn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Intersection Observer lazy loading
export function useLazyLoad(
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, options]);

  return isVisible;
}

// Preload on hover
export function usePreloadOnHover(importFn: () => Promise<any>) {
  const [preloaded, setPreloaded] = useState(false);

  const handleMouseEnter = () => {
    if (!preloaded) {
      importFn();
      setPreloaded(true);
    }
  };

  return { onMouseEnter: handleMouseEnter };
}

// Component with suspense boundary
export function WithSuspense({
  children,
  fallback = <DefaultLoader />,
  errorBoundary = false,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  errorBoundary?: boolean;
}) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

// Route preloader component
export function RoutePreloader({ routes }: { routes: string[] }) {
  const routeManager = new RouteManager();

  useEffect(() => {
    // Preload routes after a delay
    const timer = setTimeout(() => {
      routeManager.preloadRoutes(routes);
    }, 2000);

    return () => clearTimeout(timer);
  }, [routes]);

  return null;
}

// Example usage and utilities
export const LazyLoadingUtils = {
  // Create lazy loaded component
  createLazy: (importFn: () => Promise<{ default: ComponentType<any> }>) => {
    return lazyLoad({ component: importFn });
  },

  // Create lazy loaded component with custom fallback
  createLazyWithFallback: (
    importFn: () => Promise<{ default: ComponentType<any> }>,
    fallback: ReactNode
  ) => {
    return lazyLoad({ component: importFn, fallback });
  },

  // Preload component
  preload: (importFn: () => Promise<any>) => {
    importFn();
  },

  // Preload multiple components
  preloadMultiple: (importFns: (() => Promise<any>)[]) => {
    importFns.forEach((fn) => fn());
  },
};

// Performance monitoring
export class LazyLoadMonitor {
  private metrics: Map<
    string,
    {
      loadTime: number;
      renderTime: number;
      size?: number;
    }
  > = new Map();

  recordLoad(componentName: string, startTime: number) {
    const loadTime = performance.now() - startTime;
    this.metrics.set(componentName, {
      loadTime,
      renderTime: 0,
    });
  }

  recordRender(componentName: string, startTime: number) {
    const metric = this.metrics.get(componentName);
    if (metric) {
      metric.renderTime = performance.now() - startTime;
    }
  }

  getMetrics() {
    return Array.from(this.metrics.entries()).map(([name, metric]) => ({
      name,
      ...metric,
    }));
  }

  getAverageLoadTime() {
    const metrics = Array.from(this.metrics.values());
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length;
  }
}

// Export singleton instances
export const routeManager = new RouteManager();
export const priorityManager = new LoadingPriorityManager();
export const lazyLoadMonitor = new LazyLoadMonitor();
