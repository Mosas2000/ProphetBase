'use client';

import {
  Award,
  CheckCircle,
  Lock,
  Star,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { useState } from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'trading' | 'social' | 'progression' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  unlockedDate?: string;
  reward: {
    type: 'xp' | 'token' | 'badge' | 'title';
    amount: number;
  };
}

export default function AchievementShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | Achievement['category']
  >('all');
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const [achievements] = useState<Achievement[]>([
    // Trading Achievements
    {
      id: 'a1',
      name: 'First Trade',
      description: 'Complete your first trade',
      category: 'trading',
      rarity: 'common',
      icon: '💰',
      unlocked: true,
      progress: 1,
      target: 1,
      unlockedDate: '2025-01-15',
      reward: { type: 'xp', amount: 100 },
    },
    {
      id: 'a2',
      name: 'Volume Trader',
      description: 'Trade 10,000 tokens total',
      category: 'trading',
      rarity: 'rare',
      icon: '📈',
      unlocked: true,
      progress: 10000,
      target: 10000,
      unlockedDate: '2025-01-18',
      reward: { type: 'token', amount: 500 },
    },
    {
      id: 'a3',
      name: 'Whale',
      description: 'Complete a trade worth 50,000 tokens',
      category: 'trading',
      rarity: 'epic',
      icon: '🐋',
      unlocked: false,
      progress: 32000,
      target: 50000,
      reward: { type: 'badge', amount: 1 },
    },
    {
      id: 'a4',
      name: 'Market Legend',
      description: 'Reach 1,000,000 total volume',
      category: 'trading',
      rarity: 'legendary',
      icon: '👑',
      unlocked: false,
      progress: 458000,
      target: 1000000,
      reward: { type: 'title', amount: 1 },
    },

    // Social Achievements
    {
      id: 'a5',
      name: 'Social Butterfly',
      description: 'Join a guild',
      category: 'social',
      rarity: 'common',
      icon: '🦋',
      unlocked: true,
      progress: 1,
      target: 1,
      unlockedDate: '2025-01-16',
      reward: { type: 'xp', amount: 150 },
    },
    {
      id: 'a6',
      name: 'Team Player',
      description: 'Win 10 guild tournaments',
      category: 'social',
      rarity: 'rare',
      icon: '🤝',
      unlocked: false,
      progress: 7,
      target: 10,
      reward: { type: 'token', amount: 1000 },
    },
    {
      id: 'a7',
      name: 'Guild Master',
      description: 'Lead a guild to rank 1',
      category: 'social',
      rarity: 'epic',
      icon: '⚔️',
      unlocked: false,
      progress: 3,
      target: 1,
      reward: { type: 'badge', amount: 1 },
    },

    // Progression Achievements
    {
      id: 'a8',
      name: 'Newcomer',
      description: 'Reach level 10',
      category: 'progression',
      rarity: 'common',
      icon: '🌱',
      unlocked: true,
      progress: 10,
      target: 10,
      unlockedDate: '2025-01-17',
      reward: { type: 'xp', amount: 200 },
    },
    {
      id: 'a9',
      name: 'Rising Star',
      description: 'Reach level 50',
      category: 'progression',
      rarity: 'rare',
      icon: '⭐',
      unlocked: true,
      progress: 50,
      target: 50,
      unlockedDate: '2025-01-22',
      reward: { type: 'token', amount: 750 },
    },
    {
      id: 'a10',
      name: 'Elite Trader',
      description: 'Reach level 100',
      category: 'progression',
      rarity: 'epic',
      icon: '💎',
      unlocked: false,
      progress: 73,
      target: 100,
      reward: { type: 'badge', amount: 1 },
    },
    {
      id: 'a11',
      name: 'Grandmaster',
      description: 'Reach max level',
      category: 'progression',
      rarity: 'legendary',
      icon: '🏆',
      unlocked: false,
      progress: 73,
      target: 200,
      reward: { type: 'title', amount: 1 },
    },

    // Special Achievements
    {
      id: 'a12',
      name: 'Early Adopter',
      description: 'Join during beta period',
      category: 'special',
      rarity: 'rare',
      icon: '🚀',
      unlocked: true,
      progress: 1,
      target: 1,
      unlockedDate: '2025-01-15',
      reward: { type: 'badge', amount: 1 },
    },
    {
      id: 'a13',
      name: 'Lucky Trader',
      description: 'Win 10 trades in a row',
      category: 'special',
      rarity: 'epic',
      icon: '🍀',
      unlocked: false,
      progress: 7,
      target: 10,
      reward: { type: 'token', amount: 2000 },
    },
    {
      id: 'a14',
      name: 'Prophet',
      description: 'Predict market correctly 100 times',
      category: 'special',
      rarity: 'legendary',
      icon: '🔮',
      unlocked: false,
      progress: 68,
      target: 100,
      reward: { type: 'title', amount: 1 },
    },
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-slate-400';
      case 'rare':
        return 'text-blue-400';
      case 'epic':
        return 'text-purple-400';
      case 'legendary':
        return 'text-amber-400';
      default:
        return 'text-slate-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-slate-500/20 border-slate-500';
      case 'rare':
        return 'bg-blue-500/20 border-blue-500';
      case 'epic':
        return 'bg-purple-500/20 border-purple-500';
      case 'legendary':
        return 'bg-amber-500/20 border-amber-500';
      default:
        return 'bg-slate-500/20 border-slate-500';
    }
  };

  const filteredAchievements =
    selectedCategory === 'all'
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;
  const completionPercent = Math.floor(
    (unlockedAchievements / totalAchievements) * 100
  );

  const rareCounts = {
    common: achievements.filter((a) => a.unlocked && a.rarity === 'common')
      .length,
    rare: achievements.filter((a) => a.unlocked && a.rarity === 'rare').length,
    epic: achievements.filter((a) => a.unlocked && a.rarity === 'epic').length,
    legendary: achievements.filter(
      (a) => a.unlocked && a.rarity === 'legendary'
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-xl">
            <Award className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Achievement Showcase
            </h1>
            <p className="text-slate-400">
              Showcase your accomplishments and rare badges
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-indigo-400" />
              <span className="text-slate-400 text-sm">Total</span>
            </div>
            <div className="text-3xl font-bold">
              {unlockedAchievements}/{totalAchievements}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-slate-400" />
              <span className="text-slate-400 text-sm">Common</span>
            </div>
            <div className="text-3xl font-bold text-slate-400">
              {rareCounts.common}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400 text-sm">Rare</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">
              {rareCounts.rare}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-purple-400" />
              <span className="text-slate-400 text-sm">Epic</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">
              {rareCounts.epic}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-amber-400" />
              <span className="text-slate-400 text-sm">Legendary</span>
            </div>
            <div className="text-3xl font-bold text-amber-400">
              {rareCounts.legendary}
            </div>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Overall Completion</h2>
            <span className="text-2xl font-bold text-indigo-400">
              {completionPercent}%
            </span>
          </div>
          <div className="h-6 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all flex items-center justify-end pr-3"
              style={{ width: `${completionPercent}%` }}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(
            ['all', 'trading', 'social', 'progression', 'special'] as const
          ).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-indigo-600'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              onClick={() => setSelectedAchievement(achievement)}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                achievement.unlocked
                  ? `${getRarityBg(achievement.rarity)} hover:scale-105`
                  : 'bg-slate-800/30 border-slate-700 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                {achievement.unlocked ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <Lock className="w-6 h-6 text-slate-600" />
                )}
              </div>

              <h3
                className={`text-xl font-bold mb-2 ${
                  achievement.unlocked
                    ? getRarityColor(achievement.rarity)
                    : 'text-slate-600'
                }`}
              >
                {achievement.name}
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                {achievement.description}
              </p>

              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${getRarityBg(
                  achievement.rarity
                )}`}
              >
                {achievement.rarity.toUpperCase()}
              </div>

              {!achievement.unlocked && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-bold">
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all"
                      style={{
                        width: `${
                          (achievement.progress / achievement.target) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {achievement.unlocked && achievement.unlockedDate && (
                <div className="text-xs text-slate-500">
                  Unlocked: {achievement.unlockedDate}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Achievement Detail Modal */}
        {selectedAchievement && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <div
              className={`rounded-xl p-8 border-2 max-w-md w-full ${getRarityBg(
                selectedAchievement.rarity
              )}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-8xl mb-4">
                  {selectedAchievement.unlocked
                    ? selectedAchievement.icon
                    : '🔒'}
                </div>
                <div
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 ${getRarityBg(
                    selectedAchievement.rarity
                  )}`}
                >
                  {selectedAchievement.rarity.toUpperCase()}
                </div>
                <h2
                  className={`text-3xl font-bold mb-2 ${getRarityColor(
                    selectedAchievement.rarity
                  )}`}
                >
                  {selectedAchievement.name}
                </h2>
                <p className="text-slate-300 mb-4">
                  {selectedAchievement.description}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-bold capitalize">
                    {selectedAchievement.category}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-400">Reward:</span>
                  <span className="font-bold">
                    {selectedAchievement.reward.amount}{' '}
                    {selectedAchievement.reward.type.toUpperCase()}
                  </span>
                </div>
                {selectedAchievement.unlocked &&
                  selectedAchievement.unlockedDate && (
                    <div className="flex justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-slate-400">Unlocked:</span>
                      <span className="font-bold">
                        {selectedAchievement.unlockedDate}
                      </span>
                    </div>
                  )}
                {!selectedAchievement.unlocked && (
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Progress:</span>
                      <span className="font-bold">
                        {selectedAchievement.progress}/
                        {selectedAchievement.target}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600"
                        style={{
                          width: `${
                            (selectedAchievement.progress /
                              selectedAchievement.target) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedAchievement(null)}
                className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold"
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
