'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function Guilds() {
  const myGuilds = [
    { id: '1', name: 'Crypto Bulls', members: 45, rank: 3, avatar: '🐂' },
    { id: '2', name: 'Market Masters', members: 32, rank: 7, avatar: '🎯' },
  ];

  const availableGuilds = [
    { id: '3', name: 'Diamond Traders', members: 67, rank: 1, avatar: '💎', requirement: 'Level 30+' },
    { id: '4', name: 'Sports Bettors', members: 54, rank: 5, avatar: '⚽', requirement: 'Open' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Guilds</h3>
            <Button>Create Guild</Button>
          </div>
        </div>
      </Card>

      {/* My Guilds */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">My Guilds</h4>
          
          <div className="space-y-3">
            {myGuilds.map(guild => (
              <div key={guild.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{guild.avatar}</span>
                    <div>
                      <p className="font-semibold">{guild.name}</p>
                      <p className="text-sm text-gray-400">{guild.members} members • Rank #{guild.rank}</p>
                    </div>
                  </div>
                  <Button size="sm">View</Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button className="px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600">
                    💬 Chat
                  </button>
                  <button className="px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600">
                    🏆 Tournaments
                  </button>
                  <button className="px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600">
                    📊 Strategies
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Available Guilds */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Discover Guilds</h4>
          
          <div className="space-y-3">
            {availableGuilds.map(guild => (
              <div key={guild.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{guild.avatar}</span>
                  <div>
                    <p className="font-semibold">{guild.name}</p>
                    <p className="text-sm text-gray-400">{guild.members} members • Rank #{guild.rank}</p>
                    <Badge variant="default" className="mt-1 text-xs">{guild.requirement}</Badge>
                  </div>
                </div>
                <Button size="sm">Join</Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Guild Tournaments */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Active Tournaments</h4>
          
          <div className="space-y-3">
            {[
              { name: 'Guild Wars Season 1', prize: 10000, teams: 16, endsIn: '3d' },
              { name: 'Crypto Challenge', prize: 5000, teams: 8, endsIn: '1w' },
            ].map((tournament, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{tournament.name}</p>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{tournament.teams} teams</span>
                  <span>${tournament.prize.toLocaleString()} prize</span>
                  <span>Ends in {tournament.endsIn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Shared Strategies */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Guild Strategies</h4>
          
          <div className="space-y-2">
            {[
              { title: 'Momentum Trading Guide', guild: 'Crypto Bulls', votes: 45 },
              { title: 'Risk Management Tips', guild: 'Market Masters', votes: 32 },
            ].map((strategy, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{strategy.title}</p>
                  <p className="text-xs text-gray-400">{strategy.guild}</p>
                </div>
                <span className="text-sm">👍 {strategy.votes}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
