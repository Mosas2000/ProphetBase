'use client';

import { useState } from 'react';

export default function RiskMetrics() {
  const [metrics] = useState({
    var: 2450, // Value at Risk
    sharpeRatio: 1.85,
    maxDrawdown: 12.3,
    beta: 1.12,
    winRate: 68.5,
    avgWin: 145,
    avgLoss: 89,
    profitFactor: 1.63
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Metrics Dashboard</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-red-600">${metrics.var.toLocaleString()}</div>
          <p className="text-sm text-gray-600 mt-1">Value at Risk</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">{metrics.sharpeRatio}</div>
          <p className="text-sm text-gray-600 mt-1">Sharpe Ratio</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-orange-600">{metrics.maxDrawdown}%</div>
          <p className="text-sm text-gray-600 mt-1">Max Drawdown</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600">{metrics.profitFactor}</div>
          <p className="text-sm text-gray-600 mt-1">Profit Factor</p>
        </div>
      </div>
    </div>
  );
}
