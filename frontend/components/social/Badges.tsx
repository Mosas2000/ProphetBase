'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  requirement?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function Badges() {
  const badges: BadgeItem[] = [
    {
      id: '1',
      name: 'First Trade',
      description: 'Complete your first trade',
      icon: '🎯',
      unlocked: true,
      rarity: 'common',
    },
    {
      id: '2',
      name: 'Profit Master',
      description: 'Earn $1,000 in total profits',
      icon: '💰',
      unlocked: true,
      progress: 100,
      requirement: '$1,000',
      rarity: 'rare',
    },
    {
      id: '3',
      name: 'Top 100',
      description: 'Reach top 100 on the leaderboard',
      icon: '🏆',
      unlocked: true,
      rarity: 'epic',
    },
    {
      id: '4',
      name: 'Win Streak',
      description: 'Win 10 markets in a row',
      icon: '🔥',
      unlocked: false,
      progress: 60,
      requirement: '6/10 wins',
      rarity: 'epic',
    },
    {
      id: '5',
      name: 'Diamond Hands',
      description: 'Hold a position for 30+ days',
      icon: '💎',
      unlocked: false,
      progress: 40,
      requirement: '12/30 days',
      rarity: 'rare',
    },
    {
      id: '6',
      name: 'Market Creator',
      description: 'Create 5 markets',
      icon: '✨',
      unlocked: false,
      progress: 20,
      requirement: '1/5 markets',
      rarity: 'common',
    },
    {
      id: '7',
      name: 'Legendary Trader',
      description: 'Reach #1 on the all-time leaderboard',
      icon: '👑',
      unlocked: false,
      progress: 0,
      requirement: 'Rank #1',
      rarity: 'legendary',
    },
    {
      id: '8',
      name: 'Community Leader',
      description: 'Get 100 followers',
      icon: '👥',
      unlocked: false,
      progress: 75,
      requirement: '75/100 followers',
      rarity: 'rare',
    },
  ];

  const getRarityColor = (rarity: BadgeItem['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-600';
    }
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Achievement Badges</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {unlockedCount} of {badges.length} badges unlocked
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`relative p-6 rounded-lg text-center transition-all ${
              badge.unlocked
                ? `bg-gradient-to-br ${getRarityColor(badge.rarity)} text-white shadow-lg`
                : 'bg-gray-100 dark:bg-gray-800 opacity-60'
            }`}
          >
            {badge.unlocked && (
              <div className="absolute top-2 right-2">
                <Badge variant="green" className="text-xs">✓</Badge>
              </div>
            )}
            
            <div className="text-5xl mb-3">{badge.icon}</div>
            <h3 className="font-bold mb-1">{badge.name}</h3>
            <p className={`text-xs mb-2 ${badge.unlocked ? 'text-white/90' : 'text-gray-500'}`}>
              {badge.description}
            </p>
            
            {!badge.unlocked && badge.progress !== undefined && (
              <div className="mt-3">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{badge.requirement}</p>
              </div>
            )}
            
            {badge.unlocked && (
              <Badge variant={badge.rarity} className="mt-2 capitalize">
                {badge.rarity}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
