'use client';

import { Medal, TrendingUp, TrendingDown, Crown, Target } from 'lucide-react';
import { useState } from 'react';

interface Rank {
  id: string;
  name: string;
  tier: number;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
}

interface RankHistory {
  season: number;
  rank: string;
  points: number;
  position: number;
}

export default function RankSystem() {
  const [currentPoints, setCurrentPoints] = useState(2850);
  const [currentSeason, setCurrentSeason] = useState(3);
  const [decayActive, setDecayActive] = useState(true);

  const [ranks] = useState<Rank[]>([
    { id: 'r1', name: 'Bronze', tier: 1, minPoints: 0, maxPoints: 999, icon: '🥉', color: 'text-amber-700' },
    { id: 'r2', name: 'Silver', tier: 2, minPoints: 1000, maxPoints: 1999, icon: '🥈', color: 'text-slate-400' },
    { id: 'r3', name: 'Gold', tier: 3, minPoints: 2000, maxPoints: 2999, icon: '🥇', color: 'text-amber-400' },
    { id: 'r4', name: 'Platinum', tier: 4, minPoints: 3000, maxPoints: 3999, icon: '💎', color: 'text-cyan-400' },
    { id: 'r5', name: 'Diamond', tier: 5, minPoints: 4000, maxPoints: 4999, icon: '💠', color: 'text-blue-400' },
    { id: 'r6', name: 'Master', tier: 6, minPoints: 5000, maxPoints: 5999, icon: '⭐', color: 'text-purple-400' },
    { id: 'r7', name: 'Grandmaster', tier: 7, minPoints: 6000, maxPoints: 6999, icon: '🌟', color: 'text-violet-400' },
    { id: 'r8', name: 'Legend', tier: 8, minPoints: 7000, maxPoints: 99999, icon: '👑', color: 'text-amber-300' }
  ]);

  const [rankHistory] = useState<RankHistory[]>([
    { season: 1, rank: 'Silver', points: 1750, position: 1234 },
    { season: 2, rank: 'Gold', points: 2400, position: 567 },
    { season: 3, rank: 'Gold', points: 2850, position: 423 }
  ]);

  const getCurrentRank = () => {
    return ranks.find(r => currentPoints >= r.minPoints && currentPoints <= r.maxPoints) || ranks[0];
  };

  const getNextRank = () => {
    const currentRank = getCurrentRank();
    return ranks.find(r => r.tier === currentRank.tier + 1);
  };

  const currentRank = getCurrentRank();
  const nextRank = getNextRank();
  const pointsToNext = nextRank ? nextRank.minPoints - currentPoints : 0;
  const progressPercent = ((currentPoints - currentRank.minPoints) / (currentRank.maxPoints - currentRank.minPoints)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl">
            <Medal className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Ranked System</h1>
            <p className="text-slate-400">Compete for glory and exclusive rewards</p>
          </div>
        </div>

        {/* Current Rank Card */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-8 border-2 border-purple-500 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="text-8xl">{currentRank.icon}</div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className={`text-4xl font-bold ${currentRank.color}`}>{currentRank.name}</h2>
                  <Crown className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-2xl text-slate-300 mb-2">{currentPoints.toLocaleString()} LP</div>
                <div className="text-slate-400">Season {currentSeason} • Global Rank #423</div>
              </div>
            </div>
            <div className="text-right">
              {nextRank && (
                <>
                  <div className="text-sm text-slate-400 mb-2">Next Rank</div>
                  <div className={`text-3xl font-bold ${nextRank.color} mb-2`}>{nextRank.name}</div>
                  <div className="text-lg text-slate-300">{pointsToNext} LP needed</div>
                </>
              )}
              {!nextRank && (
                <div className="text-2xl font-bold text-amber-400">MAX RANK</div>
              )}
            </div>
          </div>

          {nextRank && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Rank Progress</span>
                <span className="text-sm font-bold">{Math.floor(progressPercent)}%</span>
              </div>
              <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-slate-400 text-sm">Wins Today</span>
            </div>
            <div className="text-3xl font-bold text-green-400">+127 LP</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span className="text-slate-400 text-sm">Losses Today</span>
            </div>
            <div className="text-3xl font-bold text-red-400">-43 LP</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-slate-400 text-sm">Win Rate</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">68%</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Medal className="w-5 h-5 text-amber-400" />
              <span className="text-slate-400 text-sm">Peak Rank</span>
            </div>
            <div className="text-3xl font-bold text-amber-400">Plat</div>
          </div>
        </div>

        {/* Rank Ladder */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-2xl font-bold mb-6">Rank Progression</h2>
          <div className="space-y-4">
            {ranks.slice().reverse().map((rank) => (
              <div
                key={rank.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  rank.id === currentRank.id
                    ? 'bg-purple-500/20 border-purple-500 scale-105'
                    : currentPoints >= rank.minPoints
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-slate-700/30 border-slate-600/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{rank.icon}</div>
                    <div>
                      <h3 className={`text-2xl font-bold ${rank.color}`}>{rank.name}</h3>
                      <div className="text-sm text-slate-400">
                        {rank.minPoints.toLocaleString()} - {rank.maxPoints === 99999 ? '∞' : rank.maxPoints.toLocaleString()} LP
                      </div>
                    </div>
                  </div>
                  {rank.id === currentRank.id && (
                    <div className="px-4 py-2 bg-purple-600 rounded-lg font-bold">
                      Current Rank
                    </div>
                  )}
                  {currentPoints >= rank.minPoints && rank.id !== currentRank.id && (
                    <div className="px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg font-bold text-green-400">
                      ✓ Achieved
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Season Info & Decay */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Season {currentSeason}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Season Ends:</span>
                <span className="font-bold">25 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Your Rank:</span>
                <span className={`font-bold ${currentRank.color}`}>{currentRank.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Highest Rank:</span>
                <span className="font-bold text-cyan-400">Platinum</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Season Rewards:</span>
                <span className="font-bold text-amber-400">Unlocked</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Rank Decay</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={`font-bold ${decayActive ? 'text-orange-400' : 'text-green-400'}`}>
                  {decayActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Days Inactive:</span>
                <span className="font-bold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Decay Starts In:</span>
                <span className="font-bold text-orange-400">4 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Decay Rate:</span>
                <span className="font-bold">-25 LP/day</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              💡 Play at least one ranked match every 7 days to prevent decay
            </p>
          </div>
        </div>

        {/* Rank History */}
        <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold mb-4">Season History</h3>
          <div className="space-y-3">
            {rankHistory.map((history) => (
              <div key={history.season} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-slate-600">S{history.season}</div>
                  <div>
                    <div className="font-bold">{history.rank}</div>
                    <div className="text-sm text-slate-400">{history.points} LP</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-400">#{history.position}</div>
                  <div className="text-sm text-slate-400">Global Rank</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
