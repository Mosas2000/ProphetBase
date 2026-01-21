'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  difficulty: 'easy' | 'medium' | 'hard';
  progress: number;
  maxProgress: number;
  reward: number;
  expiresIn: string;
  completed: boolean;
}

export function Challenges() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Trade Master',
      description: 'Complete 5 trades today',
      type: 'daily',
      difficulty: 'easy',
      progress: 3,
      maxProgress: 5,
      reward: 200,
      expiresIn: '8h',
      completed: false,
    },
    {
      id: '2',
      title: 'Market Explorer',
      description: 'Trade in 3 different categories',
      type: 'daily',
      difficulty: 'medium',
      progress: 2,
      maxProgress: 3,
      reward: 350,
      expiresIn: '8h',
      completed: false,
    },
    {
      id: '3',
      title: 'Early Bird',
      description: 'Make a trade before 9 AM',
      type: 'daily',
      difficulty: 'easy',
      progress: 1,
      maxProgress: 1,
      reward: 150,
      expiresIn: '8h',
      completed: true,
    },
    {
      id: '4',
      title: 'Volume King',
      description: 'Trade $1,000 total volume this week',
      type: 'weekly',
      difficulty: 'hard',
      progress: 650,
      maxProgress: 1000,
      reward: 1000,
      expiresIn: '3d',
      completed: false,
    },
    {
      id: '5',
      title: 'Diversification',
      description: 'Hold positions in 10 different markets',
      type: 'weekly',
      difficulty: 'medium',
      progress: 7,
      maxProgress: 10,
      reward: 500,
      expiresIn: '3d',
      completed: false,
    },
  ];

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-600';
      case 'medium': return 'text-yellow-400 border-yellow-600';
      case 'hard': return 'text-red-400 border-red-600';
    }
  };

  const filteredChallenges = challenges.filter(c => c.type === activeTab);
  const completedToday = challenges.filter(c => c.type === 'daily' && c.completed).length;
  const totalDaily = challenges.filter(c => c.type === 'daily').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Challenges</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Daily Progress</p>
              <p className="text-2xl font-bold">{completedToday}/{totalDaily}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Rewards</p>
              <p className="text-2xl font-bold text-yellow-400">
                {challenges.filter(c => c.completed).reduce((sum, c) => sum + c.reward, 0)} XP
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(['daily', 'weekly'] as const).map(tab => (
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

      {/* Challenges List */}
      <div className="space-y-4">
        {filteredChallenges.map(challenge => (
          <Card key={challenge.id}>
            <div className={`p-6 ${challenge.completed && 'opacity-75'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{challenge.title}</h4>
                    <Badge variant="default" className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{challenge.description}</p>
                  
                  {!challenge.completed && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="font-medium">{challenge.progress}/{challenge.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-right ml-4">
                  <p className="text-sm text-gray-400 mb-1">Reward</p>
                  <p className="text-xl font-bold text-yellow-400">+{challenge.reward} XP</p>
                  <p className="text-xs text-gray-500 mt-2">Expires in {challenge.expiresIn}</p>
                </div>
              </div>

              {challenge.completed ? (
                <div className="flex items-center justify-between bg-green-500/10 border border-green-500 rounded-lg p-3">
                  <span className="text-green-400 font-medium">✓ Completed</span>
                  <Button size="sm" variant="secondary">Claim Reward</Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {challenge.maxProgress - challenge.progress} more to complete
                  </span>
                  <Button size="sm" disabled>In Progress</Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Challenge History */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Recent Completions</h4>
          
          <div className="space-y-2">
            {[
              { title: 'Early Bird', reward: 150, time: '2h ago' },
              { title: 'Quick Trader', reward: 100, time: '1d ago' },
              { title: 'Market Explorer', reward: 350, time: '2d ago' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">{item.title}</p>
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
