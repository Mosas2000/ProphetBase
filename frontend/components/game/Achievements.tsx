'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: number;
}

export function Achievements() {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'First Trade',
      description: 'Complete your first prediction',
      icon: '🎯',
      rarity: 'common',
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      reward: 100,
    },
    {
      id: '2',
      name: 'Market Maven',
      description: 'Trade in 10 different markets',
      icon: '📊',
      rarity: 'rare',
      unlocked: true,
      progress: 10,
      maxProgress: 10,
      reward: 500,
    },
    {
      id: '3',
      name: 'Profit Prophet',
      description: 'Earn $1,000 in total profits',
      icon: '💰',
      rarity: 'epic',
      unlocked: false,
      progress: 650,
      maxProgress: 1000,
      reward: 1000,
    },
    {
      id: '4',
      name: 'Diamond Hands',
      description: 'Hold a position for 30 days',
      icon: '💎',
      rarity: 'legendary',
      unlocked: false,
      progress: 15,
      maxProgress: 30,
      reward: 5000,
    },
    {
      id: '5',
      name: 'Early Bird',
      description: 'Be among first 10 traders in a market',
      icon: '🐦',
      rarity: 'rare',
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      reward: 750,
    },
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-600';
      case 'rare': return 'text-blue-400 border-blue-600';
      case 'epic': return 'text-purple-400 border-purple-600';
      case 'legendary': return 'text-yellow-400 border-yellow-600';
    }
  };

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    points: achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.reward, 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Achievement Progress</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Unlocked</p>
              <p className="text-2xl font-bold">{stats.unlocked}/{stats.total}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Completion</p>
              <p className="text-2xl font-bold">{Math.round((stats.unlocked / stats.total) * 100)}%</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Points Earned</p>
              <p className="text-2xl font-bold">{stats.points}</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {(['all', 'unlocked', 'locked'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Achievements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map(achievement => (
          <Card key={achievement.id}>
            <div className={`p-6 ${!achievement.unlocked && 'opacity-60'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-semibold mb-1">{achievement.name}</h4>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </div>
                </div>
                <Badge variant={achievement.unlocked ? 'success' : 'default'} className={getRarityColor(achievement.rarity)}>
                  {achievement.rarity}
                </Badge>
              </div>

              {/* Progress */}
              {!achievement.unlocked && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-medium">{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Reward */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Reward</span>
                <span className="font-bold text-yellow-400">+{achievement.reward} XP</span>
              </div>

              {achievement.unlocked && (
                <div className="mt-3 text-center">
                  <Badge variant="success">✓ Unlocked</Badge>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Badge Showcase */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Badge Showcase</h4>
          <div className="flex gap-4 flex-wrap">
            {achievements.filter(a => a.unlocked).map(a => (
              <div key={a.id} className="text-center">
                <div className={`w-16 h-16 rounded-full border-2 ${getRarityColor(a.rarity)} flex items-center justify-center text-3xl bg-gray-800`}>
                  {a.icon}
                </div>
                <p className="text-xs mt-2 text-gray-400">{a.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
