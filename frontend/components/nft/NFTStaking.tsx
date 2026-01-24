'use client';

import { Clock, Lock, Star, TrendingUp, Unlock, Zap } from 'lucide-react';
import { useState } from 'react';

interface StakedNFT {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  rarityMultiplier: number;
  stakedDate: Date;
  lockPeriod: number; // days
  unlockDate: Date;
  baseReward: number; // per day
  boostedReward: number; // with multiplier
  totalEarned: number;
  icon: string;
  canUnstake: boolean;
}

interface StakingPool {
  id: string;
  name: string;
  description: string;
  minLockDays: number;
  maxLockDays: number;
  baseAPY: number;
  bonusAPY: number;
  totalStaked: number;
  participants: number;
  icon: string;
}

interface UnstakedNFT {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
}

export default function NFTStaking() {
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<UnstakedNFT | null>(null);
  const [lockDays, setLockDays] = useState(30);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [unstakingNFT, setUnstakingNFT] = useState<StakedNFT | null>(null);

  const [stakedNFTs, setStakedNFTs] = useState<StakedNFT[]>([
    {
      id: '1',
      name: 'Legendary Bull #0042',
      rarity: 'legendary',
      rarityMultiplier: 5.0,
      stakedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
      lockPeriod: 90,
      unlockDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
      baseReward: 100,
      boostedReward: 500,
      totalEarned: 22500,
      icon: '👑',
      canUnstake: false
    },
    {
      id: '2',
      name: 'Epic Prophet #0156',
      rarity: 'epic',
      rarityMultiplier: 3.0,
      stakedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35),
      lockPeriod: 30,
      unlockDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      baseReward: 50,
      boostedReward: 150,
      totalEarned: 5250,
      icon: '💎',
      canUnstake: true
    },
    {
      id: '3',
      name: 'Rare Trader #1243',
      rarity: 'rare',
      rarityMultiplier: 2.0,
      stakedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      lockPeriod: 30,
      unlockDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      baseReward: 25,
      boostedReward: 50,
      totalEarned: 1000,
      icon: '🌟',
      canUnstake: false
    }
  ]);

  const [unstakedNFTs, setUnstakedNFTs] = useState<UnstakedNFT[]>([
    { id: '4', name: 'Uncommon Analyst #3421', rarity: 'uncommon', icon: '✨' },
    { id: '5', name: 'Common Novice #8765', rarity: 'common', icon: '🎴' },
    { id: '6', name: 'Rare Strategist #2341', rarity: 'rare', icon: '🌟' }
  ]);

  const [stakingPools] = useState<StakingPool[]>([
    {
      id: 'pool1',
      name: 'Flexible Staking',
      description: 'Stake and unstake anytime with base rewards',
      minLockDays: 0,
      maxLockDays: 0,
      baseAPY: 10,
      bonusAPY: 0,
      totalStaked: 2500000,
      participants: 1247,
      icon: '🔓'
    },
    {
      id: 'pool2',
      name: 'Short-term Lock',
      description: '30-day lock period with 2x rewards',
      minLockDays: 30,
      maxLockDays: 30,
      baseAPY: 20,
      bonusAPY: 20,
      totalStaked: 5800000,
      participants: 3421,
      icon: '⏱️'
    },
    {
      id: 'pool3',
      name: 'Long-term Lock',
      description: '90-day lock period with 4x rewards',
      minLockDays: 90,
      maxLockDays: 90,
      baseAPY: 40,
      bonusAPY: 120,
      totalStaked: 12400000,
      participants: 8934,
      icon: '🔒'
    },
    {
      id: 'pool4',
      name: 'Legendary Pool',
      description: '365-day lock for legendary rewards',
      minLockDays: 365,
      maxLockDays: 365,
      baseAPY: 100,
      bonusAPY: 400,
      totalStaked: 8900000,
      participants: 2156,
      icon: '👑'
    }
  ]);

  const getRarityMultiplier = (rarity: string): number => {
    switch (rarity) {
      case 'legendary':
        return 5.0;
      case 'epic':
        return 3.0;
      case 'rare':
        return 2.0;
      case 'uncommon':
        return 1.5;
      case 'common':
        return 1.0;
      default:
        return 1.0;
    }
  };

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

  const calculateEstimatedRewards = (nft: UnstakedNFT | null, days: number): number => {
    if (!nft) return 0;
    const multiplier = getRarityMultiplier(nft.rarity);
    const baseDaily = 10; // base reward per day
    return baseDaily * multiplier * days;
  };

  const handleStake = () => {
    if (!selectedNFT || !selectedPool) return;

    const multiplier = getRarityMultiplier(selectedNFT.rarity);
    const baseDaily = 10;
    const unlockDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * lockDays);

    const newStaked: StakedNFT = {
      id: selectedNFT.id,
      name: selectedNFT.name,
      rarity: selectedNFT.rarity,
      rarityMultiplier: multiplier,
      stakedDate: new Date(),
      lockPeriod: lockDays,
      unlockDate: unlockDate,
      baseReward: baseDaily,
      boostedReward: baseDaily * multiplier,
      totalEarned: 0,
      icon: selectedNFT.icon,
      canUnstake: lockDays === 0
    };

    setStakedNFTs([...stakedNFTs, newStaked]);
    setUnstakedNFTs(unstakedNFTs.filter(nft => nft.id !== selectedNFT.id));
    setShowStakeModal(false);
    setSelectedNFT(null);
  };

  const handleUnstake = () => {
    if (!unstakingNFT) return;

    const unstakedNFT: UnstakedNFT = {
      id: unstakingNFT.id,
      name: unstakingNFT.name,
      rarity: unstakingNFT.rarity,
      icon: unstakingNFT.icon
    };

    setUnstakedNFTs([...unstakedNFTs, unstakedNFT]);
    setStakedNFTs(stakedNFTs.filter(nft => nft.id !== unstakingNFT.id));
    setShowUnstakeModal(false);
    setUnstakingNFT(null);
  };

  const totalStaked = stakedNFTs.length;
  const totalEarnings = stakedNFTs.reduce((sum, nft) => sum + nft.totalEarned, 0);
  const dailyEarnings = stakedNFTs.reduce((sum, nft) => sum + nft.boostedReward, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysRemaining = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl">
              <Lock className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">NFT Staking</h1>
              <p className="text-slate-400">Stake your NFTs to earn passive rewards with rarity multipliers</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Staked</span>
              <Lock className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{totalStaked} NFTs</div>
            <div className="text-xs text-slate-400 mt-1">Currently earning</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Earned</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">{formatCurrency(totalEarnings)}</div>
            <div className="text-xs text-slate-400 mt-1">All-time rewards</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Daily Earnings</span>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">{formatCurrency(dailyEarnings)}</div>
            <div className="text-xs text-slate-400 mt-1">Current rate</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Available NFTs</span>
              <Star className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400">{unstakedNFTs.length}</div>
            <div className="text-xs text-slate-400 mt-1">Ready to stake</div>
          </div>
        </div>

        {/* Staking Pools */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Staking Pools</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stakingPools.map((pool) => (
              <div
                key={pool.id}
                onClick={() => {
                  setSelectedPool(pool);
                  if (unstakedNFTs.length > 0) {
                    setShowStakeModal(true);
                  }
                }}
                className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 cursor-pointer hover:border-blue-500 transition-all"
              >
                <div className="text-4xl mb-3">{pool.icon}</div>
                <h3 className="font-bold text-lg mb-2">{pool.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{pool.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Base APY</span>
                    <span className="font-semibold text-green-400">{pool.baseAPY}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Bonus APY</span>
                    <span className="font-semibold text-blue-400">+{pool.bonusAPY}%</span>
                  </div>
                  {pool.minLockDays > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Lock Period</span>
                      <span className="font-semibold">{pool.minLockDays} days</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-600/30 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Total Staked</div>
                  <div className="font-semibold">{formatCurrency(pool.totalStaked)}</div>
                  <div className="text-xs text-slate-400 mt-1">{pool.participants.toLocaleString()} participants</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staked NFTs */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Your Staked NFTs</h2>

          {stakedNFTs.length === 0 ? (
            <div className="text-center py-12">
              <Lock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No NFTs staked yet. Start staking to earn rewards!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stakedNFTs.map((nft) => (
                <div key={nft.id} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{nft.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border ${getRarityColor(nft.rarity)}`}>
                          {nft.rarity.toUpperCase()} • {nft.rarityMultiplier}x Multiplier
                        </div>
                      </div>
                    </div>

                    {nft.canUnstake ? (
                      <button
                        onClick={() => {
                          setUnstakingNFT(nft);
                          setShowUnstakeModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Unlock className="w-4 h-4" />
                        Unstake
                      </button>
                    ) : (
                      <div className="text-right">
                        <div className="text-xs text-slate-400 mb-1">Unlocks in</div>
                        <div className="font-semibold text-yellow-400">{getDaysRemaining(nft.unlockDate)} days</div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Staked</div>
                      <div className="font-semibold">{formatDate(nft.stakedDate)}</div>
                    </div>
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Lock Period</div>
                      <div className="font-semibold">{nft.lockPeriod} days</div>
                    </div>
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Daily Rewards</div>
                      <div className="font-semibold text-green-400">{formatCurrency(nft.boostedReward)}</div>
                    </div>
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Total Earned</div>
                      <div className="font-semibold text-blue-400">{formatCurrency(nft.totalEarned)}</div>
                    </div>
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Unlock Date</div>
                      <div className="font-semibold">{formatDate(nft.unlockDate)}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {nft.canUnstake ? (
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <Unlock className="w-4 h-4" />
                        Ready to unstake
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-yellow-400">
                        <Clock className="w-4 h-4" />
                        Locked until {formatDate(nft.unlockDate)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available NFTs */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-6">Available NFTs to Stake</h2>

          {unstakedNFTs.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">All your NFTs are currently staked!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {unstakedNFTs.map((nft) => (
                <div
                  key={nft.id}
                  onClick={() => {
                    setSelectedNFT(nft);
                    setShowStakeModal(true);
                  }}
                  className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 cursor-pointer hover:border-blue-500 transition-all text-center"
                >
                  <div className="text-6xl mb-4">{nft.icon}</div>
                  <h3 className="font-bold mb-2">{nft.name}</h3>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border ${getRarityColor(nft.rarity)}`}>
                    {nft.rarity.toUpperCase()}
                  </div>
                  <div className="mt-4 text-sm text-slate-400">
                    {getRarityMultiplier(nft.rarity)}x Multiplier
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stake Modal */}
        {showStakeModal && selectedNFT && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4">Stake NFT</h3>

              <div className="text-center mb-6">
                <div className="text-7xl mb-3">{selectedNFT.icon}</div>
                <h4 className="font-bold text-lg mb-2">{selectedNFT.name}</h4>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border ${getRarityColor(selectedNFT.rarity)}`}>
                  {selectedNFT.rarity.toUpperCase()} • {getRarityMultiplier(selectedNFT.rarity)}x
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">Lock Period (days)</label>
                <input
                  type="range"
                  min="0"
                  max="365"
                  step="30"
                  value={lockDays}
                  onChange={(e) => setLockDays(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold">{lockDays} days</span>
                  <span className="text-sm text-slate-400">
                    {lockDays === 0 ? 'Flexible' : `Locked until ${formatDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * lockDays))}`}
                  </span>
                </div>
              </div>

              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mb-6">
                <div className="text-sm text-blue-400 mb-2">Estimated Rewards:</div>
                <div className="text-2xl font-bold">{formatCurrency(calculateEstimatedRewards(selectedNFT, lockDays))}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {formatCurrency(calculateEstimatedRewards(selectedNFT, lockDays) / (lockDays || 1))} per day
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowStakeModal(false);
                    setSelectedNFT(null);
                  }}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStake}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Stake NFT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unstake Modal */}
        {showUnstakeModal && unstakingNFT && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4">Unstake NFT</h3>

              <div className="text-center mb-6">
                <div className="text-7xl mb-3">{unstakingNFT.icon}</div>
                <h4 className="font-bold text-lg">{unstakingNFT.name}</h4>
              </div>

              <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4 mb-6">
                <div className="text-sm text-green-400 mb-2">Total Rewards Earned:</div>
                <div className="text-2xl font-bold">{formatCurrency(unstakingNFT.totalEarned)}</div>
              </div>

              <p className="text-sm text-slate-400 mb-6">
                Unstaking will return your NFT to your wallet and claim all accumulated rewards.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUnstakeModal(false);
                    setUnstakingNFT(null);
                  }}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnstake}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  Unstake
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
