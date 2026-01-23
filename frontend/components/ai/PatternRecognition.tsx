'use client';

import React, { useState } from 'react';
import { TrendingUp, Target, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Pattern {
  id: string;
  name: string;
  type: 'bullish' | 'bearish' | 'continuation' | 'reversal';
  confidence: number;
  detected: Date;
  timeframe: string;
  priceTarget: number;
  currentPrice: number;
  successRate: number;
  historicalMatches: number;
  expectedDuration: string;
  status: 'forming' | 'confirmed' | 'completed';
  keyLevels: {
    support: number[];
    resistance: number[];
  };
  description: string;
}

interface MarketPattern {
  marketId: string;
  marketTitle: string;
  currentPrice: number;
  patterns: Pattern[];
}

export default function PatternRecognition() {
  const [selectedMarket, setSelectedMarket] = useState<string>('1');
  const [filterType, setFilterType] = useState<'all' | 'bullish' | 'bearish' | 'continuation' | 'reversal'>('all');
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

  const [marketPatterns] = useState<MarketPattern[]>([
    {
      marketId: '1',
      marketTitle: 'Will Bitcoin reach $100k by Q2 2026?',
      currentPrice: 0.68,
      patterns: [
        {
          id: 'p1',
          name: 'Ascending Triangle',
          type: 'bullish',
          confidence: 87,
          detected: new Date(Date.now() - 1000 * 60 * 60 * 12),
          timeframe: '4H',
          priceTarget: 0.78,
          currentPrice: 0.68,
          successRate: 72,
          historicalMatches: 234,
          expectedDuration: '3-7 days',
          status: 'confirmed',
          keyLevels: {
            support: [0.65, 0.62],
            resistance: [0.72, 0.75],
          },
          description: 'Bullish continuation pattern with higher lows and horizontal resistance. Breakout expected above 0.72.',
        },
        {
          id: 'p2',
          name: 'Bull Flag',
          type: 'bullish',
          confidence: 79,
          detected: new Date(Date.now() - 1000 * 60 * 60 * 6),
          timeframe: '1H',
          priceTarget: 0.75,
          currentPrice: 0.68,
          successRate: 68,
          historicalMatches: 189,
          expectedDuration: '1-3 days',
          status: 'forming',
          keyLevels: {
            support: [0.66, 0.64],
            resistance: [0.70, 0.72],
          },
          description: 'Short-term consolidation after strong upward move. Flag pole at 0.60-0.68.',
        },
        {
          id: 'p3',
          name: 'Cup and Handle',
          type: 'bullish',
          confidence: 82,
          detected: new Date(Date.now() - 1000 * 60 * 60 * 48),
          timeframe: '1D',
          priceTarget: 0.85,
          currentPrice: 0.68,
          successRate: 75,
          historicalMatches: 156,
          expectedDuration: '7-14 days',
          status: 'confirmed',
          keyLevels: {
            support: [0.63, 0.58],
            resistance: [0.72, 0.78],
          },
          description: 'Classic continuation pattern showing strong accumulation phase. Handle formation complete.',
        },
      ],
    },
    {
      marketId: '2',
      marketTitle: 'Will inflation exceed 3% in 2026?',
      currentPrice: 0.42,
      patterns: [
        {
          id: 'p4',
          name: 'Head and Shoulders',
          type: 'bearish',
          confidence: 84,
          detected: new Date(Date.now() - 1000 * 60 * 60 * 24),
          timeframe: '4H',
          priceTarget: 0.32,
          currentPrice: 0.42,
          successRate: 78,
          historicalMatches: 198,
          expectedDuration: '5-10 days',
          status: 'confirmed',
          keyLevels: {
            support: [0.38, 0.35],
            resistance: [0.45, 0.48],
          },
          description: 'Bearish reversal pattern. Neckline broken at 0.40. Target at 0.32.',
        },
        {
          id: 'p5',
          name: 'Descending Triangle',
          type: 'bearish',
          confidence: 76,
          detected: new Date(Date.now() - 1000 * 60 * 60 * 18),
          timeframe: '2H',
          priceTarget: 0.35,
          currentPrice: 0.42,
          successRate: 71,
          historicalMatches: 167,
          expectedDuration: '2-5 days',
          status: 'forming',
          keyLevels: {
            support: [0.38, 0.36],
            resistance: [0.44, 0.46],
          },
          description: 'Bearish continuation pattern with horizontal support and descending highs.',
        },
        {
          id: 'p6',
          name: 'Double Top',
          type: 'bearish',
          confidence: 81,
          detected: new Date(Date.now() - 1000 * 60 * 60 * 36),
          timeframe: '1D',
          priceTarget: 0.30,
          currentPrice: 0.42,
          successRate: 74,
          historicalMatches: 143,
          expectedDuration: '7-12 days',
          status: 'confirmed',
          keyLevels: {
            support: [0.37, 0.33],
            resistance: [0.48, 0.50],
          },
          description: 'Two peaks at similar levels (0.48) with breakdown below support confirming reversal.',
        },
      ],
    },
  ]);

  const currentMarket = marketPatterns.find(m => m.marketId === selectedMarket) || marketPatterns[0];
  
  const filteredPatterns = filterType === 'all' 
    ? currentMarket.patterns 
    : currentMarket.patterns.filter(p => p.type === filterType);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bullish':
        return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'bearish':
        return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'continuation':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'reversal':
        return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      default:
        return 'text-slate-400 bg-slate-400/20 border-slate-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'forming':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'completed':
        return <Target className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'forming':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'confirmed':
        return 'text-green-400 bg-green-400/20';
      case 'completed':
        return 'text-blue-400 bg-blue-400/20';
      default:
        return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getPriceChange = (current: number, target: number) => {
    const change = ((target - current) / current) * 100;
    return change.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Pattern Recognition</h1>
              <p className="text-slate-400">AI-powered chart pattern detection and analysis</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Select Market</label>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {marketPatterns.map((market) => (
                  <option key={market.marketId} value={market.marketId}>
                    {market.marketTitle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Patterns</option>
                <option value="bullish">Bullish Only</option>
                <option value="bearish">Bearish Only</option>
                <option value="continuation">Continuation</option>
                <option value="reversal">Reversal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pattern Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="text-slate-400 text-sm mb-2">Total Patterns</div>
            <div className="text-3xl font-bold text-blue-400">{currentMarket.patterns.length}</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="text-slate-400 text-sm mb-2">Bullish</div>
            <div className="text-3xl font-bold text-green-400">
              {currentMarket.patterns.filter(p => p.type === 'bullish').length}
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="text-slate-400 text-sm mb-2">Bearish</div>
            <div className="text-3xl font-bold text-red-400">
              {currentMarket.patterns.filter(p => p.type === 'bearish').length}
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="text-slate-400 text-sm mb-2">Confirmed</div>
            <div className="text-3xl font-bold text-purple-400">
              {currentMarket.patterns.filter(p => p.status === 'confirmed').length}
            </div>
          </div>
        </div>

        {/* Detected Patterns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedPattern(pattern)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{pattern.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(pattern.type)}`}>
                      {pattern.type.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(pattern.status)}`}>
                      {getStatusIcon(pattern.status)}
                      <span className="ml-1">{pattern.status.toUpperCase()}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400 mb-1">Confidence</div>
                  <div className={`text-2xl font-bold ${getConfidenceColor(pattern.confidence)}`}>
                    {pattern.confidence}%
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-4">{pattern.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Current Price</div>
                  <div className="text-lg font-semibold">${pattern.currentPrice.toFixed(2)}</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Price Target</div>
                  <div className="text-lg font-semibold text-blue-400">${pattern.priceTarget.toFixed(2)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Potential Gain</div>
                  <div className={`text-lg font-semibold ${
                    parseFloat(getPriceChange(pattern.currentPrice, pattern.priceTarget)) > 0 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {parseFloat(getPriceChange(pattern.currentPrice, pattern.priceTarget)) > 0 ? '+' : ''}
                    {getPriceChange(pattern.currentPrice, pattern.priceTarget)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Success Rate</div>
                  <div className="text-lg font-semibold">{pattern.successRate}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {pattern.historicalMatches} historical matches
                </span>
                <span className="text-slate-400">
                  TF: {pattern.timeframe}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pattern Detail Modal */}
        {selectedPattern && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedPattern.name}</h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(selectedPattern.type)}`}>
                        {selectedPattern.type.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(selectedPattern.status)}`}>
                        {getStatusIcon(selectedPattern.status)}
                        <span className="ml-1">{selectedPattern.status.toUpperCase()}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPattern(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Pattern Details</h3>
                    <p className="text-slate-400">{selectedPattern.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-2">Confidence Level</div>
                      <div className={`text-3xl font-bold ${getConfidenceColor(selectedPattern.confidence)}`}>
                        {selectedPattern.confidence}%
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2 mt-3">
                        <div
                          className={`h-full rounded-full ${
                            selectedPattern.confidence >= 80 ? 'bg-green-500' : 
                            selectedPattern.confidence >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${selectedPattern.confidence}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-2">Success Rate</div>
                      <div className="text-3xl font-bold text-blue-400">{selectedPattern.successRate}%</div>
                      <div className="text-xs text-slate-400 mt-2">
                        Based on {selectedPattern.historicalMatches} historical matches
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Price Levels</h3>
                    <div className="space-y-3">
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">Current Price</span>
                          <span className="text-lg font-semibold">${selectedPattern.currentPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">Target Price</span>
                          <span className="text-lg font-semibold text-blue-400">${selectedPattern.priceTarget.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Potential Move</span>
                          <span className={`text-lg font-semibold ${
                            parseFloat(getPriceChange(selectedPattern.currentPrice, selectedPattern.priceTarget)) > 0 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {parseFloat(getPriceChange(selectedPattern.currentPrice, selectedPattern.priceTarget)) > 0 ? '+' : ''}
                            {getPriceChange(selectedPattern.currentPrice, selectedPattern.priceTarget)}%
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <div className="text-sm text-green-400 mb-2">Support Levels</div>
                          {selectedPattern.keyLevels.support.map((level, idx) => (
                            <div key={idx} className="text-slate-300 mb-1">
                              ${level.toFixed(2)}
                            </div>
                          ))}
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <div className="text-sm text-red-400 mb-2">Resistance Levels</div>
                          {selectedPattern.keyLevels.resistance.map((level, idx) => (
                            <div key={idx} className="text-slate-300 mb-1">
                              ${level.toFixed(2)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Timing</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-2">Timeframe</div>
                        <div className="text-lg font-semibold">{selectedPattern.timeframe}</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-2">Detected</div>
                        <div className="text-lg font-semibold">
                          {Math.floor((Date.now() - selectedPattern.detected.getTime()) / (1000 * 60 * 60))}h ago
                        </div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-2">Expected</div>
                        <div className="text-lg font-semibold">{selectedPattern.expectedDuration}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
