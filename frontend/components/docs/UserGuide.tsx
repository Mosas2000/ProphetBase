'use client';

import { useState } from 'react';

interface GuideStep {
  title: string;
  content: string;
  videoUrl?: string;
}

const GUIDE_SECTIONS = [
  {
    title: 'Getting Started',
    steps: [
      {
        title: 'Connecting your Wallet',
        content: 'To start using ProphetBase, connect your wallet using the "Connect Wallet" button in the top right corner. We support RainbowKit, MetaMask, and WalletConnect.',
      },
      {
        title: 'Acquiring STX/USDC',
        content: 'ProphetBase operates on the Stacks network. You will need STX for transaction fees and USDC for placing stakes.',
      },
    ]
  },
  {
    title: 'Trading 101',
    steps: [
      {
        title: 'Placing your first bet',
        content: 'Select a market, choose YES or NO, and enter the amount you wish to stake. Review the potential payout and confirm the transaction.',
      },
      {
        title: 'Understanding Odds',
        content: 'Odds reflect the market consensus. A higher payout means a lower probability of that outcome occurring according to the market.',
      },
    ]
  },
  {
    title: 'Advanced Features',
    steps: [
      {
        title: 'Using the Command Palette',
        content: 'Press Ctrl+K (or Cmd+K) to open the command palette. This allows you to navigate the platform rapidly via keyboard.',
      },
      {
        title: 'Customizing your Workspace',
        content: 'The Workspace Manager allows you to save custom layouts of widgets and predictors.',
      },
    ]
  }
];

export default function UserGuide() {
  const [activeSection, setActiveSection] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col md:flex-row h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search guide..."
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <nav className="space-y-1">
          {GUIDE_SECTIONS.map((section, sIdx) => (
            <div key={section.title} className="mb-4">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              {section.steps.map((step, tIdx) => (
                <button
                  key={step.title}
                  onClick={() => {
                    setActiveSection(sIdx);
                    setActiveStep(tIdx);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === sIdx && activeStep === tIdx
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {GUIDE_SECTIONS[activeSection].steps[activeStep].title}
          </h2>
          
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
            <p className="text-lg mb-6">
              {GUIDE_SECTIONS[activeSection].steps[activeStep].content}
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-8">
              <h4 className="text-blue-800 dark:text-blue-300 font-bold mb-2">💡 Tip</h4>
              <p className="text-blue-700 dark:text-blue-400">
                You can always access this guide by pressing <kbd className="font-mono bg-white dark:bg-gray-800 px-1 rounded border">Shift + ?</kbd> anywhere on the platform.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button
               className="text-blue-600 font-medium hover:underline"
               onClick={() => {
                 if (activeStep > 0) setActiveStep(activeStep - 1);
                 else if (activeSection > 0) {
                   const prevSec = activeSection - 1;
                   setActiveSection(prevSec);
                   setActiveStep(GUIDE_SECTIONS[prevSec].steps.length - 1);
                 }
               }}
            >
              ← Previous
            </button>
            <button
               className="text-blue-600 font-medium hover:underline"
               onClick={() => {
                 if (activeStep < GUIDE_SECTIONS[activeSection].steps.length - 1) setActiveStep(activeStep + 1);
                 else if (activeSection < GUIDE_SECTIONS.length - 1) {
                   setActiveSection(activeSection + 1);
                   setActiveStep(0);
                 }
               }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
