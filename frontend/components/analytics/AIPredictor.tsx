'use client';

import { useState } from 'react';

interface Prediction {
  marketId: string;
  marketQuestion: string;
  aiPrediction: {
    outcome: 'YES' | 'NO';
    confidence: number;
    reasoning: string[];
  };
  factors: {
    name: string;
    impact: number;
    direction: 'positive' | 'negative' | 'neutral';
  }[];
  historicalAccuracy: number;
  similarMarkets: {
    id: string;
    question: string;
    outcome: string;
    similarity: number;
  }[];
}

export default function AIPredictor() {
  const [marketId, setMarketId] = useState('42');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction>({
    marketId: '42',
    marketQuestion: 'Will BTC reach $100k by EOY 2024?',
    aiPrediction: {
      outcome: 'YES',
      confidence: 73.5,
      reasoning: [
        'Strong institutional adoption trends continue',
        'Historical halving cycle pattern suggests bull market',
        'Macro economic conditions favorable for risk assets',
        'On-chain metrics show accumulation by long-term holders',
        'Decreased exchange reserves indicate supply squeeze'
      ]
    },
    factors: [
      { name: 'Market Sentiment', impact: 85, direction: 'positive' },
      { name: 'On-Chain Metrics', impact: 78, direction: 'positive' },
      { name: 'Macroeconomic', impact: 62, direction: 'positive' },
      { name: 'Technical Analysis', impact: 71, direction: 'positive' },
      { name: 'Regulatory Environment', impact: 45, direction: 'neutral' }
    ],
    historicalAccuracy: 68.3,
    similarMarkets: [
      { id: '38', question: 'BTC reaches $75k by Q3 2024', outcome: 'YES', similarity: 92 },
      { id: '25', question: 'BTC above $50k by end of 2023', outcome: 'YES', similarity: 85 },
      { id: '89', question: 'ETH reaches $5k before BTC $100k', outcome: 'NO', similarity: 78 }
    ]
  });

  const runPrediction = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Market Predictor</h2>
          <p className="text-sm text-gray-600">Machine learning-powered outcome predictions</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
            🤖 AI-Powered
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {prediction.historicalAccuracy}% Accuracy
          </span>
        </div>
      </div>

      {/* Market Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Market
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={marketId}
            onChange={(e) => setMarketId(e.target.value)}
            placeholder="Market ID"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={runPrediction}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
          >
            {loading ? 'Analyzing...' : 'Predict'}
          </button>
        </div>
      </div>

      {/* Prediction Result */}
      <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {prediction.marketQuestion}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🤖</span>
                <div>
                  <div className="text-sm text-gray-600">AI Prediction</div>
                  <div className={`text-2xl font-bold ${
                    prediction.aiPrediction.outcome === 'YES' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {prediction.aiPrediction.outcome}
                  </div>
                </div>
              </div>
              
              <div className="border-l pl-4">
                <div className="text-sm text-gray-600">Confidence</div>
                <div className="text-2xl font-bold text-purple-600">
                  {prediction.aiPrediction.confidence}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
              style={{ width: `${prediction.aiPrediction.confidence}%` }}
            >
              <span className="text-xs text-white font-medium">
                {prediction.aiPrediction.confidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Reasoning */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">AI Reasoning:</h4>
          <ul className="space-y-1">
            {prediction.aiPrediction.reasoning.map((reason, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                <span className="text-purple-600">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Impact Factors */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Factors</h3>
        <div className="space-y-3">
          {prediction.factors.map((factor, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">
                    {factor.direction === 'positive' ? '📈' : factor.direction === 'negative' ? '📉' : '➡️'}
                  </span>
                  <span className="font-medium text-gray-900">{factor.name}</span>
                </div>
                <span className={`text-sm font-semibold ${
                  factor.direction === 'positive' ? 'text-green-600' :
                  factor.direction === 'negative' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {factor.impact}% {factor.direction}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    factor.direction === 'positive' ? 'bg-green-600' :
                    factor.direction === 'negative' ? 'bg-red-600' :
                    'bg-gray-600'
                  }`}
                  style={{ width: `${factor.impact}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Markets */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Historical Markets</h3>
        <div className="grid grid-cols-1 gap-3">
          {prediction.similarMarkets.map((market) => (
            <div key={market.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{market.question}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-semibold ${
                    market.outcome === 'YES' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {market.outcome}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {market.similarity}% similar
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">Market #{market.id}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          ⚠️ <strong>Disclaimer:</strong> AI predictions are for informational purposes only and should not be considered financial advice. 
          Always conduct your own research before making trading decisions.
        </p>
      </div>
    </div>
  );
}
