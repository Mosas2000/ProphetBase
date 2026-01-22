/**
 * Virtual Scrolling for Large Lists
 * Implements efficient rendering for long lists with infinite scroll
 */

'use client';

import React, { useCallback, useRef, useState } from 'react';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  className?: string;
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  onLoadMore,
  hasMore = false,
  loading = false,
  className = '',
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);

    // Infinite scroll
    if (onLoadMore && hasMore && !loading) {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        onLoadMore();
      }
    }
  }, [onLoadMore, hasMore, loading]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
      {loading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
        </div>
      )}
    </div>
  );
}

// Infinite scroll hook
export function useInfiniteScroll<T>(
  fetchMore: (page: number) => Promise<T[]>,
  options: {
    initialPage?: number;
    pageSize?: number;
  } = {}
) {
  const { initialPage = 0, pageSize = 20 } = options;
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await fetchMore(page);
      setItems((prev) => [...prev, ...newItems]);
      setHasMore(newItems.length === pageSize);
      setPage((p) => p + 1);
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchMore, pageSize]);

  return { items, loading, hasMore, loadMore };
}

// Performance monitoring for virtual scroll
export class VirtualScrollMonitor {
  private metrics: {
    renderTime: number[];
    scrollEvents: number;
    visibleItems: number[];
  } = {
    renderTime: [],
    scrollEvents: 0,
    visibleItems: [],
  };

  recordRenderTime(time: number): void {
    this.metrics.renderTime.push(time);
    if (this.metrics.renderTime.length > 100) {
      this.metrics.renderTime.shift();
    }
  }

  recordScrollEvent(): void {
    this.metrics.scrollEvents++;
  }

  recordVisibleItems(count: number): void {
    this.metrics.visibleItems.push(count);
    if (this.metrics.visibleItems.length > 100) {
      this.metrics.visibleItems.shift();
    }
  }

  getStats() {
    const avgRenderTime =
      this.metrics.renderTime.reduce((a, b) => a + b, 0) / this.metrics.renderTime.length || 0;
    const avgVisibleItems =
      this.metrics.visibleItems.reduce((a, b) => a + b, 0) / this.metrics.visibleItems.length || 0;

    return {
      avgRenderTime: avgRenderTime.toFixed(2) + 'ms',
      scrollEvents: this.metrics.scrollEvents,
      avgVisibleItems: Math.round(avgVisibleItems),
      performance: avgRenderTime < 16 ? 'Good' : avgRenderTime < 33 ? 'Fair' : 'Poor',
    };
  }

  reset(): void {
    this.metrics = {
      renderTime: [],
      scrollEvents: 0,
      visibleItems: [],
    };
  }
}

export const virtualScrollMonitor = new VirtualScrollMonitor();
