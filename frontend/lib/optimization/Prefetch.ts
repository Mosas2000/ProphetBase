/**
 * Intelligent Prefetching System
 * Handles hover prefetch, priority hints, and smart resource loading
 */

interface PrefetchOptions {
  priority?: 'high' | 'low' | 'auto';
  as?: 'script' | 'style' | 'image' | 'fetch';
  crossOrigin?: 'anonymous' | 'use-credentials';
  timeout?: number;
}

class Prefetch {
  private prefetchedUrls: Set<string> = new Set();
  private hoverTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.initViewportObserver();
  }

  /**
   * Prefetch resource
   */
  prefetch(url: string, options: PrefetchOptions = {}): void {
    if (this.prefetchedUrls.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;

    if (options.as) link.as = options.as;
    if (options.crossOrigin) link.crossOrigin = options.crossOrigin;
    if (options.priority) {
      link.setAttribute('importance', options.priority);
    }

    document.head.appendChild(link);
    this.prefetchedUrls.add(url);
  }

  /**
   * Preload resource (higher priority than prefetch)
   */
  preload(url: string, options: PrefetchOptions = {}): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;

    if (options.as) link.as = options.as;
    if (options.crossOrigin) link.crossOrigin = options.crossOrigin;

    document.head.appendChild(link);
  }

  /**
   * Prefetch on hover with delay
   */
  prefetchOnHover(
    element: HTMLElement,
    url: string,
    delay: number = 200
  ): () => void {
    const handleMouseEnter = () => {
      const timeout = setTimeout(() => {
        this.prefetch(url, { priority: 'high' });
      }, delay);

      this.hoverTimeouts.set(url, timeout);
    };

    const handleMouseLeave = () => {
      const timeout = this.hoverTimeouts.get(url);
      if (timeout) {
        clearTimeout(timeout);
        this.hoverTimeouts.delete(url);
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // Return cleanup function
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      const timeout = this.hoverTimeouts.get(url);
      if (timeout) clearTimeout(timeout);
    };
  }

  /**
   * Prefetch when element enters viewport
   */
  prefetchOnVisible(element: HTMLElement, url: string): void {
    if (!this.observer) return;

    element.dataset.prefetchUrl = url;
    this.observer.observe(element);
  }

  /**
   * Initialize viewport observer for prefetching
   */
  private initViewportObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const url = (entry.target as HTMLElement).dataset.prefetchUrl;
            if (url) {
              this.prefetch(url, { priority: 'low' });
              this.observer?.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: '200px',
        threshold: 0,
      }
    );
  }

  /**
   * Prefetch critical resources
   */
  prefetchCritical(urls: string[]): void {
    urls.forEach((url) => this.preload(url, { priority: 'high' }));
  }

  /**
   * Prefetch route data
   */
  async prefetchRouteData(
    route: string,
    fetcher: () => Promise<any>
  ): Promise<void> {
    if (this.prefetchedUrls.has(`route:${route}`)) return;

    try {
      await fetcher();
      this.prefetchedUrls.add(`route:${route}`);
    } catch (error) {
      console.error(`Failed to prefetch route data: ${route}`, error);
    }
  }

  /**
   * DNS prefetch for external domains
   */
  dnsPrefetch(domain: string): void {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  }

  /**
   * Preconnect to external domains
   */
  preconnect(domain: string, crossOrigin?: boolean): void {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    if (crossOrigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  /**
   * Smart prefetch based on connection speed
   */
  smartPrefetch(url: string): void {
    if (typeof navigator === 'undefined') return;

    const connection = (navigator as any).connection;
    if (!connection) {
      this.prefetch(url);
      return;
    }

    const { effectiveType, saveData } = connection;

    // Don't prefetch on slow connections or data saver mode
    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      return;
    }

    // Use high priority for fast connections
    const priority = effectiveType === '4g' ? 'high' : 'low';
    this.prefetch(url, { priority });
  }

  /**
   * Get prefetch statistics
   */
  getStats() {
    return {
      prefetched: this.prefetchedUrls.size,
      pending: this.hoverTimeouts.size,
      urls: Array.from(this.prefetchedUrls),
    };
  }

  /**
   * Clear all prefetch data
   */
  clear(): void {
    this.prefetchedUrls.clear();
    this.hoverTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.hoverTimeouts.clear();
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.observer?.disconnect();
    this.clear();
  }
}

// Export singleton
export const prefetch = new Prefetch();

// React hook for prefetching
export function usePrefetch(url: string, options?: PrefetchOptions) {
  React.useEffect(() => {
    prefetch.prefetch(url, options);
  }, [url]);
}

// React hook for hover prefetch
export function useHoverPrefetch(url: string, delay?: number) {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    return prefetch.prefetchOnHover(ref.current, url, delay);
  }, [url, delay]);

  return ref;
}

// Link component with prefetch
export function PrefetchLink({
  href,
  children,
  prefetchOn = 'hover',
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  prefetchOn?: 'hover' | 'visible' | 'mount';
  className?: string;
  [key: string]: any;
}) {
  const ref = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (prefetchOn === 'mount') {
      prefetch.prefetch(href);
    } else if (prefetchOn === 'visible' && ref.current) {
      prefetch.prefetchOnVisible(ref.current, href);
    }
  }, [href, prefetchOn]);

  React.useEffect(() => {
    if (prefetchOn === 'hover' && ref.current) {
      return prefetch.prefetchOnHover(ref.current, href);
    }
  }, [href, prefetchOn]);

  return (
    <a ref={ref} href={href} className={className} {...props}>
      {children}
    </a>
  );
}

import React from 'react';
