import React, { useState } from 'react';
import { RewardService } from '@/lib/gamification';

const steps = [
  {
    title: 'Welcome to ProphetBase!',
    description: 'Earn coins and badges as you explore the app.',
    reward: 10,
    icon: '🎉',
  },
  {
    title: 'Connect Your Wallet',
    description: 'Connect your wallet to start trading and earning rewards.',
    reward: 20,
    icon: '👛',
  },
  {
    title: 'Complete Your First Trade',
    description: 'Make your first trade to unlock your first badge.',
    reward: 30,
    icon: '💸',
  },
  {
    title: 'Track Your Progress',
    description: 'View your achievements, streaks, and leaderboard rank.',
    reward: 10,
    icon: '📊',
  },
];

export const GamifiedOnboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const [rewards, setRewards] = useState<number[]>([]);
  const isLast = step === steps.length - 1;

  function handleNext() {
    if (!rewards.includes(step)) {
      RewardService.earn(steps[step].reward);
      setRewards([...rewards, step]);
    }
    if (!isLast) setStep(step + 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-6 py-10 md:hidden">
      <div className="mb-8 text-5xl">{steps[step].icon}</div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900 text-center">{steps[step].title}</h2>
      <p className="mb-6 text-gray-600 text-center max-w-xs">{steps[step].description}</p>
      <div className="mb-4 text-green-600 font-semibold">+{steps[step].reward} coins</div>
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white font-bold"
        onClick={handleNext}
      >
        {isLast ? 'Finish' : 'Next'}
      </button>
      <div className="flex gap-1 mt-6">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`inline-block w-2 h-2 rounded-full ${i === step ? 'bg-blue-600' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};
