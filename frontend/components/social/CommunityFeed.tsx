'use client';

import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import { formatDate } from '@/lib/utils/formatDate';
import { useState } from 'react';

interface Activity {
  id: string;
  type: 'trade' | 'comment' | 'market_created' | 'win';
  user: string;
  userAddress: string;
  content: string;
  marketName?: string;
  timestamp: number;
}

export default function CommunityFeed() {
  const [filter, setFilter] = useState<'all' | 'trades' | 'comments' | 'wins'>('all');

  const activities: Activity[] = [
    {
      id: '1',
      type: 'win',
      user: 'CryptoKing',
      userAddress: '0x1234...5678',
      content: 'won $500 on',
      marketName: 'Will Bitcoin reach $100k by EOY?',
      timestamp: Date.now() - 1800000,
    },
    {
      id: '2',
      type: 'trade',
      user: 'MarketMaker',
      userAddress: '0x2345...6789',
      content: 'bought 100 YES shares in',
      marketName: 'Will ETH reach $5k by March?',
      timestamp: Date.now() - 3600000,
    },
    {
      id: '3',
      type: 'comment',
      user: 'PredictPro',
      userAddress: '0x3456...7890',
      content: 'commented on',
      marketName: 'Will SOL reach $200 by Q2?',
      timestamp: Date.now() - 5400000,
    },
    {
      id: '4',
      type: 'market_created',
      user: 'TradeWizard',
      userAddress: '0x4567...8901',
      content: 'created a new market:',
      marketName: 'Will Apple reach $200 by Q3?',
      timestamp: Date.now() - 7200000,
    },
  ];

  const filteredActivities = activities.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'trades') return a.type === 'trade';
    if (filter === 'comments') return a.type === 'comment';
    if (filter === 'wins') return a.type === 'win';
    return true;
  });

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'trade': return '📈';
      case 'comment': return '💬';
      case 'market_created': return '✨';
      case 'win': return '🎉';
      default: return '📊';
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">Community Feed</h2>

      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'primary' : 'secondary'}
          className="text-sm"
        >
          All Activity
        </Button>
        <Button
          onClick={() => setFilter('trades')}
          variant={filter === 'trades' ? 'primary' : 'secondary'}
          className="text-sm"
        >
          Trades
        </Button>
        <Button
          onClick={() => setFilter('comments')}
          variant={filter === 'comments' ? 'primary' : 'secondary'}
          className="text-sm"
        >
          Comments
        </Button>
        <Button
          onClick={() => setFilter('wins')}
          variant={filter === 'wins' ? 'primary' : 'secondary'}
          className="text-sm"
        >
          Wins
        </Button>
      </div>

      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Avatar fallback={activity.user[0]} size="sm" />
                <span className="font-semibold">{activity.user}</span>
                <span className="text-gray-500">{activity.content}</span>
              </div>
              {activity.marketName && (
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                  {activity.marketName}
                </p>
              )}
              <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
