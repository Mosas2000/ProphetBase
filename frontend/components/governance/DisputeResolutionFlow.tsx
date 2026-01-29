'use client';

import { useState } from 'react';

/**
 * UI for challenging and resolving market outcome disputes
 */
export default function DisputeResolutionFlow() {
  const [step, setStep] = useState(1);

  return (
    <div className="p-10 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl max-w-2xl mx-auto">
      <header className="mb-10 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl shadow-red-500/10">
          ⚖️
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
          Dispute Resolution
        </h2>
        <p className="text-gray-500 font-medium font-inter">
          Challenge a market resolution by providing evidence and bonding capital.
        </p>
      </header>

      {/* Steps Progress */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`w-10 h-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-red-600' : 'bg-gray-100 dark:bg-gray-800'}`} 
          />
        ))}
      </div>

      <div className="space-y-8">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">1. Ground for Dispute</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
               Select the reason why the current resolution is incorrect.
             </p>
             <div className="space-y-3">
                {[
                  'Incorrect Oracle Data',
                  'Ambiguous Market Terms',
                  'Premature Resolution',
                  'Event Metadata Mismatch'
                ].map((reason) => (
                  <button key={reason} className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-left text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-red-200 transition-all">
                    {reason}
                  </button>
                ))}
             </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">2. Evidence Submission</h3>
             <textarea 
               placeholder="Provide links to official sources and detailed explanation..."
               className="w-full p-6 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm h-48 focus:ring-2 focus:ring-red-600 outline-none mb-6"
             />
             <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl flex gap-3">
                <span className="text-blue-600 font-bold">ℹ️</span>
                <p className="text-[10px] text-blue-800/70 dark:text-blue-400/70 font-medium uppercase tracking-tight">
                  Dispute fee is 5,000 PRPT. This will be returned if the dispute is successful.
                </p>
             </div>
          </div>
        )}

        <div className="flex gap-4">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl uppercase tracking-widest"
            >
              Back
            </button>
          )}
          <button 
            onClick={() => step < 3 ? setStep(step + 1) : null}
            className="flex-[2] py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-red-500/20"
          >
            {step === 3 ? 'Initiate Dispute' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
