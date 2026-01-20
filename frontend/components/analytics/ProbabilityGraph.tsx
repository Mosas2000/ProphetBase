'use client';

import Card from '@/components/ui/Card';
import { useState } from 'react';

interface ProbabilityPoint {
  timestamp: number;
  yesPrice: number;
  noPrice: number;
}

interface MarketData {
  id: number;
  name: string;
  color: string;
  data: ProbabilityPoint[];
}

export default function ProbabilityGraph() {
  const [selectedMarkets, setSelectedMarkets] = useState<number[]>([1]);

  // Mock probability data
  const markets: MarketData[] = [
    {
      id: 1,
      name: 'Bitcoin $100k',
      color: '#0052FF',
      data: [
        { timestamp: 1, yesPrice: 50, noPrice: 50 },
        { timestamp: 2, yesPrice: 55, noPrice: 45 },
        { timestamp: 3, yesPrice: 60, noPrice: 40 },
        { timestamp: 4, yesPrice: 65, noPrice: 35 },
        { timestamp: 5, yesPrice: 70, noPrice: 30 },
      ],
    },
    {
      id: 2,
      name: 'ETH $5k',
      color: '#10B981',
      data: [
        { timestamp: 1, yesPrice: 60, noPrice: 40 },
        { timestamp: 2, yesPrice: 55, noPrice: 45 },
        { timestamp: 3, yesPrice: 50, noPrice: 50 },
        { timestamp: 4, yesPrice: 45, noPrice: 55 },
        { timestamp: 5, yesPrice: 45, noPrice: 55 },
      ],
    },
  ];

  const toggleMarket = (id: number) => {
    setSelectedMarkets(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const maxPrice = 100;

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Probability Over Time</h2>

      {/* Market Selection */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {markets.map((market) => (
          <button
            key={market.id}
            onClick={() => toggleMarket(market.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedMarkets.includes(market.id)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
            }`}
          >
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: market.color }}
            />
            {market.name}
          </button>
        ))}
      </div>

      {/* Graph */}
      <div className="relative h-80 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>100¢</span>
          <span>75¢</span>
          <span>50¢</span>
          <span>25¢</span>
          <span>0¢</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-12 right-6 top-6 bottom-6">
          {[0, 25, 50, 75, 100].map((value) => (
            <div
              key={value}
              className="absolute w-full border-t border-gray-200 dark:border-gray-700"
              style={{ bottom: `${value}%` }}
            />
          ))}
        </div>

        {/* Lines */}
        <svg className="absolute left-12 right-6 top-6 bottom-6 w-[calc(100%-4.5rem)] h-[calc(100%-3rem)]">
          {markets
            .filter(m => selectedMarkets.includes(m.id))
            .map((market) => {
              const points = market.data.map((d, i) => ({
                x: (i / (market.data.length - 1)) * 100,
                y: 100 - d.yesPrice,
              }));

              const pathData = points
                .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`)
                .join(' ');

              return (
                <g key={market.id}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke={market.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {points.map((p, i) => (
                    <circle
                      key={i}
                      cx={`${p.x}%`}
                      cy={`${p.y}%`}
                      r="4"
                      fill={market.color}
                      className="cursor-pointer hover:r-6 transition-all"
                    />
                  ))}
                </g>
              );
            })}
        </svg>

        {/* X-axis labels */}
        <div className="absolute left-12 right-6 bottom-0 flex justify-between text-xs text-gray-500">
          <span>Day 1</span>
          <span>Day 2</span>
          <span>Day 3</span>
          <span>Day 4</span>
          <span>Day 5</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Avg Movement</div>
          <div className="text-xl font-bold">±8.5¢</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Volatility</div>
          <div className="text-xl font-bold">Medium</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Trend</div>
          <div className="text-xl font-bold text-green-600">↗ Bullish</div>
        </div>
      </div>
    </Card>
  );
}
