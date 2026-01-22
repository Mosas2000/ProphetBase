'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export function SocialCompetition() {
  const [activeTab, setActiveTab] = useState<'friends' | 'leagues' | 'teams'>('friends');

  const friends = [
    { name: 'Alice', avatar: '👩', profit: 2450, rank: 12, status: 'online' },
    { name: 'Bob', avatar: '👨', profit: 1850, rank: 28, status: 'offline' },
    { name: 'Charlie', avatar: '🧑', profit: 3100, rank: 5, status: 'online' },
  ];

  const leagues = [
    { name: 'Diamond League', tier: 'diamond', rank: 15, participants: 50, prize: 5000 },
    { name: 'Platinum League', tier: 'platinum', rank: 3, participants: 50, prize: 2500 },
  ];

  const teams = [
    { name: 'Crypto Bulls', members: 12, rank: 3, totalProfit: 45000, avatar: '🐂' },
    { name: 'Market Masters', members: 8, rank: 7, totalProfit: 32000, avatar: '🎯' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Social Competition</h3>
          
          <div className="flex gap-2">
            {(['friends', 'leagues', 'teams'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Friend Challenges */}
      {activeTab === 'friends' && (
        <>
          <Card>
            <div className="p-6">
              <h4 className="font-semibold mb-4">Your Friends</h4>
              
              <div className="space-y-3">
                {friends.map((friend, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{friend.avatar}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{friend.name}</p>
                          <div className={`w-2 h-2 rounded-full ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                        </div>
                        <p className="text-sm text-gray-400">Rank #{friend.rank} • +${friend.profit}</p>
                      </div>
                    </div>
                    <Button size="sm">Challenge</Button>
                  </div>
                ))}
              </div>

              <Button variant="secondary" className="w-full mt-4">Invite Friends</Button>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h4 className="font-semibold mb-4">Active Challenges</h4>
              
              <div className="space-y-3">
                {[
                  { opponent: 'Alice', bet: 100, endsIn: '2h', status: 'winning' },
                  { opponent: 'Charlie', bet: 250, endsIn: '1d', status: 'losing' },
                ].map((challenge, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${
                    challenge.status === 'winning' ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">vs {challenge.opponent}</p>
                      <Badge variant={challenge.status === 'winning' ? 'success' : 'error'}>
                        {challenge.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Bet: ${challenge.bet}</span>
                      <span className="text-gray-400">Ends in {challenge.endsIn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Private Leagues */}
      {activeTab === 'leagues' && (
        <>
          <Card>
            <div className="p-6">
              <h4 className="font-semibold mb-4">Your Leagues</h4>
              
              <div className="space-y-4">
                {leagues.map((league, idx) => (
                  <div key={idx} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-semibold mb-1">{league.name}</h5>
                        <p className="text-sm text-gray-400">{league.participants} participants</p>
                      </div>
                      <Badge variant="default" className="capitalize">{league.tier}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-400">Your Rank</p>
                        <p className="text-xl font-bold">#{league.rank}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Prize Pool</p>
                        <p className="text-xl font-bold text-yellow-400">${league.prize}</p>
                      </div>
                    </div>

                    <Button size="sm" className="w-full">View Standings</Button>
                  </div>
                ))}
              </div>

              <Button variant="secondary" className="w-full mt-4">Join New League</Button>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h4 className="font-semibold mb-4">League Rewards</h4>
              
              <div className="space-y-2">
                {[
                  { place: '1st', reward: '$2,500 + Trophy' },
                  { place: '2nd', reward: '$1,500' },
                  { place: '3rd', reward: '$1,000' },
                  { place: 'Top 10', reward: '$500' },
                ].map((reward, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="font-medium">{reward.place}</span>
                    <span className="text-yellow-400">{reward.reward}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Team Competitions */}
      {activeTab === 'teams' && (
        <>
          <Card>
            <div className="p-6">
              <h4 className="font-semibold mb-4">Your Teams</h4>
              
              <div className="space-y-4">
                {teams.map((team, idx) => (
                  <div key={idx} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{team.avatar}</span>
                      <div>
                        <h5 className="font-semibold">{team.name}</h5>
                        <p className="text-sm text-gray-400">{team.members} members</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-400">Team Rank</p>
                        <p className="text-xl font-bold">#{team.rank}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Total Profit</p>
                        <p className="text-xl font-bold text-green-400">${team.totalProfit.toLocaleString()}</p>
                      </div>
                    </div>

                    <Button size="sm" className="w-full">View Team</Button>
                  </div>
                ))}
              </div>

              <Button variant="secondary" className="w-full mt-4">Create Team</Button>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h4 className="font-semibold mb-4">Bragging Rights</h4>
              
              <div className="space-y-2">
                {[
                  { achievement: 'Team MVP', description: 'Highest profit this week', icon: '🏆' },
                  { achievement: 'Streak Master', description: '7-day team streak', icon: '🔥' },
                  { achievement: 'Top Contributor', description: 'Most trades completed', icon: '⭐' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="font-medium">{item.achievement}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
