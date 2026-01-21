'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function TimeSeriesAnalysis() {
  const indicators = [
    { name: 'RSI', value: 68, signal: 'Overbought', color: 'text-yellow-400' },
    { name: 'MACD', value: '+0.05', signal: 'Bullish', color: 'text-green-400' },
    { name: 'Bollinger Bands', value: 'Upper', signal: 'Resistance', color: 'text-red-400' },
  ];

  const patterns = [
    { name: 'Head and Shoulders', confidence: 72, timeframe: '4h' },
    { name: 'Double Bottom', confidence: 65, timeframe: '1d' },
  ];

  const forecast = {
    prediction: 'Bullish',
    target: 0.72,
    confidence: 68,
    timeframe: '7 days',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Time Series Analysis</h3>
          <p className="text-gray-400">Advanced charting and technical analysis</p>
        </div>
      </Card>

      {/* Chart */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Price Chart</h4>
          
          <div className="bg-gray-900 rounded-lg p-6 h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl mb-2">📊</p>
              <p className="text-sm text-gray-400">Advanced candlestick chart</p>
              <p className="text-xs text-gray-500 mt-1">With technical indicators overlay</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Technical Indicators */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Technical Indicators</h4>
          
          <div className="space-y-3">
            {indicators.map((indicator, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium mb-1">{indicator.name}</p>
                  <p className={`text-sm ${indicator.color}`}>{indicator.signal}</p>
                </div>
                <span className="text-xl font-bold">{indicator.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Pattern Recognition */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Detected Patterns</h4>
          
          <div className="space-y-2">
            {patterns.map((pattern, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{pattern.name}</p>
                  <Badge variant="default">{pattern.timeframe}</Badge>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Confidence</span>
                  <span className="font-medium">{pattern.confidence}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${pattern.confidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Forecast */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Price Forecast</h4>
          
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Badge variant="success" className="mb-2">{forecast.prediction}</Badge>
                <p className="text-sm text-gray-400">{forecast.timeframe} forecast</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{forecast.target.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Target Price</p>
              </div>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Confidence</span>
              <span className="font-medium">{forecast.confidence}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${forecast.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
