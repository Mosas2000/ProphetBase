'use client';

import { useState } from 'react';

interface FeedItem {
  id: string;
  type: 'trade' | 'market_created' | 'resolved' | 'whale_alert' | 'streak';
  user: {
    address: string;
    username: string;
    avatar: string;
  };
  timestamp: number;
  data: any;
}

export default function TradingFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([
    {
      id: '1',
      type: 'whale_alert',
      user: {
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        username: 'WhaleTrader',
        avatar: '🐋'
      },
      timestamp: Date.now() - 30000,
      data: {
        marketId: '42',
        marketQuestion: 'Will BTC reach $100k by EOY?',
        outcome: 'YES',
        amount: 50000,
        shares: 45000
      }
    },
    {
      id: '2',
      type: 'trade',
      user: {
        address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
        username: 'SmartTrader',
        avatar: '🎯'
      },
      timestamp: Date.now() - 120000,
      data: {
        marketId: '89',
        marketQuestion: 'ETH 2.0 staking reaches 40M?',
        outcome: 'NO',
        amount: 1200,
        shares: 1100
      }
    },
    {
      id: '3',
      type: 'market_created',
      user: {
        address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
        username: 'MarketMaker',
        avatar: '🏭'
      },
      timestamp: Date.now() - 300000,
      data: {
        marketId: '127',
        marketQuestion: 'Will AI reach AGI by 2030?',
        initialLiquidity: 5000,
        category: 'Technology'
      }
    },
    {
      id: '4',
      type: 'resolved',
      user: {
        address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
        username: 'Oracle',
        avatar: '🔮'
      },
      timestamp: Date.now() - 600000,
      data: {
        marketId: '78',
        marketQuestion: 'Tesla Q4 deliveries exceed 500k?',
        winningOutcome: 'YES',
        totalVolume: 125000,
        traders: 847
      }
    },
    {
      id: '5',
      type: 'streak',
      user: {
        address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        username: 'LuckyStreak',
        avatar: '🔥'
      },
      timestamp: Date.now() - 900000,
      data: {
        wins: 15,
        profit: 8500
      }
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'trades' | 'markets' | 'whales'>('all');

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const filteredFeed = feed.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'trades') return item.type === 'trade';
    if (filter === 'markets') return item.type === 'market_created' || item.type === 'resolved';
    if (filter === 'whales') return item.type === 'whale_alert';
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trading Feed</h2>
          <p className="text-sm text-gray-600">Real-time market activity</p>
        </div>
        
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          {(['all', 'trades', 'markets', 'whales'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md capitalize transition-colors ${
                filter === f
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredFeed.map(item => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            {item.type === 'whale_alert' && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{item.user.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{item.user.username}</span>
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                        🐋 WHALE ALERT
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Bought <span className="font-semibold text-green-600">{item.data.outcome}</span> shares for{' '}
                      <span className="font-semibold">${item.data.amount.toLocaleString()}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{formatTime(item.timestamp)}</span>
                </div>
                <div className="ml-10 p-3 bg-white rounded border-l-4 border-purple-500">
                  <p className="text-sm text-gray-700 mb-1">{item.data.marketQuestion}</p>
                  <p className="text-xs text-gray-500">
                    Market #{item.data.marketId} • {item.data.shares.toLocaleString()} shares acquired
                  </p>
                </div>
              </div>
            )}

            {item.type === 'trade' && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{item.user.avatar}</span>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">{item.user.username}</span>
                    <p className="text-sm text-gray-600">
                      Bought <span className="font-semibold text-red-600">{item.data.outcome}</span> shares for{' '}
                      <span className="font-semibold">${item.data.amount.toLocaleString()}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{formatTime(item.timestamp)}</span>
                </div>
                <div className="ml-10 p-3 bg-white rounded">
                  <p className="text-sm text-gray-700">{item.data.marketQuestion}</p>
                  <p className="text-xs text-gray-500 mt-1">Market #{item.data.marketId}</p>
                </div>
              </div>
            )}

            {item.type === 'market_created' && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{item.user.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{item.user.username}</span>
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        Created Market
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Added ${item.data.initialLiquidity.toLocaleString()} initial liquidity
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{formatTime(item.timestamp)}</span>
                </div>
                <div className="ml-10 p-3 bg-white rounded border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700 mb-1">{item.data.marketQuestion}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      {item.data.category}
                    </span>
                    <span className="text-xs text-gray-500">Market #{item.data.marketId}</span>
                  </div>
                </div>
              </div>
            )}

            {item.type === 'resolved' && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{item.user.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{item.user.username}</span>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        Market Resolved
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Winner: <span className="font-semibold text-green-600">{item.data.winningOutcome}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{formatTime(item.timestamp)}</span>
                </div>
                <div className="ml-10 p-3 bg-white rounded border-l-4 border-green-500">
                  <p className="text-sm text-gray-700 mb-2">{item.data.marketQuestion}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>💰 ${item.data.totalVolume.toLocaleString()} volume</span>
                    <span>👥 {item.data.traders} traders</span>
                    <span>Market #{item.data.marketId}</span>
                  </div>
                </div>
              </div>
            )}

            {item.type === 'streak' && (
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{item.user.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{item.user.username}</span>
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                        🔥 {item.data.wins} Win Streak
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Total profit: <span className="font-semibold text-green-600">${item.data.profit.toLocaleString()}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{formatTime(item.timestamp)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
          Load More Activity
        </button>
      </div>
    </div>
  );
}
