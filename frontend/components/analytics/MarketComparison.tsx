'use client';

import { useState } from 'react';

interface MarketComparison {
  id: string;
  question: string;
  volume: number;
  liquidity: number;
  traders: number;
  yesPrice: number;
  noPrice: number;
  volatility: number;
}

export default function MarketComparison() {
  const [markets] = useState<MarketComparison[]>([
    {
      id: '42',
      question: 'BTC reaches $100k by EOY',
      volume: 125000,
      liquidity: 45000,
      traders: 847,
      yesPrice: 0.68,
      noPrice: 0.32,
      volatility: 12.5,
    },
    {
      id: '89',
      question: 'ETH reaches $5k before BTC $100k',
      volume: 98000,
      liquidity: 38000,
      traders: 623,
      yesPrice: 0.45,
      noPrice: 0.55,
      volatility: 18.3,
    },
  ]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Market Comparison
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {markets.map((market) => (
          <div key={market.id} className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">
              {market.question}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Volume:</span>
                <span className="font-semibold">
                  ${market.volume.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Traders:</span>
                <span className="font-semibold">{market.traders}</span>
              </div>
              <div className="flex justify-between">
                <span>YES Price:</span>
                <span className="font-semibold text-green-600">
                  ${market.yesPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
