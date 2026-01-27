'use client';

import { useState, useEffect } from 'react';
import { PieChart, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

interface Asset {
  symbol: string;
  quantity: number;
  value: number;
  allocation: number;
  performance24h: number;
}

interface PerformanceData {
  period: string;
  return: number;
  benchmark: number;
}

export default function PortfolioAnalytics() {
  const [totalValue, setTotalValue] = useState(125430);
  const [assets, setAssets] = useState<Asset[]>([
    { symbol: 'BTC', quantity: 2.5, value: 125500, allocation: 50, performance24h: 2.3 },
    { symbol: 'ETH', quantity: 45, value: 63750, allocation: 25.4, performance24h: 1.8 },
    { symbol: 'SOL', quantity: 500, value: 35000, allocation: 14, performance24h: -0.5 },
    { symbol: 'USDT', quantity: 26680, value: 26680, allocation: 10.6, performance24h: 0 },
  ]);

  const [timeframe, setTimeframe] = useState('7D');
  const [performance, setPerformance] = useState<PerformanceData[]>([
    { period: '1D', return: 2.1, benchmark: 1.5 },
    { period: '7D', return: 5.3, benchmark: 4.2 },
    { period: '1M', return: 12.4, benchmark: 8.9 },
    { period: '3M', return: 28.7, benchmark: 22.3 },
    { period: '1Y', return: 145.2, benchmark: 98.4 },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Portfolio Analytics</h1>
          <p className="text-slate-400">Comprehensive portfolio performance and allocation analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-slate-400">Total Value</span>
            </div>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-400">24h Change</span>
            </div>
            <div className="text-2xl font-bold text-green-400">+$2,145</div>
            <div className="text-xs text-slate-400">+1.74%</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-400">Total Assets</span>
            </div>
            <div className="text-2xl font-bold">{assets.length}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-5 h-5 text-amber-400" />
              <span className="text-sm text-slate-400">Diversification</span>
            </div>
            <div className="text-2xl font-bold">Good</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Asset Allocation</h2>
            <div className="space-y-4">
              {assets.map((asset) => (
                <div key={asset.symbol}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{asset.symbol}</span>
                    <span className="text-slate-400">{asset.allocation.toFixed(1)}%</span>
                  </div>
                  <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      style={{ width: `${asset.allocation}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-slate-400">${asset.value.toLocaleString()}</span>
                    <span className={asset.performance24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {asset.performance24h >= 0 ? '+' : ''}
                      {asset.performance24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
            <div className="space-y-3">
              {performance.map((perf) => (
                <div
                  key={perf.period}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                >
                  <span className="font-medium">{perf.period}</span>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Portfolio</div>
                      <div className={`font-bold ${perf.return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {perf.return >= 0 ? '+' : ''}
                        {perf.return.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Benchmark</div>
                      <div className="font-medium text-slate-300">{perf.benchmark.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-4">Portfolio Composition</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-3 text-slate-400 font-medium">Asset</th>
                  <th className="text-right p-3 text-slate-400 font-medium">Quantity</th>
                  <th className="text-right p-3 text-slate-400 font-medium">Value</th>
                  <th className="text-right p-3 text-slate-400 font-medium">Allocation</th>
                  <th className="text-right p-3 text-slate-400 font-medium">24h Change</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.symbol} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="p-3 font-bold">{asset.symbol}</td>
                    <td className="p-3 text-right font-mono">{asset.quantity.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono">${asset.value.toLocaleString()}</td>
                    <td className="p-3 text-right">{asset.allocation.toFixed(1)}%</td>
                    <td className="p-3 text-right">
                      <span className={`font-bold ${asset.performance24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.performance24h >= 0 ? '+' : ''}
                        {asset.performance24h.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
