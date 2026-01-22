'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function SeasonPass() {
  const currentLevel = 24;
  const maxLevel = 50;
  const currentXP = 2400;
  const xpPerLevel = 100;
  const isPremium = false;

  const rewards = [
    { level: 5, free: '100 XP', premium: '500 XP + Badge', unlocked: true },
    { level: 10, free: 'Common NFT', premium: 'Rare NFT + 1000 XP', unlocked: true },
    { level: 15, free: '200 XP', premium: '1000 XP + Exclusive Skin', unlocked: true },
    { level: 20, free: 'Rare Badge', premium: 'Epic NFT + 2000 XP', unlocked: true },
    { level: 25, free: '300 XP', premium: '1500 XP + Premium Badge', unlocked: false },
    { level: 30, free: 'Epic Badge', premium: 'Legendary NFT + 3000 XP', unlocked: false },
  ];

  const seasonInfo = {
    name: 'Season 1: Genesis',
    endsIn: '45 days',
    participants: 12450,
  };

  return (
    <div className="space-y-6">
      {/* Season Header */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-1">{seasonInfo.name}</h3>
              <p className="text-gray-400">Ends in {seasonInfo.endsIn}</p>
            </div>
            {!isPremium && (
              <Button>Upgrade to Premium - $9.99</Button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Your Level</p>
              <p className="text-2xl font-bold">{currentLevel}/{maxLevel}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Participants</p>
              <p className="text-2xl font-bold">{seasonInfo.participants.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Tier</p>
              <p className="text-2xl font-bold">{isPremium ? 'Premium' : 'Free'}</p>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Season Progress</span>
              <span className="font-medium">{currentXP} / {maxLevel * xpPerLevel} XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                style={{ width: `${(currentLevel / maxLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Rewards Track */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Season Rewards</h4>
          
          <div className="space-y-4">
            {rewards.map((reward, idx) => (
              <div key={idx} className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                  <span className="font-bold">Level {reward.level}</span>
                  {reward.unlocked ? (
                    <Badge variant="success">Unlocked</Badge>
                  ) : (
                    <Badge variant="default">{reward.level - currentLevel} levels</Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2">
                  {/* Free Tier */}
                  <div className={`p-4 border-r border-gray-700 ${!reward.unlocked && 'opacity-50'}`}>
                    <p className="text-xs text-gray-400 mb-2">FREE</p>
                    <p className="font-medium">{reward.free}</p>
                    {reward.unlocked && (
                      <Button size="sm" variant="secondary" className="mt-2 w-full">Claim</Button>
                    )}
                  </div>

                  {/* Premium Tier */}
                  <div className={`p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 ${!reward.unlocked && 'opacity-50'}`}>
                    <p className="text-xs text-yellow-400 mb-2">PREMIUM</p>
                    <p className="font-medium">{reward.premium}</p>
                    {reward.unlocked && isPremium && (
                      <Button size="sm" className="mt-2 w-full">Claim</Button>
                    )}
                    {reward.unlocked && !isPremium && (
                      <Button size="sm" variant="secondary" className="mt-2 w-full" disabled>
                        Premium Only
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Premium Benefits */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Premium Benefits</h4>
          
          <div className="space-y-2 mb-4">
            {[
              'Unlock all premium rewards',
              '2x XP boost for the entire season',
              'Exclusive premium badge',
              'Early access to new features',
              'Priority customer support',
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="text-yellow-400">✓</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {!isPremium && (
            <Button className="w-full">Get Premium Pass - $9.99</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
