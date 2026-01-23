'use client';

import React, { useState } from 'react';
import { Lightbulb, TrendingUp, Target, AlertCircle, BarChart3, Sparkles, ChevronRight } from 'lucide-react';

interface Insight {
  id: string;
  category: 'opportunity' | 'risk' | 'trend' | 'anomaly' | 'prediction';
  priority: 'high' | 'medium' | 'low';
  title: string;
  summary: string;
  analysis: string[];
  recommendation: string;
  confidence: number;
  potentialImpact: string;
  timeframe: string;
  relatedMarkets: string[];
}

interface MarketTrend {
  name: string;
  direction: 'up' | 'down' | 'stable';
  strength: number;
  affectedMarkets: number;
}

export default function MarketInsights() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'opportunity' | 'risk' | 'trend' | 'anomaly' | 'prediction'>('all');
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  const [insights] = useState<Insight[]>([
    {
      id: 'i1',
      category: 'opportunity',
      priority: 'high',
      title: 'Strong Bullish Momentum in Crypto Markets',
      summary: 'Multiple crypto-related prediction markets showing synchronized bullish signals with institutional adoption indicators',
      analysis: [
        'Bitcoin $100k market up 12% in 24 hours with sustained volume',
        'Ethereum and altcoin markets following similar patterns',
        'Institutional sentiment shift detected across 8 major indicators',
        'Technical breakout confirmed above key resistance levels',
        'Social sentiment strongly positive with 78% bullish mentions',
      ],
      recommendation: 'Consider increasing exposure to crypto-related markets. Target 35-40% portfolio allocation with stop losses at current support levels ($0.63-$0.65).',
      confidence: 87,
      potentialImpact: '+25-35% potential returns over 2-3 weeks',
      timeframe: '14-21 days',
      relatedMarkets: ['Bitcoin $100k', 'Ethereum $5k', 'Crypto Adoption'],
    },
    {
      id: 'i2',
      category: 'risk',
      priority: 'high',
      title: 'Elevated Volatility Warning Across Tech Sector',
      summary: 'AI detects increasing correlation between tech markets with heightened volatility risk',
      analysis: [
        'Tech market volatility increased 35% over past week',
        'Cross-market correlation at 0.82 (historically high)',
        'Implied volatility rising faster than historical averages',
        'Multiple tech markets approaching overbought territory',
        'Regulatory concerns building in sentiment analysis',
      ],
      recommendation: 'Reduce concentration in correlated tech positions. Consider hedging with defensive sectors or taking partial profits on tech-heavy positions.',
      confidence: 82,
      potentialImpact: 'Potential 15-25% drawdown if volatility continues',
      timeframe: '7-14 days',
      relatedMarkets: ['AI Breakthrough', 'Tech Stocks', 'Chip Shortage'],
    },
    {
      id: 'i3',
      category: 'trend',
      priority: 'medium',
      title: 'Emerging Interest in Climate Markets',
      summary: 'Sustained volume increase and sentiment improvement in climate and sustainability markets',
      analysis: [
        'Climate-related markets see 45% volume increase',
        'Google Trends showing rising public interest',
        'Policy catalysts approaching in Q2',
        'Institutional ESG funds allocating to prediction markets',
        'Correlation with renewable energy stocks strengthening',
      ],
      recommendation: 'Early-stage opportunity in climate markets. Consider 10-15% allocation as markets are still establishing price discovery.',
      confidence: 74,
      potentialImpact: '+20-30% potential as mainstream adoption grows',
      timeframe: '30-60 days',
      relatedMarkets: ['Climate Goals 2026', 'EV Adoption', 'Carbon Pricing'],
    },
    {
      id: 'i4',
      category: 'anomaly',
      priority: 'medium',
      title: 'Unusual Price Divergence in Inflation Markets',
      summary: 'AI detects pricing inefficiency between related inflation prediction markets',
      analysis: [
        'CPI and Core Inflation markets showing 12% price divergence',
        'Historical correlation suggests these should trade closer',
        'Arbitrage opportunity with 8-10% potential profit',
        'Low risk given strong historical mean reversion',
        'Volume confirms this is real mispricing, not data error',
      ],
      recommendation: 'Arbitrage strategy: Long underpriced market, short overpriced market. Risk-adjusted return 7-9% with 2-3 week holding period.',
      confidence: 91,
      potentialImpact: '+7-9% risk-adjusted return',
      timeframe: '14-21 days',
      relatedMarkets: ['Inflation >3%', 'Core CPI', 'Fed Rate Decision'],
    },
    {
      id: 'i5',
      category: 'prediction',
      priority: 'high',
      title: 'Market Correction Probability Increasing',
      summary: 'AI models detect multiple signals suggesting broader market correction risk',
      analysis: [
        'VIX equivalent rising steadily for 5 consecutive days',
        'Market breadth deteriorating with fewer markets advancing',
        'Sentiment indicators reaching euphoric extremes',
        'Historical pattern matching suggests 65% correction probability',
        'Smart money flow analysis shows institutional distribution',
      ],
      recommendation: 'Defensive positioning recommended. Reduce leverage, tighten stop losses, and increase cash allocation to 20-25%.',
      confidence: 78,
      potentialImpact: 'Potential 10-20% portfolio drawdown if correction occurs',
      timeframe: '5-10 days',
      relatedMarkets: ['Market Volatility', 'Economic Recession', 'Fed Policy'],
    },
    {
      id: 'i6',
      category: 'opportunity',
      priority: 'low',
      title: 'Healthcare Sector Showing Early Strength',
      summary: 'Gradual accumulation pattern detected in healthcare-related markets',
      analysis: [
        'Healthcare markets quietly accumulating volume',
        'Insider sentiment improving based on social analysis',
        'Regulatory calendar favorable in coming months',
        'Defensive rotation may benefit healthcare',
        'Technical indicators showing hidden bullish divergence',
      ],
      recommendation: 'Early accumulation opportunity. Small 5-10% position could grow as trend develops.',
      confidence: 68,
      potentialImpact: '+15-20% potential over 2-3 months',
      timeframe: '45-90 days',
      relatedMarkets: ['Drug Approval', 'Healthcare Reform', 'Biotech Innovation'],
    },
  ]);

  const [marketTrends] = useState<MarketTrend[]>([
    {
      name: 'Crypto Adoption',
      direction: 'up',
      strength: 85,
      affectedMarkets: 12,
    },
    {
      name: 'Inflation Concerns',
      direction: 'down',
      strength: 68,
      affectedMarkets: 8,
    },
    {
      name: 'Tech Innovation',
      direction: 'up',
      strength: 72,
      affectedMarkets: 15,
    },
    {
      name: 'Climate Action',
      direction: 'up',
      strength: 58,
      affectedMarkets: 6,
    },
  ]);

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(i => i.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'opportunity':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'risk':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'trend':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'anomaly':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'prediction':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-slate-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'opportunity':
        return <Target className="w-5 h-5" />;
      case 'risk':
        return <AlertCircle className="w-5 h-5" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5" />;
      case 'anomaly':
        return <Sparkles className="w-5 h-5" />;
      case 'prediction':
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <Lightbulb className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Market Insights</h1>
              <p className="text-slate-400">AI-generated market analysis and opportunities</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Total Insights</div>
            <div className="text-2xl font-bold text-blue-400">{insights.length}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Opportunities</div>
            <div className="text-2xl font-bold text-green-400">
              {insights.filter(i => i.category === 'opportunity').length}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Risks</div>
            <div className="text-2xl font-bold text-red-400">
              {insights.filter(i => i.category === 'risk').length}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">High Priority</div>
            <div className="text-2xl font-bold text-orange-400">
              {insights.filter(i => i.priority === 'high').length}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Avg Confidence</div>
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
            </div>
          </div>
        </div>

        {/* Market Trends */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Trending Themes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketTrends.map((trend, idx) => (
              <div key={idx} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      trend.direction === 'up' ? 'bg-green-600/20' : 
                      trend.direction === 'down' ? 'bg-red-600/20' : 'bg-yellow-600/20'
                    }`}>
                      <TrendingUp className={`w-5 h-5 ${
                        trend.direction === 'up' ? 'text-green-400' : 
                        trend.direction === 'down' ? 'text-red-400 rotate-180' : 'text-yellow-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{trend.name}</h3>
                      <div className="text-xs text-slate-400">
                        {trend.affectedMarkets} markets affected
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${
                    trend.direction === 'up' ? 'text-green-400' : 
                    trend.direction === 'down' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {trend.strength}%
                  </div>
                </div>

                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${
                      trend.direction === 'up' ? 'bg-green-500' : 
                      trend.direction === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${trend.strength}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 mb-8">
          <div className="flex flex-wrap gap-2">
            {['all', 'opportunity', 'risk', 'trend', 'anomaly', 'prediction'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors border ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-700 text-slate-300 border-slate-600 hover:border-blue-500/50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Insights List */}
        <div className="space-y-4 mb-8">
          {filteredInsights.map((insight) => (
            <div
              key={insight.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedInsight(insight)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-3 rounded-lg ${getCategoryColor(insight.category)}`}>
                    {getCategoryIcon(insight.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{insight.title}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(insight.category)}`}>
                        {insight.category.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-400 mb-3">{insight.summary}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Priority:</span>
                        <span className={`font-semibold ${getPriorityColor(insight.priority)}`}>
                          {insight.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="font-semibold text-blue-400">{insight.confidence}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Timeframe:</span>
                        <span className="font-semibold text-purple-400">{insight.timeframe}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedInsight && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-3 rounded-lg ${getCategoryColor(selectedInsight.category)}`}>
                      {getCategoryIcon(selectedInsight.category)}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{selectedInsight.title}</h2>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(selectedInsight.category)}`}>
                          {selectedInsight.category.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getPriorityColor(selectedInsight.priority)}`}>
                          {selectedInsight.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedInsight(null)}
                    className="text-slate-400 hover:text-white transition-colors text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Summary</h3>
                    <p className="text-slate-300">{selectedInsight.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Detailed Analysis</h3>
                    <ul className="space-y-2">
                      {selectedInsight.analysis.map((point, idx) => (
                        <li key={idx} className="flex gap-3 text-slate-300">
                          <span className="text-blue-400">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2 text-blue-400">Recommendation</h3>
                    <p className="text-slate-300">{selectedInsight.recommendation}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Confidence Level</div>
                      <div className="text-2xl font-bold text-blue-400 mb-2">{selectedInsight.confidence}%</div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${selectedInsight.confidence}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Timeframe</div>
                      <div className="text-2xl font-bold text-purple-400">{selectedInsight.timeframe}</div>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-2">Potential Impact</div>
                    <div className="text-lg font-semibold text-green-400">{selectedInsight.potentialImpact}</div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-400 mb-2">Related Markets</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedInsight.relatedMarkets.map((market, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-600/30 text-sm"
                        >
                          {market}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-400 mb-1">AI-Powered Market Intelligence</div>
              <div className="text-sm text-slate-300">
                These insights are generated by analyzing millions of data points including price movements, volume patterns, sentiment indicators, and macroeconomic factors. 
                Use them as one input in your decision-making process.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
