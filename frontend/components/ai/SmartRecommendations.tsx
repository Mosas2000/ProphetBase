'use client';

import { AlertCircle, Brain, ChevronRight, Info, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';

interface Recommendation {
  id: string;
  marketId: string;
  marketTitle: string;
  recommendation: 'buy_yes' | 'buy_no' | 'hold' | 'exit';
  confidence: number;
  expectedReturn: number;
  risk: 'low' | 'medium' | 'high';
  reasoning: string[];
  factors: {
    sentiment: number;
    technical: number;
    fundamental: number;
    momentum: number;
  };
  timeframe: string;
  currentPrice: number;
  targetPrice: number;
}

export default function SmartRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: '1',
      marketId: 'market-1',
      marketTitle: 'Will Bitcoin reach $100k by Q2 2026?',
      recommendation: 'buy_yes',
      confidence: 87,
      expectedReturn: 24.5,
      risk: 'medium',
      reasoning: [
        'Strong bullish momentum with consistent higher highs',
        'Institutional adoption increasing with 3 new ETF approvals',
        'Historical patterns suggest 70% probability of continuation',
        'On-chain metrics show accumulation by long-term holders',
      ],
      factors: {
        sentiment: 82,
        technical: 91,
        fundamental: 85,
        momentum: 88,
      },
      timeframe: '2-3 months',
      currentPrice: 0.65,
      targetPrice: 0.81,
    },
    {
      id: '2',
      marketId: 'market-2',
      marketTitle: 'Will inflation exceed 3% in 2026?',
      recommendation: 'buy_no',
      confidence: 72,
      expectedReturn: 18.3,
      risk: 'low',
      reasoning: [
        'Federal Reserve maintaining restrictive policy stance',
        'Recent CPI data trending below expectations',
        'Supply chain pressures normalizing globally',
        'Market pricing suggests overestimation of inflation risk',
      ],
      factors: {
        sentiment: 68,
        technical: 75,
        fundamental: 79,
        momentum: 67,
      },
      timeframe: '4-6 months',
      currentPrice: 0.58,
      targetPrice: 0.42,
    },
    {
      id: '3',
      marketId: 'market-3',
      marketTitle: 'Will Tesla stock reach $300 this year?',
      recommendation: 'hold',
      confidence: 58,
      expectedReturn: 8.2,
      risk: 'high',
      reasoning: [
        'Mixed signals from technical indicators',
        'Significant resistance at current price levels',
        'Awaiting Q1 earnings report for directional clarity',
        'Market volatility suggests patience is optimal strategy',
      ],
      factors: {
        sentiment: 55,
        technical: 52,
        fundamental: 61,
        momentum: 48,
      },
      timeframe: '1-2 months',
      currentPrice: 0.52,
      targetPrice: 0.56,
    },
  ]);

  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [investmentHorizon, setInvestmentHorizon] = useState<'short' | 'medium' | 'long'>('medium');

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'buy_yes':
        return 'text-green-400 bg-green-600/20';
      case 'buy_no':
        return 'text-blue-400 bg-blue-600/20';
      case 'hold':
        return 'text-yellow-400 bg-yellow-600/20';
      case 'exit':
        return 'text-red-400 bg-red-600/20';
      default:
        return 'text-slate-400 bg-slate-600/20';
    }
  };

  const getRecommendationLabel = (rec: string) => {
    switch (rec) {
      case 'buy_yes':
        return 'Buy YES';
      case 'buy_no':
        return 'Buy NO';
      case 'hold':
        return 'Hold';
      case 'exit':
        return 'Exit Position';
      default:
        return rec;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-400 bg-green-600/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-600/20';
      case 'high':
        return 'text-red-400 bg-red-600/20';
      default:
        return 'text-slate-400 bg-slate-600/20';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <Sparkles className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Smart Recommendations</h1>
              <p className="text-slate-400">AI-powered personalized market suggestions</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Preference Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Risk Tolerance</label>
              <select
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value as any)}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Investment Horizon</label>
              <select
                value={investmentHorizon}
                onChange={(e) => setInvestmentHorizon(e.target.value as any)}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="short">Short-term (1-3 months)</option>
                <option value="medium">Medium-term (3-6 months)</option>
                <option value="long">Long-term (6+ months)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => setSelectedRec(rec)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{rec.marketTitle}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getRecommendationColor(rec.recommendation)}`}>
                      {getRecommendationLabel(rec.recommendation)}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getRiskColor(rec.risk)}`}>
                      {rec.risk.toUpperCase()} Risk
                    </span>
                  </div>
                </div>
                <Brain className="w-6 h-6 text-blue-400 flex-shrink-0" />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Confidence</div>
                  <div className={`text-xl font-bold ${getConfidenceColor(rec.confidence)}`}>
                    {rec.confidence}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Expected Return</div>
                  <div className="text-xl font-bold text-green-400">
                    +{rec.expectedReturn}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Timeframe</div>
                  <div className="text-sm font-semibold">
                    {rec.timeframe}
                  </div>
                </div>
              </div>

              {/* Factor Scores */}
              <div className="space-y-2 mb-4">
                {Object.entries(rec.factors).map(([factor, score]) => (
                  <div key={factor}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 capitalize">{factor}</span>
                      <span className={getConfidenceColor(score)}>{score}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          score >= 80 ? 'bg-green-500' :
                          score >= 60 ? 'bg-yellow-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Reasoning */}
              <div className="mb-4">
                <div className="text-xs text-slate-400 mb-2">Top Reasons:</div>
                <ul className="space-y-1">
                  {rec.reasoning.slice(0, 2).map((reason, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                View Full Analysis
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Detailed Analysis Modal */}
        {selectedRec && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedRec.marketTitle}</h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getRecommendationColor(selectedRec.recommendation)}`}>
                      {getRecommendationLabel(selectedRec.recommendation)}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getRiskColor(selectedRec.risk)}`}>
                      {selectedRec.risk.toUpperCase()} Risk
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRec(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Confidence & Return */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-2">AI Confidence</div>
                  <div className={`text-3xl font-bold ${getConfidenceColor(selectedRec.confidence)}`}>
                    {selectedRec.confidence}%
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden mt-2">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${selectedRec.confidence}%` }}
                    />
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-2">Expected Return</div>
                  <div className="text-3xl font-bold text-green-400">
                    +{selectedRec.expectedReturn}%
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Timeframe: {selectedRec.timeframe}
                  </div>
                </div>
              </div>

              {/* Price Targets */}
              <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                <div className="text-sm text-slate-400 mb-3">Price Analysis</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Current Price</div>
                    <div className="text-xl font-bold">{selectedRec.currentPrice}</div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="text-xs text-slate-400">Target Price</div>
                    <div className="text-xl font-bold text-green-400">{selectedRec.targetPrice}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Potential Gain</div>
                    <div className="text-xl font-bold text-green-400">
                      +{((selectedRec.targetPrice - selectedRec.currentPrice) / selectedRec.currentPrice * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold">AI Reasoning</h3>
                </div>
                <ul className="space-y-3">
                  {selectedRec.reasoning.map((reason, idx) => (
                    <li key={idx} className="bg-slate-700/50 rounded-lg p-3 flex items-start gap-3">
                      <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Factor Analysis */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Factor Analysis</h3>
                <div className="space-y-3">
                  {Object.entries(selectedRec.factors).map(([factor, score]) => (
                    <div key={factor} className="bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{factor} Score</span>
                        <span className={`text-lg font-bold ${getConfidenceColor(score)}`}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            score >= 80 ? 'bg-green-500' :
                            score >= 60 ? 'bg-yellow-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-300">
                    <p className="font-semibold text-blue-400 mb-1">AI Recommendation Disclaimer</p>
                    <p>This recommendation is generated by AI models analyzing historical data, market trends, and sentiment. Past performance does not guarantee future results. Always conduct your own research and consider your risk tolerance before making investment decisions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Panel */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">How Our AI Works</h3>
              <p className="text-sm text-slate-300 mb-3">
                Our recommendation engine uses advanced machine learning models to analyze multiple data sources including market trends, social sentiment, on-chain data, and historical patterns. Each recommendation includes:
              </p>
              <ul className="space-y-1 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span><strong>Confidence Score:</strong> AI model certainty based on data quality and historical accuracy</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span><strong>Risk Assessment:</strong> Volatility and downside risk analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span><strong>Explainable AI:</strong> Clear reasoning behind each recommendation for transparency</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
