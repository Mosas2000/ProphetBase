'use client';

import { Award, Lock, RefreshCw, Star, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';

interface Skill {
  id: string;
  name: string;
  description: string;
  tier: number;
  branch: 'trading' | 'analysis' | 'risk';
  cost: number;
  unlocked: boolean;
  maxLevel: number;
  currentLevel: number;
  requirements: string[];
  bonuses: string[];
}

interface SkillBranch {
  name: string;
  color: string;
  icon: string;
  description: string;
}

export default function SkillTree() {
  const [selectedBranch, setSelectedBranch] = useState<'trading' | 'analysis' | 'risk'>('trading');
  const [skillPoints, setSkillPoints] = useState(15);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const branches: Record<string, SkillBranch> = {
    trading: {
      name: 'Trading Mastery',
      color: 'blue',
      icon: '📈',
      description: 'Improve trade execution and timing'
    },
    analysis: {
      name: 'Market Analysis',
      color: 'purple',
      icon: '🔍',
      description: 'Enhanced market insights and predictions'
    },
    risk: {
      name: 'Risk Management',
      color: 'green',
      icon: '🛡️',
      description: 'Better portfolio protection and stops'
    }
  };

  const [skills] = useState<Skill[]>([
    // Trading Branch - Tier 1
    {
      id: 't1',
      name: 'Quick Execution',
      description: 'Reduce trade execution time by 10%',
      tier: 1,
      branch: 'trading',
      cost: 1,
      unlocked: true,
      maxLevel: 3,
      currentLevel: 3,
      requirements: [],
      bonuses: ['+10% faster trades', 'Priority queue access']
    },
    // Trading Branch - Tier 2
    {
      id: 't2',
      name: 'Fee Reduction',
      description: 'Lower trading fees by 5% per level',
      tier: 2,
      branch: 'trading',
      cost: 2,
      unlocked: true,
      maxLevel: 5,
      currentLevel: 2,
      requirements: ['Quick Execution Lv.3'],
      bonuses: ['-10% trading fees', 'VIP fee tier']
    },
    {
      id: 't3',
      name: 'Leverage Master',
      description: 'Unlock higher leverage options',
      tier: 2,
      branch: 'trading',
      cost: 2,
      unlocked: false,
      maxLevel: 3,
      currentLevel: 0,
      requirements: ['Quick Execution Lv.3'],
      bonuses: ['+2x max leverage', 'Margin rate reduction']
    },
    // Trading Branch - Tier 3
    {
      id: 't4',
      name: 'Position Sizing',
      description: 'Optimize position sizes automatically',
      tier: 3,
      branch: 'trading',
      cost: 3,
      unlocked: false,
      maxLevel: 3,
      currentLevel: 0,
      requirements: ['Fee Reduction Lv.3', 'Leverage Master Lv.2'],
      bonuses: ['Auto position calculator', '+15% profit optimization']
    },

    // Analysis Branch - Tier 1
    {
      id: 'a1',
      name: 'Chart Patterns',
      description: 'Recognize common chart patterns',
      tier: 1,
      branch: 'analysis',
      cost: 1,
      unlocked: true,
      maxLevel: 3,
      currentLevel: 1,
      requirements: [],
      bonuses: ['Pattern alerts', 'Success rate display']
    },
    // Analysis Branch - Tier 2
    {
      id: 'a2',
      name: 'Technical Indicators',
      description: 'Unlock advanced indicators',
      tier: 2,
      branch: 'analysis',
      cost: 2,
      unlocked: false,
      maxLevel: 4,
      currentLevel: 0,
      requirements: ['Chart Patterns Lv.2'],
      bonuses: ['20+ indicators', 'Custom indicator builder']
    },
    {
      id: 'a3',
      name: 'Market Sentiment',
      description: 'Real-time sentiment analysis',
      tier: 2,
      branch: 'analysis',
      cost: 2,
      unlocked: false,
      maxLevel: 3,
      currentLevel: 0,
      requirements: ['Chart Patterns Lv.2'],
      bonuses: ['Sentiment score', 'Social media tracking']
    },
    // Analysis Branch - Tier 3
    {
      id: 'a4',
      name: 'AI Predictions',
      description: 'ML-powered price predictions',
      tier: 3,
      branch: 'analysis',
      cost: 4,
      unlocked: false,
      maxLevel: 2,
      currentLevel: 0,
      requirements: ['Technical Indicators Lv.3', 'Market Sentiment Lv.2'],
      bonuses: ['AI prediction model', '80% accuracy rate']
    },

    // Risk Branch - Tier 1
    {
      id: 'r1',
      name: 'Stop Loss Pro',
      description: 'Advanced stop loss strategies',
      tier: 1,
      branch: 'risk',
      cost: 1,
      unlocked: true,
      maxLevel: 3,
      currentLevel: 2,
      requirements: [],
      bonuses: ['Trailing stops', 'Conditional stops']
    },
    // Risk Branch - Tier 2
    {
      id: 'r2',
      name: 'Portfolio Shield',
      description: 'Automatic portfolio rebalancing',
      tier: 2,
      branch: 'risk',
      cost: 2,
      unlocked: true,
      maxLevel: 3,
      currentLevel: 1,
      requirements: ['Stop Loss Pro Lv.2'],
      bonuses: ['Auto-rebalance', 'Risk score monitoring']
    },
    {
      id: 'r3',
      name: 'Hedge Master',
      description: 'Advanced hedging strategies',
      tier: 2,
      branch: 'risk',
      cost: 2,
      unlocked: false,
      maxLevel: 3,
      currentLevel: 0,
      requirements: ['Stop Loss Pro Lv.2'],
      bonuses: ['Hedge calculator', 'Cross-market hedging']
    },
    // Risk Branch - Tier 3
    {
      id: 'r4',
      name: 'Insurance Protocol',
      description: 'Trade insurance coverage',
      tier: 3,
      branch: 'risk',
      cost: 3,
      unlocked: false,
      maxLevel: 2,
      currentLevel: 0,
      requirements: ['Portfolio Shield Lv.3', 'Hedge Master Lv.2'],
      bonuses: ['Up to 50% loss coverage', 'Premium insurance']
    }
  ]);

  const filteredSkills = skills.filter(s => s.branch === selectedBranch);
  const maxTier = Math.max(...filteredSkills.map(s => s.tier));

  const canUnlock = (skill: Skill) => {
    if (skill.unlocked && skill.currentLevel >= skill.maxLevel) return false;
    if (skillPoints < skill.cost) return false;
    
    if (skill.requirements.length === 0) return !skill.unlocked || skill.currentLevel < skill.maxLevel;
    
    return skill.requirements.every(req => {
      const parts = req.split(' Lv.');
      const reqSkillName = parts[0];
      const reqLevel = parseInt(parts[1]);
      const reqSkill = skills.find(s => s.name === reqSkillName);
      return reqSkill && reqSkill.currentLevel >= reqLevel;
    });
  };

  const handleUnlock = (skill: Skill) => {
    if (!canUnlock(skill)) return;
    
    if (!skill.unlocked) {
      skill.unlocked = true;
      skill.currentLevel = 1;
    } else {
      skill.currentLevel++;
    }
    
    setSkillPoints(skillPoints - skill.cost);
  };

  const totalPointsSpent = skills.reduce((sum, skill) => sum + (skill.currentLevel * skill.cost), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-xl">
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Skill Tree</h1>
                <p className="text-slate-400">Unlock abilities and specialize your trading style</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-400 mb-1">Available Points</div>
              <div className="text-4xl font-bold text-cyan-400">{skillPoints}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="text-slate-400 text-sm">Points Spent</span>
              </div>
              <div className="text-2xl font-bold">{totalPointsSpent}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-green-400" />
                <span className="text-slate-400 text-sm">Skills Unlocked</span>
              </div>
              <div className="text-2xl font-bold">{skills.filter(s => s.unlocked).length}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-slate-400 text-sm">Max Skill Level</span>
              </div>
              <div className="text-2xl font-bold">{Math.max(...skills.map(s => s.currentLevel))}</div>
            </div>
          </div>

          {/* Branch Selector */}
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(branches).map(([key, branch]) => (
              <button
                key={key}
                onClick={() => setSelectedBranch(key as typeof selectedBranch)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedBranch === key
                    ? `bg-${branch.color}-500/20 border-${branch.color}-500`
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="text-4xl mb-3">{branch.icon}</div>
                <h3 className="text-lg font-bold mb-2">{branch.name}</h3>
                <p className="text-sm text-slate-400">{branch.description}</p>
                <div className="mt-3 text-sm font-medium">
                  {skills.filter(s => s.branch === key && s.unlocked).length}/
                  {skills.filter(s => s.branch === key).length} Unlocked
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Skill Tree Visualization */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{branches[selectedBranch].name}</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Reset Skills</span>
            </button>
          </div>

          {/* Tiers */}
          <div className="space-y-8">
            {Array.from({ length: maxTier }, (_, i) => i + 1).map(tier => (
              <div key={tier}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-slate-700 rounded-full font-bold text-lg">
                    {tier}
                  </div>
                  <div className="flex-1 h-0.5 bg-slate-700" />
                  <span className="text-sm text-slate-400">Tier {tier}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSkills
                    .filter(skill => skill.tier === tier)
                    .map(skill => (
                      <div
                        key={skill.id}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          skill.unlocked && skill.currentLevel >= skill.maxLevel
                            ? 'bg-green-500/20 border-green-500'
                            : skill.unlocked
                            ? 'bg-cyan-500/20 border-cyan-500'
                            : canUnlock(skill)
                            ? 'bg-slate-700/50 border-slate-600 hover:border-cyan-500'
                            : 'bg-slate-800/50 border-slate-700 opacity-50'
                        }`}
                        onClick={() => setSelectedSkill(skill)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold mb-1">{skill.name}</h3>
                            <div className="flex items-center gap-2">
                              {skill.unlocked ? (
                                <span className="text-sm font-medium text-cyan-400">
                                  Level {skill.currentLevel}/{skill.maxLevel}
                                </span>
                              ) : (
                                <span className="text-sm text-slate-400">Locked</span>
                              )}
                              <span className="text-xs text-slate-400">Cost: {skill.cost} SP</span>
                            </div>
                          </div>
                          {skill.unlocked && skill.currentLevel >= skill.maxLevel ? (
                            <Award className="w-6 h-6 text-green-400" />
                          ) : skill.unlocked ? (
                            <Zap className="w-6 h-6 text-cyan-400" />
                          ) : (
                            <Lock className="w-6 h-6 text-slate-400" />
                          )}
                        </div>

                        <p className="text-sm text-slate-300 mb-3">{skill.description}</p>

                        {skill.requirements.length > 0 && !skill.unlocked && (
                          <div className="mb-3 p-2 bg-slate-700/50 rounded text-xs">
                            <div className="text-slate-400 mb-1">Requires:</div>
                            {skill.requirements.map((req, idx) => (
                              <div key={idx} className="text-slate-300">{req}</div>
                            ))}
                          </div>
                        )}

                        <div className="space-y-1 mb-3">
                          {skill.bonuses.map((bonus, idx) => (
                            <div key={idx} className="text-xs text-green-400 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {bonus}
                            </div>
                          ))}
                        </div>

                        {canUnlock(skill) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlock(skill);
                            }}
                            className="w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
                          >
                            {skill.unlocked ? 'Upgrade' : 'Unlock'} ({skill.cost} SP)
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Detail Modal */}
        {selectedSkill && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSkill(null)}
          >
            <div
              className="bg-slate-800 rounded-xl p-6 border-2 border-cyan-500 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedSkill.name}</h2>
                <div className="text-right">
                  {selectedSkill.unlocked ? (
                    <div className="text-lg font-bold text-cyan-400">
                      Lv. {selectedSkill.currentLevel}/{selectedSkill.maxLevel}
                    </div>
                  ) : (
                    <Lock className="w-6 h-6 text-slate-400" />
                  )}
                </div>
              </div>

              <p className="text-slate-300 mb-4">{selectedSkill.description}</p>

              <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                <div className="text-sm text-slate-400 mb-2">Bonuses:</div>
                <div className="space-y-2">
                  {selectedSkill.bonuses.map((bonus, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>{bonus}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSkill.requirements.length > 0 && (
                <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                  <div className="text-sm text-slate-400 mb-2">Requirements:</div>
                  {selectedSkill.requirements.map((req, idx) => (
                    <div key={idx} className="text-slate-300">{req}</div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                {canUnlock(selectedSkill) && (
                  <button
                    onClick={() => {
                      handleUnlock(selectedSkill);
                      setSelectedSkill(null);
                    }}
                    className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors font-medium"
                  >
                    {selectedSkill.unlocked ? 'Upgrade' : 'Unlock'} ({selectedSkill.cost} SP)
                  </button>
                )}
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
