'use client';

import { useState } from 'react';

interface LeaderboardEntry {
  rank: number;
  user: { name: string; avatar: string };
  pnl: number;
  winRate: number;
}

const CATEGORIES = ['All', 'Politics', 'Sports', 'Crypto', 'Tech'];

const MOCK_LEADERS: Record<string, LeaderboardEntry[]> = {
  All: [
    { rank: 1, user: { name: 'Master Prophet', avatar: 'https://i.pravatar.cc/150?u=1' }, pnl: 45200, winRate: 72 },
    { rank: 2, user: { name: 'Macro Whale', avatar: 'https://i.pravatar.cc/150?u=2' }, pnl: 32100, winRate: 68 },
  ],
  Politics: [
    { rank: 1, user: { name: 'Insider Info', avatar: 'https://i.pravatar.cc/150?u=3' }, pnl: 12500, winRate: 85 },
    { rank: 2, user: { name: 'DC Analyst', avatar: 'https://i.pravatar.cc/150?u=4' }, pnl: 9200, winRate: 75 },
  ],
  Crypto: [
    { rank: 1, user: { name: 'Satoshi Fan', avatar: 'https://i.pravatar.cc/150?u=5' }, pnl: 180000, winRate: 45 },
    { rank: 2, user: { name: 'Base Maxi', avatar: 'https://i.pravatar.cc/150?u=6' }, pnl: 54000, winRate: 62 },
  ]
};

export default function CategoryLeaderboard() {
  const [activeCategory, setActiveCategory] = useState('All');

  const leaders = MOCK_LEADERS[activeCategory] || MOCK_LEADERS['All'];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
      <div className="p-8 pb-4">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">
          Top Forecasters
        </h2>

        {/* Categories Tab */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap uppercase tracking-widest ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-y border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rank</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trader</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">PnL (USDC)</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Win Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {leaders.map((entry) => (
              <tr key={entry.user.name} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-8 py-5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                    entry.rank === 1 ? 'bg-amber-100 text-amber-600' :
                    entry.rank === 2 ? 'bg-slate-100 text-slate-600' : 'text-gray-400'
                  }`}>
                    {entry.rank}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <img src={entry.user.avatar} alt="" className="w-10 h-10 rounded-xl" />
                    <span className="font-bold text-gray-900 dark:text-white">{entry.user.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right font-black text-green-600">
                   +${entry.pnl.toLocaleString()}
                </td>
                <td className="px-8 py-5 text-right">
                   <div className="flex flex-col items-end">
                      <span className="font-bold text-gray-900 dark:text-white">{entry.winRate}%</span>
                      <div className="w-16 h-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-1">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${entry.winRate}%` }} />
                      </div>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 text-center border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400">Updates every 6 hours based on resolved markets.</p>
      </div>
    </div>
  );
}
