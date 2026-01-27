'use client';

import { ArrowUp, BarChart2, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';

interface DynamicNFT {
  id: string;
  tokenId: string;
  name: string;
  level: number;
  maxLevel: number;
  experience: number;
  experienceToNext: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stats: {
    accuracy: number;
    volume: number;
    winRate: number;
    streak: number;
    reputation: number;
  };
  evolutionStage: number;
  maxEvolution: number;
  achievements: string[];
  performance: {
    totalPredictions: number;
    correctPredictions: number;
    totalVolume: number;
    avgPredictionAccuracy: number;
    longestStreak: number;
  };
  upgrades: {
    id: string;
    name: string;
    description: string;
    cost: number;
    unlocked: boolean;
  }[];
  icon: string;
  metadata: {
    lastUpdated: Date;
    contractAddress: string;
    ipfsUrl: string;
  };
}

interface UpgradeOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  statBoost: string;
  requiredLevel: number;
}

export default function DynamicNFTs() {
  const [selectedNFT, setSelectedNFT] = useState<DynamicNFT | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState<UpgradeOption | null>(
    null
  );

  const [dynamicNFTs, setDynamicNFTs] = useState<DynamicNFT[]>([
    {
      id: '1',
      tokenId: '0x1a2b3c4d',
      name: 'Prophet Master',
      level: 15,
      maxLevel: 50,
      experience: 3250,
      experienceToNext: 1500,
      rarity: 'legendary',
      stats: {
        accuracy: 87,
        volume: 125000,
        winRate: 72,
        streak: 12,
        reputation: 945,
      },
      evolutionStage: 3,
      maxEvolution: 5,
      achievements: [
        'First Win',
        '100 Predictions',
        '10 Day Streak',
        'High Roller',
        'Perfect Week',
      ],
      performance: {
        totalPredictions: 342,
        correctPredictions: 246,
        totalVolume: 125000,
        avgPredictionAccuracy: 87.3,
        longestStreak: 18,
      },
      upgrades: [
        {
          id: 'u1',
          name: 'Enhanced Analytics',
          description: '+10% accuracy tracking',
          cost: 500,
          unlocked: true,
        },
        {
          id: 'u2',
          name: 'Volume Multiplier',
          description: '2x trading volume tracking',
          cost: 1000,
          unlocked: true,
        },
        {
          id: 'u3',
          name: 'Streak Shield',
          description: 'Protect your streak once per week',
          cost: 2000,
          unlocked: false,
        },
        {
          id: 'u4',
          name: 'Legendary Aura',
          description: '+50 reputation per win',
          cost: 5000,
          unlocked: false,
        },
      ],
      icon: '🔮',
      metadata: {
        lastUpdated: new Date(Date.now() - 1000 * 60 * 30),
        contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
        ipfsUrl: 'ipfs://QmX5j8kZN2QvBFGH7LqF6yRZ3mKpVq',
      },
    },
    {
      id: '2',
      tokenId: '0x5e6f7g8h',
      name: 'Trading Ace',
      level: 8,
      maxLevel: 50,
      experience: 1200,
      experienceToNext: 800,
      rarity: 'epic',
      stats: {
        accuracy: 68,
        volume: 45000,
        winRate: 62,
        streak: 5,
        reputation: 520,
      },
      evolutionStage: 2,
      maxEvolution: 5,
      achievements: ['First Win', '50 Predictions', '5 Day Streak'],
      performance: {
        totalPredictions: 156,
        correctPredictions: 97,
        totalVolume: 45000,
        avgPredictionAccuracy: 68.5,
        longestStreak: 8,
      },
      upgrades: [
        {
          id: 'u1',
          name: 'Enhanced Analytics',
          description: '+10% accuracy tracking',
          cost: 500,
          unlocked: true,
        },
        {
          id: 'u2',
          name: 'Volume Multiplier',
          description: '2x trading volume tracking',
          cost: 1000,
          unlocked: false,
        },
        {
          id: 'u3',
          name: 'Streak Shield',
          description: 'Protect your streak once per week',
          cost: 2000,
          unlocked: false,
        },
      ],
      icon: '⚡',
      metadata: {
        lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2),
        contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
        ipfsUrl: 'ipfs://QmY6k9lO4QwCGIHMsRrW7zS4nLq',
      },
    },
    {
      id: '3',
      tokenId: '0x9i0j1k2l',
      name: 'Market Novice',
      level: 3,
      maxLevel: 50,
      experience: 450,
      experienceToNext: 350,
      rarity: 'rare',
      stats: {
        accuracy: 52,
        volume: 12000,
        winRate: 48,
        streak: 2,
        reputation: 180,
      },
      evolutionStage: 1,
      maxEvolution: 5,
      achievements: ['First Win', '10 Predictions'],
      performance: {
        totalPredictions: 48,
        correctPredictions: 23,
        totalVolume: 12000,
        avgPredictionAccuracy: 52.4,
        longestStreak: 4,
      },
      upgrades: [
        {
          id: 'u1',
          name: 'Enhanced Analytics',
          description: '+10% accuracy tracking',
          cost: 500,
          unlocked: false,
        },
        {
          id: 'u2',
          name: 'Volume Multiplier',
          description: '2x trading volume tracking',
          cost: 1000,
          unlocked: false,
        },
      ],
      icon: '🌟',
      metadata: {
        lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 6),
        contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
        ipfsUrl: 'ipfs://QmZ7l0mP5RxDHJNtTsV8oMr',
      },
    },
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'text-yellow-400 bg-yellow-600/20 border-yellow-500/30';
      case 'epic':
        return 'text-purple-400 bg-purple-600/20 border-purple-500/30';
      case 'rare':
        return 'text-blue-400 bg-blue-600/20 border-blue-500/30';
      case 'uncommon':
        return 'text-green-400 bg-green-600/20 border-green-500/30';
      case 'common':
        return 'text-slate-400 bg-slate-600/20 border-slate-500/30';
      default:
        return 'text-slate-400 bg-slate-600/20 border-slate-500/30';
    }
  };

  const getEvolutionName = (stage: number) => {
    switch (stage) {
      case 1:
        return 'Novice';
      case 2:
        return 'Apprentice';
      case 3:
        return 'Expert';
      case 4:
        return 'Master';
      case 5:
        return 'Legendary';
      default:
        return 'Unknown';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleUpgrade = () => {
    if (!selectedNFT || !selectedUpgrade) return;

    const updatedNFTs = dynamicNFTs.map((nft) => {
      if (nft.id === selectedNFT.id) {
        return {
          ...nft,
          upgrades: nft.upgrades.map((u) =>
            u.id === selectedUpgrade.id ? { ...u, unlocked: true } : u
          ),
        };
      }
      return nft;
    });

    setDynamicNFTs(updatedNFTs);
    alert(`Upgraded: ${selectedUpgrade.name}`);
    setShowUpgradeModal(false);
    setSelectedUpgrade(null);
  };

  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-blue-400';
    if (value >= 40) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl">
              <BarChart2 className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Dynamic NFTs</h1>
              <p className="text-slate-400">
                NFTs that evolve based on your trading performance and
                statistics
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total NFTs</span>
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-indigo-400">
              {dynamicNFTs.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Evolving NFTs</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Avg Level</span>
              <ArrowUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">
              {Math.round(
                dynamicNFTs.reduce((sum, nft) => sum + nft.level, 0) /
                  dynamicNFTs.length
              )}
            </div>
            <div className="text-xs text-slate-400 mt-1">Across all NFTs</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Volume</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {formatCurrency(
                dynamicNFTs.reduce((sum, nft) => sum + nft.stats.volume, 0)
              )}
            </div>
            <div className="text-xs text-slate-400 mt-1">Combined stats</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Avg Accuracy</span>
              <BarChart2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(
                dynamicNFTs.reduce((sum, nft) => sum + nft.stats.accuracy, 0) /
                  dynamicNFTs.length
              )}
              %
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Performance metric
            </div>
          </div>
        </div>

        {/* Dynamic NFTs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dynamicNFTs.map((nft) => (
            <div
              key={nft.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden"
            >
              {/* NFT Header */}
              <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{nft.icon}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{nft.name}</h3>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border ${getRarityColor(
                          nft.rarity
                        )}`}
                      >
                        {nft.rarity.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400 mb-1">Level</div>
                    <div className="text-3xl font-bold text-indigo-400">
                      {nft.level}
                    </div>
                  </div>
                </div>

                {/* Experience Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-300">Experience</span>
                    <span className="font-semibold">
                      {nft.experience} / {nft.experience + nft.experienceToNext}{' '}
                      XP
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (nft.experience /
                            (nft.experience + nft.experienceToNext)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {nft.experienceToNext} XP to next level
                  </div>
                </div>

                {/* Evolution Stage */}
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">
                      Evolution Stage
                    </span>
                    <span className="font-semibold">
                      {nft.evolutionStage} / {nft.maxEvolution}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: nft.maxEvolution }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded-full ${
                          i < nft.evolutionStage
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                            : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-indigo-400 mt-2">
                    Current: {getEvolutionName(nft.evolutionStage)}
                  </div>
                </div>
              </div>

              {/* NFT Stats */}
              <div className="p-6">
                <h4 className="font-bold mb-4">Performance Stats</h4>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Accuracy</div>
                    <div
                      className={`text-2xl font-bold ${getStatColor(
                        nft.stats.accuracy
                      )}`}
                    >
                      {nft.stats.accuracy}%
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-1 mt-2">
                      <div
                        className={`h-1 rounded-full ${
                          nft.stats.accuracy >= 80
                            ? 'bg-green-400'
                            : nft.stats.accuracy >= 60
                            ? 'bg-blue-400'
                            : 'bg-yellow-400'
                        }`}
                        style={{ width: `${nft.stats.accuracy}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Win Rate</div>
                    <div
                      className={`text-2xl font-bold ${getStatColor(
                        nft.stats.winRate
                      )}`}
                    >
                      {nft.stats.winRate}%
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-1 mt-2">
                      <div
                        className={`h-1 rounded-full ${
                          nft.stats.winRate >= 80
                            ? 'bg-green-400'
                            : nft.stats.winRate >= 60
                            ? 'bg-blue-400'
                            : 'bg-yellow-400'
                        }`}
                        style={{ width: `${nft.stats.winRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Volume</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(nft.stats.volume)}
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">
                      Current Streak
                    </div>
                    <div className="text-lg font-bold text-orange-400">
                      {nft.stats.streak} 🔥
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">
                      Reputation
                    </div>
                    <div className="text-lg font-bold text-purple-400">
                      {nft.stats.reputation}
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">
                      Total Predictions
                    </div>
                    <div className="text-lg font-bold">
                      {nft.performance.totalPredictions}
                    </div>
                  </div>
                </div>

                {/* Upgrades */}
                <div className="mb-6">
                  <h4 className="font-bold mb-3">Available Upgrades</h4>
                  <div className="space-y-2">
                    {nft.upgrades.slice(0, 3).map((upgrade) => (
                      <div
                        key={upgrade.id}
                        className={`bg-slate-700/30 rounded-lg p-3 border ${
                          upgrade.unlocked
                            ? 'border-green-500/30'
                            : 'border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-sm mb-1">
                              {upgrade.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {upgrade.description}
                            </div>
                          </div>
                          {upgrade.unlocked ? (
                            <div className="px-3 py-1 bg-green-600/20 border border-green-600/30 rounded text-green-400 text-xs">
                              ✓ Unlocked
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedNFT(nft);
                                setSelectedUpgrade(upgrade as any);
                                setShowUpgradeModal(true);
                              }}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs font-medium transition-colors"
                            >
                              {formatCurrency(upgrade.cost)}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="font-bold mb-3">
                    Achievements ({nft.achievements.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {nft.achievements.map((achievement, i) => (
                      <div
                        key={i}
                        className="px-3 py-1 bg-yellow-600/20 border border-yellow-600/30 rounded-lg text-yellow-400 text-xs font-medium"
                      >
                        🏆 {achievement}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata */}
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                  <h4 className="font-bold text-sm mb-3">On-Chain Metadata</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Token ID:</span>
                      <span className="font-mono">{nft.tokenId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Contract:</span>
                      <span className="font-mono text-xs">
                        {nft.metadata.contractAddress.slice(0, 10)}...
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">IPFS:</span>
                      <span className="font-mono text-xs">
                        {nft.metadata.ipfsUrl.slice(0, 20)}...
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Last Updated:</span>
                      <span>{formatDate(nft.metadata.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade Modal */}
        {showUpgradeModal && selectedNFT && selectedUpgrade && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4">Upgrade NFT</h3>

              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{selectedNFT.icon}</div>
                <h4 className="font-bold text-lg mb-2">{selectedNFT.name}</h4>
              </div>

              <div className="bg-indigo-600/10 border border-indigo-600/30 rounded-lg p-4 mb-6">
                <h5 className="font-bold mb-2">{selectedUpgrade.name}</h5>
                <p className="text-sm text-slate-300 mb-3">
                  {selectedUpgrade.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Upgrade Cost:</span>
                  <span className="font-bold text-xl">
                    {formatCurrency(selectedUpgrade.cost)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-6">
                This upgrade will be recorded on-chain and the NFT metadata will
                be updated on IPFS.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    setSelectedUpgrade(null);
                    setSelectedNFT(null);
                  }}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpgrade}
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowUp className="w-4 h-4" />
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
