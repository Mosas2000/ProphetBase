'use client';

import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useState } from 'react';

interface Trader {
  address: string;
  username: string;
  followers: number;
  winRate: number;
  totalProfit: number;
  isFollowing: boolean;
}

interface FollowListProps {
  type: 'followers' | 'following';
}

export default function FollowList({ type }: FollowListProps) {
  const [traders, setTraders] = useState<Trader[]>([
    {
      address: '0x1234...5678',
      username: 'CryptoKing',
      followers: 1234,
      winRate: 78.5,
      totalProfit: 5420,
      isFollowing: true,
    },
    {
      address: '0x2345...6789',
      username: 'MarketMaster',
      followers: 987,
      winRate: 75.2,
      totalProfit: 4890,
      isFollowing: true,
    },
    {
      address: '0x3456...7890',
      username: 'PredictPro',
      followers: 756,
      winRate: 72.8,
      totalProfit: 4125,
      isFollowing: false,
    },
  ]);

  const toggleFollow = (address: string) => {
    setTraders(traders.map(t => 
      t.address === address ? { ...t, isFollowing: !t.isFollowing } : t
    ));
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">
        {type === 'followers' ? 'Followers' : 'Following'}
      </h2>

      <div className="space-y-3">
        {traders.map((trader) => (
          <div
            key={trader.address}
            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <Avatar fallback={trader.username[0]} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{trader.username}</h4>
                {trader.winRate > 75 && (
                  <Badge variant="yellow">Top Trader</Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 font-mono mb-2">{trader.address}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {trader.followers} followers
                </span>
                <span className="text-green-600">
                  {trader.winRate}% win rate
                </span>
                <span className="text-blue-600">
                  ${trader.totalProfit.toLocaleString()} profit
                </span>
              </div>
            </div>
            <Button
              onClick={() => toggleFollow(trader.address)}
              variant={trader.isFollowing ? 'secondary' : 'primary'}
              className="text-sm"
            >
              {trader.isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          </div>
        ))}
      </div>

      {traders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
          </p>
        </div>
      )}
    </Card>
  );
}
