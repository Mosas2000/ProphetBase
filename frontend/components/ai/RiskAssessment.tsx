'use client';

import {
  Activity,
  AlertTriangle,
  PieChart,
  Shield,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

interface RiskFactor {
  category: string;
  score: number;
  weight: number;
  description: string;
  recommendation: string;
}

interface PortfolioRisk {
  overall: number;
  volatility: number;
  concentration: number;
  liquidity: number;
  timeHorizon: number;
}

interface StressTest {
  scenario: string;
  impact: number;
  probability: number;
  description: string;
}

interface MarketRisk {
  marketId: string;
  marketTitle: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  factors: RiskFactor[];
  stressTests: StressTest[];
}

export default function RiskAssessment() {
  const [selectedMarket, setSelectedMarket] = useState<string>('1');
  const [showStressTests, setShowStressTests] = useState(false);

  const [portfolioRisk] = useState<PortfolioRisk>({
    overall: 62,
    volatility: 68,
    concentration: 72,
    liquidity: 45,
    timeHorizon: 58,
  });

  const [marketRisks] = useState<MarketRisk[]>([
    {
      marketId: '1',
      marketTitle: 'Will Bitcoin reach $100k by Q2 2026?',
      riskScore: 58,
      riskLevel: 'Medium',
      factors: [
        {
          category: 'Market Volatility',
          score: 72,
          weight: 30,
          description:
            'High price volatility in crypto markets with 15-25% monthly swings',
          recommendation:
            'Consider hedging positions with lower volatility assets',
        },
        {
          category: 'Liquidity Risk',
          score: 42,
          weight: 20,
          description:
            'Strong liquidity with deep order books and high trading volume',
          recommendation: 'Maintain current position size',
        },
        {
          category: 'Regulatory Risk',
          score: 65,
          weight: 25,
          description:
            'Evolving regulatory landscape with potential policy changes',
          recommendation: 'Monitor regulatory developments closely',
        },
        {
          category: 'Technical Risk',
          score: 48,
          weight: 15,
          description: 'Moderate technical indicators with mixed signals',
          recommendation: 'Wait for clearer technical confirmation',
        },
        {
          category: 'Sentiment Risk',
          score: 55,
          weight: 10,
          description: 'Neutral to slightly positive market sentiment',
          recommendation: 'Monitor sentiment shifts for entry/exit signals',
        },
      ],
      stressTests: [
        {
          scenario: 'Major Market Crash (-30%)',
          impact: -42,
          probability: 15,
          description:
            'Crypto market experiences severe correction due to macro factors',
        },
        {
          scenario: 'Regulatory Crackdown',
          impact: -35,
          probability: 25,
          description: 'Government introduces restrictive crypto regulations',
        },
        {
          scenario: 'Exchange Hack',
          impact: -28,
          probability: 10,
          description:
            'Major exchange security breach impacts market confidence',
        },
        {
          scenario: 'Bull Market Rally (+50%)',
          impact: +65,
          probability: 30,
          description:
            'Strong institutional adoption drives major price appreciation',
        },
      ],
    },
    {
      marketId: '2',
      marketTitle: 'Will inflation exceed 3% in 2026?',
      riskScore: 34,
      riskLevel: 'Low',
      factors: [
        {
          category: 'Market Volatility',
          score: 32,
          weight: 30,
          description: 'Low volatility market with stable price movements',
          recommendation: 'Safe for larger position sizes',
        },
        {
          category: 'Liquidity Risk',
          score: 38,
          weight: 20,
          description: 'Good liquidity with consistent trading activity',
          recommendation: 'Liquidity suitable for most trading strategies',
        },
        {
          category: 'Regulatory Risk',
          score: 28,
          weight: 25,
          description:
            'Well-established regulatory framework with low uncertainty',
          recommendation: 'Minimal regulatory concerns',
        },
        {
          category: 'Technical Risk',
          score: 42,
          weight: 15,
          description: 'Stable technical indicators with clear trends',
          recommendation: 'Technical setup favorable for entries',
        },
        {
          category: 'Sentiment Risk',
          score: 30,
          weight: 10,
          description: 'Stable sentiment with low speculation',
          recommendation: 'Low sentiment-driven volatility expected',
        },
      ],
      stressTests: [
        {
          scenario: 'Economic Recession',
          impact: -25,
          probability: 35,
          description: 'Economic downturn affects market predictions',
        },
        {
          scenario: 'Fed Policy Shift',
          impact: -18,
          probability: 40,
          description: 'Federal Reserve changes monetary policy direction',
        },
        {
          scenario: 'Supply Chain Recovery',
          impact: +22,
          probability: 45,
          description:
            'Supply chain normalization reduces inflationary pressure',
        },
        {
          scenario: 'Energy Price Spike',
          impact: -32,
          probability: 20,
          description:
            'Sudden increase in energy costs drives inflation higher',
        },
      ],
    },
  ]);

  const currentMarket =
    marketRisks.find((m) => m.marketId === selectedMarket) || marketRisks[0];

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 50) return 'text-orange-400';
    if (score >= 30) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact > 0) return 'text-green-400';
    if (impact < -30) return 'text-red-400';
    if (impact < -15) return 'text-orange-400';
    return 'text-yellow-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                AI Risk Assessment
              </h1>
              <p className="text-slate-400">
                Comprehensive risk analysis and portfolio stress testing
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Portfolio Risk Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Overall Risk</span>
                <Shield className="w-4 h-4 text-orange-400" />
              </div>
              <div
                className={`text-2xl font-bold ${getRiskColor(
                  portfolioRisk.overall
                )}`}
              >
                {portfolioRisk.overall}
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1.5 mt-3">
                <div
                  className={`h-full rounded-full ${
                    portfolioRisk.overall >= 70
                      ? 'bg-red-500'
                      : portfolioRisk.overall >= 50
                      ? 'bg-orange-500'
                      : portfolioRisk.overall >= 30
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${portfolioRisk.overall}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Volatility</span>
                <Activity className="w-4 h-4 text-red-400" />
              </div>
              <div
                className={`text-2xl font-bold ${getRiskColor(
                  portfolioRisk.volatility
                )}`}
              >
                {portfolioRisk.volatility}
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1.5 mt-3">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{ width: `${portfolioRisk.volatility}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Concentration</span>
                <PieChart className="w-4 h-4 text-orange-400" />
              </div>
              <div
                className={`text-2xl font-bold ${getRiskColor(
                  portfolioRisk.concentration
                )}`}
              >
                {portfolioRisk.concentration}
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1.5 mt-3">
                <div
                  className="h-full rounded-full bg-orange-500"
                  style={{ width: `${portfolioRisk.concentration}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Liquidity</span>
                <TrendingUp className="w-4 h-4 text-yellow-400" />
              </div>
              <div
                className={`text-2xl font-bold ${getRiskColor(
                  portfolioRisk.liquidity
                )}`}
              >
                {portfolioRisk.liquidity}
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1.5 mt-3">
                <div
                  className="h-full rounded-full bg-yellow-500"
                  style={{ width: `${portfolioRisk.liquidity}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Time Horizon</span>
                <Target className="w-4 h-4 text-orange-400" />
              </div>
              <div
                className={`text-2xl font-bold ${getRiskColor(
                  portfolioRisk.timeHorizon
                )}`}
              >
                {portfolioRisk.timeHorizon}
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1.5 mt-3">
                <div
                  className="h-full rounded-full bg-orange-500"
                  style={{ width: `${portfolioRisk.timeHorizon}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Market Selector */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <label className="block text-sm text-slate-400 mb-2">
            Select Market for Detailed Analysis
          </label>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {marketRisks.map((market) => (
              <option key={market.marketId} value={market.marketId}>
                {market.marketTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Market Risk Score */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Market Risk Score</h2>
            <span
              className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getRiskLevelColor(
                currentMarket.riskLevel
              )}`}
            >
              {currentMarket.riskLevel} Risk
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${
                    (currentMarket.riskScore / 100) * 351.86
                  } 351.86`}
                  className={
                    currentMarket.riskScore >= 70
                      ? 'text-red-500'
                      : currentMarket.riskScore >= 50
                      ? 'text-orange-500'
                      : currentMarket.riskScore >= 30
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`text-3xl font-bold ${getRiskColor(
                    currentMarket.riskScore
                  )}`}
                >
                  {currentMarket.riskScore}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="text-sm text-slate-400 mb-2">
                Risk Interpretation
              </div>
              <p className="text-slate-300">
                {currentMarket.riskScore >= 70 &&
                  'High risk market with significant volatility and uncertainty. Consider reducing position size or implementing hedging strategies.'}
                {currentMarket.riskScore >= 50 &&
                  currentMarket.riskScore < 70 &&
                  'Moderate risk market with manageable volatility. Suitable for experienced traders with proper risk management.'}
                {currentMarket.riskScore >= 30 &&
                  currentMarket.riskScore < 50 &&
                  'Lower risk market with stable characteristics. Good opportunity for conservative investors.'}
                {currentMarket.riskScore < 30 &&
                  'Low risk market with minimal volatility. Suitable for risk-averse investors and larger position sizes.'}
              </p>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Risk Factor Breakdown</h2>

          <div className="space-y-4">
            {currentMarket.factors.map((factor, idx) => (
              <div key={idx} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={`w-5 h-5 ${getRiskColor(factor.score)}`}
                    />
                    <div>
                      <h3 className="font-semibold">{factor.category}</h3>
                      <div className="text-xs text-slate-400">
                        Weight: {factor.weight}%
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-2xl font-bold ${getRiskColor(
                      factor.score
                    )}`}
                  >
                    {factor.score}
                  </div>
                </div>

                <p className="text-sm text-slate-400 mb-3">
                  {factor.description}
                </p>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${
                        factor.score >= 70
                          ? 'bg-red-500'
                          : factor.score >= 50
                          ? 'bg-orange-500'
                          : factor.score >= 30
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-400 w-12">
                    {factor.score}%
                  </span>
                </div>

                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                  <div className="text-xs text-blue-400 font-semibold mb-1">
                    Recommendation
                  </div>
                  <div className="text-sm text-slate-300">
                    {factor.recommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stress Tests */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Stress Test Scenarios</h2>
            <button
              onClick={() => setShowStressTests(!showStressTests)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {showStressTests ? 'Hide' : 'Show'} Tests
            </button>
          </div>

          {showStressTests && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentMarket.stressTests.map((test, idx) => (
                <div key={idx} className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{test.scenario}</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    {test.description}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">
                          Potential Impact
                        </span>
                        <span
                          className={`text-lg font-bold ${getImpactColor(
                            test.impact
                          )}`}
                        >
                          {test.impact > 0 ? '+' : ''}
                          {test.impact}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className={`h-full rounded-full ${
                            test.impact > 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.abs(test.impact)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">
                          Probability
                        </span>
                        <span className="text-lg font-bold text-blue-400">
                          {test.probability}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${test.probability}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
