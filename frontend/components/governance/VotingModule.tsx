'use client';

import { useState } from 'react';

interface VotingOption {
  id: string;
  label: string;
  votes: number;
}

/**
 * Advanced voting module with support for multiple voting strategies
 */
export default function VotingModule() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [options, setOptions] = useState<VotingOption[]>([
    { id: 'yes', label: 'APPROVE', votes: 1250000 },
    { id: 'no', label: 'REJECT', votes: 450000 },
    { id: 'abstain', label: 'ABSTAIN', votes: 120000 },
  ]);

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Protocol Vote</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Voting ends in 3 Days, 4 Hours</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-black text-blue-600">{(totalVotes / 1000).toFixed(1)}k VP</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Tally</div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedOption(opt.id)}
            className={`w-full relative overflow-hidden p-6 rounded-2xl border transition-all text-left ${
              selectedOption === opt.id 
                ? 'border-blue-600 ring-2 ring-blue-600/10' 
                : 'border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30'
            }`}
          >
            {/* Progress Bar Background */}
            <div 
              className={`absolute inset-0 transition-all duration-1000 ${
                selectedOption === opt.id ? 'bg-blue-600/5' : 'bg-gray-100 dark:bg-gray-800/50'
              }`}
              style={{ width: `${(opt.votes / totalVotes) * 100}%` }}
            />

            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === opt.id ? 'border-blue-600' : 'border-gray-300 dark:border-gray-600'}`}>
                   {selectedOption === opt.id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                </div>
                <span className={`font-bold text-sm ${selectedOption === opt.id ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                  {opt.label}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-gray-900 dark:text-white">{((opt.votes / totalVotes) * 100).toFixed(1)}%</span>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{(opt.votes / 1000).toFixed(0)}k VP</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        disabled={!selectedOption}
        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all ${
          selectedOption 
            ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02]' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
        }`}
      >
        Cast My Vote
      </button>

      <p className="mt-4 text-[10px] text-gray-400 text-center font-medium leading-relaxed">
        By casting your vote, you authorize the protocol to record your decision on-chain. 
        Gas fees apply based on network congestion.
      </p>
    </div>
  );
}
