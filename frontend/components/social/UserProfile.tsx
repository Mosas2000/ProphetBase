'use client';

import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useState } from 'react';

interface UserProfileProps {
  address: string;
  isOwnProfile?: boolean;
}

interface UserStats {
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  marketsTraded: number;
  followers: number;
  following: number;
  rank: number;
}

export default function UserProfile({ address, isOwnProfile = false }: UserProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'positions' | 'history' | 'achievements'>('positions');

  // Mock user data
  const stats: UserStats = {
    totalTrades: 234,
    winRate: 68.5,
    totalProfit: 1250.50,
    marketsTraded: 45,
    followers: 156,
    following: 89,
    rank: 12,
  };

  const achievements = [
    { id: 1, name: 'First Trade', icon: '🎯', unlocked: true },
    { id: 2, name: 'Profit Master', icon: '💰', unlocked: true },
    { id: 3, name: 'Top 100', icon: '🏆', unlocked: true },
    { id: 4, name: 'Win Streak', icon: '🔥', unlocked: false },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start gap-4 mb-6">
          <Avatar fallback={address.slice(2, 4).toUpperCase()} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold">Trader #{stats.rank}</h2>
              <Badge variant="blue">Verified</Badge>
            </div>
            <p className="text-sm text-gray-500 font-mono">{address}</p>
            <div className="flex gap-4 mt-3 text-sm">
              <div>
                <span className="font-bold">{stats.followers}</span>
                <span className="text-gray-500 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold">{stats.following}</span>
                <span className="text-gray-500 ml-1">Following</span>
              </div>
            </div>
          </div>
          {!isOwnProfile && (
            <Button
              onClick={() => setIsFollowing(!isFollowing)}
              variant={isFollowing ? 'secondary' : 'primary'}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Trades</div>
            <div className="text-2xl font-bold">{stats.totalTrades}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Win Rate</div>
            <div className="text-2xl font-bold text-green-600">{stats.winRate}%</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Profit</div>
            <div className="text-2xl font-bold text-green-600">${stats.totalProfit}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Markets</div>
            <div className="text-2xl font-bold">{stats.marketsTraded}</div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'positions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Active Positions
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Trade History
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'achievements'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Achievements
          </button>
        </div>

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg text-center ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
                    : 'bg-gray-100 dark:bg-gray-800 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="font-medium text-sm">{achievement.name}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'positions' && (
          <p className="text-center text-gray-500 py-8">No active positions</p>
        )}

        {activeTab === 'history' && (
          <p className="text-center text-gray-500 py-8">No trade history</p>
        )}
      </Card>
    </div>
  );
}
