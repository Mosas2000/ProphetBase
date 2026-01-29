'use client';

import { useState } from 'react';

interface RecommendedMarket {
  id: string;
  title: string;
  reason: string;
  matchScore: number;
  category: string;
}

const MOCK_REQS: RecommendedMarket[] = [
  { id: '1', title: 'Will Base TVL exceed $10B by July?', reason: 'Based on your interest in Base L2 and yield farming.', matchScore: 98, category: 'Crypto' },
  { id: '2', title: 'Nvidia Market Cap reaches $5T in 2026?', reason: 'You follow tech earnings and AI hardware markets.', matchScore: 92, category: 'Tech' },
  { id: '3', title: 'USA House Majority: Republican or Democrat?', reason: 'Your recent trades in political sentiment markets.', matchScore: 85, category: 'Politics' },
];

/**
 * AI-powered market discovery and personalized recommendations
 */
export default function AIMarketDiscovery() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">AI <span className="text-blue-600">Oracle</span></h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Personalized market discovery engine</p>
        </div>
        <button 
          onClick={() => setLoading(true)}
          className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      <div className="space-y-6">
        {MOCK_REQS.map((market) => (
          <div 
            key={market.id}
            className="group p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[8px] font-black rounded-lg uppercase tracking-widest">
                {market.category}
              </span>
              <div className="text-right">
                <span className="text-[10px] font-black text-green-600 uppercase italic">{market.matchScore}% MATCH</span>
              </div>
            </div>

            <h4 className="text-lg font-black text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-blue-600 transition-colors">
              {market.title}
            </h4>
            
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
               <span className="text-sm">🤖</span>
               <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
                 "{market.reason}"
               </p>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700" />
                ))}
                <span className="text-[10px] text-gray-400 font-bold ml-4 self-center uppercase">124 Traders Interested</span>
              </div>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                Explore Market
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
          AI adjusts to your trading patterns in real-time.
        </p>
      </div>
    </div>
  );
}
