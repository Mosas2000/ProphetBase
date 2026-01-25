'use client';

import { Award, Lock, Star, Zap, Gift, Crown, Clock, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Reward {
  id: string;
  name: string;
  type: 'token' | 'nft' | 'boost' | 'cosmetic';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  claimed: boolean;
}

interface Tier {
  level: number;
  xpRequired: number;
  free: Reward[];
  premium: Reward[];
}

export default function BattlePass() {
  const [currentLevel, setCurrentLevel] = useState(12);
  const [currentXP, setCurrentXP] = useState(2400);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const season = {
    number: 3,
    name: 'Crypto Winter',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    daysRemaining: 65
  };

  const nextLevelXP = (currentLevel + 1) * 200;

  const tiers: Tier[] = Array.from({ length: 50 }, (_, i) => ({
    level: i + 1,
    xpRequired: (i + 1) * 200,
    free: [
      {
        id: `f${i}1`,
        name: i % 5 === 0 ? 'Premium Currency' : 'XP Boost',
        type: i % 5 === 0 ? 'token' : 'boost',
        rarity: i % 10 === 0 ? 'rare' : 'common',
        icon: i % 5 === 0 ? '💎' : '⚡',
        claimed: i < currentLevel
      }
    ],
    premium: [
      {
        id: `p${i}1`,
        name: i % 10 === 0 ? 'Legendary NFT' : i % 5 === 0 ? 'Epic Boost' : 'Rare Token',
        type: i % 10 === 0 ? 'nft' : i % 5 === 0 ? 'boost' : 'token',
        rarity: i % 10 === 0 ? 'legendary' : i % 5 === 0 ? 'epic' : 'rare',
        icon: i % 10 === 0 ? '👑' : i % 5 === 0 ? '🔥' : '💰',
        claimed: i < currentLevel && isPremium
      },
      {
        id: `p${i}2`,
        name: 'Exclusive Avatar',
        type: 'cosmetic',
        rarity: 'epic',
        icon: '🎨',
        claimed: i < currentLevel && isPremium
      }
    ]
  }));

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-slate-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-500/20 border-slate-500';
      case 'rare': return 'bg-blue-500/20 border-blue-500';
      case 'epic': return 'bg-purple-500/20 border-purple-500';
      case 'legendary': return 'bg-amber-500/20 border-amber-500';
      default: return 'bg-slate-500/20 border-slate-500';
    }
  };

  const premiumPrice = 1999;
  const totalRewards = {
    free: tiers.reduce((sum, tier) => sum + tier.free.length, 0),
    premium: tiers.reduce((sum, tier) => sum + tier.premium.length, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl">
                <Award className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Battle Pass</h1>
                <p className="text-slate-400">Season {season.number}: {season.name}</p>
              </div>
            </div>

            {!isPremium && (
              <button
                onClick={() => setIsPremium(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl transition-all shadow-lg hover:shadow-xl font-bold"
              >
                <Crown className="w-5 h-5" />
                <span>Upgrade to Premium</span>
                <span className="text-sm opacity-90">${(premiumPrice / 100).toFixed(2)}</span>
              </button>
            )}
          </div>

          {/* Season Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span className="text-slate-400 text-sm">Current Level</span>
              </div>
              <div className="text-3xl font-bold text-indigo-400">{currentLevel}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="text-slate-400 text-sm">Total XP</span>
              </div>
              <div className="text-3xl font-bold text-amber-400">{currentXP.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="text-slate-400 text-sm">Days Remaining</span>
              </div>
              <div className="text-3xl font-bold text-purple-400">{season.daysRemaining}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-green-400" />
                <span className="text-slate-400 text-sm">Unlocked Rewards</span>
              </div>
              <div className="text-3xl font-bold text-green-400">
                {currentLevel * (isPremium ? 3 : 1)}
              </div>
            </div>
          </div>

          {/* Current Progress */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <div className="text-lg font-bold">Level {currentLevel} Progress</div>
              <div className="text-slate-400">
                {currentXP} / {nextLevelXP} XP
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                style={{ width: `${(currentXP / nextLevelXP) * 100}%` }}
              />
            </div>
            <div className="text-sm text-slate-400">
              {nextLevelXP - currentXP} XP needed for Level {currentLevel + 1}
            </div>
          </div>
        </div>

        {/* Battle Pass Tiers */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Rewards Track</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-600 rounded" />
                <span className="text-slate-400">Free Track</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded" />
                <span className="text-slate-400">Premium Track</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
              {tiers.slice(0, 20).map((tier) => (
                <div
                  key={tier.level}
                  className={`flex-shrink-0 w-32 ${
                    tier.level === currentLevel ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  {/* Level Number */}
                  <div className="text-center mb-2">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                      tier.level <= currentLevel
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {tier.level}
                    </div>
                  </div>

                  {/* Premium Rewards */}
                  <div className={`mb-2 p-3 rounded-lg border-2 ${
                    isPremium && tier.level <= currentLevel
                      ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500'
                      : !isPremium
                      ? 'bg-slate-700/30 border-slate-600 opacity-50'
                      : 'bg-slate-700/50 border-slate-600'
                  }`}>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-amber-400">PREMIUM</span>
                    </div>
                    <div className="space-y-2">
                      {tier.premium.map((reward) => (
                        <div
                          key={reward.id}
                          className={`p-2 rounded ${getRarityBg(reward.rarity)} border cursor-pointer hover:scale-105 transition-transform`}
                          onClick={() => setSelectedReward(reward)}
                        >
                          <div className="text-2xl text-center mb-1">{reward.icon}</div>
                          <div className={`text-xs font-medium text-center ${getRarityColor(reward.rarity)}`}>
                            {reward.name}
                          </div>
                          {reward.claimed && (
                            <div className="flex justify-center mt-1">
                              <div className="bg-green-500 rounded-full p-0.5">
                                <Award className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          )}
                          {!isPremium && (
                            <div className="flex justify-center mt-1">
                              <Lock className="w-3 h-3 text-slate-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Free Rewards */}
                  <div className={`p-3 rounded-lg border-2 ${
                    tier.level <= currentLevel
                      ? 'bg-slate-700/50 border-slate-500'
                      : 'bg-slate-700/30 border-slate-600'
                  }`}>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-400">FREE</span>
                    </div>
                    <div className="space-y-2">
                      {tier.free.map((reward) => (
                        <div
                          key={reward.id}
                          className={`p-2 rounded ${getRarityBg(reward.rarity)} border cursor-pointer hover:scale-105 transition-transform`}
                          onClick={() => setSelectedReward(reward)}
                        >
                          <div className="text-2xl text-center mb-1">{reward.icon}</div>
                          <div className={`text-xs font-medium text-center ${getRarityColor(reward.rarity)}`}>
                            {reward.name}
                          </div>
                          {reward.claimed && (
                            <div className="flex justify-center mt-1">
                              <div className="bg-green-500 rounded-full p-0.5">
                                <Award className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Upgrade CTA */}
        {!isPremium && (
          <div className="mt-6 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-xl p-6 border-2 border-amber-500/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-6 h-6 text-amber-400" />
                  <h3 className="text-2xl font-bold">Upgrade to Premium</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  Unlock {totalRewards.premium} exclusive rewards including legendary NFTs, exclusive boosts, and cosmetics!
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Instant access to all premium rewards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>+25% XP boost for the entire season</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Exclusive premium-only quests</span>
                  </li>
                </ul>
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl transition-all shadow-lg hover:shadow-xl font-bold text-lg">
                Upgrade Now<br />
                <span className="text-sm opacity-90">${(premiumPrice / 100).toFixed(2)}</span>
              </button>
            </div>
          </div>
        )}

        {/* Reward Detail Modal */}
        {selectedReward && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedReward(null)}
          >
            <div
              className={`rounded-xl p-6 border-2 max-w-md w-full ${getRarityBg(selectedReward.rarity)}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-4">{selectedReward.icon}</div>
                <h2 className={`text-2xl font-bold mb-2 ${getRarityColor(selectedReward.rarity)}`}>
                  {selectedReward.name}
                </h2>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getRarityBg(selectedReward.rarity)}`}>
                  {selectedReward.rarity.toUpperCase()}
                </div>
              </div>

              <div className="space-y-3 mb-6 text-center">
                <div className="text-slate-300">
                  Type: <span className="font-bold capitalize">{selectedReward.type}</span>
                </div>
                {selectedReward.claimed ? (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <Award className="w-5 h-5" />
                    <span className="font-bold">Reward Claimed!</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Lock className="w-5 h-5" />
                    <span>Not yet unlocked</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedReward(null)}
                className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
