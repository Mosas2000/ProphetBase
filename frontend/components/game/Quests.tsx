'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily';
  progress: number;
  maxProgress: number;
  reward: { xp: number; tokens?: number };
  completed: boolean;
  claimed: boolean;
  chain?: string;
}

export function Quests() {
  const quests: Quest[] = [
    {
      id: '1',
      title: 'Getting Started',
      description: 'Complete your first 3 trades',
      type: 'main',
      progress: 3,
      maxProgress: 3,
      reward: { xp: 500, tokens: 10 },
      completed: true,
      claimed: false,
      chain: 'Beginner Path',
    },
    {
      id: '2',
      title: 'Market Explorer',
      description: 'Trade in 5 different market categories',
      type: 'main',
      progress: 3,
      maxProgress: 5,
      reward: { xp: 1000, tokens: 25 },
      completed: false,
      claimed: false,
      chain: 'Beginner Path',
    },
    {
      id: '3',
      title: 'Profit Seeker',
      description: 'Earn $100 in total profits',
      type: 'side',
      progress: 65,
      maxProgress: 100,
      reward: { xp: 750 },
      completed: false,
      claimed: false,
    },
    {
      id: '4',
      title: 'Daily Trader',
      description: 'Make 3 trades today',
      type: 'daily',
      progress: 2,
      maxProgress: 3,
      reward: { xp: 200 },
      completed: false,
      claimed: false,
    },
  ];

  const questChains = [
    { name: 'Beginner Path', quests: 3, completed: 1 },
    { name: 'Advanced Trader', quests: 5, completed: 0 },
    { name: 'Market Master', quests: 7, completed: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Quest Chains */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quest Chains</h3>
          
          <div className="grid grid-cols-3 gap-4">
            {questChains.map((chain, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-4">
                <p className="font-medium mb-2">{chain.name}</p>
                <p className="text-sm text-gray-400 mb-2">
                  {chain.completed}/{chain.quests} completed
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(chain.completed / chain.quests) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Active Quests */}
      <div className="space-y-4">
        {['main', 'side', 'daily'].map(type => {
          const typeQuests = quests.filter(q => q.type === type);
          if (typeQuests.length === 0) return null;

          return (
            <Card key={type}>
              <div className="p-6">
                <h4 className="font-semibold mb-4 capitalize">{type} Quests</h4>
                
                <div className="space-y-3">
                  {typeQuests.map(quest => (
                    <div key={quest.id} className={`p-4 rounded-lg border ${
                      quest.completed ? 'bg-green-500/10 border-green-500' : 'bg-gray-800 border-gray-700'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium">{quest.title}</h5>
                            {quest.chain && (
                              <Badge variant="default" className="text-xs">{quest.chain}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{quest.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm text-gray-400">Reward</p>
                          <p className="font-bold text-yellow-400">+{quest.reward.xp} XP</p>
                          {quest.reward.tokens && (
                            <p className="text-xs text-blue-400">+{quest.reward.tokens} tokens</p>
                          )}
                        </div>
                      </div>

                      {!quest.completed && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span>{quest.progress}/{quest.maxProgress}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {quest.completed && !quest.claimed && (
                        <Button size="sm" className="w-full">Claim Reward</Button>
                      )}
                      {quest.claimed && (
                        <div className="text-center text-green-400 text-sm">✓ Claimed</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quest Log */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Quest Log</h4>
          
          <div className="space-y-2">
            {[
              { quest: 'Getting Started', reward: 500, time: '1h ago' },
              { quest: 'First Win', reward: 300, time: '3h ago' },
              { quest: 'Market Newbie', reward: 200, time: '1d ago' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">{item.quest}</p>
                  <p className="text-sm text-gray-400">{item.time}</p>
                </div>
                <span className="text-yellow-400 font-bold">+{item.reward} XP</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
