'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';

interface MarketInsightsProps {
  marketId: number;
  marketName: string;
}

export default function MarketInsights({ marketId, marketName }: MarketInsightsProps) {
  // Mock insights data
  const insights = {
    sentiment: 68, // 0-100
    confidence: 75,
    crowdWisdom: 'Bullish',
    totalTraders: 1234,
    volumeTrend: 'Increasing',
    priceStability: 'Moderate',
    expertConsensus: 72,
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return { label: 'Very Bullish', color: 'green' };
    if (score >= 55) return { label: 'Bullish', color: 'green' };
    if (score >= 45) return { label: 'Neutral', color: 'gray' };
    if (score >= 30) return { label: 'Bearish', color: 'red' };
    return { label: 'Very Bearish', color: 'red' };
  };

  const sentiment = getSentimentLabel(insights.sentiment);

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-6">Market Insights</h3>

      {/* Sentiment Score */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Market Sentiment</span>
          <Badge variant={sentiment.color as any}>{sentiment.label}</Badge>
        </div>
        <ProgressBar value={insights.sentiment} className="h-3" />
        <p className="text-sm text-gray-500 mt-2">
          {insights.sentiment}% of traders are bullish on this market
        </p>
      </div>

      {/* Confidence Score */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Crowd Confidence</span>
          <span className="text-lg font-bold text-blue-600">{insights.confidence}%</span>
        </div>
        <ProgressBar value={insights.confidence} className="h-3" />
        <p className="text-sm text-gray-500 mt-2">
          High confidence indicates strong conviction among traders
        </p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Total Traders</div>
          <div className="text-2xl font-bold">{insights.totalTraders.toLocaleString()}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Expert Consensus</div>
          <div className="text-2xl font-bold text-purple-600">{insights.expertConsensus}%</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Volume Trend</div>
          <div className="text-lg font-semibold text-green-600">↗ {insights.volumeTrend}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Price Stability</div>
          <div className="text-lg font-semibold">{insights.priceStability}</div>
        </div>
      </div>

      {/* Crowd Wisdom */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🧠</div>
          <div>
            <h4 className="font-semibold mb-1">Crowd Wisdom Indicator</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              The market shows <strong>{sentiment.label.toLowerCase()}</strong> sentiment with <strong>high confidence</strong>. 
              {insights.volumeTrend === 'Increasing' && ' Increasing volume suggests growing interest.'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
