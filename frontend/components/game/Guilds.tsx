'use client';

import { Users, Shield, Trophy, Crown, TrendingUp, MessageCircle, Settings } from 'lucide-react';
import { useState } from 'react';

interface Guild {
  id: string;
  name: string;
  tag: string;
  level: number;
  members: number;
  maxMembers: number;
  treasury: number;
  rank: number;
  isJoined: boolean;
}

interface GuildMember {
  id: string;
  name: string;
  role: 'leader' | 'officer' | 'member';
  contribution: number;
  joinDate: string;
}

interface GuildTournament {
  id: string;
  name: string;
  status: 'upcoming' | 'active' | 'completed';
  guilds: number;
  prizePool: number;
  startDate: string;
}

export default function Guilds() {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-guild' | 'tournaments'>('browse');
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);

  const [guilds] = useState<Guild[]>([
    { id: 'g1', name: 'Market Masters', tag: 'MM', level: 25, members: 48, maxMembers: 50, treasury: 125000, rank: 1, isJoined: true },
    { id: 'g2', name: 'Bulls United', tag: 'BULL', level: 22, members: 45, maxMembers: 50, treasury: 98000, rank: 2, isJoined: false },
    { id: 'g3', name: 'Bear Clan', tag: 'BEAR', level: 20, members: 42, maxMembers: 50, treasury: 87000, rank: 3, isJoined: false },
    { id: 'g4', name: 'Diamond Hands', tag: 'DIAM', level: 18, members: 38, maxMembers: 50, treasury: 72000, rank: 4, isJoined: false },
    { id: 'g5', name: 'Whale Watch', tag: 'WHAL', level: 16, members: 35, maxMembers: 40, treasury: 61000, rank: 5, isJoined: false }
  ]);

  const [members] = useState<GuildMember[]>([
    { id: 'm1', name: 'TraderPro', role: 'leader', contribution: 25000, joinDate: '2025-01-01' },
    { id: 'm2', name: 'MarketGuru', role: 'officer', contribution: 18000, joinDate: '2025-01-05' },
    { id: 'm3', name: 'BullRunner', role: 'officer', contribution: 15000, joinDate: '2025-01-10' },
    { id: 'm4', name: 'ChartMaster', role: 'member', contribution: 12000, joinDate: '2025-01-12' },
    { id: 'm5', name: 'You', role: 'member', contribution: 10000, joinDate: '2025-01-15' }
  ]);

  const [tournaments] = useState<GuildTournament[]>([
    { id: 't1', name: 'Guild Championship', status: 'active', guilds: 32, prizePool: 500000, startDate: '2025-01-20' },
    { id: 't2', name: 'Spring Cup', status: 'upcoming', guilds: 64, prizePool: 750000, startDate: '2025-02-01' },
    { id: 't3', name: 'Winter Finals', status: 'completed', guilds: 32, prizePool: 500000, startDate: '2025-12-15' }
  ]);

  const myGuild = guilds.find(g => g.isJoined);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'leader': return 'text-amber-400';
      case 'officer': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'leader': return '👑';
      case 'officer': return '⭐';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Guilds</h1>
            <p className="text-slate-400">Join forces with traders and compete together</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['browse', 'my-guild', 'tournaments'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-emerald-600'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              {tab === 'browse' && 'Browse Guilds'}
              {tab === 'my-guild' && 'My Guild'}
              {tab === 'tournaments' && 'Tournaments'}
            </button>
          ))}
        </div>

        {/* Browse Guilds Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-4">
            {guilds.map((guild) => (
              <div
                key={guild.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-emerald-500 transition-all cursor-pointer"
                onClick={() => setSelectedGuild(guild)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                      <Shield className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-bold">{guild.name}</h3>
                        <span className="px-2 py-1 bg-slate-700 rounded text-sm font-mono">[{guild.tag}]</span>
                        {guild.rank <= 3 && <Crown className="w-5 h-5 text-amber-400" />}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>Rank #{guild.rank}</span>
                        <span>Level {guild.level}</span>
                        <span>{guild.members}/{guild.maxMembers} members</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">{guild.treasury.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">Guild Treasury</div>
                    {!guild.isJoined ? (
                      <button className="mt-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium">
                        Join Guild
                      </button>
                    ) : (
                      <div className="mt-2 px-6 py-2 bg-amber-500/20 border border-amber-500 rounded-lg font-medium text-amber-400">
                        Joined
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Guild Tab */}
        {activeTab === 'my-guild' && myGuild && (
          <div className="space-y-6">
            {/* Guild Overview */}
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-6 border-2 border-emerald-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-3xl font-bold">{myGuild.name}</h2>
                      <span className="px-3 py-1 bg-slate-700 rounded-lg font-mono text-lg">[{myGuild.tag}]</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-amber-400 font-bold">Rank #{myGuild.rank}</span>
                      <span className="text-emerald-400">Level {myGuild.level}</span>
                      <span className="text-slate-400">{myGuild.members}/{myGuild.maxMembers} members</span>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-slate-400">Guild Treasury</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">{myGuild.treasury.toLocaleString()}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span className="text-slate-400">Active Members</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">{myGuild.members}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span className="text-slate-400">Tournament Wins</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-400">12</div>
                </div>
              </div>
            </div>

            {/* Members List */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-2xl font-bold mb-4">Guild Members</h3>
              <div className="space-y-3">
                {members.map((member, index) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-slate-600">#{index + 1}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{member.name}</span>
                          <span>{getRoleBadge(member.role)}</span>
                          <span className={`text-sm ${getRoleColor(member.role)}`}>
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </span>
                        </div>
                        <div className="text-sm text-slate-400">Joined {member.joinDate}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">{member.contribution.toLocaleString()}</div>
                      <div className="text-sm text-slate-400">Contribution</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guild Chat Preview */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Guild Chat</h3>
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-3 mb-4">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">TraderPro</span>
                    <span className="text-xs text-slate-400">2 minutes ago</span>
                  </div>
                  <p className="text-slate-300">Great job everyone on today's tournament!</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">MarketGuru</span>
                    <span className="text-xs text-slate-400">5 minutes ago</span>
                  </div>
                  <p className="text-slate-300">Next target: reach 150k treasury 🚀</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Tournaments Tab */}
        {activeTab === 'tournaments' && (
          <div className="space-y-4">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="w-8 h-8 text-amber-400" />
                      <h3 className="text-2xl font-bold">{tournament.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        tournament.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {tournament.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                      <span>{tournament.guilds} guilds</span>
                      <span>Prize Pool: {tournament.prizePool.toLocaleString()} tokens</span>
                      <span>Starts: {tournament.startDate}</span>
                    </div>
                  </div>
                  <button
                    className={`px-6 py-3 rounded-lg font-medium ${
                      tournament.status === 'active' ? 'bg-green-600 hover:bg-green-700' :
                      tournament.status === 'upcoming' ? 'bg-emerald-600 hover:bg-emerald-700' :
                      'bg-slate-600 cursor-not-allowed'
                    }`}
                    disabled={tournament.status === 'completed'}
                  >
                    {tournament.status === 'active' ? 'View Brackets' :
                     tournament.status === 'upcoming' ? 'Register Guild' :
                     'Completed'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!myGuild && activeTab === 'my-guild' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-slate-700 text-center">
            <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Not in a Guild</h3>
            <p className="text-slate-400 mb-6">Join or create a guild to unlock cooperative features</p>
            <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold">
              Browse Guilds
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
