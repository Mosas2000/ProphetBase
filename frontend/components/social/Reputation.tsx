'use client';

import { useState } from 'react';

interface ReputationLevel {
  level: number;
  name: string;
  minScore: number;
  color: string;
  icon: string;
  benefits: string[];
}

interface UserReputation {
  score: number;
  level: ReputationLevel;
  nextLevel: ReputationLevel;
  progressToNext: number;
  breakdown: {
    trading: number;
    marketCreation: number;
    community: number;
    accuracy: number;
    longevity: number;
  };
  achievements: Achievement[];
  history: ReputationEvent[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earnedDate: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ReputationEvent {
  id: string;
  type: 'gain' | 'loss';
  points: number;
  reason: string;
  timestamp: number;
}

export default function Reputation() {
  const levels: ReputationLevel[] = [
    {
      level: 1,
      name: 'Novice',
      minScore: 0,
      color: '#9CA3AF',
      icon: '🌱',
      benefits: ['Access to basic markets', 'Community chat']
    },
    {
      level: 2,
      name: 'Trader',
      minScore: 100,
      color: '#60A5FA',
      icon: '📊',
      benefits: ['Reduced fees (0.9%)', 'Create basic markets']
    },
    {
      level: 3,
      name: 'Expert',
      minScore: 500,
      color: '#8B5CF6',
      icon: '🎯',
      benefits: ['Reduced fees (0.7%)', 'Priority support', 'Advanced markets']
    },
    {
      level: 4,
      name: 'Master',
      minScore: 1500,
      color: '#F59E0B',
      icon: '👑',
      benefits: ['Reduced fees (0.5%)', 'Market maker badge', 'Exclusive tournaments']
    },
    {
      level: 5,
      name: 'Legend',
      minScore: 5000,
      color: '#EF4444',
      icon: '⭐',
      benefits: ['No fees', 'VIP support', 'Revenue share', 'Governance rights']
    }
  ];

  const [reputation] = useState<UserReputation>({
    score: 847,
    level: levels[2],
    nextLevel: levels[3],
    progressToNext: ((847 - 500) / (1500 - 500)) * 100,
    breakdown: {
      trading: 320,
      marketCreation: 180,
      community: 145,
      accuracy: 152,
      longevity: 50
    },
    achievements: [
      {
        id: '1',
        name: 'First Trade',
        description: 'Completed your first trade',
        icon: '🎯',
        points: 10,
        earnedDate: '2024-01-15',
        rarity: 'common'
      },
      {
        id: '2',
        name: 'Century Club',
        description: 'Completed 100 trades',
        icon: '💯',
        points: 50,
        earnedDate: '2024-02-20',
        rarity: 'rare'
      },
      {
        id: '3',
        name: 'Profit Prophet',
        description: 'Achieved 70% win rate over 50 trades',
        icon: '🔮',
        points: 100,
        earnedDate: '2024-03-10',
        rarity: 'epic'
      },
      {
        id: '4',
        name: 'Market Maker',
        description: 'Created 10 markets',
        icon: '🏭',
        points: 75,
        earnedDate: '2024-03-25',
        rarity: 'rare'
      }
    ],
    history: [
      {
        id: '1',
        type: 'gain',
        points: 25,
        reason: 'Won trade with 80% accuracy',
        timestamp: Date.now() - 3600000
      },
      {
        id: '2',
        type: 'gain',
        points: 15,
        reason: 'Helpful community contribution',
        timestamp: Date.now() - 7200000
      },
      {
        id: '3',
        type: 'loss',
        points: -10,
        reason: 'Flagged for suspicious activity (cleared)',
        timestamp: Date.now() - 86400000
      }
    ]
  });

  const rarityColors = {
    common: 'bg-gray-200 text-gray-700 border-gray-300',
    rare: 'bg-blue-200 text-blue-700 border-blue-300',
    epic: 'bg-purple-200 text-purple-700 border-purple-300',
    legendary: 'bg-yellow-200 text-yellow-700 border-yellow-300'
  };

  const formatDate = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reputation System</h2>
        <p className="text-sm text-gray-600">Build your reputation through trading, accuracy, and community involvement</p>
      </div>

      {/* Current Level Card */}
      <div
        className="relative p-6 rounded-lg mb-6 border-2"
        style={{
          background: `linear-gradient(135deg, ${reputation.level.color}20 0%, ${reputation.level.color}05 100%)`,
          borderColor: reputation.level.color
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-6xl">{reputation.level.icon}</div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Current Level</div>
              <h3 className="text-3xl font-bold text-gray-900">{reputation.level.name}</h3>
              <p className="text-sm text-gray-600 mt-1">Level {reputation.level.level}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold" style={{ color: reputation.level.color }}>
              {reputation.score}
            </div>
            <div className="text-sm text-gray-600">Reputation Points</div>
          </div>
        </div>

        {/* Progress to Next Level */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Progress to {reputation.nextLevel.name}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {reputation.score} / {reputation.nextLevel.minScore}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${reputation.progressToNext}%`,
                background: `linear-gradient(90deg, ${reputation.level.color}, ${reputation.nextLevel.color})`
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.ceil(reputation.nextLevel.minScore - reputation.score)} points to next level
          </div>
        </div>

        {/* Current Benefits */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-2">Current Benefits:</div>
          <div className="flex flex-wrap gap-2">
            {reputation.level.benefits.map((benefit, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white rounded-full text-sm border-2"
                style={{ borderColor: reputation.level.color, color: reputation.level.color }}
              >
                ✓ {benefit}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Reputation Breakdown */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reputation Breakdown</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(reputation.breakdown).map(([key, value]) => (
            <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-600 capitalize">{key}</div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((value / reputation.score) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Achievements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Achievements ({reputation.achievements.length})
          </h3>
          <div className="space-y-3">
            {reputation.achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${rarityColors[achievement.rarity]}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                      <span className="text-sm font-bold">+{achievement.points}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{achievement.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs capitalize px-2 py-1 rounded-full bg-white/50">
                        {achievement.rarity}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(achievement.earnedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {reputation.history.map(event => (
              <div
                key={event.id}
                className={`p-4 rounded-lg ${
                  event.type === 'gain' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{event.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(event.timestamp)}</p>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      event.type === 'gain' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {event.type === 'gain' ? '+' : ''}{event.points}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All Levels */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Levels</h3>
            <div className="space-y-2">
              {levels.map(level => (
                <div
                  key={level.level}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    reputation.score >= level.minScore
                      ? 'opacity-100'
                      : 'opacity-50'
                  }`}
                  style={{
                    borderColor: reputation.score >= level.minScore ? level.color : '#E5E7EB',
                    background: reputation.score >= level.minScore ? `${level.color}10` : '#F9FAFB'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{level.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{level.name}</div>
                        <div className="text-xs text-gray-600">{level.minScore}+ points</div>
                      </div>
                    </div>
                    {reputation.score >= level.minScore && (
                      <div className="text-green-600 text-xl">✓</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
