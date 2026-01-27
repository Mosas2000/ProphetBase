'use client';

import {
  Calendar,
  Gift,
  RefreshCw,
  Send,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface RewardNFT {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'trading' | 'daily' | 'weekly' | 'loyalty' | 'referral';
  earnedDate: Date;
  claimed: boolean;
  tradingVolume?: number;
  icon: string;
}

interface DailyDrop {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  probability: number;
  claimed: boolean;
  icon: string;
}

interface WeeklyChallenge {
  id: string;
  name: string;
  description: string;
  requirement: string;
  progress: number;
  target: number;
  reward: string;
  rewardRarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  expiresIn: number; // hours
  completed: boolean;
  icon: string;
}

interface LoyaltyTier {
  id: string;
  name: string;
  minDays: number;
  nftReward: string;
  bonusMultiplier: number;
  unlocked: boolean;
  icon: string;
}

interface Referral {
  id: string;
  username: string;
  joinedDate: Date;
  tradingVolume: number;
  rewardEarned: number;
  nftRewarded: boolean;
  icon: string;
}

export default function NFTRewards() {
  const [activeTab, setActiveTab] = useState<
    'earned' | 'daily' | 'weekly' | 'loyalty' | 'referral'
  >('earned');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<
    RewardNFT | DailyDrop | null
  >(null);

  const [earnedNFTs, setEarnedNFTs] = useState<RewardNFT[]>([
    {
      id: '1',
      name: 'Top Trader NFT',
      description: 'Earned for $50,000+ trading volume',
      rarity: 'legendary',
      category: 'trading',
      earnedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      claimed: true,
      tradingVolume: 78500,
      icon: '🏆',
    },
    {
      id: '2',
      name: '30-Day Streak Badge',
      description: 'Daily login streak achievement',
      rarity: 'epic',
      category: 'loyalty',
      earnedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      claimed: true,
      icon: '🔥',
    },
    {
      id: '3',
      name: 'Referral Master',
      description: 'Earned by referring 10+ users',
      rarity: 'rare',
      category: 'referral',
      earnedDate: new Date(Date.now() - 1000 * 60 * 60 * 12),
      claimed: false,
      icon: '🎁',
    },
  ]);

  const [dailyDrops, setDailyDrops] = useState<DailyDrop[]>([
    {
      id: 'd1',
      name: 'Common Daily Drop',
      description: 'Standard daily reward for active traders',
      rarity: 'common',
      probability: 70,
      claimed: false,
      icon: '🎴',
    },
    {
      id: 'd2',
      name: 'Uncommon Daily Drop',
      description: 'Enhanced daily reward',
      rarity: 'uncommon',
      probability: 20,
      claimed: false,
      icon: '✨',
    },
    {
      id: 'd3',
      name: 'Rare Daily Drop',
      description: 'Lucky daily bonus',
      rarity: 'rare',
      probability: 8,
      claimed: false,
      icon: '🌟',
    },
    {
      id: 'd4',
      name: 'Epic Daily Drop',
      description: 'Super rare daily prize',
      rarity: 'epic',
      probability: 1.8,
      claimed: false,
      icon: '💎',
    },
    {
      id: 'd5',
      name: 'Legendary Daily Drop',
      description: 'Jackpot daily reward',
      rarity: 'legendary',
      probability: 0.2,
      claimed: false,
      icon: '👑',
    },
  ]);

  const [weeklyChallenges] = useState<WeeklyChallenge[]>([
    {
      id: 'w1',
      name: 'Volume Master',
      description: 'Trade $10,000 in volume this week',
      requirement: 'Complete $10,000 in trades',
      progress: 7250,
      target: 10000,
      reward: 'Epic Trading NFT',
      rewardRarity: 'epic',
      expiresIn: 48,
      completed: false,
      icon: '📈',
    },
    {
      id: 'w2',
      name: 'Prediction Pro',
      description: 'Win 15 predictions this week',
      requirement: 'Win 15 predictions',
      progress: 12,
      target: 15,
      reward: 'Rare Prophet Badge',
      rewardRarity: 'rare',
      expiresIn: 48,
      completed: false,
      icon: '🎯',
    },
    {
      id: 'w3',
      name: 'Social Butterfly',
      description: 'Share 20 predictions on social media',
      requirement: 'Share 20 predictions',
      progress: 20,
      target: 20,
      reward: 'Epic Social NFT',
      rewardRarity: 'epic',
      expiresIn: 48,
      completed: true,
      icon: '📱',
    },
    {
      id: 'w4',
      name: 'Market Maker',
      description: 'Create 3 new markets',
      requirement: 'Create 3 markets',
      progress: 1,
      target: 3,
      reward: 'Rare Creator Badge',
      rewardRarity: 'rare',
      expiresIn: 48,
      completed: false,
      icon: '🔨',
    },
  ]);

  const [loyaltyTiers] = useState<LoyaltyTier[]>([
    {
      id: 'tier1',
      name: 'Bronze Member',
      minDays: 7,
      nftReward: 'Bronze Badge NFT',
      bonusMultiplier: 1.1,
      unlocked: true,
      icon: '🥉',
    },
    {
      id: 'tier2',
      name: 'Silver Member',
      minDays: 30,
      nftReward: 'Silver Badge NFT',
      bonusMultiplier: 1.25,
      unlocked: true,
      icon: '🥈',
    },
    {
      id: 'tier3',
      name: 'Gold Member',
      minDays: 90,
      nftReward: 'Gold Badge NFT',
      bonusMultiplier: 1.5,
      unlocked: false,
      icon: '🥇',
    },
    {
      id: 'tier4',
      name: 'Platinum Member',
      minDays: 180,
      nftReward: 'Platinum Badge NFT',
      bonusMultiplier: 2.0,
      unlocked: false,
      icon: '💠',
    },
    {
      id: 'tier5',
      name: 'Diamond Member',
      minDays: 365,
      nftReward: 'Diamond Badge NFT',
      bonusMultiplier: 3.0,
      unlocked: false,
      icon: '💎',
    },
  ]);

  const [referrals] = useState<Referral[]>([
    {
      id: 'r1',
      username: 'trader_alex',
      joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
      tradingVolume: 12500,
      rewardEarned: 250,
      nftRewarded: true,
      icon: '👤',
    },
    {
      id: 'r2',
      username: 'crypto_sarah',
      joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      tradingVolume: 8900,
      rewardEarned: 178,
      nftRewarded: false,
      icon: '👤',
    },
    {
      id: 'r3',
      username: 'market_mike',
      joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      tradingVolume: 5600,
      rewardEarned: 112,
      nftRewarded: false,
      icon: '👤',
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trading':
        return <TrendingUp className="w-4 h-4" />;
      case 'daily':
        return <Calendar className="w-4 h-4" />;
      case 'weekly':
        return <RefreshCw className="w-4 h-4" />;
      case 'loyalty':
        return <Trophy className="w-4 h-4" />;
      case 'referral':
        return <Users className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
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
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleClaimReward = () => {
    if (selectedReward) {
      alert(`Claimed: ${selectedReward.name}`);
      setShowClaimModal(false);
      setSelectedReward(null);
    }
  };

  const handleDailyDrop = () => {
    // Simulate daily drop
    const rand = Math.random() * 100;
    let cumulativeProbability = 0;

    for (const drop of dailyDrops) {
      cumulativeProbability += drop.probability;
      if (rand <= cumulativeProbability) {
        const updatedDrops = dailyDrops.map((d) => ({
          ...d,
          claimed: d.id === drop.id ? true : d.claimed,
        }));
        setDailyDrops(updatedDrops);
        alert(`You won: ${drop.name}!`);
        return;
      }
    }
  };

  const totalEarned = earnedNFTs.length;
  const totalClaimed = earnedNFTs.filter((nft) => nft.claimed).length;
  const unclaimedRewards = earnedNFTs.filter((nft) => !nft.claimed).length;
  const completedChallenges = weeklyChallenges.filter(
    (c) => c.completed
  ).length;
  const totalReferrals = referrals.length;
  const totalReferralEarnings = referrals.reduce(
    (sum, r) => sum + r.rewardEarned,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-xl">
              <Gift className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">NFT Rewards</h1>
              <p className="text-slate-400">
                Earn exclusive NFTs through trading, challenges, and referrals
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Earned</span>
              <Trophy className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {totalEarned} NFTs
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {totalClaimed} claimed
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Unclaimed</span>
              <Gift className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-orange-400">
              {unclaimedRewards}
            </div>
            <div className="text-xs text-slate-400 mt-1">Ready to claim</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Weekly Progress</span>
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {completedChallenges}/{weeklyChallenges.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Challenges complete
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Referrals</span>
              <Users className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">
              {totalReferrals}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {formatCurrency(totalReferralEarnings)} earned
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('earned')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'earned'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Earned NFTs
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'daily'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Daily Drops
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'weekly'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Weekly Challenges
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'loyalty'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Loyalty Rewards
          </button>
          <button
            onClick={() => setActiveTab('referral')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'referral'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Referral NFTs
          </button>
        </div>

        {/* Earned NFTs Tab */}
        {activeTab === 'earned' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedNFTs.map((nft) => (
              <div
                key={nft.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden"
              >
                <div className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 p-12 flex items-center justify-center">
                  <div className="text-8xl">{nft.icon}</div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{nft.name}</h3>
                    {getCategoryIcon(nft.category)}
                  </div>

                  <p className="text-sm text-slate-400 mb-4">
                    {nft.description}
                  </p>

                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border mb-4 ${getRarityColor(
                      nft.rarity
                    )}`}
                  >
                    {nft.rarity.toUpperCase()}
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
                    <div className="text-xs text-slate-400 mb-1">Earned</div>
                    <div className="font-semibold">
                      {formatDate(nft.earnedDate)}
                    </div>
                  </div>

                  {!nft.claimed ? (
                    <button
                      onClick={() => {
                        setSelectedReward(nft);
                        setShowClaimModal(true);
                      }}
                      className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Gift className="w-4 h-4" />
                      Claim NFT
                    </button>
                  ) : (
                    <div className="w-full px-4 py-2 bg-green-600/20 border border-green-600/30 rounded-lg text-green-400 text-center">
                      ✓ Claimed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Daily Drops Tab */}
        {activeTab === 'daily' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <Calendar className="w-8 h-8 text-orange-400" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Daily NFT Drop</h2>
                  <p className="text-slate-300">
                    Claim your daily NFT drop! The rarity is random based on
                    probability. Come back every day for more chances!
                  </p>
                </div>
              </div>

              <button
                onClick={handleDailyDrop}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Gift className="w-5 h-5" />
                Claim Daily Drop
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyDrops.map((drop) => (
                <div
                  key={drop.id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6"
                >
                  <div className="text-6xl mb-4 text-center">{drop.icon}</div>
                  <h3 className="font-bold text-center mb-2">{drop.name}</h3>
                  <p className="text-sm text-slate-400 text-center mb-4">
                    {drop.description}
                  </p>

                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border mb-3 w-full justify-center ${getRarityColor(
                      drop.rarity
                    )}`}
                  >
                    {drop.rarity.toUpperCase()}
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-400">
                      {drop.probability}%
                    </div>
                    <div className="text-xs text-slate-400">Drop Chance</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Challenges Tab */}
        {activeTab === 'weekly' && (
          <div className="space-y-4">
            {weeklyChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-5xl">{challenge.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">
                        {challenge.name}
                      </h3>
                      <p className="text-sm text-slate-400 mb-3">
                        {challenge.description}
                      </p>

                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border ${getRarityColor(
                            challenge.rewardRarity
                          )}`}
                        >
                          {challenge.reward}
                        </div>
                        <div className="text-sm text-slate-400">
                          Expires in {challenge.expiresIn}h
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-400">
                            {challenge.requirement}
                          </span>
                          <span className="font-semibold">
                            {challenge.progress} / {challenge.target}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-600 to-yellow-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                (challenge.progress / challenge.target) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {challenge.completed && (
                    <div className="px-4 py-2 bg-green-600/20 border border-green-600/30 rounded-lg text-green-400 text-sm">
                      ✓ Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loyalty Rewards Tab */}
        {activeTab === 'loyalty' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <Trophy className="w-8 h-8 text-orange-400" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Loyalty Program</h2>
                  <p className="text-slate-300">
                    Earn exclusive NFTs by being a loyal member. Each tier
                    unlocks unique NFTs and bonus multipliers for all rewards!
                  </p>
                </div>
              </div>
            </div>

            {loyaltyTiers.map((tier) => (
              <div
                key={tier.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border p-6 ${
                  tier.unlocked ? 'border-green-500/50' : 'border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{tier.icon}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{tier.name}</h3>
                      <p className="text-sm text-slate-400 mb-2">
                        {tier.minDays} days of membership required
                      </p>
                      <div className="text-sm">
                        <span className="text-slate-400">NFT Reward:</span>
                        <span className="font-semibold ml-2">
                          {tier.nftReward}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">
                          Bonus Multiplier:
                        </span>
                        <span className="font-semibold text-orange-400 ml-2">
                          {tier.bonusMultiplier}x
                        </span>
                      </div>
                    </div>
                  </div>

                  {tier.unlocked ? (
                    <div className="px-4 py-2 bg-green-600/20 border border-green-600/30 rounded-lg text-green-400">
                      ✓ Unlocked
                    </div>
                  ) : (
                    <div className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400">
                      🔒 Locked
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Referral NFTs Tab */}
        {activeTab === 'referral' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <Users className="w-8 h-8 text-orange-400" />
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">Referral Program</h2>
                  <p className="text-slate-300 mb-4">
                    Earn NFTs and rewards by referring friends! Get bonus NFTs
                    for every 5 referrals and share in their trading volume.
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="https://prophetbase.com/ref/YOUR_CODE"
                      readOnly
                      className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm"
                    />
                    <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{referral.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          {referral.username}
                        </h3>
                        <p className="text-sm text-slate-400 mb-2">
                          Joined {formatDate(referral.joinedDate)}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">
                              Trading Volume:
                            </span>
                            <span className="font-semibold ml-2">
                              {formatCurrency(referral.tradingVolume)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Your Reward:</span>
                            <span className="font-semibold text-green-400 ml-2">
                              {formatCurrency(referral.rewardEarned)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {referral.nftRewarded && (
                      <div className="px-4 py-2 bg-orange-600/20 border border-orange-600/30 rounded-lg text-orange-400 text-sm">
                        🎁 NFT Earned
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2">Referral Milestones</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">5 Referrals</span>
                  <span className="text-green-400">
                    ✓ Rare Referral NFT Earned
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>10 Referrals</span>
                  <span>Epic Referral NFT ({totalReferrals}/10)</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>25 Referrals</span>
                  <span>Legendary Referral NFT ({totalReferrals}/25)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Claim Modal */}
        {showClaimModal && selectedReward && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4">Claim NFT Reward</h3>

              <div className="text-center mb-6">
                <div className="text-7xl mb-3">{selectedReward.icon}</div>
                <h4 className="font-bold text-lg mb-2">
                  {selectedReward.name}
                </h4>
                {'description' in selectedReward && (
                  <p className="text-sm text-slate-400 mb-3">
                    {selectedReward.description}
                  </p>
                )}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border ${getRarityColor(
                    selectedReward.rarity
                  )}`}
                >
                  {selectedReward.rarity.toUpperCase()} NFT
                </div>
              </div>

              <div className="bg-orange-600/10 border border-orange-600/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-center">
                  This NFT will be minted to your wallet and stored on IPFS with
                  ERC-721 compliance.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowClaimModal(false);
                    setSelectedReward(null);
                  }}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClaimReward}
                  className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  Claim NFT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
