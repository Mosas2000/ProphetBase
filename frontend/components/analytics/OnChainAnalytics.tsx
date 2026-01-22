'use client';

import { useState } from 'react';

interface OnChainMetric {
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  category: 'address' | 'transaction' | 'value' | 'gas';
}

export default function OnChainAnalytics() {
  const [metrics] = useState<OnChainMetric[]>([
    { name: 'Active Addresses', value: '12,847', change: +15.3, trend: 'up', category: 'address' },
    { name: 'New Addresses (24h)', value: '892', change: +8.7, trend: 'up', category: 'address' },
    { name: 'Total Transactions', value: '45,231', change: +12.1, trend: 'up', category: 'transaction' },
    { name: 'Transaction Volume', value: '$18.7M', change: +22.5, trend: 'up', category: 'value' },
    { name: 'Avg Gas Price', value: '0.000045 ETH', change: -5.2, trend: 'down', category: 'gas' },
    { name: 'Contract Interactions', value: '23,456', change: +18.9, trend: 'up', category: 'transaction' },
    { name: 'Unique Traders', value: '8,234', change: +10.3, trend: 'up', category: 'address' },
    { name: 'Total Value Locked', value: '$42.3M', change: +6.8, trend: 'up', category: 'value' }
  ]);

  const getCategoryIcon = (category: string) => {
    const icons = {
      address: '👤',
      transaction: '📊',
      value: '💰',
      gas: '⛽'
    };
    return icons[category as keyof typeof icons] || '📈';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">On-Chain Analytics</h2>
          <p className="text-sm text-gray-600">Real-time blockchain metrics and insights</p>
        </div>
        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
          Base Network
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{getCategoryIcon(metric.category)}</span>
              <span className={`text-sm font-semibold ${
                metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
