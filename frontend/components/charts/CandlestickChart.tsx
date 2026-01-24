'use client';

import { Activity, TrendingUp, TrendingDown, Clock, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Pattern {
  id: string;
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  index: number;
  confidence: number;
}

interface TimeframeOption {
  label: string;
  value: string;
  minutes: number;
}

export default function CandlestickChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m');
  const [showVolume, setShowVolume] = useState(true);
  const [showPatterns, setShowPatterns] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const [timeframes] = useState<TimeframeOption[]>([
    { label: '1m', value: '1m', minutes: 1 },
    { label: '5m', value: '5m', minutes: 5 },
    { label: '15m', value: '15m', minutes: 15 },
    { label: '30m', value: '30m', minutes: 30 },
    { label: '1H', value: '1h', minutes: 60 },
    { label: '4H', value: '4h', minutes: 240 },
    { label: '1D', value: '1d', minutes: 1440 },
  ]);

  // Generate candlestick data
  const [candleData] = useState<CandleData[]>(() => {
    const data: CandleData[] = [];
    let basePrice = 50000;
    
    for (let i = 0; i < 100; i++) {
      const volatility = 500;
      const trend = Math.sin(i / 10) * 200;
      basePrice += trend + (Math.random() - 0.5) * 100;
      
      const open = basePrice + (Math.random() - 0.5) * volatility;
      const close = open + (Math.random() - 0.5) * volatility * 2;
      const high = Math.max(open, close) + Math.random() * volatility;
      const low = Math.min(open, close) - Math.random() * volatility;
      
      data.push({
        timestamp: Date.now() - (100 - i) * 900000, // 15 min intervals
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000 + 500000
      });
    }
    
    return data;
  });

  // Detect candlestick patterns
  const [patterns] = useState<Pattern[]>(() => {
    const detected: Pattern[] = [];
    
    // Simple pattern detection logic
    for (let i = 2; i < candleData.length - 2; i++) {
      const current = candleData[i];
      const prev = candleData[i - 1];
      const prev2 = candleData[i - 2];
      
      const currentBody = Math.abs(current.close - current.open);
      const currentIsGreen = current.close > current.open;
      const prevIsGreen = prev.close > prev.open;
      
      // Hammer pattern
      const upperShadow = current.high - Math.max(current.open, current.close);
      const lowerShadow = Math.min(current.open, current.close) - current.low;
      if (lowerShadow > currentBody * 2 && upperShadow < currentBody * 0.5 && !prevIsGreen) {
        detected.push({
          id: `hammer-${i}`,
          name: 'Hammer',
          type: 'bullish',
          index: i,
          confidence: 75
        });
      }
      
      // Engulfing pattern
      if (currentIsGreen && !prevIsGreen && 
          current.open < prev.close && current.close > prev.open) {
        detected.push({
          id: `engulfing-${i}`,
          name: 'Bullish Engulfing',
          type: 'bullish',
          index: i,
          confidence: 80
        });
      }
      
      // Doji pattern
      if (currentBody < (current.high - current.low) * 0.1) {
        detected.push({
          id: `doji-${i}`,
          name: 'Doji',
          type: 'neutral',
          index: i,
          confidence: 70
        });
      }
      
      // Three white soldiers
      if (i >= 2 && currentIsGreen && prevIsGreen && 
          (candleData[i-2].close > candleData[i-2].open)) {
        if (current.close > prev.close && prev.close > prev2.close) {
          detected.push({
            id: `soldiers-${i}`,
            name: 'Three White Soldiers',
            type: 'bullish',
            index: i,
            confidence: 85
          });
        }
      }
    }
    
    return detected.slice(0, 10); // Show recent patterns only
  });

  const visibleCandles = candleData.slice(-Math.floor(50 * zoomLevel));
  const maxPrice = Math.max(...visibleCandles.map(c => c.high));
  const minPrice = Math.min(...visibleCandles.map(c => c.low));
  const priceRange = maxPrice - minPrice;
  const maxVolume = Math.max(...visibleCandles.map(c => c.volume));

  const currentPrice = candleData[candleData.length - 1].close;
  const priceChange = currentPrice - candleData[candleData.length - 2].close;
  const priceChangePercent = (priceChange / candleData[candleData.length - 2].close) * 100;

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatVolume = (vol: number) => `${(vol / 1000000).toFixed(2)}M`;
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl">
              <Activity className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Candlestick Chart</h1>
              <p className="text-slate-400">Advanced pattern recognition and multi-timeframe analysis</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Timeframes */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                {timeframes.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setSelectedTimeframe(tf.value)}
                    className={`px-3 py-1.5 rounded transition-colors text-sm font-medium ${
                      selectedTimeframe === tf.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowVolume(!showVolume)}
                  className={`px-3 py-2 rounded transition-colors text-sm ${
                    showVolume
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Volume
                </button>
                <button
                  onClick={() => setShowPatterns(!showPatterns)}
                  className={`px-3 py-2 rounded transition-colors text-sm ${
                    showPatterns
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Patterns
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Chart */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
              {/* Price Header */}
              <div className="bg-slate-900/50 border-b border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">BTC/USDT</div>
                      <div className="text-3xl font-bold">{formatPrice(currentPrice)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">24h Change</div>
                      <div className={`text-xl font-bold flex items-center gap-2 ${
                        priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {priceChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        {priceChange >= 0 ? '+' : ''}{formatPrice(priceChange)} ({priceChangePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Zoom: {(zoomLevel * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>

              {/* Candlestick Chart */}
              <div className="relative bg-gradient-to-b from-slate-900 to-slate-800" style={{ height: '500px' }}>
                <svg className="w-full h-full">
                  {/* Grid */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <g key={`grid-${i}`}>
                      <line
                        x1="0"
                        y1={i * 62.5}
                        x2="100%"
                        y2={i * 62.5}
                        stroke="#334155"
                        strokeWidth="0.5"
                        strokeDasharray="4"
                      />
                      <text
                        x="10"
                        y={i * 62.5 + 5}
                        fill="#94a3b8"
                        fontSize="12"
                      >
                        {formatPrice(maxPrice - (priceRange / 8) * i)}
                      </text>
                    </g>
                  ))}

                  {/* Candlesticks */}
                  {visibleCandles.map((candle, i) => {
                    const x = (i / visibleCandles.length) * 95 + 5;
                    const width = (90 / visibleCandles.length);
                    
                    const openY = ((maxPrice - candle.open) / priceRange) * 480 + 10;
                    const closeY = ((maxPrice - candle.close) / priceRange) * 480 + 10;
                    const highY = ((maxPrice - candle.high) / priceRange) * 480 + 10;
                    const lowY = ((maxPrice - candle.low) / priceRange) * 480 + 10;
                    
                    const isGreen = candle.close > candle.open;
                    const color = isGreen ? '#10b981' : '#ef4444';
                    
                    // Check if this candle has a pattern
                    const candleIndex = candleData.indexOf(candle);
                    const hasPattern = patterns.find(p => p.index === candleIndex);
                    
                    return (
                      <g key={i}>
                        {/* Wick */}
                        <line
                          x1={`${x}%`}
                          y1={highY}
                          x2={`${x}%`}
                          y2={lowY}
                          stroke={color}
                          strokeWidth="1.5"
                        />
                        
                        {/* Body */}
                        <rect
                          x={`calc(${x}% - ${width / 2}px)`}
                          y={Math.min(openY, closeY)}
                          width={Math.max(width, 2)}
                          height={Math.max(Math.abs(closeY - openY), 1)}
                          fill={color}
                          fillOpacity={isGreen ? 0.8 : 1}
                          stroke={color}
                          strokeWidth="1"
                        />
                        
                        {/* Pattern Marker */}
                        {showPatterns && hasPattern && (
                          <g>
                            <circle
                              cx={`${x}%`}
                              cy={highY - 20}
                              r="8"
                              fill={
                                hasPattern.type === 'bullish' ? '#10b981' :
                                hasPattern.type === 'bearish' ? '#ef4444' : '#fbbf24'
                              }
                              fillOpacity="0.9"
                            />
                            <text
                              x={`${x}%`}
                              y={highY - 16}
                              textAnchor="middle"
                              fill="white"
                              fontSize="10"
                              fontWeight="bold"
                            >
                              P
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* Time labels */}
                  {visibleCandles.filter((_, i) => i % 10 === 0).map((candle, i) => {
                    const index = visibleCandles.indexOf(candle);
                    const x = (index / visibleCandles.length) * 95 + 5;
                    return (
                      <text
                        key={`time-${i}`}
                        x={`${x}%`}
                        y="495"
                        fill="#94a3b8"
                        fontSize="11"
                        textAnchor="middle"
                      >
                        {formatTime(candle.timestamp)}
                      </text>
                    );
                  })}
                </svg>
              </div>

              {/* Volume Panel */}
              {showVolume && (
                <div className="border-t border-slate-700 bg-slate-900/50" style={{ height: '150px' }}>
                  <div className="p-2 text-xs text-slate-400">Volume</div>
                  <svg className="w-full h-full">
                    {visibleCandles.map((candle, i) => {
                      const x = (i / visibleCandles.length) * 95 + 5;
                      const width = (90 / visibleCandles.length);
                      const height = (candle.volume / maxVolume) * 110;
                      const isGreen = candle.close > candle.open;
                      
                      return (
                        <rect
                          key={i}
                          x={`calc(${x}% - ${width / 2}px)`}
                          y={120 - height}
                          width={Math.max(width, 2)}
                          height={height}
                          fill={isGreen ? '#10b98155' : '#ef444455'}
                        />
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Patterns Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Detected Patterns
              </h3>
              
              {patterns.length === 0 ? (
                <p className="text-sm text-slate-400">No patterns detected</p>
              ) : (
                <div className="space-y-3">
                  {patterns.map((pattern) => (
                    <div
                      key={pattern.id}
                      className={`p-3 rounded-lg border ${
                        pattern.type === 'bullish'
                          ? 'bg-green-600/10 border-green-600/30'
                          : pattern.type === 'bearish'
                          ? 'bg-red-600/10 border-red-600/30'
                          : 'bg-yellow-600/10 border-yellow-600/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-sm">{pattern.name}</div>
                        <div className={`text-xs px-2 py-0.5 rounded ${
                          pattern.type === 'bullish'
                            ? 'bg-green-600 text-white'
                            : pattern.type === 'bearish'
                            ? 'bg-red-600 text-white'
                            : 'bg-yellow-600 text-white'
                        }`}>
                          {pattern.type.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 mb-2">
                        Candle #{pattern.index}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="font-semibold">{pattern.confidence}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                        <div
                          className={`h-1.5 rounded-full ${
                            pattern.type === 'bullish'
                              ? 'bg-green-500'
                              : pattern.type === 'bearish'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                          }`}
                          style={{ width: `${pattern.confidence}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pattern Guide */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 mt-6">
              <h3 className="font-bold mb-4">Pattern Types</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-semibold text-green-400 mb-1">Bullish Patterns</div>
                  <div className="text-xs text-slate-400">Hammer, Bullish Engulfing, Morning Star, Three White Soldiers</div>
                </div>
                <div>
                  <div className="font-semibold text-red-400 mb-1">Bearish Patterns</div>
                  <div className="text-xs text-slate-400">Shooting Star, Bearish Engulfing, Evening Star, Three Black Crows</div>
                </div>
                <div>
                  <div className="font-semibold text-yellow-400 mb-1">Neutral Patterns</div>
                  <div className="text-xs text-slate-400">Doji, Spinning Top, Harami</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
