'use client';

import { useState } from 'react';

interface LeaderboardEntry {
  rank: number;
  user: {
    address: string;
    username: string;
    avatar: string;
  };
  stats: {
    totalProfit?: number;
    winRate?: number;
    totalVolume?: number;
    marketsCreated?: number;
    accuracy?: number;
    streak?: number;
  };
  change: number; // Position change from previous period
}

export default function Leaderboards() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>(
    '7d'
  );
  const [category, setCategory] = useState<
    'profit' | 'volume' | 'winrate' | 'creators' | 'accuracy' | 'streak'
  >('profit');

  const leaderboards = {
    profit: [
      {
        rank: 1,
        user: {
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          username: 'ProphetKing',
          avatar: '👑',
        },
        stats: { totalProfit: 45230, winRate: 72.5 },
        change: 2,
      },
      {
        rank: 2,
        user: {
          address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
          username: 'WhaleTrader',
          avatar: '🐋',
        },
        stats: { totalProfit: 38950, winRate: 68.3 },
        change: -1,
      },
      {
        rank: 3,
        user: {
          address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
          username: 'DiamondHands',
          avatar: '💎',
        },
        stats: { totalProfit: 31450, winRate: 65.8 },
        change: 1,
      },
      {
        rank: 4,
        user: {
          address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
          username: 'SmartMoney',
          avatar: '🧠',
        },
        stats: { totalProfit: 28120, winRate: 70.2 },
        change: -2,
      },
      {
        rank: 5,
        user: {
          address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          username: 'RocketTrader',
          avatar: '🚀',
        },
        stats: { totalProfit: 25890, winRate: 63.7 },
        change: 0,
      },
    ],
    volume: [
      {
        rank: 1,
        user: {
          address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
          username: 'WhaleTrader',
          avatar: '🐋',
        },
        stats: { totalVolume: 1250000 },
        change: 0,
      },
      {
        rank: 2,
        user: {
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          username: 'ProphetKing',
          avatar: '👑',
        },
        stats: { totalVolume: 890000 },
        change: 1,
      },
      {
        rank: 3,
        user: {
          address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
          username: 'DiamondHands',
          avatar: '💎',
        },
        stats: { totalVolume: 675000 },
        change: -1,
      },
    ],
    winrate: [
      {
        rank: 1,
        user: {
          address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
          username: 'SmartMoney',
          avatar: '🧠',
        },
        stats: { winRate: 78.9, totalProfit: 28120 },
        change: 3,
      },
      {
        rank: 2,
        user: {
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          username: 'ProphetKing',
          avatar: '👑',
        },
        stats: { winRate: 75.2, totalProfit: 45230 },
        change: 0,
      },
    ],
    creators: [
      {
        rank: 1,
        user: {
          address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          username: 'MarketMaker',
          avatar: '🏭',
        },
        stats: { marketsCreated: 127, totalVolume: 2450000 },
        change: 0,
      },
    ],
    accuracy: [
      {
        rank: 1,
        user: {
          address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
          username: 'Oracle',
          avatar: '🔮',
        },
        stats: { accuracy: 82.3, marketsCreated: 45 },
        change: 1,
      },
    ],
    streak: [
      {
        rank: 1,
        user: {
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          username: 'LuckyStreak',
          avatar: '🔥',
        },
        stats: { streak: 23, totalProfit: 15600 },
        change: 5,
      },
    ],
  };

  const currentLeaderboard = leaderboards[category];

  const getCategoryLabel = (cat: typeof category) => {
    const labels = {
      profit: 'Total Profit',
      volume: 'Trading Volume',
      winrate: 'Win Rate',
      creators: 'Market Creators',
      accuracy: 'Prediction Accuracy',
      streak: 'Win Streak',
    };
    return labels[cat];
  };

  const getCategoryIcon = (cat: typeof category) => {
    const icons = {
      profit: '💰',
      volume: '📊',
      winrate: '🎯',
      creators: '🏭',
      accuracy: '🔮',
      streak: '🔥',
    };
    return icons[cat];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leaderboards</h2>
          <p className="text-sm text-gray-600">
            Top performers across all categories
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {(['24h', '7d', '30d', 'all'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tf === 'all' ? 'All Time' : tf}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-6 gap-2 mb-6">
        {(
          [
            'profit',
            'volume',
            'winrate',
            'creators',
            'accuracy',
            'streak',
          ] as const
        ).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`p-4 rounded-lg text-center transition-all ${
              category === cat
                ? 'bg-blue-50 border-2 border-blue-600 shadow-sm'
                : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
            }`}
          >
            <div className="text-3xl mb-1">{getCategoryIcon(cat)}</div>
            <div
              className={`text-xs font-medium capitalize ${
                category === cat ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              {cat === 'winrate' ? 'Win Rate' : cat}
            </div>
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-2">
        {currentLeaderboard.map((entry, index) => (
          <div
            key={entry.rank}
            className={`flex items-center p-4 rounded-lg transition-all ${
              entry.rank === 1
                ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400'
                : entry.rank === 2
                ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-400'
                : entry.rank === 3
                ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-400'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {/* Rank */}
            <div className="flex items-center space-x-3 w-20">
              <div
                className={`text-2xl font-bold ${
                  entry.rank === 1
                    ? 'text-yellow-600'
                    : entry.rank === 2
                    ? 'text-gray-600'
                    : entry.rank === 3
                    ? 'text-orange-600'
                    : 'text-gray-900'
                }`}
              >
                {entry.rank === 1
                  ? '🥇'
                  : entry.rank === 2
                  ? '🥈'
                  : entry.rank === 3
                  ? '🥉'
                  : `#${entry.rank}`}
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3 flex-1">
              <span className="text-3xl">{entry.user.avatar}</span>
              <div>
                <div className="font-semibold text-gray-900">
                  {entry.user.username}
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  {entry.user.address.slice(0, 10)}...
                  {entry.user.address.slice(-6)}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6">
              {entry.stats.totalProfit !== undefined && (
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    ${entry.stats.totalProfit.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Profit</div>
                </div>
              )}

              {entry.stats.totalVolume !== undefined && (
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">
                    ${entry.stats.totalVolume.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Volume</div>
                </div>
              )}

              {entry.stats.winRate !== undefined && (
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-600">
                    {entry.stats.winRate}%
                  </div>
                  <div className="text-xs text-gray-600">Win Rate</div>
                </div>
              )}

              {entry.stats.marketsCreated !== undefined && (
                <div className="text-right">
                  <div className="text-xl font-bold text-orange-600">
                    {entry.stats.marketsCreated}
                  </div>
                  <div className="text-xs text-gray-600">Markets</div>
                </div>
              )}

              {entry.stats.accuracy !== undefined && (
                <div className="text-right">
                  <div className="text-xl font-bold text-indigo-600">
                    {entry.stats.accuracy}%
                  </div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
              )}

              {entry.stats.streak !== undefined && (
                <div className="text-right">
                  <div className="text-xl font-bold text-red-600">
                    {entry.stats.streak} 🔥
                  </div>
                  <div className="text-xs text-gray-600">Streak</div>
                </div>
              )}

              {/* Change Indicator */}
              <div className="w-16 text-right">
                {entry.change > 0 && (
                  <div className="flex items-center justify-end text-green-600">
                    <span className="text-lg">↑</span>
                    <span className="text-sm font-medium">{entry.change}</span>
                  </div>
                )}
                {entry.change < 0 && (
                  <div className="flex items-center justify-end text-red-600">
                    <span className="text-lg">↓</span>
                    <span className="text-sm font-medium">
                      {Math.abs(entry.change)}
                    </span>
                  </div>
                )}
                {entry.change === 0 && (
                  <div className="text-gray-400 text-lg">−</div>
                )}
              </div>
            </div>

            {/* View Profile Button */}
            <button className="ml-4 px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              View →
            </button>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">12,847</div>
            <div className="text-sm text-gray-600">Total Traders</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">$2.4M</div>
            <div className="text-sm text-gray-600">Total Profits</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">$18.7M</div>
            <div className="text-sm text-gray-600">Total Volume</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">64.3%</div>
            <div className="text-sm text-gray-600">Avg Win Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
