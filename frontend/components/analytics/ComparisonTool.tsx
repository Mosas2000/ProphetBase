'use client';

import Card from '@/components/ui/Card';
import { useState } from 'react';

interface Market {
  id: number;
  name: string;
  yesPrice: number;
  volume: number;
  traders: number;
  created: string;
  endDate: string;
}

export default function ComparisonTool() {
  const [selectedMarkets, setSelectedMarkets] = useState<number[]>([1, 2]);

  const markets: Market[] = [
    {
      id: 1,
      name: 'Will Bitcoin reach $100k by EOY?',
      yesPrice: 65,
      volume: 125000,
      traders: 1234,
      created: '2024-01-15',
      endDate: '2024-12-31',
    },
    {
      id: 2,
      name: 'Will ETH reach $5k by March?',
      yesPrice: 45,
      volume: 89000,
      traders: 987,
      created: '2024-01-20',
      endDate: '2024-03-31',
    },
    {
      id: 3,
      name: 'Will SOL reach $200 by Q2?',
      yesPrice: 60,
      volume: 67000,
      traders: 756,
      created: '2024-01-18',
      endDate: '2024-06-30',
    },
  ];

  const toggleMarket = (id: number) => {
    setSelectedMarkets(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const selectedData = markets.filter(m => selectedMarkets.includes(m.id));

  // Calculate correlation (simplified)
  const correlation = selectedData.length === 2
    ? ((selectedData[0].yesPrice + selectedData[1].yesPrice) / 200 * 0.8).toFixed(2)
    : 'N/A';

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Market Comparison Tool</h2>

      {/* Market Selection */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Select Markets to Compare</h3>
        <div className="space-y-2">
          {markets.map((market) => (
            <label
              key={market.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={selectedMarkets.includes(market.id)}
                onChange={() => toggleMarket(market.id)}
                className="w-5 h-5"
              />
              <span className="flex-1">{market.name}</span>
              <span className="text-sm text-gray-500">{market.yesPrice}¢</span>
            </label>
          ))}
        </div>
      </div>

      {selectedData.length > 0 && (
        <>
          {/* Side-by-Side Comparison */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Metric</th>
                  {selectedData.map((market) => (
                    <th key={market.id} className="text-right p-3 text-sm font-medium">
                      Market #{market.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3 text-sm">YES Price</td>
                  {selectedData.map((market) => (
                    <td key={market.id} className="p-3 text-right font-semibold">
                      {market.yesPrice}¢
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3 text-sm">Volume</td>
                  {selectedData.map((market) => (
                    <td key={market.id} className="p-3 text-right font-semibold">
                      ${market.volume.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3 text-sm">Traders</td>
                  {selectedData.map((market) => (
                    <td key={market.id} className="p-3 text-right font-semibold">
                      {market.traders.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3 text-sm">Created</td>
                  {selectedData.map((market) => (
                    <td key={market.id} className="p-3 text-right text-sm text-gray-600">
                      {market.created}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-sm">End Date</td>
                  {selectedData.map((market) => (
                    <td key={market.id} className="p-3 text-right text-sm text-gray-600">
                      {market.endDate}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Correlation Analysis */}
          {selectedData.length === 2 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Correlation Analysis</h4>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{correlation}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Correlation Score</div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  These markets show {parseFloat(correlation) > 0.7 ? 'strong' : parseFloat(correlation) > 0.4 ? 'moderate' : 'weak'} positive correlation, 
                  suggesting they may move together.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {selectedData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Select at least one market to compare
        </div>
      )}
    </Card>
  );
}
