'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function SentimentAnalysis() {
  const currentSentiment = {
    score: 68,
    label: 'Bullish',
    change: '+12%',
    sources: 1234,
  };

  const history = [
    { time: '12h ago', score: 56, label: 'Neutral' },
    { time: '6h ago', score: 62, label: 'Bullish' },
    { time: 'Now', score: 68, label: 'Bullish' },
  ];

  const socialMetrics = [
    { platform: 'Twitter', mentions: 2340, sentiment: 72 },
    { platform: 'Reddit', mentions: 1560, sentiment: 65 },
    { platform: 'Discord', mentions: 890, sentiment: 58 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Sentiment Analysis</h3>
          <p className="text-gray-400">Real-time market sentiment from social media</p>
        </div>
      </Card>

      {/* Current Sentiment */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Current Sentiment</h4>
          
          <div className="text-center mb-6">
            <div className={`inline-block rounded-full p-8 mb-4 ${
              currentSentiment.score >= 60 ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <span className="text-6xl font-bold">{currentSentiment.score}</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant={currentSentiment.score >= 60 ? 'success' : 'error'} className="text-lg">
                {currentSentiment.label}
              </Badge>
              <span className="text-green-400 font-bold">{currentSentiment.change}</span>
            </div>
            <p className="text-sm text-gray-400">Based on {currentSentiment.sources.toLocaleString()} sources</p>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${currentSentiment.score >= 60 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${currentSentiment.score}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Sentiment History */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Sentiment History</h4>
          
          <div className="space-y-3">
            {history.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">{item.time}</p>
                  <p className="text-sm text-gray-400">Score: {item.score}</p>
                </div>
                <Badge variant={item.score >= 60 ? 'success' : 'default'}>{item.label}</Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Social Media Integration */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Social Media Breakdown</h4>
          
          <div className="space-y-3">
            {socialMetrics.map((metric, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{metric.platform}</p>
                  <span className="text-sm text-gray-400">{metric.mentions.toLocaleString()} mentions</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Sentiment</span>
                  <span className="font-medium">{metric.sentiment}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${metric.sentiment >= 60 ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${metric.sentiment}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Price Correlation */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Sentiment-Price Correlation</h4>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Correlation Coefficient</span>
              <span className="text-2xl font-bold text-blue-400">0.78</span>
            </div>
            <p className="text-sm text-gray-400">Strong positive correlation between sentiment and price movement</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
