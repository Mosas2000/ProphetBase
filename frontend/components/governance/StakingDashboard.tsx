'use client';

import { useState } from 'react';

/**
 * Interface for staking tokens to earn voting power
 */
export default function StakingDashboard() {
  const [stakedAmount, setStakedAmount] = useState(1250);
  const [inputAmount, setInputAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState(30); // days

  const votingPower = stakedAmount * (1 + lockPeriod / 365);

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
          Staking Vault
        </h2>
        <p className="text-gray-500 font-medium max-w-lg mx-auto">
          Stake your PROPHET tokens to earn voting power and influence the protocol's future.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Staked</div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">{stakedAmount.toLocaleString()} PRPT</div>
        </div>
        <div className="p-6 bg-blue-600 rounded-2xl text-center text-white shadow-xl shadow-blue-500/20">
          <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">Voting Power</div>
          <div className="text-2xl font-black">{Math.floor(votingPower).toLocaleString()} VP</div>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Est. APY</div>
          <div className="text-2xl font-black text-green-600">12.4%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Staking Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Stake Amount</label>
            <div className="relative">
              <input
                type="number"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl font-bold text-xl outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button className="absolute right-4 top-4 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg">MAX</button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Lock Period (Multiplier)</label>
            <div className="flex gap-2">
              {[30, 90, 180, 365].map((days) => (
                <button
                  key={days}
                  onClick={() => setLockPeriod(days)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${
                    lockPeriod === days 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {days}D
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-gray-400 text-center font-medium">
               Current Multiplier: <span className="text-blue-600">{(1 + lockPeriod / 365).toFixed(2)}x</span>
            </p>
          </div>

          <button className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl uppercase tracking-widest hover:scale-[1.02] transition-transform">
            Confirm Staking
          </button>
        </div>

        {/* Benefits List */}
        <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/50">
          <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Staker Benefits
          </h4>
          <ul className="space-y-4">
            {[
              'Create protocol governance proposals',
              'Vote on market resolution disputes',
              'Earn 5% fee share from platform volume',
              'Access to private prediction rooms',
              'Higher referral reward multiplier'
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-sm font-medium text-blue-800/70 dark:text-blue-400/70">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
