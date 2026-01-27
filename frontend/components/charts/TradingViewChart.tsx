'use client';

import { BarChart2, Download, Grid3x3, Maximize2, Plus, Settings, TrendingUp } from 'lucide-react';
import { useRef, useState } from 'react';

interface Indicator {
  id: string;
  name: string;
  type: 'overlay' | 'oscillator';
  enabled: boolean;
  color: string;
  settings: Record<string, any>;
}

interface DrawingTool {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

interface Timeframe {
  label: string;
  value: string;
  active: boolean;
}

interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default function TradingViewChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [showIndicators, setShowIndicators] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  const [timeframes] = useState<Timeframe[]>([
    { label: '1m', value: '1m', active: false },
    { label: '5m', value: '5m', active: false },
    { label: '15m', value: '15m', active: false },
    { label: '1H', value: '1h', active: false },
    { label: '4H', value: '4h', active: false },
    { label: '1D', value: '1d', active: true },
    { label: '1W', value: '1w', active: false },
    { label: '1M', value: '1mo', active: false },
  ]);

  const [indicators, setIndicators] = useState<Indicator[]>([
    {
      id: 'ma20',
      name: 'Moving Average (20)',
      type: 'overlay',
      enabled: true,
      color: '#3b82f6',
      settings: { period: 20 }
    },
    {
      id: 'ma50',
      name: 'Moving Average (50)',
      type: 'overlay',
      enabled: false,
      color: '#f59e0b',
      settings: { period: 50 }
    },
    {
      id: 'ema12',
      name: 'EMA (12)',
      type: 'overlay',
      enabled: false,
      color: '#10b981',
      settings: { period: 12 }
    },
    {
      id: 'bb',
      name: 'Bollinger Bands',
      type: 'overlay',
      enabled: false,
      color: '#8b5cf6',
      settings: { period: 20, stdDev: 2 }
    },
    {
      id: 'rsi',
      name: 'RSI (14)',
      type: 'oscillator',
      enabled: false,
      color: '#ef4444',
      settings: { period: 14 }
    },
    {
      id: 'macd',
      name: 'MACD',
      type: 'oscillator',
      enabled: false,
      color: '#06b6d4',
      settings: { fast: 12, slow: 26, signal: 9 }
    },
    {
      id: 'stoch',
      name: 'Stochastic',
      type: 'oscillator',
      enabled: false,
      color: '#ec4899',
      settings: { k: 14, d: 3 }
    },
    {
      id: 'volume',
      name: 'Volume',
      type: 'oscillator',
      enabled: true,
      color: '#64748b',
      settings: {}
    }
  ]);

  const [drawingTools] = useState<DrawingTool[]>([
    { id: 'trendline', name: 'Trend Line', icon: '📈', active: false },
    { id: 'horizontal', name: 'Horizontal Line', icon: '━', active: false },
    { id: 'vertical', name: 'Vertical Line', icon: '┃', active: false },
    { id: 'rectangle', name: 'Rectangle', icon: '▭', active: false },
    { id: 'circle', name: 'Circle', icon: '○', active: false },
    { id: 'fibonacci', name: 'Fibonacci', icon: '📐', active: false },
    { id: 'arrow', name: 'Arrow', icon: '→', active: false },
    { id: 'text', name: 'Text', icon: 'T', active: false },
  ]);

  const [chartData] = useState<ChartData[]>(
    Array.from({ length: 100 }, (_, i) => {
      const basePrice = 50000;
      const randomWalk = Math.random() * 1000 - 500;
      const price = basePrice + randomWalk + (i * 50);
      const volatility = 500;
      
      return {
        timestamp: Date.now() - (100 - i) * 86400000,
        open: price + (Math.random() - 0.5) * volatility,
        high: price + Math.random() * volatility,
        low: price - Math.random() * volatility,
        close: price + (Math.random() - 0.5) * volatility,
        volume: Math.random() * 1000000
      };
    })
  );

  const toggleIndicator = (id: string) => {
    setIndicators(indicators.map(ind => 
      ind.id === id ? { ...ind, enabled: !ind.enabled } : ind
    ));
  };

  const exportChart = () => {
    alert('Exporting chart as PNG...');
  };

  const currentPrice = chartData[chartData.length - 1]?.close || 0;
  const priceChange = chartData.length > 1 
    ? currentPrice - chartData[chartData.length - 2].close 
    : 0;
  const priceChangePercent = chartData.length > 1 
    ? (priceChange / chartData[chartData.length - 2].close) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl">
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">TradingView Chart</h1>
                <p className="text-slate-400">Professional charting with technical indicators</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDrawingTools(!showDrawingTools)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Grid3x3 className="w-4 h-4" />
                Draw
              </button>
              <button
                onClick={() => setShowIndicators(!showIndicators)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <BarChart2 className="w-4 h-4" />
                Indicators
              </button>
              <button
                onClick={exportChart}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Price Info */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-sm text-slate-400 mb-1">BTC/USD</div>
                <div className="text-3xl font-bold">${currentPrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">24h Change</div>
                <div className={`text-xl font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">24h High</div>
                <div className="text-xl font-semibold text-green-400">
                  ${Math.max(...chartData.map(d => d.high)).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">24h Low</div>
                <div className="text-xl font-semibold text-red-400">
                  ${Math.min(...chartData.map(d => d.low)).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Volume</div>
                <div className="text-xl font-semibold">
                  ${(chartData.reduce((sum, d) => sum + d.volume, 0) / 1000000).toFixed(2)}M
                </div>
              </div>
            </div>

            {/* Timeframe Selector */}
            <div className="flex gap-1">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setSelectedTimeframe(tf.value)}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedTimeframe === tf.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Chart Area */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
              {/* Chart Toolbar */}
              <div className="bg-slate-900/50 border-b border-slate-700 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {indicators.filter(i => i.enabled).map((indicator) => (
                    <div
                      key={indicator.id}
                      className="px-3 py-1 bg-slate-700/50 rounded text-xs flex items-center gap-2"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: indicator.color }}
                      />
                      {indicator.name}
                      <button
                        onClick={() => toggleIndicator(indicator.id)}
                        className="text-slate-400 hover:text-white ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowIndicators(true)}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Indicator
                  </button>
                </div>

                <button className="p-1 hover:bg-slate-700 rounded transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Chart Canvas */}
              <div 
                ref={chartContainerRef}
                className="relative bg-gradient-to-b from-slate-900 to-slate-800"
                style={{ height: '600px' }}
              >
                {/* Simplified Candlestick Chart Visualization */}
                <svg className="w-full h-full">
                  <defs>
                    <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <line
                      key={`grid-h-${i}`}
                      x1="0"
                      y1={i * 60}
                      x2="100%"
                      y2={i * 60}
                      stroke="#334155"
                      strokeWidth="0.5"
                      strokeDasharray="4"
                    />
                  ))}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line
                      key={`grid-v-${i}`}
                      x1={`${i * 8.33}%`}
                      y1="0"
                      x2={`${i * 8.33}%`}
                      y2="100%"
                      stroke="#334155"
                      strokeWidth="0.5"
                      strokeDasharray="4"
                    />
                  ))}

                  {/* Candlesticks */}
                  {chartData.slice(-50).map((data, i) => {
                    const x = (i / 50) * 100;
                    const maxPrice = Math.max(...chartData.slice(-50).map(d => d.high));
                    const minPrice = Math.min(...chartData.slice(-50).map(d => d.low));
                    const priceRange = maxPrice - minPrice;
                    
                    const openY = ((maxPrice - data.open) / priceRange) * 500 + 50;
                    const closeY = ((maxPrice - data.close) / priceRange) * 500 + 50;
                    const highY = ((maxPrice - data.high) / priceRange) * 500 + 50;
                    const lowY = ((maxPrice - data.low) / priceRange) * 500 + 50;
                    
                    const isGreen = data.close > data.open;
                    
                    return (
                      <g key={i}>
                        {/* Wick */}
                        <line
                          x1={`${x}%`}
                          y1={highY}
                          x2={`${x}%`}
                          y2={lowY}
                          stroke={isGreen ? '#10b981' : '#ef4444'}
                          strokeWidth="1"
                        />
                        {/* Body */}
                        <rect
                          x={`calc(${x}% - 3px)`}
                          y={Math.min(openY, closeY)}
                          width="6"
                          height={Math.abs(closeY - openY) || 1}
                          fill={isGreen ? '#10b981' : '#ef4444'}
                        />
                      </g>
                    );
                  })}

                  {/* MA Line (if enabled) */}
                  {indicators.find(i => i.id === 'ma20' && i.enabled) && (
                    <path
                      d={chartData.slice(-50).map((data, i) => {
                        const x = (i / 50) * 100;
                        const maxPrice = Math.max(...chartData.slice(-50).map(d => d.high));
                        const minPrice = Math.min(...chartData.slice(-50).map(d => d.low));
                        const priceRange = maxPrice - minPrice;
                        const y = ((maxPrice - data.close) / priceRange) * 500 + 50;
                        return `${i === 0 ? 'M' : 'L'}${x}% ${y}`;
                      }).join(' ')}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      fill="none"
                    />
                  )}

                  {/* Area fill */}
                  <path
                    d={`
                      M0% 550
                      ${chartData.slice(-50).map((data, i) => {
                        const x = (i / 50) * 100;
                        const maxPrice = Math.max(...chartData.slice(-50).map(d => d.high));
                        const minPrice = Math.min(...chartData.slice(-50).map(d => d.low));
                        const priceRange = maxPrice - minPrice;
                        const y = ((maxPrice - data.close) / priceRange) * 500 + 50;
                        return `L${x}% ${y}`;
                      }).join(' ')}
                      L100% 550
                      Z
                    `}
                    fill="url(#priceGradient)"
                  />
                </svg>

                {/* Crosshair overlay would go here */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Crosshair implementation */}
                </div>
              </div>

              {/* Volume Panel (if enabled) */}
              {indicators.find(i => i.id === 'volume' && i.enabled) && (
                <div className="border-t border-slate-700 bg-slate-900/50" style={{ height: '150px' }}>
                  <svg className="w-full h-full">
                    {chartData.slice(-50).map((data, i) => {
                      const x = (i / 50) * 100;
                      const maxVolume = Math.max(...chartData.slice(-50).map(d => d.volume));
                      const height = (data.volume / maxVolume) * 130;
                      const isGreen = data.close > data.open;
                      
                      return (
                        <rect
                          key={i}
                          x={`calc(${x}% - 3px)`}
                          y={140 - height}
                          width="6"
                          height={height}
                          fill={isGreen ? '#10b98144' : '#ef444444'}
                        />
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Drawing Tools */}
            {showDrawingTools && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Grid3x3 className="w-4 h-4" />
                  Drawing Tools
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {drawingTools.map((tool) => (
                    <button
                      key={tool.id}
                      className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors text-center"
                    >
                      <div className="text-2xl mb-1">{tool.icon}</div>
                      <div className="text-xs text-slate-400">{tool.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Indicators Panel */}
            {showIndicators && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  Technical Indicators
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm font-semibold text-slate-400 mb-2">Overlay Indicators</div>
                  {indicators.filter(i => i.type === 'overlay').map((indicator) => (
                    <div
                      key={indicator.id}
                      className="flex items-center justify-between p-2 bg-slate-700/30 rounded hover:bg-slate-700/50 transition-colors cursor-pointer"
                      onClick={() => toggleIndicator(indicator.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: indicator.color }}
                        />
                        <span className="text-sm">{indicator.name}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={indicator.enabled}
                        onChange={() => {}}
                        className="w-4 h-4"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-400 mb-2">Oscillators</div>
                  {indicators.filter(i => i.type === 'oscillator').map((indicator) => (
                    <div
                      key={indicator.id}
                      className="flex items-center justify-between p-2 bg-slate-700/30 rounded hover:bg-slate-700/50 transition-colors cursor-pointer"
                      onClick={() => toggleIndicator(indicator.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: indicator.color }}
                        />
                        <span className="text-sm">{indicator.name}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={indicator.enabled}
                        onChange={() => {}}
                        className="w-4 h-4"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <h3 className="font-bold mb-4">Market Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Market Cap</span>
                  <span className="font-semibold">$1.2T</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Dominance</span>
                  <span className="font-semibold">48.3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Fear & Greed</span>
                  <span className="font-semibold text-green-400">72 (Greed)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Funding Rate</span>
                  <span className="font-semibold">0.0125%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
