'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function Streaks() {
  const currentStreak = 7;
  const longestStreak = 15;
  const streakGoal = 30;
  const canRecover = true;
  const recoveryPrice = 100;

  const bonuses = [
    { days: 3, bonus: '5% fee discount', unlocked: true },
    { days: 7, bonus: '10% fee discount', unlocked: true },
    { days: 14, bonus: 'Exclusive badge', unlocked: false },
    { days: 30, bonus: '20% fee discount + NFT', unlocked: false },
  ];

  const leaderboard = [
    { rank: 1, user: 'CryptoKing', streak: 45, avatar: '👑' },
    { rank: 2, user: 'TradeQueen', streak: 38, avatar: '👸' },
    { rank: 3, user: 'MarketMaster', streak: 32, avatar: '🎯' },
    { rank: 4, user: 'You', streak: currentStreak, avatar: '😊' },
    { rank: 5, user: 'DiamondHands', streak: 25, avatar: '💎' },
  ];

  return (
    <div className="space-y-6">
      {/* Current Streak */}
      <Card>
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-br from-orange-500 to-red-500 rounded-full p-8 mb-4">
              <span className="text-6xl">🔥</span>
            </div>
            <h3 className="text-3xl font-bold mb-2">{currentStreak} Day Streak!</h3>
            <p className="text-gray-400">Keep trading daily to maintain your streak</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Longest Streak</p>
              <p className="text-2xl font-bold">{longestStreak} days</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Next Milestone</p>
              <p className="text-2xl font-bold">{bonuses.find(b => !b.unlocked)?.days || streakGoal} days</p>
            </div>
          </div>

          {/* Progress to next milestone */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress to 30-day goal</span>
              <span className="font-medium">{currentStreak}/{streakGoal} days</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all"
                style={{ width: `${(currentStreak / streakGoal) * 100}%` }}
              />
            </div>
          </div>

          {/* Streak Recovery */}
          {canRecover && (
            <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-yellow-400 mb-1">⚠️ Streak at Risk!</p>
                  <p className="text-sm text-gray-400">You haven't traded today. Recover your streak now!</p>
                </div>
                <Button size="sm">
                  Recover ({recoveryPrice} XP)
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Streak Bonuses */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Streak Bonuses</h4>
          
          <div className="space-y-3">
            {bonuses.map((bonus, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  bonus.unlocked
                    ? 'bg-green-500/10 border-green-500'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    bonus.unlocked ? 'bg-green-500' : 'bg-gray-700'
                  }`}>
                    {bonus.unlocked ? '✓' : '🔒'}
                  </div>
                  <div>
                    <p className="font-medium">{bonus.days} Day Streak</p>
                    <p className="text-sm text-gray-400">{bonus.bonus}</p>
                  </div>
                </div>
                {bonus.unlocked ? (
                  <Badge variant="success">Unlocked</Badge>
                ) : (
                  <Badge variant="default">{bonus.days - currentStreak} days left</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Leaderboard */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Streak Leaderboard</h4>
          
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
                  <span className="text-2xl font-bold text-gray-500 w-8">#{entry.rank}</span>
                  <span className="text-2xl">{entry.avatar}</span>
                  <div>
                    <p className="font-medium">{entry.user}</p>
                    <p className="text-sm text-gray-400">{entry.streak} day streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <span className="text-xl font-bold">{entry.streak}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
