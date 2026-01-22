'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function PerformanceDashboard() {
  const { address } = useAccount();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  // Mock performance data
  const monthlyPnL = [
    { month: 'Jan', profit: 120 },
    { month: 'Feb', profit: -45 },
    { month: 'Mar', profit: 280 },
    { month: 'Apr', profit: 156 },
    { month: 'May', profit: 345 },
    { month: 'Jun', profit: 198 },
  ];

  const strategies = [
    { name: 'Momentum Trading', trades: 45, winRate: 72, profit: 890 },
    { name: 'Value Betting', trades: 32, winRate: 68, profit: 645 },
    { name: 'Contrarian', trades: 18, winRate: 55, profit: 234 },
  ];

  const totalProfit = monthlyPnL.reduce((sum, m) => sum + m.profit, 0);
  const maxProfit = Math.max(...monthlyPnL.map(m => Math.abs(m.profit)));

  if (!address) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500">Connect wallet to view performance dashboard</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-sm capitalize ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Monthly P&L Chart */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Monthly P&L</h3>
          <div className="relative h-48">
            <div className="absolute inset-0 flex items-end justify-between gap-2">
              {monthlyPnL.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full relative group">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        data.profit >= 0
                          ? 'bg-gradient-to-t from-green-600 to-green-400'
                          : 'bg-gradient-to-b from-red-600 to-red-400'
                      }`}
                      style={{
                        height: `${(Math.abs(data.profit) / maxProfit) * 100}%`,
                        marginTop: data.profit < 0 ? 'auto' : '0',
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${data.profit}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-4">
            <span className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}${totalProfit}
            </span>
            <span className="text-sm text-gray-500 ml-2">Total P&L</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Strategy Effectiveness</h3>
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <div
              key={strategy.name}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{strategy.name}</h4>
                  <p className="text-sm text-gray-500">{strategy.trades} trades</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">${strategy.profit}</div>
                  <Badge variant={strategy.winRate >= 70 ? 'green' : strategy.winRate >= 60 ? 'blue' : 'gray'}>
                    {strategy.winRate}% win rate
                  </Badge>
                </div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${strategy.winRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
