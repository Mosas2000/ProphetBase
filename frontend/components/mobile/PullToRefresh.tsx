'use client';

import { useRef, useState } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxPullDistance = 80;
  const refreshThreshold = 60;

  const handleTouchStart = (e: React.TouchEvent) => {
    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isRefreshing || touchStart === 0) return;

    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      const currentTouch = e.touches[0].clientY;
      const distance = Math.min(currentTouch - touchStart, maxPullDistance);

      if (distance > 0) {
        setPullDistance(distance);
        // Haptic feedback at threshold
        if (distance >= refreshThreshold && 'vibrate' in navigator) {
          navigator.vibrate(10);
        }
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= refreshThreshold && !isRefreshing) {
      setIsRefreshing(true);
      // Haptic feedback on release
      if ('vibrate' in navigator) {
        navigator.vibrate(20);
      }

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
    setTouchStart(0);
  };

  const getRotation = () => {
    return (pullDistance / maxPullDistance) * 360;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-auto h-full"
      style={{
        transform: `translateY(${isRefreshing ? refreshThreshold : pullDistance}px)`,
        transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease-out' : 'none',
      }}
    >
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center"
        style={{
          height: `${maxPullDistance}px`,
          marginTop: `-${maxPullDistance}px`,
          opacity: pullDistance / maxPullDistance,
        }}
      >
        <div className="flex flex-col items-center">
          <div
            className={`text-3xl transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
            style={{
              transform: `rotate(${getRotation()}deg)`,
            }}
          >
            {isRefreshing ? '⏳' : pullDistance >= refreshThreshold ? '🔄' : '⬇️'}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {isRefreshing
              ? 'Refreshing...'
              : pullDistance >= refreshThreshold
              ? 'Release to refresh'
              : 'Pull to refresh'}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}
