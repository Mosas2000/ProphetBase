import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useState } from 'react';

const steps = [
  {
    title: 'Welcome to ProphetBase',
    description:
      'Trade crypto predictions, earn rewards, and join the community. Let’s get started!',
    icon: '🔮',
  },
  {
    title: 'Connect Your Wallet',
    description:
      'Securely connect your wallet to start trading and managing your positions.',
    icon: '👛',
  },
  {
    title: 'Explore Features',
    description:
      'Buy YES/NO shares, track your portfolio, and receive real-time notifications.',
    icon: '✨',
  },
];

export const MobileOnboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-6 py-10 md:hidden">
      <div className="mb-8 text-5xl">{steps[step].icon}</div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900 text-center">
        {steps[step].title}
      </h2>
      <p className="mb-6 text-gray-600 text-center max-w-xs">
        {steps[step].description}
      </p>
      {step === 1 ? (
        <div className="mb-6 w-full flex justify-center">
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      ) : null}
      <div className="flex gap-2 mt-4">
        {step > 0 && (
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium"
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
        )}
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white font-bold"
          onClick={() => (isLast ? setStep(0) : setStep(step + 1))}
        >
          {isLast ? 'Start Over' : 'Next'}
        </button>
      </div>
      <div className="flex gap-1 mt-6">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`inline-block w-2 h-2 rounded-full ${
              i === step ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
