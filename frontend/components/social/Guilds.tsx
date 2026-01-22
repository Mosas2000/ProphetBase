'use client';

import { useState } from 'react';

interface Guild {
  id: string;
  name: string;
  description: string;
  icon: string;
  banner: string;
  members: number;
  level: number;
  totalVolume: number;
  avgWinRate: number;
  category: 'trading' | 'research' | 'social' | 'competitive';
  isPrivate: boolean;
  requirements: {
    minWinRate?: number;
    minVolume?: number;
    minTrades?: number;
  };
}

interface GuildMember {
  address: string;
  username: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member';
  contribution: number;
  joinedDate: string;
}

export default function Guilds() {
  const [guilds, setGuilds] = useState<Guild[]>([
    {
      id: '1',
      name: 'Diamond Traders',
      description:
        'Elite traders with 70%+ win rate. Exclusive strategies and signals.',
      icon: '💎',
      banner: '#8B5CF6',
      members: 247,
      level: 15,
      totalVolume: 5800000,
      avgWinRate: 73.2,
      category: 'trading',
      isPrivate: true,
      requirements: { minWinRate: 70, minVolume: 100000, minTrades: 500 },
    },
    {
      id: '2',
      name: 'Crypto Prophets',
      description:
        'Focused on cryptocurrency and blockchain markets. Daily alpha calls.',
      icon: '🔮',
      banner: '#3B82F6',
      members: 892,
      level: 23,
      totalVolume: 12500000,
      avgWinRate: 68.5,
      category: 'research',
      isPrivate: false,
      requirements: { minTrades: 100 },
    },
    {
      id: '3',
      name: 'Whale Watch',
      description:
        'High-volume traders sharing whale alerts and market movements.',
      icon: '🐋',
      banner: '#10B981',
      members: 156,
      level: 18,
      totalVolume: 8900000,
      avgWinRate: 65.8,
      category: 'trading',
      isPrivate: true,
      requirements: { minVolume: 500000 },
    },
    {
      id: '4',
      name: 'Beginners United',
      description:
        'Learn and grow together. Mentorship and educational resources.',
      icon: '🌱',
      banner: '#F59E0B',
      members: 1547,
      level: 8,
      totalVolume: 2100000,
      avgWinRate: 58.3,
      category: 'social',
      isPrivate: false,
      requirements: {},
    },
  ]);

  const [myGuilds] = useState<string[]>(['2', '4']);
  const [filter, setFilter] = useState<
    'all' | 'trading' | 'research' | 'social' | 'competitive'
  >('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);

  const filteredGuilds = guilds.filter(
    (g) => filter === 'all' || g.category === filter
  );

  const meetsRequirements = (guild: Guild) => {
    // Mock user stats for demo
    const userStats = { winRate: 65, volume: 150000, trades: 300 };

    if (
      guild.requirements.minWinRate &&
      userStats.winRate < guild.requirements.minWinRate
    )
      return false;
    if (
      guild.requirements.minVolume &&
      userStats.volume < guild.requirements.minVolume
    )
      return false;
    if (
      guild.requirements.minTrades &&
      userStats.trades < guild.requirements.minTrades
    )
      return false;

    return true;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trading Guilds</h2>
          <p className="text-sm text-gray-600">
            Join communities and trade together
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Guild
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 mb-6">
        {(['all', 'trading', 'research', 'social', 'competitive'] as const).map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          )
        )}
      </div>

      {/* My Guilds */}
      {myGuilds.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            My Guilds
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {guilds
              .filter((g) => myGuilds.includes(g.id))
              .map((guild) => (
                <div
                  key={guild.id}
                  className="relative p-6 rounded-lg border-2 border-blue-600 cursor-pointer hover:shadow-lg transition-shadow"
                  style={{
                    background: `linear-gradient(135deg, ${guild.banner}15 0%, ${guild.banner}05 100%)`,
                  }}
                  onClick={() => setSelectedGuild(guild)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-4xl">{guild.icon}</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">
                          {guild.name}
                        </h4>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Member
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        Level {guild.level}
                      </div>
                      <div className="text-xs text-gray-600">
                        {guild.members} members
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">
                    {guild.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Volume:</span>
                      <span className="ml-2 font-semibold">
                        ${(guild.totalVolume / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Win Rate:</span>
                      <span className="ml-2 font-semibold text-green-600">
                        {guild.avgWinRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* All Guilds */}
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Discover Guilds
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {filteredGuilds
          .filter((g) => !myGuilds.includes(g.id))
          .map((guild) => (
            <div
              key={guild.id}
              className="relative p-6 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer hover:shadow-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${guild.banner}10 0%, ${guild.banner}02 100%)`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{guild.icon}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-gray-900">{guild.name}</h4>
                      {guild.isPrivate && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          🔒 Private
                        </span>
                      )}
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full capitalize">
                      {guild.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    Level {guild.level}
                  </div>
                  <div className="text-xs text-gray-600">
                    {guild.members} members
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4">{guild.description}</p>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Volume:</span>
                  <span className="ml-2 font-semibold">
                    ${(guild.totalVolume / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Win Rate:</span>
                  <span className="ml-2 font-semibold text-green-600">
                    {guild.avgWinRate}%
                  </span>
                </div>
              </div>

              {/* Requirements */}
              {Object.keys(guild.requirements).length > 0 && (
                <div className="mb-4 p-3 bg-white/50 rounded border border-gray-200">
                  <div className="text-xs font-semibold text-gray-700 mb-2">
                    Requirements:
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    {guild.requirements.minWinRate && (
                      <div
                        className={
                          meetsRequirements(guild)
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        • Min Win Rate: {guild.requirements.minWinRate}%
                      </div>
                    )}
                    {guild.requirements.minVolume && (
                      <div
                        className={
                          meetsRequirements(guild)
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        • Min Volume: $
                        {guild.requirements.minVolume.toLocaleString()}
                      </div>
                    )}
                    {guild.requirements.minTrades && (
                      <div
                        className={
                          meetsRequirements(guild)
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        • Min Trades: {guild.requirements.minTrades}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                disabled={!meetsRequirements(guild) && guild.isPrivate}
                className={`w-full py-2 rounded-lg transition-colors ${
                  !meetsRequirements(guild) && guild.isPrivate
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {!meetsRequirements(guild) && guild.isPrivate
                  ? 'Requirements Not Met'
                  : 'Join Guild'}
              </button>
            </div>
          ))}
      </div>

      {/* Guild Details Modal */}
      {selectedGuild && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-5xl">{selectedGuild.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedGuild.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Level {selectedGuild.level} • {selectedGuild.members}{' '}
                    members
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuild(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-gray-700 mb-6">{selectedGuild.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  ${(selectedGuild.totalVolume / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Total Volume</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {selectedGuild.avgWinRate}%
                </div>
                <div className="text-sm text-gray-600">Avg Win Rate</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">
                  {selectedGuild.members}
                </div>
                <div className="text-sm text-gray-600">Members</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Guild Chat
              </button>
              <button className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                View Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
