'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { useAccount } from 'wagmi';

export default function UserMetrics() {
  const { address } = useAccount();

  // Mock user metrics
  const metrics = {
    totalTrades: 156,
    wins: 107,
    losses: 49,
    winRate: 68.6,
    totalInvested: 5420,
    currentValue: 6875,
    totalProfit: 1455,
    roi: 26.8,
    avgTradeSize: 34.74,
    largestWin: 245,
    largestLoss: 89,
    sharpeRatio: 1.85,
    maxDrawdown: 12.5,
    profitFactor: 2.3,
  };

  const riskLevel = metrics.maxDrawdown < 10 ? 'Low' : metrics.maxDrawdown < 20 ? 'Medium' : 'High';
  const riskColor = riskLevel === 'Low' ? 'green' : riskLevel === 'Medium' ? 'yellow' : 'red';

  if (!address) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500">Connect wallet to view your metrics</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold mb-6">Your Performance Metrics</h2>

        {/* Win Rate */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Win Rate</span>
            <span className="text-2xl font-bold text-green-600">{metrics.winRate}%</span>
          </div>
          <ProgressBar value={metrics.winRate} className="h-3" />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{metrics.wins} wins</span>
            <span>{metrics.losses} losses</span>
          </div>
        </div>

        {/* ROI */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Return on Investment</div>
            <div className="text-3xl font-bold text-green-600">+{metrics.roi}%</div>
            <div className="text-sm text-gray-500 mt-1">${metrics.totalProfit.toLocaleString()} profit</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Invested</div>
            <div className="text-3xl font-bold">${metrics.totalInvested.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Current: ${metrics.currentValue.toLocaleString()}</div>
          </div>
        </div>

        {/* Trade Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500">Total Trades</div>
            <div className="text-xl font-bold">{metrics.totalTrades}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500">Avg Trade</div>
            <div className="text-xl font-bold">${metrics.avgTradeSize}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500">Largest Win</div>
            <div className="text-xl font-bold text-green-600">${metrics.largestWin}</div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Risk Metrics</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <div className="font-medium">Risk Level</div>
              <div className="text-sm text-gray-500">Based on drawdown and volatility</div>
            </div>
            <Badge variant={riskColor}>{riskLevel}</Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Sharpe Ratio</div>
              <div className="text-2xl font-bold">{metrics.sharpeRatio}</div>
              <div className="text-xs text-gray-500 mt-1">Risk-adjusted return</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Max Drawdown</div>
              <div className="text-2xl font-bold text-red-600">{metrics.maxDrawdown}%</div>
              <div className="text-xs text-gray-500 mt-1">Largest decline</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Profit Factor</div>
              <div className="text-2xl font-bold text-green-600">{metrics.profitFactor}</div>
              <div className="text-xs text-gray-500 mt-1">Wins vs losses</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
