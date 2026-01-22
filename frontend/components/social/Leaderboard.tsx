'use client';

import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { useState } from 'react';

interface Trader {
  rank: number;
  address: string;
  username: string;
  totalProfit: number;
  winRate: number;
  totalTrades: number;
  badge?: string;
}

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');

  // Mock leaderboard data
  const traders: Trader[] = [
    { rank: 1, address: '0x1234...5678', username: 'CryptoKing', totalProfit: 5420.50, winRate: 78.5, totalTrades: 456, badge: '👑' },
    { rank: 2, address: '0x2345...6789', username: 'MarketMaster', totalProfit: 4890.25, winRate: 75.2, totalTrades: 389, badge: '🥈' },
    { rank: 3, address: '0x3456...7890', username: 'PredictPro', totalProfit: 4125.75, winRate: 72.8, totalTrades: 312, badge: '🥉' },
    { rank: 4, address: '0x4567...8901', username: 'TradeWizard', totalProfit: 3650.00, winRate: 70.5, totalTrades: 278 },
    { rank: 5, address: '0x5678...9012', username: 'BullRunner', totalProfit: 3210.50, winRate: 68.9, totalTrades: 245 },
    { rank: 6, address: '0x6789...0123', username: 'SmartBear', totalProfit: 2980.25, winRate: 67.3, totalTrades: 223 },
    { rank: 7, address: '0x7890...1234', username: 'QuickTrade', totalProfit: 2750.00, winRate: 65.8, totalTrades: 198 },
    { rank: 8, address: '0x8901...2345', username: 'LongShot', totalProfit: 2540.75, winRate: 64.2, totalTrades: 187 },
    { rank: 9, address: '0x9012...3456', username: 'RiskTaker', totalProfit: 2350.50, winRate: 62.7, totalTrades: 165 },
    { rank: 10, address: '0x0123...4567', username: 'SteadyGains', totalProfit: 2180.25, winRate: 61.5, totalTrades: 152 },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">🏆 Leaderboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeframe === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeframe === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframe('alltime')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeframe === 'alltime'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {traders.map((trader) => (
          <div
            key={trader.rank}
            className={`p-4 rounded-lg transition-all ${
              trader.rank <= 3
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`text-2xl font-bold w-8 ${getRankColor(trader.rank)}`}>
                {trader.badge || `#${trader.rank}`}
              </div>
              <Avatar fallback={trader.username[0]} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{trader.username}</span>
                  {trader.rank <= 3 && (
                    <Badge variant={trader.rank === 1 ? 'yellow' : trader.rank === 2 ? 'gray' : 'orange'}>
                      Top {trader.rank}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-mono">{trader.address}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  ${trader.totalProfit.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {trader.winRate}% Win Rate • {trader.totalTrades} Trades
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Compete for the top spot!</strong> Top 10 traders earn exclusive badges and rewards.
        </p>
      </div>
    </Card>
  );
}
