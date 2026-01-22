'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, RefreshCw, Settings, Eye, EyeOff } from 'lucide-react';

interface Position {
  id: string;
  protocol: string;
  type: 'lending' | 'farming' | 'staking' | 'vault' | 'liquidity';
  token: string;
  amount: number;
  valueUSD: number;
  apy: number;
  dailyEarnings: number;
  pnl: number;
  pnlPercent: number;
}

interface DeFiStats {
  totalValueLocked: number;
  totalEarnings24h: number;
  totalEarningsAllTime: number;
  averageAPY: number;
  activePositions: number;
  portfolioChange24h: number;
}

interface ProtocolAllocation {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export default function DeFiDashboard() {
  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      protocol: 'Aave',
      type: 'lending',
      token: 'USDC',
      amount: 10000,
      valueUSD: 10000,
      apy: 4.2,
      dailyEarnings: 1.15,
      pnl: 156.8,
      pnlPercent: 1.57,
    },
    {
      id: '2',
      protocol: 'Uniswap V3',
      type: 'liquidity',
      token: 'ETH-USDC',
      amount: 5,
      valueUSD: 15000,
      apy: 38.5,
      dailyEarnings: 15.82,
      pnl: -234.5,
      pnlPercent: -1.54,
    },
    {
      id: '3',
      protocol: 'Yearn Finance',
      type: 'vault',
      token: 'DAI',
      amount: 8000,
      valueUSD: 8000,
      apy: 12.8,
      dailyEarnings: 2.81,
      pnl: 445.2,
      pnlPercent: 5.57,
    },
    {
      id: '4',
      protocol: 'Curve Finance',
      type: 'farming',
      token: '3pool-LP',
      amount: 12000,
      valueUSD: 12000,
      apy: 18.3,
      dailyEarnings: 6.02,
      pnl: 892.1,
      pnlPercent: 7.43,
    },
    {
      id: '5',
      protocol: 'ProphetBase',
      type: 'staking',
      token: 'PROPHET',
      amount: 50000,
      valueUSD: 25000,
      apy: 45.6,
      dailyEarnings: 31.23,
      pnl: 3245.8,
      pnlPercent: 14.98,
    },
  ]);

  const [stats, setStats] = useState<DeFiStats>({
    totalValueLocked: 70000,
    totalEarnings24h: 57.03,
    totalEarningsAllTime: 4505.4,
    averageAPY: 23.88,
    activePositions: 5,
    portfolioChange24h: 2.34,
  });

  const [hideBalances, setHideBalances] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const protocolAllocations: ProtocolAllocation[] = [
    { name: 'ProphetBase', value: 25000, percentage: 35.7, color: '#3b82f6' },
    { name: 'Uniswap V3', value: 15000, percentage: 21.4, color: '#ef4444' },
    { name: 'Curve Finance', value: 12000, percentage: 17.1, color: '#8b5cf6' },
    { name: 'Aave', value: 10000, percentage: 14.3, color: '#10b981' },
    { name: 'Yearn Finance', value: 8000, percentage: 11.4, color: '#f59e0b' },
  ];

  const typeAllocations = [
    { name: 'Staking', percentage: 35.7, color: '#3b82f6' },
    { name: 'Liquidity', percentage: 21.4, color: '#ef4444' },
    { name: 'Farming', percentage: 17.1, color: '#8b5cf6' },
    { name: 'Lending', percentage: 14.3, color: '#10b981' },
    { name: 'Vaults', percentage: 11.4, color: '#f59e0b' },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update with slightly different values
    setStats(prev => ({
      ...prev,
      totalEarnings24h: prev.totalEarnings24h + Math.random() * 5,
      portfolioChange24h: prev.portfolioChange24h + (Math.random() - 0.5),
    }));
    
    setIsRefreshing(false);
  };

  const formatCurrency = (value: number) => {
    if (hideBalances) return '****';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (hideBalances) return '****';
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getPositionTypeIcon = (type: string) => {
    switch (type) {
      case 'lending': return '🏦';
      case 'farming': return '🌾';
      case 'staking': return '💎';
      case 'vault': return '🔒';
      case 'liquidity': return '💧';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">DeFi Dashboard</h1>
            <p className="text-slate-400">Complete overview of your DeFi positions</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setHideBalances(!hideBalances)}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              title={hideBalances ? 'Show balances' : 'Hide balances'}
            >
              {hideBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Value Locked</span>
              <Wallet className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl md:text-3xl font-bold mb-1">
              {formatCurrency(stats.totalValueLocked)}
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.portfolioChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.portfolioChange24h >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{Math.abs(stats.portfolioChange24h).toFixed(2)}% (24h)</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Earnings (24h)</span>
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-green-400 mb-1">
              {formatCurrency(stats.totalEarnings24h)}
            </div>
            <div className="text-sm text-slate-400">
              Daily rate
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">All-Time Earnings</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-green-400 mb-1">
              {formatCurrency(stats.totalEarningsAllTime)}
            </div>
            <div className="text-sm text-slate-400">
              Total earned
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Average APY</span>
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl md:text-3xl font-bold mb-1">
              {stats.averageAPY.toFixed(2)}%
            </div>
            <div className="text-sm text-slate-400">
              {stats.activePositions} active positions
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Protocol Allocation */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold">Protocol Allocation</h2>
            </div>
            
            <div className="space-y-4">
              {protocolAllocations.map((protocol) => (
                <div key={protocol.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{protocol.name}</span>
                    <span className="text-sm text-slate-400">
                      {formatCurrency(protocol.value)} ({protocol.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${protocol.percentage}%`,
                        backgroundColor: protocol.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Position Type Allocation */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold">Position Types</h2>
            </div>
            
            <div className="space-y-4">
              {typeAllocations.map((type) => (
                <div key={type.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{type.name}</span>
                    <span className="text-sm text-slate-400">{type.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${type.percentage}%`,
                        backgroundColor: type.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Positions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Active Positions</h2>
            <div className="flex gap-2">
              {(['24h', '7d', '30d', 'all'] as const).map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeframe === timeframe
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Protocol</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Token</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Value</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">APY</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Daily</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">P&L</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium">{position.protocol}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span>{getPositionTypeIcon(position.type)}</span>
                        <span className="capitalize text-sm">{position.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm">{position.token}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-mono text-sm">{formatNumber(position.amount)}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-medium">{formatCurrency(position.valueUSD)}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-blue-400 font-medium">{position.apy}%</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-green-400 font-medium">
                        +{formatCurrency(position.dailyEarnings)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className={`font-medium ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.pnl >= 0 ? '+' : ''}{formatCurrency(position.pnl)}
                        <div className="text-xs">
                          ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-slate-400 mb-1">Total Deposited</div>
                <div className="text-lg font-bold">{formatCurrency(stats.totalValueLocked)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Daily Earnings</div>
                <div className="text-lg font-bold text-green-400">
                  +{formatCurrency(stats.totalEarnings24h)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Monthly Projection</div>
                <div className="text-lg font-bold text-green-400">
                  +{formatCurrency(stats.totalEarnings24h * 30)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Yearly Projection</div>
                <div className="text-lg font-bold text-green-400">
                  +{formatCurrency(stats.totalEarnings24h * 365)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
