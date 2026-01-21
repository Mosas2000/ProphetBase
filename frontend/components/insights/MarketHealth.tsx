'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface MarketHealthMetrics {
  healthScore: number;
  liquidity: number;
  participationRate: number;
  tradingActivity: number;
  priceStability: number;
}

export function MarketHealth() {
  const metrics: MarketHealthMetrics = {
    healthScore: 82,
    liquidity: 75,
    participationRate: 68,
    tradingActivity: 85,
    priceStability: 72,
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'from-green-600 to-green-400';
    if (score >= 60) return 'from-yellow-600 to-yellow-400';
    return 'from-red-600 to-red-400';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return { text: 'Excellent', variant: 'success' as const };
    if (score >= 60) return { text: 'Good', variant: 'warning' as const };
    return { text: 'Poor', variant: 'error' as const };
  };

  const healthLabel = getHealthLabel(metrics.healthScore);

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Market Health Score</h3>

          {/* Overall Health Score */}
          <div className={`bg-gradient-to-r ${getHealthColor(metrics.healthScore)} rounded-lg p-8 mb-6 text-center`}>
            <p className="text-sm text-white/80 mb-2">Overall Health</p>
            <p className="text-6xl font-bold text-white mb-3">{metrics.healthScore}</p>
            <Badge variant={healthLabel.variant} className="text-lg px-4 py-2">
              {healthLabel.text}
            </Badge>
          </div>

          {/* Health Metrics */}
          <div className="space-y-4">
            {/* Liquidity */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">💧 Liquidity</span>
                <span className="font-bold">{metrics.liquidity}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${getHealthColor(metrics.liquidity)}`}
                  style={{ width: `${metrics.liquidity}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Sufficient liquidity for smooth trading</p>
            </div>

            {/* Participation Rate */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">👥 Participation Rate</span>
                <span className="font-bold">{metrics.participationRate}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${getHealthColor(metrics.participationRate)}`}
                  style={{ width: `${metrics.participationRate}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Active trader engagement</p>
            </div>

            {/* Trading Activity */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">📊 Trading Activity</span>
                <span className="font-bold">{metrics.tradingActivity}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${getHealthColor(metrics.tradingActivity)}`}
                  style={{ width: `${metrics.tradingActivity}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">High volume and frequent trades</p>
            </div>

            {/* Price Stability */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">⚖️ Price Stability</span>
                <span className="font-bold">{metrics.priceStability}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${getHealthColor(metrics.priceStability)}`}
                  style={{ width: `${metrics.priceStability}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Moderate volatility, healthy price discovery</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Metrics */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Detailed Metrics</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Liquidity</p>
              <p className="text-2xl font-bold">$125,000</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Unique Traders</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">24h Volume</p>
              <p className="text-2xl font-bold">$45,600</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Avg Trade Size</p>
              <p className="text-2xl font-bold">$380</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Bid-Ask Spread</p>
              <p className="text-2xl font-bold">0.5%</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Market Depth</p>
              <p className="text-2xl font-bold">$18,500</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Health Insights */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Health Insights</h4>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500 rounded-lg">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-medium text-green-400">Strong Trading Activity</p>
                <p className="text-sm text-gray-400">Volume is 45% above average for this market type</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-medium text-yellow-400">Moderate Participation</p>
                <p className="text-sm text-gray-400">Consider marketing to attract more traders</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-medium text-blue-400">Healthy Price Discovery</p>
                <p className="text-sm text-gray-400">Price movements reflect genuine market sentiment</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
