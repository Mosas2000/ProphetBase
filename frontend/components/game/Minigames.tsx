'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export function Minigames() {
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [scratchRevealed, setScratchRevealed] = useState(false);
  const dailyBonusClaimed = false;

  const handleSpin = () => {
    setWheelSpinning(true);
    setTimeout(() => {
      setWheelSpinning(false);
      alert('You won 500 XP!');
    }, 2000);
  };

  const prizes = [
    { segment: 1, prize: '100 XP', color: 'bg-blue-500' },
    { segment: 2, prize: '500 XP', color: 'bg-green-500' },
    { segment: 3, prize: '50 XP', color: 'bg-gray-500' },
    { segment: 4, prize: '1000 XP', color: 'bg-purple-500' },
    { segment: 5, prize: '200 XP', color: 'bg-yellow-500' },
    { segment: 6, prize: 'NFT', color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Spin Wheel */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Spin the Wheel</h3>
          
          <div className="text-center mb-6">
            <div className={`inline-block w-64 h-64 rounded-full border-8 border-gray-700 relative ${wheelSpinning && 'animate-spin'}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">🎡</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">1 free spin per day!</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {prizes.map((prize, idx) => (
              <div key={idx} className={`${prize.color} rounded-lg p-2 text-center text-sm font-medium text-white`}>
                {prize.prize}
              </div>
            ))}
          </div>

          <Button className="w-full" onClick={handleSpin} disabled={wheelSpinning}>
            {wheelSpinning ? 'Spinning...' : 'Spin Now!'}
          </Button>
        </div>
      </Card>

      {/* Scratch Card */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Scratch Card</h3>
          
          <div className="text-center mb-6">
            <div className={`inline-block w-64 h-40 rounded-lg ${scratchRevealed ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-gray-600'} flex items-center justify-center cursor-pointer`}
              onClick={() => setScratchRevealed(true)}
            >
              {scratchRevealed ? (
                <div className="text-center">
                  <p className="text-4xl mb-2">🎉</p>
                  <p className="text-2xl font-bold text-white">You Won!</p>
                  <p className="text-xl text-white">+750 XP</p>
                </div>
              ) : (
                <p className="text-white">Click to Scratch!</p>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-4">Available: 3 cards</p>
          </div>

          <Button className="w-full" disabled={!scratchRevealed}>
            Claim Reward
          </Button>
        </div>
      </Card>

      {/* Daily Bonus */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Bonus</h3>
          
          <div className="grid grid-cols-7 gap-2 mb-6">
            {[100, 150, 200, 250, 300, 400, 500].map((bonus, idx) => (
              <div key={idx} className={`rounded-lg p-3 text-center ${
                idx < 3 ? 'bg-green-500/20 border border-green-500' : 'bg-gray-800'
              }`}>
                <p className="text-xs text-gray-400 mb-1">Day {idx + 1}</p>
                <p className="font-bold text-sm">{bonus} XP</p>
                {idx < 3 && <p className="text-xs text-green-400 mt-1">✓</p>}
              </div>
            ))}
          </div>

          <Button className="w-full" disabled={dailyBonusClaimed}>
            {dailyBonusClaimed ? 'Claimed Today' : 'Claim Day 4 Bonus'}
          </Button>
        </div>
      </Card>

      {/* Prediction Mini-game */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Prediction</h3>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-4">
            <p className="text-center mb-4">Will Bitcoin be above $50,000 in 1 hour?</p>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary">
                <span className="text-2xl mr-2">👍</span> YES
              </Button>
              <Button variant="secondary">
                <span className="text-2xl mr-2">👎</span> NO
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Potential reward</span>
            <span className="font-bold text-yellow-400">+300 XP</span>
          </div>
        </div>
      </Card>

      {/* Minigame Stats */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Your Stats</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Plays</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Won</p>
              <p className="text-2xl font-bold text-yellow-400">12,450 XP</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
