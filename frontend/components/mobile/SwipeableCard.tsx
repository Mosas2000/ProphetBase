'use client';

import { useState, useRef, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface SwipeableCardProps {
  marketName: string;
  yesPrice: number;
  noPrice: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  children?: React.ReactNode;
}

export default function SwipeableCard({
  marketName,
  yesPrice,
  noPrice,
  onSwipeLeft,
  onSwipeRight,
  children,
}: SwipeableCardProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwip ing, setIsSwiping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    const offset = currentTouch - touchStart;
    setSwipeOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - Buy NO
      onSwipeLeft?.();
      animateSwipe('left');
    } else if (isRightSwipe) {
      // Swipe right - Buy YES
      onSwipeRight?.();
      animateSwipe('right');
    } else {
      // Reset position
      setSwipeOffset(0);
    }

    setIsSwiping(false);
  };

  const animateSwipe = (direction: 'left' | 'right') => {
    const targetOffset = direction === 'left' ? -400 : 400;
    setSwipeOffset(targetOffset);
    setTimeout(() => {
      setSwipeOffset(0);
    }, 300);
  };

  const getBackgroundColor = () => {
    if (swipeOffset > 50) return 'rgba(16, 185, 129, 0.1)'; // Green for YES
    if (swipeOffset < -50) return 'rgba(239, 68, 68, 0.1)'; // Red for NO
    return 'transparent';
  };

  return (
    <div className="relative overflow-hidden">
      {/* Swipe Indicators */}
      <div className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none">
        <div
          className={`text-4xl transition-opacity ${
            swipeOffset > 50 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          ✅ YES
        </div>
        <div
          className={`text-4xl transition-opacity ${
            swipeOffset < -50 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          ❌ NO
        </div>
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
          backgroundColor: getBackgroundColor(),
        }}
        className="touch-pan-y"
      >
        <Card>
          <h3 className="font-semibold mb-4">{marketName}</h3>
          {children}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button
              onClick={() => onSwipeRight?.()}
              className="bg-green-600 hover:bg-green-700"
            >
              YES {yesPrice}¢
            </Button>
            <Button
              onClick={() => onSwipeLeft?.()}
              className="bg-red-600 hover:bg-red-700"
            >
              NO {noPrice}¢
            </Button>
          </div>
        </Card>
      </div>

      {/* Swipe Hint */}
      <p className="text-xs text-center text-gray-500 mt-2">
        👆 Swipe right for YES, left for NO
      </p>
    </div>
  );
}
