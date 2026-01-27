'use client';

import { Clock, Filter, Flame, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface HeatMapCell {
  x: number;
  y: number;
  value: number;
  label: string;
  volume: number;
  change: number;
}

type ViewMode = 'volume' | 'activity' | 'time' | 'price';

export default function HeatMap() {
  const [viewMode, setViewMode] = useState<ViewMode>('volume');
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [hoveredCell, setHoveredCell] = useState<HeatMapCell | null>(null);

  // Generate heatmap data
  const [heatmapData] = useState<HeatMapCell[]>(() => {
    const markets = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'MATIC', 'AVAX', 'LINK'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const data: HeatMapCell[] = [];

    markets.forEach((market, marketIdx) => {
      hours.forEach((hour) => {
        data.push({
          x: hour,
          y: marketIdx,
          value: Math.random() * 100,
          label: `${market} ${hour}:00`,
          volume: Math.random() * 10000000,
          change: (Math.random() - 0.5) * 10
        });
      });
    });

    return data;
  });

  const getColor = (value: number, mode: ViewMode) => {
    if (mode === 'price') {
      // Diverging color scale for price changes
      if (value > 50) {
        const intensity = (value - 50) / 50;
        return `rgba(16, 185, 129, ${0.3 + intensity * 0.7})`;
      } else {
        const intensity = (50 - value) / 50;
        return `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`;
      }
    } else {
      // Sequential color scale for volume/activity
      const intensity = value / 100;
      return `rgba(99, 102, 241, ${0.2 + intensity * 0.8})`;
    }
  };

  const markets = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'MATIC', 'AVAX', 'LINK'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatValue = (value: number) => {
    if (viewMode === 'volume') return `$${(value * 100000).toFixed(0)}`;
    if (viewMode === 'price') return `${value > 50 ? '+' : ''}${((value - 50) / 5).toFixed(2)}%`;
    return value.toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl">
              <Flame className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Market Heatmap</h1>
              <p className="text-slate-400">Visualize market activity patterns and volume distribution</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <button
                  onClick={() => setViewMode('volume')}
                  className={`px-4 py-2 rounded transition-colors ${
                    viewMode === 'volume'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Volume
                </button>
                <button
                  onClick={() => setViewMode('activity')}
                  className={`px-4 py-2 rounded transition-colors ${
                    viewMode === 'activity'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Activity
                </button>
                <button
                  onClick={() => setViewMode('time')}
                  className={`px-4 py-2 rounded transition-colors ${
                    viewMode === 'time'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Time Patterns
                </button>
                <button
                  onClick={() => setViewMode('price')}
                  className={`px-4 py-2 rounded transition-colors ${
                    viewMode === 'price'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Price Change
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                {['1h', '24h', '7d', '30d'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1.5 rounded transition-colors text-sm ${
                      selectedPeriod === period
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {viewMode === 'volume' && 'Trading Volume Heatmap'}
              {viewMode === 'activity' && 'Market Activity Heatmap'}
              {viewMode === 'time' && 'Time-Based Patterns'}
              {viewMode === 'price' && 'Price Change Heatmap'}
            </h2>
            
            {/* Legend */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">Low</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-4 rounded-sm"
                    style={{
                      backgroundColor: getColor(i * 10, viewMode)
                    }}
                  />
                ))}
              </div>
              <span className="text-slate-400">High</span>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            <svg width="100%" height="450" className="min-w-[900px]">
              {/* Y-axis labels (Markets) */}
              {markets.map((market, idx) => (
                <text
                  key={`market-${idx}`}
                  x="50"
                  y={idx * 50 + 30}
                  fill="#94a3b8"
                  fontSize="14"
                  fontWeight="600"
                  textAnchor="end"
                >
                  {market}
                </text>
              ))}

              {/* X-axis labels (Hours) */}
              {hours.filter((_, i) => i % 2 === 0).map((hour) => (
                <text
                  key={`hour-${hour}`}
                  x={70 + hour * 35}
                  y="440"
                  fill="#94a3b8"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {hour}:00
                </text>
              ))}

              {/* Heatmap cells */}
              {heatmapData.map((cell, idx) => {
                const x = 60 + cell.x * 35;
                const y = cell.y * 50 + 10;
                
                return (
                  <g key={idx}>
                    <rect
                      x={x}
                      y={y}
                      width="32"
                      height="32"
                      fill={getColor(cell.value, viewMode)}
                      stroke="#1e293b"
                      strokeWidth="2"
                      rx="4"
                      className="cursor-pointer transition-all hover:stroke-purple-500"
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                    {hoveredCell === cell && (
                      <rect
                        x={x}
                        y={y}
                        width="32"
                        height="32"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="3"
                        rx="4"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Tooltip */}
          {hoveredCell && (
            <div className="mt-4 bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Market</div>
                  <div className="font-bold">{markets[hoveredCell.y]}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Time</div>
                  <div className="font-bold">{hoveredCell.x}:00</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Volume</div>
                  <div className="font-bold text-purple-400">
                    ${(hoveredCell.volume / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Change</div>
                  <div className={`font-bold ${hoveredCell.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {hoveredCell.change >= 0 ? '+' : ''}{hoveredCell.change.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Flame className="w-6 h-6 text-orange-400" />
              <h3 className="font-bold">Hottest Markets</h3>
            </div>
            <div className="space-y-3">
              {markets.slice(0, 5).map((market, idx) => {
                const avgValue = heatmapData
                  .filter(cell => cell.y === idx)
                  .reduce((sum, cell) => sum + cell.value, 0) / 24;
                
                return (
                  <div key={market} className="flex items-center justify-between">
                    <span className="font-medium">{market}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                          style={{ width: `${avgValue}%` }}
                        />
                      </div>
                      <span className="text-sm text-orange-400">{avgValue.toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-400" />
              <h3 className="font-bold">Peak Hours</h3>
            </div>
            <div className="space-y-3">
              {[14, 18, 9, 21, 15].map((hour) => {
                const avgValue = heatmapData
                  .filter(cell => cell.x === hour)
                  .reduce((sum, cell) => sum + cell.value, 0) / markets.length;
                
                return (
                  <div key={hour} className="flex items-center justify-between">
                    <span className="font-medium">{hour}:00</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${avgValue}%` }}
                        />
                      </div>
                      <span className="text-sm text-blue-400">{avgValue.toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="font-bold">Activity Trends</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Volume</span>
                <span className="font-semibold text-green-400">$8.4M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peak Activity</span>
                <span className="font-semibold">14:00 UTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Most Active</span>
                <span className="font-semibold text-purple-400">BTC/USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pattern</span>
                <span className="font-semibold">Increasing</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Correlation</span>
                <span className="font-semibold">0.78</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
