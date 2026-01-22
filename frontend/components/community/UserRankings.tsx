'use client';

import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export function UserRankings() {
  const [selectedTab, setSelectedTab] = useState<'global' | 'category' | 'regional'>('global');

  const globalRankings = [
    { rank: 1, user: 'CryptoKing', profit: 45600, trades: 1234, winRate: 68, avatar: '👑' },
    { rank: 2, user: 'TradeQueen', profit: 38200, trades: 987, winRate: 65, avatar: '👸' },
    { rank: 3, user: 'MarketMaster', profit: 32100, trades: 856, winRate: 62, avatar: '🎯' },
    { rank: 4, user: 'DiamondHands', profit: 28500, trades: 745, winRate: 60, avatar: '💎' },
    { rank: 5, user: 'You', profit: 12400, trades: 345, winRate: 58, avatar: '😊' },
  ];

  const categoryRankings = [
    { category: 'Crypto', leader: 'BitcoinBull', profit: 25000 },
    { category: 'Sports', leader: 'SportsGuru', profit: 18000 },
    { category: 'Politics', leader: 'PolicyPro', profit: 15000 },
  ];

  const hallOfFame = [
    { year: '2024', champion: 'LegendTrader', profit: 125000 },
    { year: '2023', champion: 'OldKing', profit: 98000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Rankings</h3>
          
          <div className="flex gap-2">
            {(['global', 'category', 'regional'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors capitalize ${
                  selectedTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Global Rankings */}
      {selectedTab === 'global' && (
        <Card>
          <div className="p-6">
            <h4 className="font-semibold mb-4">Global Leaderboard</h4>
            
            <div className="space-y-2">
              {globalRankings.map(entry => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    entry.user === 'You'
                      ? 'bg-blue-500/10 border border-blue-500'
                      : 'bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                      entry.rank === 1 ? 'bg-yellow-500 text-black' :
                      entry.rank === 2 ? 'bg-gray-400 text-black' :
                      entry.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {entry.rank}
                    </div>
                    <span className="text-3xl">{entry.avatar}</span>
                    <div>
                      <p className="font-semibold">{entry.user}</p>
                      <p className="text-sm text-gray-400">{entry.trades} trades • {entry.winRate}% win rate</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">+${entry.profit.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Total Profit</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Category Rankings */}
      {selectedTab === 'category' && (
        <div className="space-y-4">
          {categoryRankings.map((cat, idx) => (
            <Card key={idx}>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">{cat.category} Markets</h4>
                    <p className="text-sm text-gray-400">Leader: {cat.leader}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">+${cat.profit.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Top Profit</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Regional Leaderboards */}
      {selectedTab === 'regional' && (
        <Card>
          <div className="p-6">
            <h4 className="font-semibold mb-4">Regional Leaders</h4>
            
            <div className="space-y-3">
              {[
                { region: 'North America', leader: 'USATrader', profit: 35000 },
                { region: 'Europe', leader: 'EuroKing', profit: 28000 },
                { region: 'Asia', leader: 'AsiaAce', profit: 32000 },
              ].map((region, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">{region.region}</p>
                    <p className="text-sm text-gray-400">{region.leader}</p>
                  </div>
                  <p className="font-bold text-green-400">+${region.profit.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Hall of Fame */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">🏆 Hall of Fame</h4>
          
          <div className="space-y-3">
            {hallOfFame.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500 rounded-lg">
                <div>
                  <p className="font-bold text-yellow-400">{entry.year} Champion</p>
                  <p className="text-sm">{entry.champion}</p>
                </div>
                <p className="text-xl font-bold text-yellow-400">${entry.profit.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
