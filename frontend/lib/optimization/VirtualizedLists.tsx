'use client';

import { Activity } from 'lucide-react';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

// Virtual scrolling component
export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  onEndReached,
  endReachedThreshold = 0.8,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      setScrollTop(target.scrollTop);

      // Check if end reached
      if (onEndReached) {
        const scrollRatio =
          (target.scrollTop + target.clientHeight) / target.scrollHeight;
        if (scrollRatio >= endReachedThreshold) {
          onEndReached();
        }
      }
    },
    [onEndReached, endReachedThreshold]
  );

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
      className="scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, idx) => (
          <div
            key={startIndex + idx}
            style={{
              position: 'absolute',
              top: (startIndex + idx) * itemHeight,
              height: itemHeight,
              width: '100%',
            }}
          >
            {renderItem(item, startIndex + idx)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Infinite scroll hook
export function useInfiniteScroll(
  callback: () => void,
  options?: {
    threshold?: number;
    enabled?: boolean;
  }
) {
  const { threshold = 0.9, enabled = true } = options || {};
  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold }
    );

    const trigger = triggerRef.current;
    if (trigger && observerRef.current) {
      observerRef.current.observe(trigger);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, threshold, enabled]);

  return triggerRef;
}

// Windowing manager
export class WindowingManager<T> {
  private items: T[];
  private windowSize: number;
  private currentWindow: number = 0;

  constructor(items: T[], windowSize: number = 50) {
    this.items = items;
    this.windowSize = windowSize;
  }

  getCurrentWindow(): T[] {
    const start = this.currentWindow * this.windowSize;
    const end = start + this.windowSize;
    return this.items.slice(start, end);
  }

  nextWindow(): T[] {
    this.currentWindow++;
    return this.getCurrentWindow();
  }

  previousWindow(): T[] {
    this.currentWindow = Math.max(0, this.currentWindow - 1);
    return this.getCurrentWindow();
  }

  hasNextWindow(): boolean {
    return (this.currentWindow + 1) * this.windowSize < this.items.length;
  }

  hasPreviousWindow(): boolean {
    return this.currentWindow > 0;
  }

  reset() {
    this.currentWindow = 0;
  }

  getTotalWindows(): number {
    return Math.ceil(this.items.length / this.windowSize);
  }
}

// Row recycling pool
export class RowPool<T> {
  private pool: HTMLElement[] = [];
  private maxSize: number;

  constructor(maxSize: number = 20) {
    this.maxSize = maxSize;
  }

  acquire(): HTMLElement | null {
    return this.pool.pop() || null;
  }

  release(element: HTMLElement) {
    if (this.pool.length < this.maxSize) {
      // Clear content and attributes
      element.innerHTML = '';
      element.removeAttribute('style');
      this.pool.push(element);
    }
  }

  clear() {
    this.pool = [];
  }

  getSize(): number {
    return this.pool.length;
  }
}

// Variable height virtual list
export function useVariableHeightVirtualList<T>({
  items,
  estimatedHeight,
  containerHeight,
}: {
  items: T[];
  estimatedHeight: number;
  containerHeight: number;
}) {
  const [heights, setHeights] = useState<Map<number, number>>(new Map());
  const [scrollTop, setScrollTop] = useState(0);

  const getItemOffset = (index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += heights.get(i) || estimatedHeight;
    }
    return offset;
  };

  const getTotalHeight = () => {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total += heights.get(i) || estimatedHeight;
    }
    return total;
  };

  const getVisibleRange = () => {
    let startIndex = 0;
    let currentOffset = 0;

    for (let i = 0; i < items.length; i++) {
      const height = heights.get(i) || estimatedHeight;
      if (currentOffset + height >= scrollTop) {
        startIndex = i;
        break;
      }
      currentOffset += height;
    }

    let endIndex = startIndex;
    currentOffset = getItemOffset(startIndex);

    while (
      endIndex < items.length &&
      currentOffset < scrollTop + containerHeight
    ) {
      currentOffset += heights.get(endIndex) || estimatedHeight;
      endIndex++;
    }

    return { startIndex, endIndex: Math.min(endIndex, items.length - 1) };
  };

  const measureItem = useCallback((index: number, height: number) => {
    setHeights((prev) => {
      const newHeights = new Map(prev);
      newHeights.set(index, height);
      return newHeights;
    });
  }, []);

  return {
    scrollTop,
    setScrollTop,
    getItemOffset,
    getTotalHeight,
    getVisibleRange,
    measureItem,
  };
}

// Performance monitoring for virtual lists
export class VirtualListMonitor {
  private scrollEvents: number = 0;
  private renderCount: number = 0;
  private lastRenderTime: number = 0;
  private renderTimes: number[] = [];

  recordScroll() {
    this.scrollEvents++;
  }

  recordRender(startTime: number) {
    const renderTime = performance.now() - startTime;
    this.renderCount++;
    this.lastRenderTime = renderTime;
    this.renderTimes.push(renderTime);

    // Keep only last 100 render times
    if (this.renderTimes.length > 100) {
      this.renderTimes.shift();
    }
  }

  getMetrics() {
    const avgRenderTime =
      this.renderTimes.length > 0
        ? this.renderTimes.reduce((sum, time) => sum + time, 0) /
          this.renderTimes.length
        : 0;

    return {
      scrollEvents: this.scrollEvents,
      renderCount: this.renderCount,
      lastRenderTime: this.lastRenderTime,
      averageRenderTime: avgRenderTime,
      maxRenderTime: Math.max(...this.renderTimes, 0),
      minRenderTime: Math.min(...this.renderTimes, Infinity),
    };
  }

  reset() {
    this.scrollEvents = 0;
    this.renderCount = 0;
    this.lastRenderTime = 0;
    this.renderTimes = [];
  }
}

// Grid virtualization
export function useVirtualGrid<T>({
  items,
  columns,
  rowHeight,
  columnWidth,
  containerWidth,
  containerHeight,
}: {
  items: T[];
  columns: number;
  rowHeight: number;
  columnWidth: number;
  containerWidth: number;
  containerHeight: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const rows = Math.ceil(items.length / columns);
  const totalHeight = rows * rowHeight;
  const totalWidth = columns * columnWidth;

  const startRow = Math.floor(scrollTop / rowHeight);
  const endRow = Math.ceil((scrollTop + containerHeight) / rowHeight);
  const startCol = Math.floor(scrollLeft / columnWidth);
  const endCol = Math.ceil((scrollLeft + containerWidth) / columnWidth);

  const visibleItems: Array<{ item: T; row: number; col: number }> = [];

  for (let row = startRow; row < endRow && row < rows; row++) {
    for (let col = startCol; col < endCol && col < columns; col++) {
      const index = row * columns + col;
      if (index < items.length) {
        visibleItems.push({ item: items[index], row, col });
      }
    }
  }

  return {
    visibleItems,
    totalHeight,
    totalWidth,
    setScrollTop,
    setScrollLeft,
  };
}

// Performance stats component
export function VirtualListStats({ monitor }: { monitor: VirtualListMonitor }) {
  const [metrics, setMetrics] = useState(monitor.getMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(monitor.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [monitor]);

  return (
    <div className="p-4 bg-slate-800 rounded-lg text-sm">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-blue-400" />
        <span className="font-bold">Virtual List Performance</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-slate-400 text-xs">Scroll Events</div>
          <div className="font-bold">{metrics.scrollEvents}</div>
        </div>
        <div>
          <div className="text-slate-400 text-xs">Render Count</div>
          <div className="font-bold">{metrics.renderCount}</div>
        </div>
        <div>
          <div className="text-slate-400 text-xs">Avg Render (ms)</div>
          <div className="font-bold text-green-400">
            {metrics.averageRenderTime.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-xs">Last Render (ms)</div>
          <div className="font-bold">{metrics.lastRenderTime.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

export const virtualListMonitor = new VirtualListMonitor();
