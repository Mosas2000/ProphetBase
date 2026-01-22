'use client';

import { useState } from 'react';

interface Tournament {
  id: string;
  name: string;
  description: string;
  prize: number;
  entryFee: number;
  participants: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'ended';
  category: 'daily' | 'weekly' | 'special';
  rules: string[];
  leaderboard: TournamentEntry[];
}

interface TournamentEntry {
  rank: number;
  user: {
    address: string;
    username: string;
    avatar: string;
  };
  profit: number;
  trades: number;
  winRate: number;
}

export default function Tournaments() {
  const [tournaments] = useState<Tournament[]>([
    {
      id: '1',
      name: 'Daily Trading Challenge',
      description:
        'Compete for the highest profit in 24 hours. Top 10 traders win prizes!',
      prize: 5000,
      entryFee: 50,
      participants: 847,
      maxParticipants: 1000,
      startDate: new Date(Date.now() - 43200000).toISOString(),
      endDate: new Date(Date.now() + 43200000).toISOString(),
      status: 'active',
      category: 'daily',
      rules: [
        'Minimum 10 trades required',
        'All markets eligible',
        'Profits calculated in USDC',
        'No wash trading',
      ],
      leaderboard: [
        {
          rank: 1,
          user: {
            address: '0x742d35Cc',
            username: 'ProphetKing',
            avatar: '👑',
          },
          profit: 2450,
          trades: 47,
          winRate: 72.3,
        },
        {
          rank: 2,
          user: {
            address: '0x8626f694',
            username: 'SmartTrader',
            avatar: '🎯',
          },
          profit: 2180,
          trades: 38,
          winRate: 68.4,
        },
        {
          rank: 3,
          user: {
            address: '0x9fE46736',
            username: 'DiamondHands',
            avatar: '💎',
          },
          profit: 1950,
          trades: 42,
          winRate: 66.7,
        },
      ],
    },
    {
      id: '2',
      name: 'Weekly Championship',
      description:
        '7-day tournament with $50k prize pool. Prove your trading skills!',
      prize: 50000,
      entryFee: 200,
      participants: 342,
      maxParticipants: 500,
      startDate: new Date(Date.now() - 172800000).toISOString(),
      endDate: new Date(Date.now() + 432000000).toISOString(),
      status: 'active',
      category: 'weekly',
      rules: [
        'Minimum 50 trades required',
        'All markets eligible',
        'Top 50 traders win prizes',
        'Fair play enforced',
      ],
      leaderboard: [],
    },
    {
      id: '3',
      name: 'Crypto Predictions Grand Prix',
      description:
        'Special event focusing on crypto markets only. $100k prize pool!',
      prize: 100000,
      entryFee: 500,
      participants: 128,
      maxParticipants: 200,
      startDate: new Date(Date.now() + 604800000).toISOString(),
      endDate: new Date(Date.now() + 1209600000).toISOString(),
      status: 'upcoming',
      category: 'special',
      rules: [
        'Crypto markets only',
        'Minimum $10k trading volume',
        'KYC required for prize distribution',
        'Professional rules apply',
      ],
      leaderboard: [],
    },
  ]);

  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);

  const getTimeRemaining = (endDate: string) => {
    const diff = new Date(endDate).getTime() - Date.now();
    if (diff < 0) return 'Ended';

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: Tournament['status']) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-700',
      active: 'bg-green-100 text-green-700',
      ended: 'bg-gray-100 text-gray-700',
    };
    return colors[status];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Trading Tournaments
          </h2>
          <p className="text-sm text-gray-600">
            Compete with traders worldwide for prizes
          </p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">$155,000</div>
          <div className="text-sm text-gray-600">Total Prize Pool</div>
        </div>
      </div>

      {/* Active Tournaments */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Active Tournaments
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {tournaments
            .filter((t) => t.status === 'active')
            .map((tournament) => (
              <div
                key={tournament.id}
                className="relative p-6 rounded-lg border-2 border-green-400 bg-gradient-to-r from-green-50 to-green-100 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTournament(tournament)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-bold text-gray-900">
                        {tournament.name}
                      </h4>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                          tournament.status
                        )}`}
                      >
                        🔴 LIVE
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full capitalize">
                        {tournament.category}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">
                      {tournament.description}
                    </p>

                    <div className="flex items-center space-x-6 text-sm">
                      <div>
                        <span className="text-gray-600">Prize Pool:</span>
                        <span className="ml-2 font-bold text-green-600">
                          ${tournament.prize.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Entry:</span>
                        <span className="ml-2 font-semibold">
                          ${tournament.entryFee}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Participants:</span>
                        <span className="ml-2 font-semibold">
                          {tournament.participants}/{tournament.maxParticipants}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Ends in:</span>
                        <span className="ml-2 font-semibold text-red-600">
                          {getTimeRemaining(tournament.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (tournament.participants /
                            tournament.maxParticipants) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Top 3 Leaders */}
                {tournament.leaderboard.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {tournament.leaderboard.slice(0, 3).map((entry) => (
                      <div
                        key={entry.rank}
                        className="bg-white rounded-lg p-3 text-center"
                      >
                        <div className="text-2xl mb-1">
                          {entry.rank === 1
                            ? '🥇'
                            : entry.rank === 2
                            ? '🥈'
                            : '🥉'}
                        </div>
                        <div className="font-semibold text-gray-900 text-sm mb-1">
                          {entry.user.username}
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          ${entry.profit.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {entry.trades} trades
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                  View Leaderboard →
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Upcoming Tournaments */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Tournaments
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {tournaments
            .filter((t) => t.status === 'upcoming')
            .map((tournament) => (
              <div
                key={tournament.id}
                className="p-6 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {tournament.name}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(
                        tournament.status
                      )}`}
                    >
                      {tournament.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ${(tournament.prize / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs text-gray-600">Prize Pool</div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4">
                  {tournament.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">Entry Fee:</span>
                    <span className="ml-2 font-semibold">
                      ${tournament.entryFee}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Starts in:</span>
                    <span className="ml-2 font-semibold">
                      {getTimeRemaining(tournament.startDate)}
                    </span>
                  </div>
                </div>

                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Register Now
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Tournament Rules Modal */}
      {selectedTournament && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedTournament.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedTournament.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedTournament(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ${selectedTournament.prize.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Prize Pool</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ${selectedTournament.entryFee}
                </div>
                <div className="text-sm text-gray-600">Entry Fee</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedTournament.participants}
                </div>
                <div className="text-sm text-gray-600">Participants</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {getTimeRemaining(selectedTournament.endDate)}
                </div>
                <div className="text-sm text-gray-600">Time Left</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Tournament Rules
              </h4>
              <ul className="space-y-2">
                {selectedTournament.rules.map((rule, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-2 text-gray-700"
                  >
                    <span className="text-blue-600">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedTournament.leaderboard.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Current Leaderboard
                </h4>
                <div className="space-y-2">
                  {selectedTournament.leaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 text-center text-xl font-bold">
                        {entry.rank === 1
                          ? '🥇'
                          : entry.rank === 2
                          ? '🥈'
                          : entry.rank === 3
                          ? '🥉'
                          : `#${entry.rank}`}
                      </div>
                      <div className="flex-1 ml-3">
                        <div className="font-semibold text-gray-900">
                          {entry.user.username}
                        </div>
                        <div className="text-sm text-gray-600">
                          {entry.trades} trades • {entry.winRate}% win rate
                        </div>
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        ${entry.profit.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex space-x-3">
              <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Enter Tournament
              </button>
              <button
                onClick={() => setSelectedTournament(null)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
