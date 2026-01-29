'use client';

import { useState } from 'react';

/**
 * Component for managing voting power delegation
 */
export default function DelegationPanel() {
  const [delegateAddress, setDelegateAddress] = useState('');
  const [isSelfDelegated, setIsSelfDelegated] = useState(true);

  const handleDelegation = (self: boolean) => {
    setIsSelfDelegated(self);
    if (self) setDelegateAddress('');
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400 text-2xl">
          👥
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Vote Delegation</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Empower other traders to vote for you</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Delegation Options */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleDelegation(true)}
            className={`p-4 rounded-2xl border transition-all text-center ${
              isSelfDelegated 
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10 ring-2 ring-indigo-600/10' 
                : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="text-xl mb-1">🎯</div>
            <div className={`text-xs font-black uppercase ${isSelfDelegated ? 'text-indigo-600' : 'text-gray-400'}`}>Self Delegate</div>
          </button>
          <button
            onClick={() => handleDelegation(false)}
            className={`p-4 rounded-2xl border transition-all text-center ${
              !isSelfDelegated 
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10 ring-2 ring-indigo-600/10' 
                : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="text-xl mb-1">🤝</div>
            <div className={`text-xs font-black uppercase ${!isSelfDelegated ? 'text-indigo-600' : 'text-gray-400'}`}>External</div>
          </button>
        </div>

        {!isSelfDelegated && (
          <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Delegate Address</label>
              <input
                type="text"
                value={delegateAddress}
                onChange={(e) => setDelegateAddress(e.target.value)}
                placeholder="0x... or username"
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              />
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
               <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Power to Transfer</span>
                  <span className="text-xs font-black text-gray-900 dark:text-white">1,250 VP</span>
               </div>
               <p className="text-[10px] text-gray-400 font-medium">Your voting power will be added to the delegate's total power.</p>
            </div>
          </div>
        )}

        <button 
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01]"
        >
          {isSelfDelegated ? 'Confirm Self Delegation' : 'Delegate Power'}
        </button>

        <p className="text-[10px] text-gray-400 text-center font-medium leading-relaxed">
          Delegation can be revoked at any time. When you delegate, you keep your tokens and only transfer voting rights.
        </p>
      </div>
    </div>
  );
}
