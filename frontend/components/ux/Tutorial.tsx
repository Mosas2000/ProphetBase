'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useEffect, useState } from 'react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  target?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Welcome to ProphetBase! 🎉',
    description: 'ProphetBase is a decentralized prediction market platform. Let\'s take a quick tour to get you started.',
    position: 'center',
  },
  {
    id: 2,
    title: 'Browse Markets',
    description: 'Explore prediction markets across different categories like Crypto, Sports, and Politics. Click on any market to see details.',
    position: 'center',
  },
  {
    id: 3,
    title: 'Make Predictions',
    description: 'Buy YES or NO shares based on your prediction. The price reflects the market\'s confidence in each outcome.',
    position: 'center',
  },
  {
    id: 4,
    title: 'Connect Your Wallet',
    description: 'Connect your Web3 wallet to start trading. We support MetaMask, WalletConnect, and more.',
    position: 'top',
  },
  {
    id: 5,
    title: 'Track Your Portfolio',
    description: 'View your active positions, P&L, and trading history in your portfolio dashboard.',
    position: 'center',
  },
  {
    id: 6,
    title: 'Create Markets',
    description: 'Have a prediction idea? Create your own market and earn fees from trading activity!',
    position: 'center',
  },
  {
    id: 7,
    title: 'You\'re All Set! 🚀',
    description: 'That\'s it! Start exploring markets and making predictions. You can replay this tutorial anytime from the help menu.',
    position: 'center',
  },
];

interface TutorialProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export function Tutorial({ onComplete, autoStart = false }: TutorialProps) {
  const [isActive, setIsActive] = useState(autoStart);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedBefore, setHasCompletedBefore] = useState(false);

  useEffect(() => {
    // Check if user has completed tutorial before
    const completed = localStorage.getItem('tutorial_completed');
    setHasCompletedBefore(!!completed);
    
    if (!completed && autoStart) {
      setIsActive(true);
    }
  }, [autoStart]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    setCurrentStep(0);
  };

  const handleComplete = () => {
    localStorage.setItem('tutorial_completed', 'true');
    setIsActive(false);
    setCurrentStep(0);
    if (onComplete) {
      onComplete();
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  if (!isActive) {
    return (
      <button
        onClick={handleRestart}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all z-50"
        title="Start Tutorial"
      >
        💡
      </button>
    );
  }

  const step = tutorialSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" />

      {/* Tutorial Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2 border-blue-500 shadow-2xl">
          <div className="p-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
                <span>{Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2 mb-6">
              {tutorialSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStep
                      ? 'bg-blue-500 w-8'
                      : idx < currentStep
                      ? 'bg-blue-400'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="secondary"
                onClick={handleSkip}
              >
                Skip Tutorial
              </Button>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button
                    variant="secondary"
                    onClick={handlePrevious}
                  >
                    Previous
                  </Button>
                )}
                <Button onClick={handleNext}>
                  {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>

            {/* Keyboard Hints */}
            <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400 text-center">
              <span>💡 Tip: Use arrow keys to navigate • Press ESC to skip</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
