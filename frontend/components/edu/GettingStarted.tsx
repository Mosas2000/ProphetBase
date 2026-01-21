'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export function GettingStarted() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to ProphetBase',
      description: 'Learn how to make your first prediction',
      content: 'ProphetBase is a decentralized prediction market where you can trade on real-world events. Start by connecting your wallet and exploring markets.',
      video: '🎥',
      demo: true,
    },
    {
      title: 'Connect Your Wallet',
      description: 'Set up your Web3 wallet',
      content: 'Click the "Connect Wallet" button in the top right. We support MetaMask, WalletConnect, and other popular wallets.',
      video: '🎥',
      demo: true,
    },
    {
      title: 'Browse Markets',
      description: 'Find interesting predictions',
      content: 'Explore markets across categories like Crypto, Sports, Politics, and more. Each market has a question and two outcomes: YES or NO.',
      video: '🎥',
      demo: false,
    },
    {
      title: 'Make Your First Trade',
      description: 'Buy shares in a market',
      content: 'Choose YES or NO, enter your amount, and confirm. You\'ll receive shares that can be redeemed for $1 if you\'re correct.',
      video: '🎥',
      demo: true,
    },
    {
      title: 'Track Your Portfolio',
      description: 'Monitor your positions',
      content: 'View all your active positions, potential profits, and market updates in your portfolio dashboard.',
      video: '🎥',
      demo: false,
    },
  ];

  const tutorials = [
    { title: 'How Prediction Markets Work', duration: '5:30', views: 12500 },
    { title: 'Understanding Share Prices', duration: '3:45', views: 8200 },
    { title: 'Risk Management Basics', duration: '7:15', views: 6800 },
    { title: 'Reading Market Trends', duration: '6:00', views: 5400 },
  ];

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Getting Started Guide</h3>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium">Step {currentStep + 1} of {steps.length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Step */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="default">Step {currentStep + 1}</Badge>
              <h4 className="text-xl font-bold">{steps[currentStep].title}</h4>
            </div>
            <p className="text-gray-400 mb-4">{steps[currentStep].description}</p>
            
            {steps[currentStep].video && (
              <div className="bg-gray-900 rounded-lg p-8 mb-4 flex items-center justify-center">
                <span className="text-6xl">{steps[currentStep].video}</span>
              </div>
            )}
            
            <p className="mb-4">{steps[currentStep].content}</p>
            
            {steps[currentStep].demo && (
              <Button variant="secondary" className="mb-4">
                Try Interactive Demo
              </Button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex-1"
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="flex-1"
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Video Tutorials */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Video Tutorials</h4>
          
          <div className="space-y-3">
            {tutorials.map((tutorial, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                    ▶️
                  </div>
                  <div>
                    <p className="font-medium mb-1">{tutorial.title}</p>
                    <p className="text-sm text-gray-400">{tutorial.duration} • {tutorial.views.toLocaleString()} views</p>
                  </div>
                </div>
                <Button size="sm">Watch</Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Tips */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Quick Tips</h4>
          
          <div className="space-y-2">
            {[
              'Start with small amounts to learn how markets work',
              'Research events before trading',
              'Diversify across multiple markets',
              'Set price alerts for important markets',
              'Join our Discord community for tips',
            ].map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-blue-400">💡</span>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
