'use client';

import { LineChart, TrendingUp, TrendingDown, Percent, Scale } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MarketData {
  timestamp: number;
  prices: { [market: string]: number };
}

interface Divergence {
  market1: string;
  market2: string;
  percentage: number;
  type: 'positive' | 'negative';
}

export default function ComparisonChart() {
  const markets = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'];
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['BTC', 'ETH', 'SOL']);
  const [scaleType, setScaleType] = useState<'absolute' | 'normalized' | 'percentage'>('normalized');
  const [timeRange, setTimeRange] = useState('24h');
  const [hoveredPoint, setHoveredPoint] = useState<{ market: string; value: number; timestamp: number } | null>(null);

  // Generate comparison data
  const [chartData, setChartData] = useState<MarketData[]>([]);

  useEffect(() => {
    const baseValues = {
      BTC: 50000,
      ETH: 3000,
      SOL: 100,
      ADA: 0.5,
      DOT: 6
    };

    const data: MarketData[] = [];
    const dataPoints = 100;
    
    for (let i = 0; i < dataPoints; i++) {
      const timestamp = Date.now() - (dataPoints - i) * 60000;
      const prices: { [market: string]: number } = {};
      
      markets.forEach(market => {
        const basePrice = baseValues[market as keyof typeof baseValues];
        const trend = Math.sin(i / 10) * 0.05;
        const volatility = (Math.random() - 0.5) * 0.02;
        prices[market] = basePrice * (1 + trend + volatility);
      });
      
      data.push({ timestamp, prices });
    }
    
    setChartData(data);
  }, [timeRange]);

  const toggleMarket = (market: string) => {
    if (selectedMarkets.includes(market)) {
      if (selectedMarkets.length > 1) {
        setSelectedMarkets(selectedMarkets.filter(m => m !== market));
      }
    } else {
      setSelectedMarkets([...selectedMarkets, market]);
    }
  };

  // Calculate normalized data
  const getNormalizedData = () => {
    if (chartData.length === 0) return [];
    
    return chartData.map((data, idx) => {
      const normalized: { [market: string]: number } = {};
      
      selectedMarkets.forEach(market => {
        if (scaleType === 'normalized') {
          // Normalize to 0-100 scale
          const initialPrice = chartData[0].prices[market];
          normalized[market] = (data.prices[market] / initialPrice) * 100;
        } else if (scaleType === 'percentage') {
          // Percentage change from start
          const initialPrice = chartData[0].prices[market];
          normalized[market] = ((data.prices[market] - initialPrice) / initialPrice) * 100;
        } else {
          // Absolute prices
          normalized[market] = data.prices[market];
        }
      });
      
      return { ...data, normalized };
    });
  };

  const normalizedData = getNormalizedData();

  // Find divergences
  const findDivergences = (): Divergence[] => {
    if (normalizedData.length < 20) return [];
    
    const divergences: Divergence[] = [];
    const recent = normalizedData.slice(-20);
    
    selectedMarkets.forEach((m1, i) => {
      selectedMarkets.slice(i + 1).forEach(m2 => {
        const m1Start = recent[0].normalized[m1];
        const m1End = recent[recent.length - 1].normalized[m1];
        const m2Start = recent[0].normalized[m2];
        const m2End = recent[recent.length - 1].normalized[m2];
        
        const m1Change = ((m1End - m1Start) / m1Start) * 100;
        const m2Change = ((m2End - m2Start) / m2Start) * 100;
        const diff = Math.abs(m1Change - m2Change);
        
        if (diff > 2) {
          divergences.push({
            market1: m1,
            market2: m2,
            percentage: diff,
            type: m1Change > m2Change ? 'positive' : 'negative'
          });
        }
      });
    });
    
    return divergences.sort((a, b) => b.percentage - a.percentage);
  };

  const divergences = findDivergences();

  const chartWidth = 800;
  const chartHeight = 400;
  const padding = { top: 40, right: 120, bottom: 60, left: 60 };

  const getYScale = () => {
    let min = Infinity, max = -Infinity;
    
    normalizedData.forEach(data => {
      selectedMarkets.forEach(market => {
        const value = data.normalized[market];
        if (value < min) min = value;
        if (value > max) max = value;
      });
    });
    
    const range = max - min;
    return { min: min - range * 0.1, max: max + range * 0.1 };
  };

  const yScale = getYScale();

  const getY = (value: number) => {
    return chartHeight - padding.bottom - ((value - yScale.min) / (yScale.max - yScale.min)) * (chartHeight - padding.top - padding.bottom);
  };

  const marketColors: { [key: string]: string } = {
    BTC: '#f7931a',
    ETH: '#627eea',
    SOL: '#14f195',
    ADA: '#0033ad',
    DOT: '#e6007a'
  };

  // Calculate performance
  const getPerformance = (market: string) => {
    if (normalizedData.length === 0) return 0;
    const initial = normalizedData[0].normalized[market];
    const final = normalizedData[normalizedData.length - 1].normalized[market];
    
    if (scaleType === 'percentage') {
      return final;
    }
    return ((final - initial) / initial) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-xl">
              <LineChart className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Comparison Chart</h1>
              <p className="text-slate-400">Multi-market comparison with divergence detection</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Scale className="w-4 h-4 text-slate-400" />
                {markets.map(market => (
                  <button
                    key={market}
                    onClick={() => toggleMarket(market)}
                    className={`px-3 py-1.5 rounded transition-colors text-sm font-medium ${
                      selectedMarkets.includes(market)
                        ? 'text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                    style={selectedMarkets.includes(market) ? { backgroundColor: marketColors[market] } : {}}
                  >
                    {market}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScaleType('absolute')}
                  className={`px-3 py-1.5 rounded transition-colors text-sm ${
                    scaleType === 'absolute'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Absolute
                </button>
                <button
                  onClick={() => setScaleType('normalized')}
                  className={`px-3 py-1.5 rounded transition-colors text-sm ${
                    scaleType === 'normalized'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Normalized
                </button>
                <button
                  onClick={() => setScaleType('percentage')}
                  className={`px-3 py-1.5 rounded transition-colors text-sm ${
                    scaleType === 'percentage'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  % Change
                </button>
              </div>

              <div className="flex items-center gap-2">
                {['1h', '24h', '7d', '30d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded transition-colors text-sm ${
                      timeRange === range
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Market Performance Comparison</h2>
          </div>

          <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
              const y = chartHeight - padding.bottom - ratio * (chartHeight - padding.top - padding.bottom);
              const value = yScale.min + (yScale.max - yScale.min) * ratio;
              
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                  <text x={padding.left - 10} y={y + 5} textAnchor="end" fill="#94a3b8" fontSize="11">
                    {scaleType === 'percentage' ? `${value.toFixed(1)}%` : value.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* Time axis */}
            <line
              x1={padding.left}
              y1={chartHeight - padding.bottom}
              x2={chartWidth - padding.right}
              y2={chartHeight - padding.bottom}
              stroke="#475569"
              strokeWidth="2"
            />

            {/* Draw lines for each market */}
            {selectedMarkets.map(market => {
              const points = normalizedData.map((data, idx) => {
                const x = padding.left + (idx / (normalizedData.length - 1)) * (chartWidth - padding.left - padding.right);
                const y = getY(data.normalized[market]);
                return `${x},${y}`;
              }).join(' ');

              return (
                <g key={market}>
                  <polyline
                    points={points}
                    fill="none"
                    stroke={marketColors[market]}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Hover points */}
                  {normalizedData.map((data, idx) => {
                    const x = padding.left + (idx / (normalizedData.length - 1)) * (chartWidth - padding.left - padding.right);
                    const y = getY(data.normalized[market]);
                    
                    return (
                      <circle
                        key={`${market}-${idx}`}
                        cx={x}
                        cy={y}
                        r="4"
                        fill={marketColors[market]}
                        opacity="0"
                        className="cursor-pointer hover:opacity-100"
                        onMouseEnter={() => setHoveredPoint({ market, value: data.normalized[market], timestamp: data.timestamp })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    );
                  })}

                  {/* Legend */}
                  <g transform={`translate(${chartWidth - padding.right + 10}, ${padding.top + selectedMarkets.indexOf(market) * 30})`}>
                    <circle cx="0" cy="0" r="5" fill={marketColors[market]} />
                    <text x="15" y="5" fill="#fff" fontSize="12" fontWeight="600">
                      {market}
                    </text>
                    <text x="55" y="5" fill={getPerformance(market) >= 0 ? '#10b981' : '#ef4444'} fontSize="12" fontWeight="600">
                      {getPerformance(market) >= 0 ? '+' : ''}{getPerformance(market).toFixed(2)}%
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Hover info */}
          {hoveredPoint && (
            <div className="mt-4 bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Market</div>
                  <div className="font-bold" style={{ color: marketColors[hoveredPoint.market] }}>
                    {hoveredPoint.market}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Value</div>
                  <div className="font-bold">
                    {scaleType === 'percentage' ? `${hoveredPoint.value.toFixed(2)}%` : hoveredPoint.value.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Time</div>
                  <div className="font-bold">
                    {new Date(hoveredPoint.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats and Divergences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Percent className="w-6 h-6 text-violet-400" />
              <h3 className="font-bold">Performance Summary</h3>
            </div>
            <div className="space-y-3">
              {selectedMarkets.map(market => {
                const perf = getPerformance(market);
                return (
                  <div key={market} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: marketColors[market] }} />
                      <span className="font-medium">{market}</span>
                    </div>
                    <div className={`font-bold text-lg ${perf >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {perf >= 0 ? '+' : ''}{perf.toFixed(2)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold">Detected Divergences</h3>
            </div>
            <div className="space-y-3">
              {divergences.length > 0 ? (
                divergences.slice(0, 5).map((div, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{div.market1}</span>
                      <span className="text-slate-400">vs</span>
                      <span className="font-medium">{div.market2}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {div.type === 'positive' ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <span className="font-bold text-amber-400">{div.percentage.toFixed(2)}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-8">
                  No significant divergences detected
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
