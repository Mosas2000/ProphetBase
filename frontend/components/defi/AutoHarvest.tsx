'use client';

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Pause,
  Play,
  Settings,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface HarvestSource {
  id: string;
  name: string;
  icon: string;
  pendingRewards: number;
  rewardToken: string;
  estimatedGas: number;
  lastHarvest: Date | null;
  apy: number;
  autoHarvest: boolean;
}

interface HarvestConfig {
  enabled: boolean;
  minRewardThreshold: number;
  maxGasPrice: number;
  frequency: 'hourly' | 'daily' | 'weekly' | 'auto';
  compound: boolean;
  gasOptimization: boolean;
}

export default function AutoHarvest() {
  const [sources, setSources] = useState<HarvestSource[]>([
    {
      id: '1',
      name: 'Yield Farming',
      icon: '🌾',
      pendingRewards: 42.5,
      rewardToken: 'PROPHET',
      estimatedGas: 0.0012,
      lastHarvest: new Date(Date.now() - 1000 * 60 * 60 * 6),
      apy: 45.3,
      autoHarvest: true,
    },
    {
      id: '2',
      name: 'Staking Rewards',
      icon: '💎',
      pendingRewards: 18.7,
      rewardToken: 'PROPHET',
      estimatedGas: 0.0008,
      lastHarvest: new Date(Date.now() - 1000 * 60 * 60 * 12),
      apy: 32.1,
      autoHarvest: true,
    },
    {
      id: '3',
      name: 'Liquidity Mining',
      icon: '💧',
      pendingRewards: 67.3,
      rewardToken: 'PROPHET',
      estimatedGas: 0.0015,
      lastHarvest: new Date(Date.now() - 1000 * 60 * 60 * 4),
      apy: 58.7,
      autoHarvest: false,
    },
    {
      id: '4',
      name: 'Vault Strategies',
      icon: '🏦',
      pendingRewards: 103.2,
      rewardToken: 'USDC',
      estimatedGas: 0.002,
      lastHarvest: new Date(Date.now() - 1000 * 60 * 60 * 24),
      apy: 28.4,
      autoHarvest: true,
    },
  ]);

  const [config, setConfig] = useState<HarvestConfig>({
    enabled: true,
    minRewardThreshold: 10,
    maxGasPrice: 50,
    frequency: 'auto',
    compound: true,
    gasOptimization: true,
  });

  const [isHarvesting, setIsHarvesting] = useState(false);
  const [harvestHistory, setHarvestHistory] = useState<any[]>([
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      source: 'Yield Farming',
      amount: 35.2,
      token: 'PROPHET',
      gas: 0.0011,
      status: 'success',
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      source: 'Staking Rewards',
      amount: 15.8,
      token: 'PROPHET',
      gas: 0.0009,
      status: 'success',
    },
  ]);

  const [nextHarvest, setNextHarvest] = useState<Date>(
    new Date(Date.now() + 1000 * 60 * 60 * 2)
  );
  const [currentGasPrice, setCurrentGasPrice] = useState(25);

  useEffect(() => {
    // Simulate gas price updates
    const interval = setInterval(() => {
      setCurrentGasPrice((prev) =>
        Math.max(10, Math.min(100, prev + (Math.random() - 0.5) * 10))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalPendingRewards = sources.reduce(
    (sum, source) => sum + source.pendingRewards,
    0
  );
  const totalEstimatedGas = sources.reduce(
    (sum, source) => sum + source.estimatedGas,
    0
  );
  const activeAutoHarvest = sources.filter((s) => s.autoHarvest).length;

  const handleHarvestAll = async () => {
    setIsHarvesting(true);

    // Simulate harvest operation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update harvest history
    const newHistoryItems = sources
      .filter((s) => s.pendingRewards > 0)
      .map((source) => ({
        timestamp: new Date(),
        source: source.name,
        amount: source.pendingRewards,
        token: source.rewardToken,
        gas: source.estimatedGas,
        status: 'success',
      }));

    setHarvestHistory((prev) => [...newHistoryItems, ...prev].slice(0, 10));

    // Reset pending rewards
    setSources((prev) =>
      prev.map((s) => ({
        ...s,
        pendingRewards: 0,
        lastHarvest: new Date(),
      }))
    );

    setIsHarvesting(false);
  };

  const handleHarvestSingle = async (sourceId: string) => {
    const source = sources.find((s) => s.id === sourceId);
    if (!source) return;

    setIsHarvesting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setHarvestHistory((prev) =>
      [
        {
          timestamp: new Date(),
          source: source.name,
          amount: source.pendingRewards,
          token: source.rewardToken,
          gas: source.estimatedGas,
          status: 'success',
        },
        ...prev,
      ].slice(0, 10)
    );

    setSources((prev) =>
      prev.map((s) =>
        s.id === sourceId
          ? {
              ...s,
              pendingRewards: 0,
              lastHarvest: new Date(),
            }
          : s
      )
    );

    setIsHarvesting(false);
  };

  const toggleAutoHarvest = (sourceId: string) => {
    setSources((prev) =>
      prev.map((s) =>
        s.id === sourceId
          ? {
              ...s,
              autoHarvest: !s.autoHarvest,
            }
          : s
      )
    );
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const formatTimeUntil = (date: Date) => {
    const hours = Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60));
    const minutes = Math.floor(
      ((date.getTime() - Date.now()) % (1000 * 60 * 60)) / (1000 * 60)
    );
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const canHarvest = (source: HarvestSource) => {
    return (
      source.pendingRewards >= config.minRewardThreshold &&
      currentGasPrice <= config.maxGasPrice
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Auto Harvest</h1>
              <p className="text-slate-400">
                Automated reward collection and compounding
              </p>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Pending</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">
              ${totalPendingRewards.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Across {sources.length} sources
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Auto Harvest</span>
              <CheckCircle className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold">
              {activeAutoHarvest}/{sources.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">Sources enabled</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Next Harvest</span>
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold">
              {formatTimeUntil(nextHarvest)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {config.frequency} mode
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Gas Price</span>
              <AlertTriangle
                className={`w-4 h-4 ${
                  currentGasPrice > config.maxGasPrice
                    ? 'text-red-400'
                    : 'text-green-400'
                }`}
              />
            </div>
            <div className="text-2xl font-bold">
              {currentGasPrice.toFixed(0)} Gwei
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Max: {config.maxGasPrice} Gwei
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold">Auto Harvest Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Status
              </label>
              <button
                onClick={() =>
                  setConfig((prev) => ({ ...prev, enabled: !prev.enabled }))
                }
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  config.enabled
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {config.enabled ? '✓ Enabled' : '✗ Disabled'}
              </button>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Min Reward Threshold
              </label>
              <input
                type="number"
                value={config.minRewardThreshold}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    minRewardThreshold: Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Minimum rewards"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Max Gas Price (Gwei)
              </label>
              <input
                type="number"
                value={config.maxGasPrice}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    maxGasPrice: Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Max gas price"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Frequency
              </label>
              <select
                value={config.frequency}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    frequency: e.target.value as any,
                  }))
                }
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="auto">Auto (Smart)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Auto Compound
              </label>
              <button
                onClick={() =>
                  setConfig((prev) => ({ ...prev, compound: !prev.compound }))
                }
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  config.compound
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {config.compound ? '✓ Enabled' : '✗ Disabled'}
              </button>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Gas Optimization
              </label>
              <button
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    gasOptimization: !prev.gasOptimization,
                  }))
                }
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  config.gasOptimization
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {config.gasOptimization ? '✓ Enabled' : '✗ Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Harvest Sources */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Reward Sources</h2>
            <button
              onClick={handleHarvestAll}
              disabled={isHarvesting || totalPendingRewards === 0}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isHarvesting ? 'Harvesting...' : 'Harvest All'}
            </button>
          </div>

          <div className="space-y-4">
            {sources.map((source) => (
              <div key={source.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl">{source.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{source.name}</h3>
                        {source.autoHarvest && (
                          <span className="px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded-full">
                            Auto
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                        <span>APY: {source.apy}%</span>
                        <span>Last: {formatTimeAgo(source.lastHarvest)}</span>
                        <span>Gas: {source.estimatedGas} ETH</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-400">
                        {source.pendingRewards.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {source.rewardToken}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleAutoHarvest(source.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        source.autoHarvest
                          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                          : 'bg-slate-600 text-slate-400 hover:bg-slate-500'
                      }`}
                      title="Toggle auto harvest"
                    >
                      {source.autoHarvest ? (
                        <Play className="w-5 h-5" />
                      ) : (
                        <Pause className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleHarvestSingle(source.id)}
                      disabled={
                        isHarvesting ||
                        source.pendingRewards === 0 ||
                        !canHarvest(source)
                      }
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Harvest
                    </button>
                  </div>
                </div>

                {!canHarvest(source) && source.pendingRewards > 0 && (
                  <div className="mt-3 p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-yellow-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>
                        {source.pendingRewards < config.minRewardThreshold
                          ? `Waiting for minimum threshold (${config.minRewardThreshold} ${source.rewardToken})`
                          : `Gas price too high (${currentGasPrice} > ${config.maxGasPrice} Gwei)`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Harvest History */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-6">Recent Harvests</h2>
          <div className="space-y-3">
            {harvestHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="font-medium">{item.source}</div>
                    <div className="text-sm text-slate-400">
                      {item.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-400">
                    +{item.amount.toFixed(2)} {item.token}
                  </div>
                  <div className="text-xs text-slate-400">
                    Gas: {item.gas.toFixed(4)} ETH
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
