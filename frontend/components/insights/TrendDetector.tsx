'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface TrendingMarket {
  id: number;
  question: string;
  momentum: number;
  volume24h: number;
  priceChange: number;
  trend: 'breakout' | 'strong' | 'moderate' | 'weak';
}

export function TrendDetector() {
  const trending: TrendingMarket[] = [
    {
      id: 1,
      question: 'Will Bitcoin reach $100k by 2024?',
      momentum: 85,
      volume24h: 125000,
      priceChange: 15.5,
      trend: 'breakout',
    },
    {
      id: 2,
      question: 'Will ETH reach $5k by Q2?',
      momentum: 72,
      volume24h: 98000,
      priceChange: 8.2,
      trend: 'strong',
    },
    {
      id: 3,
      question: 'Will Lakers win championship?',
      momentum: 58,
      volume24h: 65000,
      priceChange: 5.1,
      trend: 'moderate',
    },
  ];

  const getTrendColor = (trend: TrendingMarket['trend']) => {
    switch (trend) {
      case 'breakout': return 'from-green-600 to-green-400';
      case 'strong': return 'from-green-500 to-green-300';
      case 'moderate': return 'from-yellow-500 to-yellow-300';
      case 'weak': return 'from-gray-500 to-gray-400';
    }
  };

  const getTrendBadge = (trend: TrendingMarket['trend']) => {
    switch (trend) {
      case 'breakout': return { variant: 'success' as const, label: '🚀 Breakout' };
      case 'strong': return { variant: 'success' as const, label: '📈 Strong' };
      case 'moderate': return { variant: 'warning' as const, label: '➡️ Moderate' };
      case 'weak': return { variant: 'default' as const, label: '📉 Weak' };
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">🔥 Trending Markets</h3>

          <div className="space-y-4">
            {trending.map((market, idx) => {
              const badge = getTrendBadge(market.trend);
              return (
                <Card key={market.id} className="border border-gray-700">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl font-bold text-gray-500">#{idx + 1}</span>
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </div>
                        <h4 className="font-semibold mb-2">{market.question}</h4>
                      </div>
                    </div>

                    {/* Momentum Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Momentum Score</span>
                        <span className="font-bold">{market.momentum}/100</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full bg-gradient-to-r ${getTrendColor(market.trend)}`}
                          style={{ width: `${market.momentum}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">24h Volume</p>
                        <p className="font-medium">${market.volume24h.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Price Change</p>
                        <p className={`font-medium ${market.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {market.priceChange >= 0 ? '+' : ''}{market.priceChange}%
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Momentum Indicators */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Momentum Indicators</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Bullish Momentum</p>
              <p className="text-3xl font-bold text-green-400">12</p>
              <p className="text-xs text-gray-400 mt-1">markets trending up</p>
            </div>

            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Bearish Momentum</p>
              <p className="text-3xl font-bold text-red-400">5</p>
              <p className="text-xs text-gray-400 mt-1">markets trending down</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Breakout Alerts */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Breakout Alerts</h4>
          
          <div className="space-y-3">
            {[
              { market: 'Bitcoin $100k', type: 'Volume Breakout', change: '+145%', time: '1h ago' },
              { market: 'ETH $5k', type: 'Price Breakout', change: '+12%', time: '3h ago' },
              { market: 'Lakers Championship', type: 'Momentum Surge', change: '+8%', time: '6h ago' },
            ].map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-medium">{alert.market}</p>
                    <p className="text-sm text-gray-400">{alert.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-400">{alert.change}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
