'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function AIInsights() {
  const predictions = [
    { market: 'Bitcoin $100k by 2024?', prediction: 'YES', confidence: 78, pattern: 'Bullish momentum', anomaly: false },
    { market: 'ETH $5k by Q2?', prediction: 'NO', confidence: 62, pattern: 'Resistance at $4.5k', anomaly: true },
  ];

  const patterns = [
    { name: 'Accumulation Phase', markets: 3, strength: 'Strong' },
    { name: 'Breakout Pattern', markets: 2, strength: 'Moderate' },
  ];

  const anomalies = [
    { market: 'Lakers Championship', type: 'Volume Spike', severity: 'High', detected: '2h ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
          <p className="text-gray-400">Machine learning predictions and pattern recognition</p>
        </div>
      </Card>

      {/* AI Predictions */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">AI Predictions</h4>
          
          <div className="space-y-3">
            {predictions.map((pred, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium mb-1">{pred.market}</p>
                    <p className="text-sm text-gray-400 mb-2">{pred.pattern}</p>
                    {pred.anomaly && (
                      <Badge variant="warning" className="text-xs">⚠️ Anomaly Detected</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={pred.prediction === 'YES' ? 'success' : 'error'}>
                      {pred.prediction}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Confidence</span>
                    <span className="font-medium">{pred.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${pred.confidence >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${pred.confidence}%` }}
                    />
                  </div>
                </div>
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
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{pattern.name}</p>
                  <p className="text-xs text-gray-400">{pattern.markets} markets</p>
                </div>
                <Badge variant="default">{pattern.strength}</Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Anomaly Detection */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Anomaly Detection</h4>
          
          <div className="space-y-2">
            {anomalies.map((anomaly, idx) => (
              <div key={idx} className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{anomaly.market}</p>
                    <p className="text-sm text-gray-400">{anomaly.type}</p>
                  </div>
                  <Badge variant="error">{anomaly.severity}</Badge>
                </div>
                <p className="text-xs text-gray-400">Detected {anomaly.detected}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Model Performance */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Model Performance</h4>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-green-400">73%</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Predictions</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Confidence</p>
              <p className="text-2xl font-bold">68%</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
