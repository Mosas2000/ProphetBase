'use client';

import { useState } from 'react';

interface DataPoint {
  date: string;
  volume: number;
  traders: number;
  markets: number;
}

export default function DataVisualizer() {
  const [data] = useState<DataPoint[]>([
    { date: '2024-01', volume: 1200000, traders: 5600, markets: 127 },
    { date: '2024-02', volume: 1580000, traders: 6890, markets: 145 },
    { date: '2024-03', volume: 2340000, traders: 8234, markets: 168 },
    { date: '2024-04', volume: 3120000, traders: 10456, markets: 192 },
  ]);

  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Data Visualizer</h2>
        <div className="flex space-x-2">
          {(['line', 'bar', 'area'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                chartType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 h-80 flex items-center justify-center">
        <div className="text-gray-400">Chart visualization placeholder</div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">$3.12M</div>
          <p className="text-sm text-gray-600">Current Volume</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">10,456</div>
          <p className="text-sm text-gray-600">Active Traders</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">192</div>
          <p className="text-sm text-gray-600">Total Markets</p>
        </div>
      </div>
    </div>
  );
}
