'use client';

import { Activity, AlertCircle, Brain, LineChart, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface PredictionModel {
  name: string;
  type: 'lstm' | 'arima' | 'ensemble' | 'transformer';
  accuracy: number;
  prediction: number;
  confidence: number;
}

interface PricePrediction {
  marketId: string;
  marketTitle: string;
  currentPrice: number;
  predictions: {
    day1: { price: number; low: number; high: number; confidence: number };
    day7: { price: number; low: number; high: number; confidence: number };
    day30: { price: number; low: number; high: number; confidence: number };
  };
  models: PredictionModel[];
  trend: 'bullish' | 'bearish' | 'neutral';
  volatility: number;
  historicalAccuracy: number;
}

export default function PricePrediction() {
  const [selectedMarket, setSelectedMarket] = useState<string>('1');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day1' | 'day7' | 'day30'>('day7');
  
  const [predictions] = useState<PricePrediction[]>([
    {
      marketId: '1',
      marketTitle: 'Will Bitcoin reach $100k by Q2 2026?',
      currentPrice: 0.65,
      predictions: {
        day1: { price: 0.66, low: 0.64, high: 0.68, confidence: 92 },
        day7: { price: 0.71, low: 0.67, high: 0.76, confidence: 84 },
        day30: { price: 0.78, low: 0.70, high: 0.87, confidence: 72 },
      },
      models: [
        { name: 'LSTM Neural Network', type: 'lstm', accuracy: 87, prediction: 0.72, confidence: 85 },
        { name: 'ARIMA Time Series', type: 'arima', accuracy: 82, prediction: 0.69, confidence: 80 },
        { name: 'Ensemble Model', type: 'ensemble', accuracy: 91, prediction: 0.71, confidence: 88 },
        { name: 'Transformer', type: 'transformer', accuracy: 89, prediction: 0.70, confidence: 86 },
      ],
      trend: 'bullish',
      volatility: 0.15,
      historicalAccuracy: 87.3,
    },
    {
      marketId: '2',
      marketTitle: 'Will inflation exceed 3% in 2026?',
      currentPrice: 0.58,
      predictions: {
        day1: { price: 0.57, low: 0.56, high: 0.59, confidence: 94 },
        day7: { price: 0.54, low: 0.51, high: 0.58, confidence: 86 },
        day30: { price: 0.48, low: 0.42, high: 0.55, confidence: 75 },
      },
      models: [
        { name: 'LSTM Neural Network', type: 'lstm', accuracy: 84, prediction: 0.53, confidence: 82 },
        { name: 'ARIMA Time Series', type: 'arima', accuracy: 86, prediction: 0.55, confidence: 85 },
        { name: 'Ensemble Model', type: 'ensemble', accuracy: 89, prediction: 0.54, confidence: 87 },
        { name: 'Transformer', type: 'transformer', accuracy: 87, prediction: 0.52, confidence: 84 },
      ],
      trend: 'bearish',
      volatility: 0.12,
      historicalAccuracy: 86.5,
    },
  ]);

  const currentPrediction = predictions.find(p => p.marketId === selectedMarket) || predictions[0];
  const selectedPred = currentPrediction.predictions[selectedTimeframe];

  const getModelTypeColor = (type: string) => {
    switch (type) {
      case 'lstm':
        return 'text-blue-400 bg-blue-600/20';
      case 'arima':
        return 'text-green-400 bg-green-600/20';
      case 'ensemble':
        return 'text-purple-400 bg-purple-600/20';
      case 'transformer':
        return 'text-orange-400 bg-orange-600/20';
      default:
        return 'text-slate-400 bg-slate-600/20';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'text-green-400';
      case 'bearish':
        return 'text-red-400';
      case 'neutral':
        return 'text-yellow-400';
      default:
        return 'text-slate-400';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const priceChange = ((selectedPred.price - currentPrediction.currentPrice) / currentPrediction.currentPrice) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <LineChart className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">AI Price Prediction</h1>
              <p className="text-slate-400">ML-powered price forecasting with confidence intervals</p>
            </div>
          </div>
        </div>

        {/* Market Selector */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <label className="block text-sm text-slate-400 mb-2">Select Market</label>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {predictions.map((pred) => (
              <option key={pred.marketId} value={pred.marketId}>
                {pred.marketTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Main Prediction */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Price Forecast</h2>
            <div className="flex gap-2">
              {(['day1', 'day7', 'day30'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTimeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {tf === 'day1' ? '1 Day' : tf === 'day7' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Current vs Predicted */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-slate-700/50 rounded-lg p-6">
              <div className="text-sm text-slate-400 mb-2">Current Price</div>
              <div className="text-3xl font-bold">{currentPrediction.currentPrice}</div>
              <div className="text-xs text-slate-400 mt-2">Live market price</div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-6">
              <div className="text-sm text-slate-400 mb-2">Predicted Price</div>
              <div className={`text-3xl font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {selectedPred.price}
              </div>
              <div className={`text-sm font-semibold mt-2 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-6">
              <div className="text-sm text-slate-400 mb-2">Confidence</div>
              <div className={`text-3xl font-bold ${getConfidenceColor(selectedPred.confidence)}`}>
                {selectedPred.confidence}%
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden mt-2">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${selectedPred.confidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* Confidence Interval */}
          <div className="bg-slate-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Confidence Interval</h3>
              <span className="text-sm text-slate-400">{selectedPred.confidence}% confidence band</span>
            </div>

            <div className="relative h-20">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-8 bg-slate-600 rounded-lg relative overflow-hidden">
                  {/* Confidence interval bar */}
                  <div
                    className="absolute h-full bg-blue-500/30 border-l-2 border-r-2 border-blue-500"
                    style={{
                      left: `${(selectedPred.low / 1) * 100}%`,
                      right: `${(1 - selectedPred.high / 1) * 100}%`,
                    }}
                  />
                  {/* Current price indicator */}
                  <div
                    className="absolute w-1 h-full bg-yellow-400"
                    style={{ left: `${(currentPrediction.currentPrice / 1) * 100}%` }}
                  />
                  {/* Predicted price indicator */}
                  <div
                    className="absolute w-1 h-full bg-green-400"
                    style={{ left: `${(selectedPred.price / 1) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm mt-4">
              <div>
                <div className="text-slate-400">Low</div>
                <div className="font-semibold">{selectedPred.low}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400">Predicted</div>
                <div className="font-semibold text-green-400">{selectedPred.price}</div>
              </div>
              <div className="text-right">
                <div className="text-slate-400">High</div>
                <div className="font-semibold">{selectedPred.high}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Trend</span>
              <TrendingUp className={`w-4 h-4 ${getTrendColor(currentPrediction.trend)}`} />
            </div>
            <div className={`text-2xl font-bold capitalize ${getTrendColor(currentPrediction.trend)}`}>
              {currentPrediction.trend}
            </div>
            <div className="text-xs text-slate-400 mt-1">AI-detected market direction</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Volatility</span>
              <Activity className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold">
              {(currentPrediction.volatility * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400 mt-1">Expected price fluctuation</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Model Accuracy</span>
              <Target className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">
              {currentPrediction.historicalAccuracy}%
            </div>
            <div className="text-xs text-slate-400 mt-1">Historical prediction accuracy</div>
          </div>
        </div>

        {/* Model Comparison */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold">Model Predictions</h2>
          </div>

          <div className="space-y-4">
            {currentPrediction.models.map((model, idx) => (
              <div key={idx} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{model.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getModelTypeColor(model.type)}`}>
                        {model.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400">
                      Historical Accuracy: {model.accuracy}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{model.prediction}</div>
                    <div className={`text-xs ${getConfidenceColor(model.confidence)}`}>
                      {model.confidence}% confidence
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Model Accuracy</div>
                    <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${model.accuracy}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Prediction Confidence</div>
                    <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${model.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Timeframe Predictions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Multi-Timeframe Forecast</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Timeframe</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Predicted Price</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Change</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Range</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(currentPrediction.predictions).map(([timeframe, pred]) => {
                  const change = ((pred.price - currentPrediction.currentPrice) / currentPrediction.currentPrice) * 100;
                  return (
                    <tr key={timeframe} className="border-b border-slate-700/50">
                      <td className="py-4 px-4 font-medium">
                        {timeframe === 'day1' ? '1 Day' : timeframe === 'day7' ? '7 Days' : '30 Days'}
                      </td>
                      <td className="py-4 px-4 text-right text-lg font-bold">
                        {pred.price}
                      </td>
                      <td className={`py-4 px-4 text-right font-semibold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                      </td>
                      <td className="py-4 px-4 text-right text-sm">
                        {pred.low} - {pred.high}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${getConfidenceColor(pred.confidence)}`}>
                          {pred.confidence}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">AI Prediction Disclaimer</h3>
              <p className="text-sm text-slate-300 mb-3">
                These predictions are generated by machine learning models trained on historical market data. Key points to understand:
              </p>
              <ul className="space-y-1 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Models are continuously retrained with new data to maintain accuracy</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Confidence intervals represent the range where the true price is likely to fall</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Historical accuracy reflects past performance and does not guarantee future results</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Predictions should be used as one factor in your decision-making process</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
