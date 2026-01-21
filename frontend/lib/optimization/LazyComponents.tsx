/**
 * Lazy Component Loading with Suspense
 * Handles lazy loading of heavy components with prioritization
 */

'use client';

import React, { ComponentType, lazy, Suspense } from 'react';

interface LazyLoadOptions {
  fallback?: React.ReactNode;
  priority?: 'high' | 'low';
  preload?: boolean;
}

// Default loading fallback
const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
  </div>
);

/**
 * Create lazy component with options
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) {
  const LazyComponent = lazy(importFn);
  const { fallback = <DefaultFallback />, preload = false } = options;

  if (preload && typeof window !== 'undefined') {
    // Preload component on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => importFn());
    } else {
      setTimeout(() => importFn(), 1);
    }
  }

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Lazy load heavy components
 */

// Charts
export const LazyChart = createLazyComponent(
  () => import('@/components/Chart'),
  { priority: 'low' }
);

// Market List (heavy with many items)
export const LazyMarketList = createLazyComponent(
  () => import('@/components/MarketList'),
  { priority: 'high', preload: true }
);

// Analytics Dashboard
export const LazyAnalyticsDashboard = createLazyComponent(
  () => import('@/components/AnalyticsDashboard'),
  { priority: 'low' }
);

// Trading Interface
export const LazyTradingInterface = createLazyComponent(
  () => import('@/components/TradingInterface'),
  { priority: 'high', preload: true }
);

/**
 * Suspense boundary with error handling
 */
export function SuspenseBoundary({
  children,
  fallback,
  onError,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}) {
  return (
    <ErrorBoundary onError={onError}>
      <Suspense fallback={fallback || <DefaultFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Error Boundary Component
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <p className="text-red-500 mb-4">Something went wrong loading this component.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Loading prioritization manager
 */
class LoadingPriorityManager {
  private highPriorityQueue: (() => Promise<any>)[] = [];
  private lowPriorityQueue: (() => Promise<any>)[] = [];
  private isProcessing = false;

  addToQueue(importFn: () => Promise<any>, priority: 'high' | 'low' = 'low') {
    if (priority === 'high') {
      this.highPriorityQueue.push(importFn);
    } else {
      this.lowPriorityQueue.push(importFn);
    }

    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;

    while (this.highPriorityQueue.length > 0 || this.lowPriorityQueue.length > 0) {
      const importFn = this.highPriorityQueue.shift() || this.lowPriorityQueue.shift();
      if (importFn) {
        try {
          await importFn();
        } catch (error) {
          console.error('Failed to load component:', error);
        }
      }
    }

    this.isProcessing = false;
  }
}

export const loadingPriorityManager = new LoadingPriorityManager();

/**
 * Hook for lazy loading on visibility
 */
export function useLazyLoad<T>(
  importFn: () => Promise<T>,
  options: { threshold?: number; rootMargin?: string } = {}
) {
  const [component, setComponent] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current || component) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !component && !isLoading) {
          setIsLoading(true);
          importFn().then((mod) => {
            setComponent(mod);
            setIsLoading(false);
          });
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '50px',
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [component, isLoading]);

  return { ref, component, isLoading };
}
