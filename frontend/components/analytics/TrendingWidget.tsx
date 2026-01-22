'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

interface TrendingMarket {
  id: number;
  name: string;
  yesPrice: number;
  volume24h: number;
  volumeChange: number;
  traders: number;
  category: string;
}

export default function TrendingWidget() {
  const trendingMarkets: TrendingMarket[] = [
    {
      id: 1,
      name: 'Will Bitcoin reach $100k by EOY?',
      yesPrice: 65,
      volume24h: 125000,
      volumeChange: 245,
      traders: 1234,
      category: 'Crypto',
    },
    {
      id: 2,
      name: 'Will ETH reach $5k by March?',
      yesPrice: 45,
      volume24h: 89000,
      volumeChange: 189,
      traders: 987,
      category: 'Crypto',
    },
    {
      id: 3,
      name: 'Super Bowl Winner 2025',
      yesPrice: 72,
      volume24h: 67000,
      volumeChange: 156,
      traders: 756,
      category: 'Sports',
    },
    {
      id: 4,
      name: 'Will AI reach AGI by 2026?',
      yesPrice: 38,
      volume24h: 54000,
      volumeChange: 134,
      traders: 645,
      category: 'Tech',
    },
    {
      id: 5,
      name: 'Will SOL reach $200 by Q2?',
      yesPrice: 60,
      volume24h: 45000,
      volumeChange: 112,
      traders: 534,
      category: 'Crypto',
    },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">🔥 Trending Markets</h2>
        <Badge variant="red">Hot</Badge>
      </div>

      <div className="space-y-3">
        {trendingMarkets.map((market, idx) => (
          <div
            key={market.id}
            className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl font-bold text-gray-400">#{idx + 1}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold mb-1">{market.name}</h4>
                    <Badge variant="blue" className="text-xs">{market.category}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{market.yesPrice}¢</div>
                    <div className="text-xs text-gray-500">YES</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">24h Volume</div>
                    <div className="font-semibold">${(market.volume24h / 1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Change</div>
                    <div className="font-semibold text-green-600">+{market.volumeChange}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Traders</div>
                    <div className="font-semibold">{market.traders}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          🚀 Rising volume indicates growing interest • Updated every 5 minutes
        </p>
      </div>
    </Card>
  );
}
