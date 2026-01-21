'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function PredictionModels() {
  const models = [
    { name: 'Random Forest', accuracy: 76, predictions: 450, status: 'active' },
    { name: 'Neural Network', accuracy: 72, predictions: 380, status: 'active' },
    { name: 'Gradient Boosting', accuracy: 74, predictions: 420, status: 'active' },
  ];

  const ensemblePrediction = {
    outcome: 'YES',
    confidence: 78,
    agreement: 3,
    total: 3,
  };

  const backtestResults = [
    { period: 'Last 30 days', accuracy: 73, profit: 2450, trades: 45 },
    { period: 'Last 90 days', accuracy: 71, profit: 6800, trades: 128 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Prediction Models</h3>
          <p className="text-gray-400">Multiple ML models with ensemble predictions</p>
        </div>
      </Card>

      {/* Active Models */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Active Models</h4>
          
          <div className="space-y-3">
            {models.map((model, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium mb-1">{model.name}</p>
                    <p className="text-sm text-gray-400">{model.predictions} predictions</p>
                  </div>
                  <Badge variant="success">{model.status}</Badge>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Accuracy</span>
                  <span className="font-medium">{model.accuracy}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${model.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Ensemble Prediction */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Ensemble Prediction</h4>
          
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500 rounded-lg p-6">
            <div className="text-center mb-4">
              <Badge variant="success" className="text-xl px-6 py-2 mb-2">
                {ensemblePrediction.outcome}
              </Badge>
              <p className="text-sm text-gray-400">
                {ensemblePrediction.agreement}/{ensemblePrediction.total} models agree
              </p>
            </div>
            
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Ensemble Confidence</span>
              <span className="font-bold">{ensemblePrediction.confidence}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: `${ensemblePrediction.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Backtesting Results */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Backtesting Results</h4>
          
          <div className="space-y-3">
            {backtestResults.map((result, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <p className="font-medium mb-3">{result.period}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Accuracy</p>
                    <p className="font-bold text-green-400">{result.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Profit</p>
                    <p className="font-bold text-green-400">+${result.profit.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Trades</p>
                    <p className="font-bold">{result.trades}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
