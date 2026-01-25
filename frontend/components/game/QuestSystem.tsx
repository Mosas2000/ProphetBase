'use client';

import { Swords, Trophy, Target, Clock, CheckCircle, Lock, Star, Zap } from 'lucide-react';
import { useState } from 'react';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'chain';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  progress: number;
  target: number;
  xpReward: number;
  tokenReward: number;
  status: 'locked' | 'active' | 'completed' | 'claimed';
  timeRemaining?: number;
  chainPosition?: number;
  chainTotal?: number;
  requirements?: string[];
}

export default function QuestSystem() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'chains'>('daily');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const [quests] = useState<Quest[]>([
    // Daily Quests
    {
      id: 'd1',
      title: 'First Trade',
      description: 'Complete your first trade of the day',
      type: 'daily',
      difficulty: 'easy',
      progress: 1,
      target: 1,
      xpReward: 50,
      tokenReward: 10,
      status: 'completed',
      timeRemaining: 18000
    },
    {
      id: 'd2',
      title: 'Volume Master',
      description: 'Trade $10,000 worth of assets today',
      type: 'daily',
      difficulty: 'medium',
      progress: 6500,
      target: 10000,
      xpReward: 150,
      tokenReward: 50,
      status: 'active',
      timeRemaining: 18000
    },
    {
      id: 'd3',
      title: 'Market Prediction',
      description: 'Make 5 correct price predictions',
      type: 'daily',
      difficulty: 'medium',
      progress: 3,
      target: 5,
      xpReward: 120,
      tokenReward: 30,
      status: 'active',
      timeRemaining: 18000
    },
    {
      id: 'd4',
      title: 'Profit Streak',
      description: 'Win 3 trades in a row',
      type: 'daily',
      difficulty: 'hard',
      progress: 2,
      target: 3,
      xpReward: 250,
      tokenReward: 100,
      status: 'active',
      timeRemaining: 18000
    },
    // Weekly Quests
    {
      id: 'w1',
      title: 'Weekly Champion',
      description: 'Complete 50 trades this week',
      type: 'weekly',
      difficulty: 'medium',
      progress: 32,
      target: 50,
      xpReward: 500,
      tokenReward: 200,
      status: 'active',
      timeRemaining: 432000
    },
    {
      id: 'w2',
      title: 'Market Explorer',
      description: 'Trade in 10 different markets',
      type: 'weekly',
      difficulty: 'hard',
      progress: 7,
      target: 10,
      xpReward: 750,
      tokenReward: 350,
      status: 'active',
      timeRemaining: 432000
    },
    {
      id: 'w3',
      title: 'Profit Legend',
      description: 'Earn $5,000 profit this week',
      type: 'weekly',
      difficulty: 'legendary',
      progress: 2100,
      target: 5000,
      xpReward: 1500,
      tokenReward: 1000,
      status: 'active',
      timeRemaining: 432000
    },
    // Quest Chains
    {
      id: 'c1',
      title: 'Novice Trader I',
      description: 'Complete your first 10 trades',
      type: 'chain',
      difficulty: 'easy',
      progress: 10,
      target: 10,
      xpReward: 100,
      tokenReward: 25,
      status: 'completed',
      chainPosition: 1,
      chainTotal: 5
    },
    {
      id: 'c2',
      title: 'Novice Trader II',
      description: 'Complete 50 trades',
      type: 'chain',
      difficulty: 'easy',
      progress: 28,
      target: 50,
      xpReward: 200,
      tokenReward: 75,
      status: 'active',
      chainPosition: 2,
      chainTotal: 5,
      requirements: ['Complete Novice Trader I']
    },
    {
      id: 'c3',
      title: 'Novice Trader III',
      description: 'Complete 100 trades',
      type: 'chain',
      difficulty: 'medium',
      progress: 0,
      target: 100,
      xpReward: 500,
      tokenReward: 200,
      status: 'locked',
      chainPosition: 3,
      chainTotal: 5,
      requirements: ['Complete Novice Trader II']
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-blue-400';
      case 'hard': return 'text-purple-400';
      case 'legendary': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20';
      case 'medium': return 'bg-blue-500/20';
      case 'hard': return 'bg-purple-500/20';
      case 'legendary': return 'bg-amber-500/20';
      default: return 'bg-slate-500/20';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const filteredQuests = quests.filter(q => {
    if (activeTab === 'daily') return q.type === 'daily';
    if (activeTab === 'weekly') return q.type === 'weekly';
    return q.type === 'chain';
  });

  const totalXP = quests.filter(q => q.status === 'completed').reduce((sum, q) => sum + q.xpReward, 0);
  const completedQuests = quests.filter(q => q.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl">
              <Swords className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Quest System</h1>
              <p className="text-slate-400">Complete quests to earn XP and rewards</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="text-slate-400 text-sm">Total XP</span>
              </div>
              <div className="text-2xl font-bold text-amber-400">{totalXP.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-400 text-sm">Completed</span>
              </div>
              <div className="text-2xl font-bold text-green-400">{completedQuests}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="text-slate-400 text-sm">Active</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">
                {quests.filter(q => q.status === 'active').length}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'daily'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="font-medium">Daily Quests</span>
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'weekly'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Star className="w-5 h-5" />
              <span className="font-medium">Weekly Quests</span>
            </button>
            <button
              onClick={() => setActiveTab('chains')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'chains'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span className="font-medium">Quest Chains</span>
            </button>
          </div>
        </div>

        {/* Quest List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuests.map(quest => (
            <div
              key={quest.id}
              className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all cursor-pointer ${
                quest.status === 'locked'
                  ? 'border-slate-700 opacity-60'
                  : quest.status === 'completed'
                  ? 'border-green-500/50 bg-green-900/10'
                  : 'border-slate-700 hover:border-purple-500/50'
              }`}
              onClick={() => setSelectedQuest(quest)}
            >
              {/* Quest Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {quest.status === 'locked' && <Lock className="w-5 h-5 text-slate-400" />}
                    {quest.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
                    <h3 className="text-xl font-bold">{quest.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{quest.description}</p>
                  
                  {quest.chainPosition && (
                    <div className="flex items-center gap-2 text-sm text-purple-400 mb-2">
                      <Zap className="w-4 h-4" />
                      <span>Chain Quest {quest.chainPosition}/{quest.chainTotal}</span>
                    </div>
                  )}
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyBg(quest.difficulty)} ${getDifficultyColor(quest.difficulty)}`}>
                  {quest.difficulty.toUpperCase()}
                </div>
              </div>

              {/* Progress Bar */}
              {quest.status !== 'locked' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-bold">
                      {quest.progress} / {quest.target}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                      style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Requirements */}
              {quest.requirements && quest.status === 'locked' && (
                <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-xs text-slate-400 mb-2">Requirements:</div>
                  {quest.requirements.map((req, idx) => (
                    <div key={idx} className="text-sm text-slate-300 flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      {req}
                    </div>
                  ))}
                </div>
              )}

              {/* Rewards */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-amber-400">+{quest.xpReward} XP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <span className="font-bold text-purple-400">+{quest.tokenReward}</span>
                  </div>
                </div>

                {quest.timeRemaining && quest.status === 'active' && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="w-4 h-4" />
                    {formatTime(quest.timeRemaining)}
                  </div>
                )}

                {quest.status === 'completed' && (
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium">
                    Claim Reward
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quest Detail Modal */}
        {selectedQuest && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedQuest(null)}
          >
            <div
              className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedQuest.title}</h2>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyBg(selectedQuest.difficulty)} ${getDifficultyColor(selectedQuest.difficulty)}`}>
                  {selectedQuest.difficulty.toUpperCase()}
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">{selectedQuest.description}</p>
              
              {selectedQuest.status !== 'locked' && (
                <div className="mb-6">
                  <div className="text-sm text-slate-400 mb-2">Current Progress</div>
                  <div className="text-3xl font-bold mb-2">
                    {selectedQuest.progress} / {selectedQuest.target}
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-4">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                      style={{ width: `${(selectedQuest.progress / selectedQuest.target) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    <span className="text-sm text-slate-400">XP Reward</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-400">+{selectedQuest.xpReward}</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-slate-400">Tokens</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">+{selectedQuest.tokenReward}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedQuest(null)}
                className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
