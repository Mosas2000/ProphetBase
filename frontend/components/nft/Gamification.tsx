'use client';

import {
  Award,
  Gift,
  Lock,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Unlock,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface PlayerLevel {
  level: number;
  experience: number;
  experienceToNext: number;
  title: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'trading' | 'social' | 'collection' | 'milestone';
  progress: number;
  target: number;
  unlocked: boolean;
  reward: string;
  icon: string;
}

interface CollectionBonus {
  id: string;
  name: string;
  description: string;
  requiredNFTs: number;
  currentNFTs: number;
  bonus: string;
  bonusType: 'multiplier' | 'discount' | 'exclusive' | 'reward';
  unlocked: boolean;
  icon: string;
}

interface Perk {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  unlocked: boolean;
  benefit: string;
  icon: string;
}

interface Quest {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  progress: number;
  target: number;
  reward: string;
  expiresIn: number; // hours
  completed: boolean;
  icon: string;
}

export default function Gamification() {
  const [activeTab, setActiveTab] = useState<
    'progression' | 'achievements' | 'collection' | 'quests'
  >('progression');

  const [playerLevel] = useState<PlayerLevel>({
    level: 28,
    experience: 8450,
    experienceToNext: 2550,
    title: 'Master Prophet',
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: 'a1',
      name: 'Trading Titan',
      description: 'Complete 1,000 successful trades',
      category: 'trading',
      progress: 850,
      target: 1000,
      unlocked: false,
      reward: 'Legendary Trading NFT',
      icon: '📈',
    },
    {
      id: 'a2',
      name: 'Social Butterfly',
      description: 'Get 500 followers on the platform',
      category: 'social',
      progress: 500,
      target: 500,
      unlocked: true,
      reward: 'Epic Social Badge',
      icon: '🦋',
    },
    {
      id: 'a3',
      name: 'NFT Collector',
      description: 'Own 50 unique NFTs',
      category: 'collection',
      progress: 32,
      target: 50,
      unlocked: false,
      reward: 'Rare Collector Badge',
      icon: '🎨',
    },
    {
      id: 'a4',
      name: 'Century Club',
      description: 'Reach level 100',
      category: 'milestone',
      progress: 28,
      target: 100,
      unlocked: false,
      reward: 'Legendary Century NFT',
      icon: '💯',
    },
    {
      id: 'a5',
      name: 'Profit Master',
      description: 'Earn $100,000 in total profits',
      category: 'trading',
      progress: 67500,
      target: 100000,
      unlocked: false,
      reward: 'Epic Profit Badge',
      icon: '💰',
    },
    {
      id: 'a6',
      name: 'Perfect Streak',
      description: 'Win 20 predictions in a row',
      category: 'trading',
      progress: 12,
      target: 20,
      unlocked: false,
      reward: 'Legendary Streak NFT',
      icon: '🔥',
    },
  ]);

  const [collectionBonuses] = useState<CollectionBonus[]>([
    {
      id: 'cb1',
      name: 'Trading Card Set',
      description: 'Collect all 10 legendary trading cards',
      requiredNFTs: 10,
      currentNFTs: 6,
      bonus: '2x Trading Volume Tracking',
      bonusType: 'multiplier',
      unlocked: false,
      icon: '🃏',
    },
    {
      id: 'cb2',
      name: 'Achievement Master',
      description: 'Unlock all achievement NFTs',
      requiredNFTs: 20,
      currentNFTs: 20,
      bonus: '25% Fee Discount',
      bonusType: 'discount',
      unlocked: true,
      icon: '🏆',
    },
    {
      id: 'cb3',
      name: 'Seasonal Collection',
      description: 'Own NFTs from all 4 seasons',
      requiredNFTs: 4,
      currentNFTs: 3,
      bonus: 'Exclusive Seasonal Drops',
      bonusType: 'exclusive',
      unlocked: false,
      icon: '❄️',
    },
    {
      id: 'cb4',
      name: 'Profile Master',
      description: 'Collect 15 unique profile NFTs',
      requiredNFTs: 15,
      currentNFTs: 8,
      bonus: 'Custom Profile Frames',
      bonusType: 'reward',
      unlocked: false,
      icon: '🖼️',
    },
  ]);

  const [perks] = useState<Perk[]>([
    {
      id: 'p1',
      name: 'Enhanced Analytics',
      description: 'Access to advanced trading analytics and insights',
      requiredLevel: 5,
      unlocked: true,
      benefit: 'Premium analytics dashboard',
      icon: '📊',
    },
    {
      id: 'p2',
      name: 'Priority Support',
      description: 'Get priority customer support',
      requiredLevel: 10,
      unlocked: true,
      benefit: '24/7 priority assistance',
      icon: '🎧',
    },
    {
      id: 'p3',
      name: 'Fee Reduction',
      description: 'Reduced trading fees on all transactions',
      requiredLevel: 15,
      unlocked: true,
      benefit: '10% fee discount',
      icon: '💵',
    },
    {
      id: 'p4',
      name: 'Early Access',
      description: 'Early access to new features and NFT drops',
      requiredLevel: 20,
      unlocked: true,
      benefit: '24h early access',
      icon: '🚀',
    },
    {
      id: 'p5',
      name: 'Custom Badges',
      description: 'Unlock custom profile badges and flair',
      requiredLevel: 25,
      unlocked: true,
      benefit: 'Exclusive badges',
      icon: '⭐',
    },
    {
      id: 'p6',
      name: 'VIP Access',
      description: 'Access to exclusive VIP-only features',
      requiredLevel: 30,
      unlocked: false,
      benefit: 'VIP lounge access',
      icon: '👑',
    },
    {
      id: 'p7',
      name: 'Mega Multiplier',
      description: '3x rewards on all activities',
      requiredLevel: 50,
      unlocked: false,
      benefit: '3x reward multiplier',
      icon: '⚡',
    },
  ]);

  const [quests] = useState<Quest[]>([
    {
      id: 'q1',
      name: 'Daily Trader',
      description: 'Complete 10 trades today',
      difficulty: 'easy',
      progress: 7,
      target: 10,
      reward: '500 XP + Common NFT',
      expiresIn: 6,
      completed: false,
      icon: '📅',
    },
    {
      id: 'q2',
      name: 'Prediction Pro',
      description: 'Win 5 predictions with 80%+ accuracy',
      difficulty: 'medium',
      progress: 3,
      target: 5,
      reward: '1,500 XP + Rare NFT',
      expiresIn: 18,
      completed: false,
      icon: '🎯',
    },
    {
      id: 'q3',
      name: 'Social Star',
      description: 'Get 100 likes on your predictions',
      difficulty: 'medium',
      progress: 100,
      target: 100,
      reward: '1,000 XP + Uncommon NFT',
      expiresIn: 12,
      completed: true,
      icon: '⭐',
    },
    {
      id: 'q4',
      name: 'Volume Champion',
      description: 'Trade $50,000 in volume this week',
      difficulty: 'hard',
      progress: 32500,
      target: 50000,
      reward: '5,000 XP + Epic NFT',
      expiresIn: 72,
      completed: false,
      icon: '🏅',
    },
    {
      id: 'q5',
      name: 'Legendary Quest',
      description: 'Achieve a 20-win streak',
      difficulty: 'legendary',
      progress: 12,
      target: 20,
      reward: '10,000 XP + Legendary NFT',
      expiresIn: 168,
      completed: false,
      icon: '👑',
    },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-600/20 border-green-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-600/20 border-yellow-500/30';
      case 'hard':
        return 'text-orange-400 bg-orange-600/20 border-orange-500/30';
      case 'legendary':
        return 'text-purple-400 bg-purple-600/20 border-purple-500/30';
      default:
        return 'text-slate-400 bg-slate-600/20 border-slate-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trading':
        return <TrendingUp className="w-4 h-4" />;
      case 'social':
        return <Star className="w-4 h-4" />;
      case 'collection':
        return <Gift className="w-4 h-4" />;
      case 'milestone':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;
  const unlockedBonuses = collectionBonuses.filter((b) => b.unlocked).length;
  const unlockedPerks = perks.filter((p) => p.unlocked).length;
  const completedQuests = quests.filter((q) => q.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-xl">
              <Trophy className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Gamification</h1>
              <p className="text-slate-400">
                Level up, unlock perks, and earn exclusive rewards
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Current Level</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {playerLevel.level}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {playerLevel.title}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Achievements</span>
              <Award className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {unlockedAchievements}/{achievements.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Unlocked</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Active Perks</span>
              <Star className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {unlockedPerks}
            </div>
            <div className="text-xs text-slate-400 mt-1">Unlocked benefits</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Quests Done</span>
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {completedQuests}/{quests.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">This period</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('progression')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'progression'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Progression
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'achievements'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'collection'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Collection Bonuses
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'quests'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Daily Quests
          </button>
        </div>

        {/* Progression Tab */}
        {activeTab === 'progression' && (
          <div className="space-y-6">
            {/* Level Progress */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Level {playerLevel.level}
                  </h2>
                  <div className="text-emerald-400 font-semibold">
                    {playerLevel.title}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-400">
                    {playerLevel.experience.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">Total XP</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-300">
                    Progress to Level {playerLevel.level + 1}
                  </span>
                  <span className="font-semibold">
                    {playerLevel.experience} /{' '}
                    {playerLevel.experience + playerLevel.experienceToNext} XP
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-green-600 h-3 rounded-full transition-all"
                    style={{
                      width: `${
                        (playerLevel.experience /
                          (playerLevel.experience +
                            playerLevel.experienceToNext)) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {playerLevel.experienceToNext.toLocaleString()} XP needed
                </div>
              </div>
            </div>

            {/* Unlocked Perks */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-6">Level Perks & Benefits</h2>

              <div className="space-y-3">
                {perks.map((perk) => (
                  <div
                    key={perk.id}
                    className={`rounded-xl p-4 border ${
                      perk.unlocked
                        ? 'bg-emerald-600/10 border-emerald-500/30'
                        : 'bg-slate-700/30 border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl">{perk.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{perk.name}</h3>
                          <p className="text-sm text-slate-400 mb-2">
                            {perk.description}
                          </p>
                          <div className="text-sm">
                            <span className="text-slate-400">Benefit:</span>
                            <span className="font-semibold text-emerald-400 ml-2">
                              {perk.benefit}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {perk.unlocked ? (
                          <div className="px-3 py-1 bg-emerald-600/20 border border-emerald-600/30 rounded text-emerald-400 text-sm flex items-center gap-2">
                            <Unlock className="w-3 h-3" />
                            Unlocked
                          </div>
                        ) : (
                          <div className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded text-slate-400 text-sm flex items-center gap-2">
                            <Lock className="w-3 h-3" />
                            Level {perk.requiredLevel}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border ${
                  achievement.unlocked
                    ? 'border-yellow-500/50'
                    : 'border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-5xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{achievement.name}</h3>
                      {getCategoryIcon(achievement.category)}
                    </div>
                    <p className="text-sm text-slate-400 mb-3">
                      {achievement.description}
                    </p>

                    {achievement.unlocked ? (
                      <div className="px-3 py-1 bg-yellow-600/20 border border-yellow-600/30 rounded text-yellow-400 text-sm inline-flex items-center gap-2">
                        <Trophy className="w-3 h-3" />
                        Unlocked
                      </div>
                    ) : (
                      <>
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-400">Progress</span>
                            <span className="font-semibold">
                              {achievement.progress.toLocaleString()} /{' '}
                              {achievement.target.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-yellow-600 to-orange-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${
                                  (achievement.progress / achievement.target) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Reward</div>
                  <div className="font-semibold text-emerald-400">
                    {achievement.reward}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Collection Bonuses Tab */}
        {activeTab === 'collection' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <Gift className="w-8 h-8 text-emerald-400" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Collection Bonuses</h2>
                  <p className="text-slate-300">
                    Complete NFT collections to unlock powerful bonuses and
                    exclusive benefits!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collectionBonuses.map((bonus) => (
                <div
                  key={bonus.id}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border ${
                    bonus.unlocked
                      ? 'border-emerald-500/50'
                      : 'border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">{bonus.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{bonus.name}</h3>
                      <p className="text-sm text-slate-400 mb-4">
                        {bonus.description}
                      </p>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-400">NFTs Collected</span>
                          <span className="font-semibold">
                            {bonus.currentNFTs} / {bonus.requiredNFTs}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              bonus.unlocked
                                ? 'bg-gradient-to-r from-emerald-600 to-green-600'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600'
                            }`}
                            style={{
                              width: `${
                                (bonus.currentNFTs / bonus.requiredNFTs) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="bg-slate-700/30 rounded-lg p-3 mb-3">
                        <div className="text-xs text-slate-400 mb-1">Bonus</div>
                        <div className="font-semibold text-emerald-400">
                          {bonus.bonus}
                        </div>
                      </div>

                      {bonus.unlocked ? (
                        <div className="px-3 py-1 bg-emerald-600/20 border border-emerald-600/30 rounded text-emerald-400 text-sm inline-flex items-center gap-2">
                          <Trophy className="w-3 h-3" />
                          Active Bonus
                        </div>
                      ) : (
                        <div className="text-sm text-slate-400">
                          {bonus.requiredNFTs - bonus.currentNFTs} more NFTs
                          needed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quests Tab */}
        {activeTab === 'quests' && (
          <div className="space-y-4">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border ${
                  quest.completed ? 'border-green-500/50' : 'border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-5xl">{quest.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{quest.name}</h3>
                        <div
                          className={`px-2 py-1 rounded text-xs font-semibold border ${getDifficultyColor(
                            quest.difficulty
                          )}`}
                        >
                          {quest.difficulty.toUpperCase()}
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">
                        {quest.description}
                      </p>

                      {quest.completed ? (
                        <div className="px-3 py-1 bg-green-600/20 border border-green-600/30 rounded text-green-400 text-sm inline-flex items-center gap-2">
                          <Trophy className="w-3 h-3" />
                          Completed
                        </div>
                      ) : (
                        <>
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-slate-400">Progress</span>
                              <span className="font-semibold">
                                {typeof quest.progress === 'number' &&
                                quest.progress > 100
                                  ? `$${quest.progress.toLocaleString()}`
                                  : quest.progress}{' '}
                                /{' '}
                                {typeof quest.target === 'number' &&
                                quest.target > 100
                                  ? `$${quest.target.toLocaleString()}`
                                  : quest.target}
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-emerald-600 to-green-600 h-2 rounded-full transition-all"
                                style={{
                                  width: `${
                                    (quest.progress / quest.target) * 100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="text-xs text-orange-400">
                            Expires in {quest.expiresIn}h
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3 text-right">
                    <div className="text-xs text-slate-400 mb-1">Reward</div>
                    <div className="font-semibold text-sm text-emerald-400">
                      {quest.reward}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
