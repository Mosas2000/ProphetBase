'use client';

import { useState } from 'react';

interface UserProfile {
  address: string;
  username: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  stats: {
    totalTrades: number;
    winRate: number;
    totalVolume: number;
    totalProfit: number;
    marketsCreated: number;
    followers: number;
    following: number;
  };
  badges: Badge[];
  recentActivity: Activity[];
  preferences: {
    isPublic: boolean;
    showBalance: boolean;
    allowCopyTrade: boolean;
  };
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate: string;
}

interface Activity {
  id: string;
  type: 'trade' | 'market_created' | 'achievement' | 'follow';
  description: string;
  timestamp: number;
  marketId?: string;
}

export default function UserProfiles() {
  const [profile, setProfile] = useState<UserProfile>({
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    username: 'ProphetMaster',
    avatar: '🎯',
    bio: 'Professional prediction market trader. Specializing in crypto and tech markets. Always DYOR! 📊',
    joinedDate: '2024-01-15',
    stats: {
      totalTrades: 1247,
      winRate: 68.5,
      totalVolume: 125000,
      totalProfit: 18750,
      marketsCreated: 23,
      followers: 892,
      following: 156
    },
    badges: [
      {
        id: '1',
        name: 'Veteran Trader',
        icon: '⭐',
        description: 'Completed 1000+ trades',
        rarity: 'epic',
        earnedDate: '2024-03-01'
      },
      {
        id: '2',
        name: 'Market Maker',
        icon: '🏭',
        description: 'Created 20+ markets',
        rarity: 'rare',
        earnedDate: '2024-02-15'
      },
      {
        id: '3',
        name: 'Diamond Hands',
        icon: '💎',
        description: 'Held position for 30+ days',
        rarity: 'legendary',
        earnedDate: '2024-04-01'
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'trade',
        description: 'Bought 500 YES shares in "BTC reaches $100k"',
        timestamp: Date.now() - 3600000,
        marketId: '42'
      },
      {
        id: '2',
        type: 'achievement',
        description: 'Earned "Veteran Trader" badge',
        timestamp: Date.now() - 86400000
      },
      {
        id: '3',
        type: 'market_created',
        description: 'Created market "ETH 2.0 staking reaches 40M"',
        timestamp: Date.now() - 172800000,
        marketId: '89'
      }
    ],
    preferences: {
      isPublic: true,
      showBalance: true,
      allowCopyTrade: true
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'badges' | 'settings'>('overview');

  const rarityColors = {
    common: 'bg-gray-200 text-gray-700',
    rare: 'bg-blue-200 text-blue-700',
    epic: 'bg-purple-200 text-purple-700',
    legendary: 'bg-yellow-200 text-yellow-700'
  };

  const saveProfile = () => {
    // Save profile logic here
    setIsEditing(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const diff = Date.now() - timestamp;
    
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 pb-6 border-b">
        <div className="flex items-start space-x-4">
          <div className="text-6xl">{profile.avatar}</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{profile.username}</h1>
            <p className="text-sm text-gray-500 font-mono">{profile.address.slice(0, 10)}...{profile.address.slice(-8)}</p>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            ) : (
              <p className="mt-2 text-gray-700">{profile.bio}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">Joined {new Date(profile.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={saveProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{profile.stats.totalTrades.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Trades</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{profile.stats.winRate}%</div>
          <div className="text-sm text-gray-600">Win Rate</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">${profile.stats.totalVolume.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Volume</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">${profile.stats.totalProfit.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Profit</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-gray-900">{profile.stats.marketsCreated}</div>
          <div className="text-sm text-gray-600">Markets Created</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-gray-900">{profile.stats.followers.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Followers</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-gray-900">{profile.stats.following}</div>
          <div className="text-sm text-gray-600">Following</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 border-b">
        {(['overview', 'activity', 'badges', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {profile.recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">
                  {activity.type === 'trade' && '📊'}
                  {activity.type === 'market_created' && '🏭'}
                  {activity.type === 'achievement' && '🏆'}
                  {activity.type === 'follow' && '👥'}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">{formatDate(activity.timestamp)}</p>
                </div>
                {activity.marketId && (
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    View Market →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earned Badges ({profile.badges.length})</h3>
          <div className="grid grid-cols-3 gap-4">
            {profile.badges.map(badge => (
              <div key={badge.id} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 transition-colors">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-1">{badge.name}</h4>
                <span className={`inline-block text-xs px-2 py-1 rounded-full mb-2 ${rarityColors[badge.rarity]}`}>
                  {badge.rarity}
                </span>
                <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                <p className="text-xs text-gray-500">Earned {new Date(badge.earnedDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Public Profile</h4>
                <p className="text-sm text-gray-600">Allow others to view your profile and stats</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.preferences.isPublic}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, isPublic: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Show Balance</h4>
                <p className="text-sm text-gray-600">Display your wallet balance on your profile</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.preferences.showBalance}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, showBalance: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Allow Copy Trading</h4>
                <p className="text-sm text-gray-600">Let others automatically copy your trades</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.preferences.allowCopyTrade}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, allowCopyTrade: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
