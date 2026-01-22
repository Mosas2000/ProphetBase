'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface Tournament {
  id: string;
  name: string;
  status: 'upcoming' | 'live' | 'ended';
  prizePool: number;
  participants: number;
  maxParticipants: number;
  endsIn: string;
  entryFee: number;
}

export function Tournaments() {
  const [selectedTab, setSelectedTab] = useState<'live' | 'upcoming' | 'ended'>('live');

  const tournaments: Tournament[] = [
    {
      id: '1',
      name: 'Weekly Trading Championship',
      status: 'live',
      prizePool: 10000,
      participants: 156,
      maxParticipants: 200,
      endsIn: '2d 14h',
      entryFee: 50,
    },
    {
      id: '2',
      name: 'Crypto Predictions Cup',
      status: 'upcoming',
      prizePool: 5000,
      participants: 45,
      maxParticipants: 100,
      endsIn: '5d',
      entryFee: 25,
    },
    {
      id: '3',
      name: 'Sports Betting Masters',
      status: 'ended',
      prizePool: 8000,
      participants: 200,
      maxParticipants: 200,
      endsIn: 'Ended',
      entryFee: 40,
    },
  ];

  const leaderboard = [
    { rank: 1, user: 'CryptoKing', profit: 2450, trades: 45, avatar: '👑' },
    { rank: 2, user: 'TradeQueen', profit: 2100, trades: 38, avatar: '👸' },
    { rank: 3, user: 'MarketMaster', profit: 1850, trades: 42, avatar: '🎯' },
    { rank: 4, user: 'You', profit: 1200, trades: 28, avatar: '😊' },
    { rank: 5, user: 'DiamondHands', profit: 950, trades: 25, avatar: '💎' },
  ];

  const prizes = [
    { place: '1st', prize: 5000, percentage: '50%' },
    { place: '2nd', prize: 3000, percentage: '30%' },
    { place: '3rd', prize: 1500, percentage: '15%' },
    { place: '4th-10th', prize: 500, percentage: '5%' },
  ];

  const filteredTournaments = tournaments.filter(t => t.status === selectedTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Trading Tournaments</h3>
          
          <div className="flex gap-2">
            {(['live', 'upcoming', 'ended'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedTab === tab
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

      {/* Tournaments List */}
      <div className="space-y-4">
        {filteredTournaments.map(tournament => (
          <Card key={tournament.id}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-bold">{tournament.name}</h4>
                    <Badge variant={
                      tournament.status === 'live' ? 'success' :
                      tournament.status === 'upcoming' ? 'warning' : 'default'
                    }>
                      {tournament.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">
                    {tournament.participants}/{tournament.maxParticipants} participants
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">Prize Pool</p>
                  <p className="text-2xl font-bold text-yellow-400">${tournament.prizePool.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-sm text-gray-400 mb-1">Entry Fee</p>
                  <p className="font-bold">${tournament.entryFee}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-sm text-gray-400 mb-1">{tournament.status === 'ended' ? 'Duration' : 'Ends In'}</p>
                  <p className="font-bold">{tournament.endsIn}</p>
                </div>
              </div>

              {tournament.status === 'live' && (
                <Button className="w-full">View Live Standings</Button>
              )}
              {tournament.status === 'upcoming' && (
                <Button className="w-full">Register Now</Button>
              )}
              {tournament.status === 'ended' && (
                <Button variant="secondary" className="w-full">View Results</Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Live Leaderboard */}
      {selectedTab === 'live' && (
        <Card>
          <div className="p-6">
            <h4 className="font-semibold mb-4">Live Standings</h4>
            
            <div className="space-y-2">
              {leaderboard.map(entry => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    entry.user === 'You'
                      ? 'bg-blue-500/10 border border-blue-500'
                      : 'bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      entry.rank === 1 ? 'bg-yellow-500 text-black' :
                      entry.rank === 2 ? 'bg-gray-400 text-black' :
                      entry.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {entry.rank}
                    </div>
                    <span className="text-2xl">{entry.avatar}</span>
                    <div>
                      <p className="font-medium">{entry.user}</p>
                      <p className="text-sm text-gray-400">{entry.trades} trades</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">+${entry.profit}</p>
                    <p className="text-xs text-gray-400">profit</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Prize Distribution */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Prize Distribution</h4>
          
          <div className="space-y-2">
            {prizes.map((prize, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">{prize.place}</span>
                  <span className="text-sm text-gray-400">{prize.percentage} of pool</span>
                </div>
                <span className="font-bold text-yellow-400">${prize.prize.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
