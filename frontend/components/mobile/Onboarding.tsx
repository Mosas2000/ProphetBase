'use client';

import Button from '@/components/ui/Button';
import { useState } from 'react';

interface OnboardingScreen {
  title: string;
  description: string;
  icon: string;
}

export default function Onboarding() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const screens: OnboardingScreen[] = [
    {
      title: 'Welcome to ProphetBase',
      description: 'Trade on the future with decentralized prediction markets on Base',
      icon: '🎯',
    },
    {
      title: 'Connect Your Wallet',
      description: 'Securely connect your Web3 wallet to start trading',
      icon: '👛',
    },
    {
      title: 'Browse Markets',
      description: 'Explore prediction markets across crypto, sports, politics, and more',
      icon: '📊',
    },
    {
      title: 'Make Predictions',
      description: 'Buy YES or NO shares based on your predictions',
      icon: '💡',
    },
    {
      title: 'Earn Rewards',
      description: 'Win big when your predictions are correct!',
      icon: '🏆',
    },
  ];

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else if (isRightSwipe && currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    // Navigate to home or close onboarding
  };

  const handleGetStarted = () => {
    localStorage.setItem('onboarding_completed', 'true');
    // Navigate to home
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600 z-50 flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-white text-sm font-medium hover:underline"
        >
          Skip
        </button>
      </div>

      {/* Swipeable Content */}
      <div
        className="flex-1 flex items-center justify-center px-8"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="text-center text-white">
          <div className="text-8xl mb-8 animate-bounce">{screens[currentScreen].icon}</div>
          <h2 className="text-3xl font-bold mb-4">{screens[currentScreen].title}</h2>
          <p className="text-lg opacity-90">{screens[currentScreen].description}</p>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {screens.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentScreen(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentScreen ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="p-6">
        {currentScreen === screens.length - 1 ? (
          <Button onClick={handleGetStarted} fullWidth className="bg-white text-blue-600 hover:bg-gray-100">
            Get Started
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentScreen(currentScreen + 1)}
            fullWidth
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
