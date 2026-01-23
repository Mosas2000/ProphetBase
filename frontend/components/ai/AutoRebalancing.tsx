'use client';

import React, { useState } from 'react';
import { RefreshCw, PieChart, TrendingUp, Target, Settings, Zap, DollarSign, BarChart3 } from 'lucide-react';

interface Asset {
  marketId: string;
  marketTitle: string;
  currentAllocation: number;
  targetAllocation: number;
  currentValue: number;
  currentShares: number;
  price: number;
}

interface RebalanceAction {
  marketId: string;
  marketTitle: string;
  action: 'buy' | 'sell' | 'hold';
  currentShares: number;
  targetShares: number;
  sharesToTrade: number;
  value: number;
  reason: string;
}

interface RebalanceStrategy {
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'threshold';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  minTradeSize: number;
  maxSingleTrade: number;
  taxOptimization: boolean;
}

export default function AutoRebalancing() {
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [strategy, setStrategy] = useState<RebalanceStrategy>({
    frequency: 'monthly',
    riskTolerance: 'moderate',
    minTradeSize: 50,
    maxSingleTrade: 1000,
    taxOptimization: true,
  });

  const [portfolio] = useState<Asset[]>([
    {
      marketId: '1',
      marketTitle: 'Bitcoin $100k',
      currentAllocation: 45,
      targetAllocation: 35,
      currentValue: 2250,
      currentShares: 3200,
      price: 0.68,
    },
    {
      marketId: '2',
      marketTitle: 'Inflation >3%',
      currentAllocation: 20,
      targetAllocation: 25,
      currentValue: 1000,
      currentShares: 2380,
      price: 0.42,
    },
    {
      marketId: '3',
      marketTitle: 'Tech Stocks Rally',
      currentAllocation: 25,
      targetAllocation: 25,
      currentValue: 1250,
      currentShares: 2272,
      price: 0.55,
    },
    {
      marketId: '4',
      marketTitle: 'Gold Reaches $2500',
      currentAllocation: 10,
      targetAllocation: 15,
      currentValue: 500,
      currentShares: 833,
      price: 0.60,
    },
  ]);

  const totalValue = portfolio.reduce((sum, asset) => sum + asset.currentValue, 0);

  const [rebalanceActions] = useState<RebalanceAction[]>([
    {
      marketId: '1',
      marketTitle: 'Bitcoin $100k',
      action: 'sell',
      currentShares: 3200,
      targetShares: 2574,
      sharesToTrade: 626,
      value: -425.68,
      reason: 'Overweight by 10% - reduce exposure to manage risk',
    },
    {
      marketId: '2',
      marketTitle: 'Inflation >3%',
      action: 'buy',
      currentShares: 2380,
      targetShares: 2976,
      sharesToTrade: 596,
      value: +250.32,
      reason: 'Underweight by 5% - increase to target allocation',
    },
    {
      marketId: '3',
      marketTitle: 'Tech Stocks Rally',
      action: 'hold',
      currentShares: 2272,
      targetShares: 2272,
      sharesToTrade: 0,
      value: 0,
      reason: 'At target allocation - no action needed',
    },
    {
      marketId: '4',
      marketTitle: 'Gold Reaches $2500',
      action: 'buy',
      currentShares: 833,
      targetShares: 1250,
      sharesToTrade: 417,
      value: +250.20,
      reason: 'Underweight by 5% - increase for diversification',
    },
  ]);

  const getDriftPercentage = (current: number, target: number) => {
    return Math.abs(current - target);
  };

  const getDriftColor = (drift: number) => {
    if (drift >= 10) return 'text-red-400';
    if (drift >= 5) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'sell':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'hold':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const handleRebalance = () => {
    setIsRebalancing(true);
    setTimeout(() => {
      setIsRebalancing(false);
      // In real implementation, this would execute the trades
    }, 3000);
  };

  const estimatedCost = rebalanceActions
    .reduce((sum, action) => sum + Math.abs(action.value), 0) * 0.01; // 1% trading fee

  const taxImpact = strategy.taxOptimization ? estimatedCost * 0.5 : estimatedCost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                <RefreshCw className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Auto Rebalancing</h1>
                <p className="text-slate-400">AI-driven portfolio optimization</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-bold mb-6">Rebalancing Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Rebalancing Frequency</label>
                <select
                  value={strategy.frequency}
                  onChange={(e) => setStrategy({...strategy, frequency: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="threshold">Threshold-based (5% drift)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Risk Tolerance</label>
                <select
                  value={strategy.riskTolerance}
                  onChange={(e) => setStrategy({...strategy, riskTolerance: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Minimum Trade Size ($)</label>
                <input
                  type="number"
                  value={strategy.minTradeSize}
                  onChange={(e) => setStrategy({...strategy, minTradeSize: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Maximum Single Trade ($)</label>
                <input
                  type="number"
                  value={strategy.maxSingleTrade}
                  onChange={(e) => setStrategy({...strategy, maxSingleTrade: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={strategy.taxOptimization}
                    onChange={(e) => setStrategy({...strategy, taxOptimization: e.target.checked})}
                    className="w-5 h-5 bg-slate-700 rounded border-slate-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">Enable tax-loss harvesting optimization</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-400">Total Value</span>
            </div>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-400">Assets</span>
            </div>
            <div className="text-2xl font-bold">{portfolio.length}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-slate-400">Max Drift</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {Math.max(...portfolio.map(a => getDriftPercentage(a.currentAllocation, a.targetAllocation)))}%
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-400">Rebalance Needed</span>
            </div>
            <div className="text-2xl font-bold text-red-400">
              {rebalanceActions.filter(a => a.action !== 'hold').length}
            </div>
          </div>
        </div>

        {/* Current Allocation */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Current vs Target Allocation</h2>
          
          <div className="space-y-4">
            {portfolio.map((asset) => {
              const drift = getDriftPercentage(asset.currentAllocation, asset.targetAllocation);
              return (
                <div key={asset.marketId} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold mb-1">{asset.marketTitle}</h3>
                      <div className="text-sm text-slate-400">
                        ${asset.currentValue.toLocaleString()} • {asset.currentShares.toLocaleString()} shares @ ${asset.price}
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${getDriftColor(drift)}`}>
                      {drift > 0 && (drift === asset.currentAllocation - asset.targetAllocation ? '+' : '')}
                      {(asset.currentAllocation - asset.targetAllocation).toFixed(1)}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-slate-400 mb-2">Current: {asset.currentAllocation}%</div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${asset.currentAllocation}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-2">Target: {asset.targetAllocation}%</div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${asset.targetAllocation}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {drift >= 5 && (
                    <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-2 text-sm text-yellow-400">
                      ⚠️ Significant drift detected - rebalancing recommended
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rebalance Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recommended Actions</h2>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-400">
                Estimated Cost: <span className="text-white font-semibold">${estimatedCost.toFixed(2)}</span>
              </div>
              {strategy.taxOptimization && (
                <div className="text-sm text-green-400">
                  Tax Optimized: -${(estimatedCost - taxImpact).toFixed(2)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {rebalanceActions.map((action) => (
              <div key={action.marketId} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{action.marketTitle}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border uppercase ${getActionColor(action.action)}`}>
                        {action.action}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{action.reason}</p>

                    {action.action !== 'hold' && (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400 mb-1">Current Shares</div>
                          <div className="font-semibold">{action.currentShares.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Target Shares</div>
                          <div className="font-semibold">{action.targetShares.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Shares to {action.action}</div>
                          <div className={`font-semibold ${action.action === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                            {action.action === 'buy' ? '+' : '-'}{Math.abs(action.sharesToTrade).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {action.action !== 'hold' && (
                    <div className="text-right ml-4">
                      <div className="text-sm text-slate-400 mb-1">Value</div>
                      <div className={`text-xl font-bold ${action.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {action.value > 0 ? '+' : ''}${Math.abs(action.value).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleRebalance}
            disabled={isRebalancing}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
              isRebalancing
                ? 'bg-slate-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRebalancing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Rebalancing Portfolio...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Execute Rebalancing
              </>
            )}
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-400 mb-1">AI-Powered Optimization</div>
              <div className="text-sm text-slate-300">
                Our AI analyzes market conditions, tax implications, and transaction costs to optimize your rebalancing strategy. 
                {strategy.taxOptimization && ' Tax-loss harvesting is enabled to minimize your tax burden.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
