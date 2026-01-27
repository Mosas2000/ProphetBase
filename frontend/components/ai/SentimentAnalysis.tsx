'use client';

import { MessageCircle, MessageSquare, Minus, Newspaper, TrendingDown, TrendingUp, Twitter, Users } from 'lucide-react';
import React, { useState } from 'react';

interface SentimentSource {
  name: string;
  icon: React.ReactNode;
  score: number;
  trend: 'up' | 'down' | 'stable';
  volume: number;
}

interface SentimentDataPoint {
  timestamp: Date;
  score: number;
  volume: number;
}

interface MarketSentiment {
  marketId: string;
  marketTitle: string;
  overallScore: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  sources: SentimentSource[];
  communityMood: {
    positive: number;
    neutral: number;
    negative: number;
  };
  keyPhrases: string[];
  recentData: SentimentDataPoint[];
}

export default function SentimentAnalysis() {
  const [selectedMarket, setSelectedMarket] = useState<string>('1');
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  
  const [sentiments] = useState<MarketSentiment[]>([
    {
      marketId: '1',
      marketTitle: 'Will Bitcoin reach $100k by Q2 2026?',
      overallScore: 78,
      trend: 'bullish',
      sources: [
        {
          name: 'Twitter/X',
          icon: <Twitter className="w-5 h-5" />,
          score: 82,
          trend: 'up',
          volume: 45231,
        },
        {
          name: 'Reddit',
          icon: <MessageCircle className="w-5 h-5" />,
          score: 75,
          trend: 'up',
          volume: 12893,
        },
        {
          name: 'News Articles',
          icon: <Newspaper className="w-5 h-5" />,
          score: 71,
          trend: 'stable',
          volume: 2847,
        },
        {
          name: 'Community',
          icon: <Users className="w-5 h-5" />,
          score: 84,
          trend: 'up',
          volume: 8934,
        },
      ],
      communityMood: {
        positive: 68,
        neutral: 22,
        negative: 10,
      },
      keyPhrases: [
        'Bitcoin ETF approval',
        'institutional adoption',
        'bullish momentum',
        'new all-time high',
        'accumulation phase',
      ],
      recentData: [
        { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), score: 72, volume: 3200 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), score: 74, volume: 3500 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), score: 75, volume: 3800 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), score: 77, volume: 4200 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), score: 76, volume: 4100 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), score: 78, volume: 4500 },
      ],
    },
    {
      marketId: '2',
      marketTitle: 'Will inflation exceed 3% in 2026?',
      overallScore: 42,
      trend: 'bearish',
      sources: [
        {
          name: 'Twitter/X',
          icon: <Twitter className="w-5 h-5" />,
          score: 38,
          trend: 'down',
          volume: 28456,
        },
        {
          name: 'Reddit',
          icon: <MessageCircle className="w-5 h-5" />,
          score: 45,
          trend: 'down',
          volume: 8234,
        },
        {
          name: 'News Articles',
          icon: <Newspaper className="w-5 h-5" />,
          score: 48,
          trend: 'stable',
          volume: 1893,
        },
        {
          name: 'Community',
          icon: <Users className="w-5 h-5" />,
          score: 37,
          trend: 'down',
          volume: 5621,
        },
      ],
      communityMood: {
        positive: 25,
        neutral: 35,
        negative: 40,
      },
      keyPhrases: [
        'Fed policy effective',
        'cooling inflation',
        'supply chain recovery',
        'economic slowdown',
        'rate cuts expected',
      ],
      recentData: [
        { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), score: 48, volume: 2800 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), score: 46, volume: 2600 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), score: 45, volume: 2500 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), score: 43, volume: 2300 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), score: 44, volume: 2400 },
        { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), score: 42, volume: 2200 },
      ],
    },
  ]);

  const currentSentiment = sentiments.find(s => s.marketId === selectedMarket) || sentiments[0];

  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    if (score >= 30) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return 'Very Bullish';
    if (score >= 60) return 'Bullish';
    if (score >= 50) return 'Slightly Bullish';
    if (score >= 40) return 'Neutral';
    if (score >= 30) return 'Slightly Bearish';
    if (score >= 20) return 'Bearish';
    return 'Very Bearish';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Sentiment Analysis</h1>
              <p className="text-slate-400">Real-time sentiment tracking from social media and news</p>
            </div>
          </div>
        </div>

        {/* Market Selector */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Select Market</label>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {sentiments.map((sentiment) => (
                  <option key={sentiment.marketId} value={sentiment.marketId}>
                    {sentiment.marketTitle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overall Sentiment */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Overall Sentiment</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400">Sentiment Score</span>
                <span className={`text-2xl font-bold ${getSentimentColor(currentSentiment.overallScore)}`}>
                  {currentSentiment.overallScore}/100
                </span>
              </div>
              
              <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full transition-all duration-500 ${
                    currentSentiment.overallScore >= 70
                      ? 'bg-green-500'
                      : currentSentiment.overallScore >= 50
                      ? 'bg-yellow-500'
                      : currentSentiment.overallScore >= 30
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${currentSentiment.overallScore}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Very Bearish</span>
                <span className="text-sm text-slate-400">Neutral</span>
                <span className="text-sm text-slate-400">Very Bullish</span>
              </div>

              <div className={`mt-4 text-center text-lg font-semibold ${getSentimentColor(currentSentiment.overallScore)}`}>
                {getSentimentLabel(currentSentiment.overallScore)}
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400 mb-4">Community Mood Distribution</div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400">Positive</span>
                    <span className="text-green-400 font-semibold">{currentSentiment.communityMood.positive}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${currentSentiment.communityMood.positive}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-400">Neutral</span>
                    <span className="text-yellow-400 font-semibold">{currentSentiment.communityMood.neutral}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-500"
                      style={{ width: `${currentSentiment.communityMood.neutral}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-400">Negative</span>
                    <span className="text-red-400 font-semibold">{currentSentiment.communityMood.negative}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-500"
                      style={{ width: `${currentSentiment.communityMood.negative}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Sentiment by Source</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSentiment.sources.map((source, idx) => (
              <div key={idx} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-600 rounded-lg">
                      {source.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{source.name}</h3>
                      <div className="text-xs text-slate-400">
                        {source.volume.toLocaleString()} mentions
                      </div>
                    </div>
                  </div>
                  {getTrendIcon(source.trend)}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Sentiment Score</span>
                  <span className={`text-xl font-bold ${getSentimentColor(source.score)}`}>
                    {source.score}
                  </span>
                </div>

                <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      source.score >= 70
                        ? 'bg-green-500'
                        : source.score >= 50
                        ? 'bg-yellow-500'
                        : source.score >= 30
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${source.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Phrases */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Trending Key Phrases</h2>
          
          <div className="flex flex-wrap gap-3">
            {currentSentiment.keyPhrases.map((phrase, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-600/30 hover:bg-blue-600/30 transition-colors cursor-pointer"
              >
                #{phrase}
              </span>
            ))}
          </div>
        </div>

        {/* Sentiment Timeline */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-6">Sentiment Timeline</h2>
          
          <div className="space-y-4">
            {currentSentiment.recentData.map((data, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="text-sm text-slate-400 w-24">
                  {data.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-semibold ${getSentimentColor(data.score)}`}>
                      {data.score}
                    </span>
                    <span className="text-xs text-slate-400">
                      {data.volume.toLocaleString()} mentions
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        data.score >= 70
                          ? 'bg-green-500'
                          : data.score >= 50
                          ? 'bg-yellow-500'
                          : data.score >= 30
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
