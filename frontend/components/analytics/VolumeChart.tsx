'use client';

import Card from '@/components/ui/Card';
import { useState } from 'react';

interface VolumeData {
  date: string;
  volume: number;
  category?: string;
}

export default function VolumeChart() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('24h');

  // Mock volume data
  const volumeData: VolumeData[] = [
    { date: '00:00', volume: 1200 },
    { date: '04:00', volume: 800 },
    { date: '08:00', volume: 2400 },
    { date: '12:00', volume: 3600 },
    { date: '16:00', volume: 2800 },
    { date: '20:00', volume: 1600 },
  ];

  const categoryVolume = [
    { category: 'Crypto', volume: 45000, percentage: 45 },
    { category: 'Sports', volume: 30000, percentage: 30 },
    { category: 'Politics', volume: 15000, percentage: 15 },
    { category: 'Entertainment', volume: 10000, percentage: 10 },
  ];

  const totalVolume = volumeData.reduce((sum, d) => sum + d.volume, 0);
  const maxVolume = Math.max(...volumeData.map(d => d.volume));

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trading Volume</h2>
          <div className="flex gap-2">
            {(['24h', '7d', '30d', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-3xl font-bold mb-1">${totalVolume.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Total Volume (24h)</div>
        </div>

        {/* Volume Chart */}
        <div className="relative h-64 mb-6">
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {volumeData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full relative group">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                    style={{ height: `${(data.volume / maxVolume) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${data.volume.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">{data.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-200 dark:border-gray-700 pt-4">
          <div>
            <div className="text-sm text-gray-500">Peak Volume</div>
            <div className="text-lg font-bold">${maxVolume.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Avg Volume</div>
            <div className="text-lg font-bold">${Math.round(totalVolume / volumeData.length).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Markets Active</div>
            <div className="text-lg font-bold">24</div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Volume by Category</h3>
        <div className="space-y-4">
          {categoryVolume.map((cat) => (
            <div key={cat.category}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">{cat.category}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  ${cat.volume.toLocaleString()} ({cat.percentage}%)
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
