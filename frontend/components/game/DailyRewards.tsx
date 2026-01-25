'use client';

import { Calendar, Flame, Gift, Zap, Star, Clock } from 'lucide-react';
import { useState } from 'react';

interface DailyReward {
  day: number;
  reward: {
    type: 'tokens' | 'xp' | 'boost' | 'nft';
    amount: number;
    name: string;
    icon: string;
  };
  claimed: boolean;
  premium: boolean;
}

export default function DailyRewards() {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [longestStreak, setLongestStreak] = useState(23);
  const [isPremium, setIsPremium] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const [rewards] = useState<DailyReward[]>([
    { day: 1, reward: { type: 'tokens', amount: 50, name: '50 Tokens', icon: '💰' }, claimed: true, premium: false },
    { day: 2, reward: { type: 'xp', amount: 100, name: '100 XP', icon: '⭐' }, claimed: true, premium: false },
    { day: 3, reward: { type: 'tokens', amount: 75, name: '75 Tokens', icon: '💰' }, claimed: true, premium: false },
    { day: 4, reward: { type: 'boost', amount: 1, name: '2x XP Boost', icon: '🚀' }, claimed: true, premium: false },
    { day: 5, reward: { type: 'tokens', amount: 100, name: '100 Tokens', icon: '💰' }, claimed: true, premium: false },
    { day: 6, reward: { type: 'xp', amount: 200, name: '200 XP', icon: '⭐' }, claimed: true, premium: false },
    { day: 7, reward: { type: 'nft', amount: 1, name: 'Rare NFT', icon: '🎨' }, claimed: false, premium: false },
    { day: 8, reward: { type: 'tokens', amount: 150, name: '150 Tokens', icon: '💰' }, claimed: false, premium: false },
    { day: 9, reward: { type: 'boost', amount: 1, name: '3x XP Boost', icon: '🔥' }, claimed: false, premium: false },
    { day: 10, reward: { type: 'tokens', amount: 200, name: '200 Tokens', icon: '💰' }, claimed: false, premium: true },
    { day: 11, reward: { type: 'xp', amount: 500, name: '500 XP', icon: '⭐' }, claimed: false, premium: false },
    { day: 12, reward: { type: 'tokens', amount: 250, name: '250 Tokens', icon: '💰' }, claimed: false, premium: false },
    { day: 13, reward: { type: 'boost', amount: 1, name: '24h XP Boost', icon: '⚡' }, claimed: false, premium: false },
    { day: 14, reward: { type: 'nft', amount: 1, name: 'Epic NFT', icon: '👑' }, claimed: false, premium: true }
  ]);

  const nextRewardIndex = rewards.findIndex(r => !r.claimed);
  const canClaim = nextRewardIndex >= 0;
  const streakMultiplier = Math.floor(currentStreak / 7) + 1;

  const claimReward = () => {
    if (canClaim) {
      const reward = rewards[nextRewardIndex];
      if (reward.premium && !isPremium) {
        alert('Premium reward! Upgrade to claim.');
        return;
      }
      reward.claimed = true;
      setCurrentStreak(currentStreak + 1);
    }
  };

  const totalTokensEarned = rewards
    .filter(r => r.claimed && r.reward.type === 'tokens')
    .reduce((sum, r) => sum + r.reward.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-rose-600/20 to-pink-600/20 rounded-xl">
              <Calendar className="w-8 h-8 text-rose-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Daily Rewards</h1>
              <p className="text-slate-400">Login every day to claim rewards and build your streak</p>
            </div>
          </div>

          {/* Streak Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-slate-400 text-sm">Current Streak</span>
              </div>
              <div className="text-3xl font-bold text-orange-400">{currentStreak} days</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="text-slate-400 text-sm">Longest Streak</span>
              </div>
              <div className="text-3xl font-bold text-amber-400">{longestStreak} days</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <span className="text-slate-400 text-sm">Streak Multiplier</span>
              </div>
              <div className="text-3xl font-bold text-purple-400">x{streakMultiplier}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-green-400" />
                <span className="text-slate-400 text-sm">Tokens Earned</span>
              </div>
              <div className="text-3xl font-bold text-green-400">{totalTokensEarned}</div>
            </div>
          </div>

          {/* Next Reward Claim */}
          {canClaim && (
            <div className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-xl p-6 border-2 border-rose-500/50 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-rose-400" />
                    <h3 className="text-xl font-bold">Day {rewards[nextRewardIndex].day} Reward Ready!</h3>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-4xl">{rewards[nextRewardIndex].reward.icon}</div>
                    <div>
                      <div className="text-2xl font-bold">{rewards[nextRewardIndex].reward.name}</div>
                      {rewards[nextRewardIndex].premium && (
                        <div className="text-amber-400 text-sm">Premium Reward</div>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Keep your streak going! Login tomorrow to continue earning.
                  </p>
                </div>
                <button
                  onClick={claimReward}
                  className="px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl transition-all shadow-lg hover:shadow-xl font-bold text-lg"
                >
                  Claim Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rewards Calendar */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">14-Day Reward Cycle</h2>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
            >
              {showHistory ? 'Hide' : 'Show'} History
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.day}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  reward.claimed
                    ? 'bg-green-500/20 border-green-500'
                    : reward.day === nextRewardIndex + 1
                    ? 'bg-rose-500/20 border-rose-500 ring-2 ring-rose-500 animate-pulse'
                    : reward.premium && !isPremium
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-slate-700/50 border-slate-600'
                }`}
              >
                {reward.premium && (
                  <div className="absolute top-2 right-2">
                    <Star className="w-4 h-4 text-amber-400" />
                  </div>
                )}

                <div className="text-center mb-2">
                  <div className="text-sm text-slate-400 mb-1">Day {reward.day}</div>
                  <div className="text-4xl mb-2">{reward.reward.icon}</div>
                  <div className="text-sm font-bold">{reward.reward.name}</div>
                </div>

                {reward.claimed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-xl">
                    <div className="bg-green-500 rounded-full p-2">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Streak Recovery */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold">Streak Recovery</h3>
              </div>
              <p className="text-slate-300 mb-3">
                Missed a day? Use a Streak Recovery token to keep your streak alive!
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span>Available Tokens: <strong className="text-purple-400">3</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span>Premium users get 5 tokens/month</span>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium">
              Learn More
            </button>
          </div>
        </div>

        {!isPremium && (
          <div className="mt-6 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-xl p-6 border-2 border-amber-500/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-6 h-6 text-amber-400" />
                  <h3 className="text-2xl font-bold">Upgrade to Premium</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>+50% bonus on all rewards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>5 Streak Recovery tokens per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Access to exclusive premium rewards</span>
                  </li>
                </ul>
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl transition-all shadow-lg hover:shadow-xl font-bold text-lg">
                Upgrade
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
