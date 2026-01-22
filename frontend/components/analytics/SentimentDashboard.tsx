'use client';

import { useState } from 'react';

interface SentimentData {
  overall: number;
  sources: {
    twitter: number;
    reddit: number;
    discord: number;
    forum: number;
  };
  trend: 'bullish' | 'bearish' | 'neutral';
  change24h: number;
  keywords: {
    word: string;
    count: number;
    sentiment: 'positive' | 'negative' | 'neutral';
  }[];
  timeline: {
    timestamp: number;
    score: number;
  }[];
}

export default function SentimentDashboard() {
  const [marketId, setMarketId] = useState('42');
  const [sentiment] = useState<SentimentData>({
    overall: 68.5,
    sources: {
      twitter: 72.3,
      reddit: 65.8,
      discord: 71.2,
      forum: 64.5,
    },
    trend: 'bullish',
    change24h: +5.3,
    keywords: [
      { word: 'bullish', count: 1247, sentiment: 'positive' },
      { word: 'moon', count: 892, sentiment: 'positive' },
      { word: 'buying', count: 678, sentiment: 'positive' },
      { word: 'worried', count: 234, sentiment: 'negative' },
      { word: 'dump', count: 156, sentiment: 'negative' },
    ],
    timeline: [
      { timestamp: Date.now() - 86400000 * 7, score: 55 },
      { timestamp: Date.now() - 86400000 * 6, score: 58 },
      { timestamp: Date.now() - 86400000 * 5, score: 62 },
      { timestamp: Date.now() - 86400000 * 4, score: 61 },
      { timestamp: Date.now() - 86400000 * 3, score: 65 },
      { timestamp: Date.now() - 86400000 * 2, score: 67 },
      { timestamp: Date.now() - 86400000, score: 63 },
      { timestamp: Date.now(), score: 68.5 },
    ],
  });

  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 80) return 'Very Bullish';
    if (score >= 65) return 'Bullish';
    if (score >= 50) return 'Neutral';
    if (score >= 35) return 'Bearish';
    return 'Very Bearish';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Sentiment Analysis
          </h2>
          <p className="text-sm text-gray-600">
            Real-time social sentiment tracking
          </p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          Updated {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Overall Sentiment */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Overall Sentiment
            </h3>
            <div
              className={`text-5xl font-bold ${getSentimentColor(
                sentiment.overall
              )}`}
            >
              {sentiment.overall}%
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {getSentimentLabel(sentiment.overall)}
            </p>
          </div>
          <div className="text-right">
            <div
              className={`flex items-center space-x-1 text-lg font-semibold ${
                sentiment.change24h > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <span>{sentiment.change24h > 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(sentiment.change24h)}%</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">24h change</p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${
              sentiment.overall >= 70
                ? 'bg-green-600'
                : sentiment.overall >= 50
                ? 'bg-yellow-600'
                : 'bg-red-600'
            }`}
            style={{ width: `${sentiment.overall}%` }}
          />
        </div>
      </div>

      {/* Source Breakdown */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sentiment by Source
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(sentiment.sources).map(([source, score]) => (
            <div key={source} className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">
                {source === 'twitter' && '𝕏'}
                {source === 'reddit' && '🤖'}
                {source === 'discord' && '💬'}
                {source === 'forum' && '📋'}
              </div>
              <div className={`text-2xl font-bold ${getSentimentColor(score)}`}>
                {score}%
              </div>
              <div className="text-sm text-gray-600 capitalize">{source}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Keywords */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Trending Keywords
        </h3>
        <div className="flex flex-wrap gap-3">
          {sentiment.keywords.map((keyword, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-full border-2 ${
                keyword.sentiment === 'positive'
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : keyword.sentiment === 'negative'
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-gray-50 border-gray-300 text-gray-700'
              }`}
            >
              <span className="font-semibold">{keyword.word}</span>
              <span className="ml-2 text-sm">({keyword.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Timeline */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          7-Day Sentiment Trend
        </h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="relative h-40">
            <svg className="w-full h-full">
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                points={sentiment.timeline
                  .map((point, index) => {
                    const x = (index / (sentiment.timeline.length - 1)) * 100;
                    const y = 100 - point.score;
                    return `${x}%,${y}%`;
                  })
                  .join(' ')}
              />
              {sentiment.timeline.map((point, index) => {
                const x = (index / (sentiment.timeline.length - 1)) * 100;
                const y = 100 - point.score;
                return (
                  <circle
                    key={index}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    fill="#2563EB"
                  />
                );
              })}
            </svg>
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-600">
            <span>7 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
