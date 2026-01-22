'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface SentimentData {
  bullish: number;
  bearish: number;
  neutral: number;
  totalVotes: number;
  momentum: 'strong-bull' | 'bull' | 'neutral' | 'bear' | 'strong-bear';
}

interface MarketSentimentProps {
  marketId?: number;
  data?: SentimentData;
}

export function MarketSentiment({ marketId, data }: MarketSentimentProps) {
  // Mock data - replace with actual API call
  const sentiment: SentimentData = data || {
    bullish: 65,
    bearish: 25,
    neutral: 10,
    totalVotes: 1234,
    momentum: 'bull',
  };

  const getMomentumColor = () => {
    switch (sentiment.momentum) {
      case 'strong-bull': return 'from-green-600 to-green-400';
      case 'bull': return 'from-green-500 to-green-300';
      case 'neutral': return 'from-gray-500 to-gray-400';
      case 'bear': return 'from-red-500 to-red-300';
      case 'strong-bear': return 'from-red-600 to-red-400';
    }
  };

  const getMomentumLabel = () => {
    switch (sentiment.momentum) {
      case 'strong-bull': return '🚀 Very Bullish';
      case 'bull': return '📈 Bullish';
      case 'neutral': return '➡️ Neutral';
      case 'bear': return '📉 Bearish';
      case 'strong-bear': return '💥 Very Bearish';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Market Sentiment</h3>

          {/* Overall Sentiment */}
          <div className={`bg-gradient-to-r ${getMomentumColor()} rounded-lg p-6 mb-6 text-center`}>
            <p className="text-sm text-white/80 mb-2">Community Mood</p>
            <p className="text-3xl font-bold text-white mb-2">{getMomentumLabel()}</p>
            <p className="text-sm text-white/80">{sentiment.totalVotes.toLocaleString()} votes</p>
          </div>

          {/* Sentiment Breakdown */}
          <div className="space-y-4">
            {/* Bullish */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-green-400 font-medium">🐂 Bullish</span>
                <span className="font-bold">{sentiment.bullish}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${sentiment.bullish}%` }}
                />
              </div>
            </div>

            {/* Neutral */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400 font-medium">➡️ Neutral</span>
                <span className="font-bold">{sentiment.neutral}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gray-500 h-3 rounded-full transition-all"
                  style={{ width: `${sentiment.neutral}%` }}
                />
              </div>
            </div>

            {/* Bearish */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-red-400 font-medium">🐻 Bearish</span>
                <span className="font-bold">{sentiment.bearish}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all"
                  style={{ width: `${sentiment.bearish}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Sentiment Indicators */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Sentiment Indicators</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Fear & Greed</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-green-400">72</p>
                <Badge variant="success">Greed</Badge>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Confidence</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">85%</p>
                <Badge variant="success">High</Badge>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Volatility</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-yellow-400">Medium</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Momentum</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-green-400">+12%</p>
                <span className="text-green-400">↗</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Sentiment Changes */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Sentiment Timeline</h4>
          
          <div className="space-y-3">
            {[
              { time: '2 hours ago', change: '+5%', sentiment: 'Bullish', color: 'text-green-400' },
              { time: '6 hours ago', change: '-2%', sentiment: 'Bearish', color: 'text-red-400' },
              { time: '12 hours ago', change: '+8%', sentiment: 'Bullish', color: 'text-green-400' },
              { time: '1 day ago', change: '+3%', sentiment: 'Bullish', color: 'text-green-400' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${item.color}`}>{item.change}</span>
                  <span className="text-gray-400">{item.sentiment}</span>
                </div>
                <span className="text-sm text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
