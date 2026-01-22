'use client';

import { useEffect, useRef, useState } from 'react';

interface TouchGesturesProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function TouchGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onDoubleTap,
  onLongPress,
  children,
  className = ''
}: TouchGesturesProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, time: 0 });
  const [lastTap, setLastTap] = useState(0);
  const [initialDistance, setInitialDistance] = useState(0);
  const longPressTimer = useRef<NodeJS.Timeout>();

  const SWIPE_THRESHOLD = 50;
  const DOUBLE_TAP_DELAY = 300;
  const LONG_PRESS_DELAY = 500;

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });

    // Handle pinch
    if (e.touches.length === 2 && onPinch) {
      setInitialDistance(getDistance(e.touches[0], e.touches[1]));
    }

    // Handle long press
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress();
      }, LONG_PRESS_DELAY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Cancel long press on move
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    // Handle pinch
    if (e.touches.length === 2 && onPinch && initialDistance) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialDistance;
      onPinch(scale);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Cancel long press
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;

    // Handle double tap
    if (onDoubleTap) {
      const now = Date.now();
      if (now - lastTap < DOUBLE_TAP_DELAY) {
        onDoubleTap();
        setLastTap(0);
        return;
      }
      setLastTap(now);
    }

    // Handle swipes
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > SWIPE_THRESHOLD || absY > SWIPE_THRESHOLD) {
      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }
  };

  return (
    <div
      ref={elementRef}
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

// Example usage component
export function TouchGesturesDemo() {
  const [gesture, setGesture] = useState<string>('');
  const [scale, setScale] = useState<number>(1);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Touch Gestures Demo</h2>
      
      <TouchGestures
        onSwipeLeft={() => setGesture('Swiped Left ←')}
        onSwipeRight={() => setGesture('Swiped Right →')}
        onSwipeUp={() => setGesture('Swiped Up ↑')}
        onSwipeDown={() => setGesture('Swiped Down ↓')}
        onPinch={(s) => {
          setScale(s);
          setGesture(`Pinching: ${s.toFixed(2)}x`);
        }}
        onDoubleTap={() => setGesture('Double Tapped 👆👆')}
        onLongPress={() => setGesture('Long Pressed ⏱️')}
        className="bg-blue-50 border-2 border-blue-300 rounded-lg p-12 text-center min-h-[300px] flex items-center justify-center select-none"
      >
        <div style={{ transform: `scale(${scale})`, transition: 'transform 0.1s' }}>
          <div className="text-4xl mb-4">👋</div>
          <p className="text-lg font-semibold text-gray-900">
            {gesture || 'Try gestures here!'}
          </p>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>• Swipe in any direction</p>
            <p>• Double tap</p>
            <p>• Long press</p>
            <p>• Pinch to zoom</p>
          </div>
        </div>
      </TouchGestures>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Gesture Info</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Last Gesture:</strong> {gesture || 'None'}</p>
          <p><strong>Scale:</strong> {scale.toFixed(2)}x</p>
        </div>
      </div>
    </div>
  );
}
