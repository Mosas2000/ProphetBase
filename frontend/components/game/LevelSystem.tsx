'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function LevelSystem() {
  const currentLevel = 24;
  const currentXP = 3450;
  const xpForNextLevel = 5000;
  const totalXP = 45600;

  const benefits = [
    { level: 10, benefit: '5% trading fee discount', unlocked: true },
    { level: 20, benefit: 'Access to exclusive markets', unlocked: true },
    { level: 30, benefit: '10% trading fee discount', unlocked: false },
    { level: 50, benefit: 'VIP badge + priority support', unlocked: false },
    { level: 75, benefit: '15% trading fee discount', unlocked: false },
    { level: 100, benefit: 'Legendary status + all perks', unlocked: false },
  ];

  const getLevelTier = (level: number) => {
    if (level >= 75) return { name: 'Legendary', color: 'from-yellow-600 to-orange-600' };
    if (level >= 50) return { name: 'Master', color: 'from-purple-600 to-pink-600' };
    if (level >= 30) return { name: 'Expert', color: 'from-blue-600 to-cyan-600' };
    if (level >= 10) return { name: 'Advanced', color: 'from-green-600 to-emerald-600' };
    return { name: 'Beginner', color: 'from-gray-600 to-gray-500' };
  };

  const tier = getLevelTier(currentLevel);

  return (
    <div className="space-y-6">
      {/* Level Display */}
      <Card>
        <div className="p-6">
          <div className="text-center mb-6">
            <div className={`inline-block bg-gradient-to-br ${tier.color} rounded-full p-8 mb-4`}>
              <span className="text-6xl font-bold text-white">{currentLevel}</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Level {currentLevel}</h3>
            <Badge variant="default" className="text-lg px-4 py-2">{tier.name}</Badge>
          </div>

          {/* XP Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">XP to next level</span>
              <span className="font-medium">{currentXP.toLocaleString()} / {xpForNextLevel.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className={`bg-gradient-to-r ${tier.color} h-4 rounded-full transition-all`}
                style={{ width: `${(currentXP / xpForNextLevel) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center">
              {xpForNextLevel - currentXP} XP needed for Level {currentLevel + 1}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total XP</p>
              <p className="text-xl font-bold">{totalXP.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Next Tier</p>
              <p className="text-xl font-bold">{30 - currentLevel} levels</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Rank</p>
              <p className="text-xl font-bold">#156</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Level Benefits */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Level Benefits</h4>
          
          <div className="space-y-3">
            {benefits.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  item.unlocked
                    ? 'bg-green-500/10 border-green-500'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    item.unlocked ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {item.level}
                  </div>
                  <div>
                    <p className="font-medium">{item.benefit}</p>
                    <p className="text-sm text-gray-400">Level {item.level} reward</p>
                  </div>
                </div>
                {item.unlocked ? (
                  <Badge variant="success">Unlocked</Badge>
                ) : (
                  <Badge variant="default">{item.level - currentLevel} levels</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* XP Sources */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Earn XP</h4>
          
          <div className="space-y-2">
            {[
              { action: 'Complete a trade', xp: 50 },
              { action: 'Win a prediction', xp: 100 },
              { action: 'Complete daily challenge', xp: 200 },
              { action: 'Maintain 7-day streak', xp: 500 },
              { action: 'Unlock achievement', xp: '100-5000' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-sm">{item.action}</span>
                <span className="font-bold text-yellow-400">+{item.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Progress Visualization */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Level Progression</h4>
          
          <div className="relative">
            <div className="flex justify-between mb-2">
              {[10, 20, 30, 50, 75, 100].map(level => (
                <div key={level} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentLevel >= level ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {level}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{getLevelTier(level).name}</span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-gray-700 rounded-full relative">
              <div
                className="h-1 bg-blue-500 rounded-full absolute"
                style={{ width: `${(currentLevel / 100) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
