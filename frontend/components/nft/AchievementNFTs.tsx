'use client';

import { Award, CheckCircle, Clock, Gift, Lock, Send, Share2, Trophy } from 'lucide-react';
import { useState } from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'trading' | 'social' | 'milestones' | 'special';
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: string;
  unlocked: boolean;
  unlockedDate: Date | null;
  progress: number;
  maxProgress: number;
  nftMinted: boolean;
  nftTokenId: string | null;
  transferrable: boolean;
  reward: {
    type: 'token' | 'boost' | 'exclusive';
    amount: number;
    description: string;
  };
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  requirement: number;
  current: number;
  reward: string;
  completed: boolean;
}

export default function AchievementNFTs() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'trading' | 'social' | 'milestones' | 'special'>('all');
  const [showMintModal, setShowMintModal] = useState(false);
  const [mintingAchievement, setMintingAchievement] = useState<Achievement | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      name: 'First Blood',
      description: 'Made your first prediction',
      category: 'trading',
      rarity: 'bronze',
      icon: '🎯',
      unlocked: true,
      unlockedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
      progress: 1,
      maxProgress: 1,
      nftMinted: true,
      nftTokenId: '0x1a2b3c',
      transferrable: true,
      reward: {
        type: 'token',
        amount: 100,
        description: '100 Prediction Tokens'
      }
    },
    {
      id: '2',
      name: 'Market Master',
      description: 'Achieved 10 correct predictions in a row',
      category: 'trading',
      rarity: 'gold',
      icon: '🏆',
      unlocked: true,
      unlockedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      progress: 10,
      maxProgress: 10,
      nftMinted: false,
      nftTokenId: null,
      transferrable: true,
      reward: {
        type: 'boost',
        amount: 25,
        description: '25% Trading Fee Discount for 30 days'
      }
    },
    {
      id: '3',
      name: 'Diamond Hands',
      description: 'Held a position for 90 days without selling',
      category: 'milestones',
      rarity: 'diamond',
      icon: '💎',
      unlocked: true,
      unlockedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      progress: 90,
      maxProgress: 90,
      nftMinted: false,
      nftTokenId: null,
      transferrable: false,
      reward: {
        type: 'exclusive',
        amount: 1,
        description: 'Exclusive Diamond Hands Badge'
      }
    },
    {
      id: '4',
      name: 'Social Butterfly',
      description: 'Invited 50 friends to the platform',
      category: 'social',
      rarity: 'silver',
      icon: '🦋',
      unlocked: true,
      unlockedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
      progress: 50,
      maxProgress: 50,
      nftMinted: true,
      nftTokenId: '0x4d5e6f',
      transferrable: true,
      reward: {
        type: 'token',
        amount: 500,
        description: '500 Prediction Tokens'
      }
    },
    {
      id: '5',
      name: 'Early Adopter',
      description: 'Joined during platform beta',
      category: 'special',
      rarity: 'platinum',
      icon: '⭐',
      unlocked: true,
      unlockedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
      progress: 1,
      maxProgress: 1,
      nftMinted: true,
      nftTokenId: '0x7g8h9i',
      transferrable: false,
      reward: {
        type: 'exclusive',
        amount: 1,
        description: 'Lifetime VIP Status'
      }
    },
    {
      id: '6',
      name: 'Prediction Rookie',
      description: 'Make 100 predictions',
      category: 'trading',
      rarity: 'bronze',
      icon: '🎲',
      unlocked: false,
      unlockedDate: null,
      progress: 67,
      maxProgress: 100,
      nftMinted: false,
      nftTokenId: null,
      transferrable: true,
      reward: {
        type: 'token',
        amount: 200,
        description: '200 Prediction Tokens'
      }
    },
    {
      id: '7',
      name: 'Whale Watcher',
      description: 'Trade over $100,000 in volume',
      category: 'milestones',
      rarity: 'gold',
      icon: '🐋',
      unlocked: false,
      unlockedDate: null,
      progress: 72500,
      maxProgress: 100000,
      nftMinted: false,
      nftTokenId: null,
      transferrable: true,
      reward: {
        type: 'boost',
        amount: 50,
        description: '50% Fee Discount Permanently'
      }
    },
    {
      id: '8',
      name: 'Community Champion',
      description: 'Reach top 10 on the leaderboard',
      category: 'social',
      rarity: 'platinum',
      icon: '👑',
      unlocked: false,
      unlockedDate: null,
      progress: 24,
      maxProgress: 10,
      nftMinted: false,
      nftTokenId: null,
      transferrable: false,
      reward: {
        type: 'exclusive',
        amount: 1,
        description: 'Hall of Fame Entry'
      }
    }
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 'm1',
      title: 'Prediction Apprentice',
      description: 'Make 10 predictions',
      requirement: 10,
      current: 10,
      reward: '🥉 Bronze Achievement',
      completed: true
    },
    {
      id: 'm2',
      title: 'Prediction Expert',
      description: 'Make 50 predictions',
      requirement: 50,
      current: 50,
      reward: '🥈 Silver Achievement',
      completed: true
    },
    {
      id: 'm3',
      title: 'Prediction Master',
      description: 'Make 100 predictions',
      requirement: 100,
      current: 67,
      reward: '🥇 Gold Achievement',
      completed: false
    },
    {
      id: 'm4',
      title: 'Prediction Legend',
      description: 'Make 500 predictions',
      requirement: 500,
      current: 67,
      reward: '💎 Diamond Achievement',
      completed: false
    }
  ]);

  const handleMintNFT = async (achievement: Achievement) => {
    setMintingAchievement(achievement);
    setShowMintModal(true);
  };

  const confirmMint = async () => {
    if (!mintingAchievement) return;
    
    setIsMinting(true);
    // Simulate minting process
    await new Promise(resolve => setTimeout(resolve, 3000));

    setAchievements(prev => prev.map(ach =>
      ach.id === mintingAchievement.id
        ? { ...ach, nftMinted: true, nftTokenId: `0x${Date.now().toString(16)}` }
        : ach
    ));

    setIsMinting(false);
    setShowMintModal(false);
    setMintingAchievement(null);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'diamond':
        return 'from-cyan-400 to-blue-600';
      case 'platinum':
        return 'from-slate-300 to-slate-500';
      case 'gold':
        return 'from-yellow-400 to-orange-600';
      case 'silver':
        return 'from-slate-400 to-slate-600';
      case 'bronze':
        return 'from-orange-600 to-orange-800';
      default:
        return 'from-slate-600 to-slate-800';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'diamond':
        return 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30';
      case 'platinum':
        return 'bg-slate-500/20 text-slate-300 border-slate-400/30';
      case 'gold':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case 'silver':
        return 'bg-slate-400/20 text-slate-400 border-slate-500/30';
      case 'bronze':
        return 'bg-orange-600/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
    }
  };

  const filteredAchievements = achievements.filter(ach =>
    selectedCategory === 'all' || ach.category === selectedCategory
  );

  const unlockedCount = achievements.filter(ach => ach.unlocked).length;
  const mintedCount = achievements.filter(ach => ach.nftMinted).length;
  const totalRewards = achievements
    .filter(ach => ach.unlocked && ach.reward.type === 'token')
    .reduce((sum, ach) => sum + ach.reward.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Achievement NFTs</h1>
              <p className="text-slate-400">Unlock, mint, and showcase your accomplishments</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Unlocked</span>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{unlockedCount} / {achievements.length}</div>
            <div className="text-xs text-slate-400 mt-1">{Math.round((unlockedCount / achievements.length) * 100)}% Complete</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">NFTs Minted</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400">{mintedCount}</div>
            <div className="text-xs text-slate-400 mt-1">Ready to trade</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Rewards</span>
              <Gift className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">{totalRewards}</div>
            <div className="text-xs text-slate-400 mt-1">Tokens earned</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Pending</span>
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {achievements.filter(ach => ach.unlocked && !ach.nftMinted).length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Ready to mint</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'all', label: 'All Achievements', icon: Trophy },
              { id: 'trading', label: 'Trading', icon: TrendingUp },
              { id: 'social', label: 'Social', icon: Share2 },
              { id: 'milestones', label: 'Milestones', icon: Award },
              { id: 'special', label: 'Special', icon: Gift }
            ].map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              onClick={() => setSelectedAchievement(achievement)}
              className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border cursor-pointer transition-all hover:scale-105 ${
                achievement.unlocked 
                  ? 'border-slate-700 hover:border-blue-500' 
                  : 'border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center text-3xl`}>
                  {achievement.unlocked ? achievement.icon : <Lock className="w-8 h-8 text-slate-400" />}
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getRarityBadgeColor(achievement.rarity)}`}>
                  {achievement.rarity.toUpperCase()}
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2">{achievement.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{achievement.description}</p>

              {achievement.unlocked ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    Unlocked {achievement.unlockedDate ? new Date(achievement.unlockedDate).toLocaleDateString() : ''}
                  </div>

                  {achievement.nftMinted ? (
                    <div className="space-y-2">
                      <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-3">
                        <div className="text-xs text-purple-400 mb-1">NFT Token ID</div>
                        <div className="font-mono text-sm">{achievement.nftTokenId}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                        {achievement.transferrable && (
                          <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <Send className="w-4 h-4" />
                            Transfer
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMintNFT(achievement);
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      Mint as NFT
                    </button>
                  )}

                  <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                    <div className="text-xs text-blue-400 mb-1">Reward</div>
                    <div className="text-sm font-semibold">{achievement.reward.description}</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Progress</span>
                      <span className="font-semibold">
                        {achievement.progress.toLocaleString()} / {achievement.maxProgress.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full"
                        style={{ width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Locked Reward</div>
                    <div className="text-sm font-semibold text-slate-300">{achievement.reward.description}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Milestones Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-6">Milestone Tracker</h2>
          
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <p className="text-sm text-slate-400">{milestone.description}</p>
                  </div>
                  {milestone.completed && <CheckCircle className="w-6 h-6 text-green-400" />}
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-semibold">
                      {milestone.current.toLocaleString()} / {milestone.requirement.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${
                        milestone.completed 
                          ? 'bg-green-500' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600'
                      }`}
                      style={{ width: `${Math.min((milestone.current / milestone.requirement) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className={`px-3 py-2 rounded-lg text-sm ${
                  milestone.completed 
                    ? 'bg-green-600/20 text-green-400' 
                    : 'bg-slate-600/20 text-slate-400'
                }`}>
                  Reward: {milestone.reward}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mint Modal */}
        {showMintModal && mintingAchievement && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4">Mint Achievement NFT</h3>

              <div className="mb-6">
                <div className={`w-full h-48 rounded-xl bg-gradient-to-br ${getRarityColor(mintingAchievement.rarity)} flex items-center justify-center text-6xl mb-4`}>
                  {mintingAchievement.icon}
                </div>

                <h4 className="font-bold text-lg mb-2">{mintingAchievement.name}</h4>
                <p className="text-sm text-slate-400 mb-4">{mintingAchievement.description}</p>

                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mb-4">
                  <div className="text-sm text-blue-400 mb-2">Minting Details:</div>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• NFT will be stored on IPFS</li>
                    <li>• Gas fee: ~0.002 ETH (~$5)</li>
                    <li>• {mintingAchievement.transferrable ? 'Transferrable' : 'Soulbound (Non-transferrable)'}</li>
                    <li>• ERC-721 standard compliant</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowMintModal(false);
                    setMintingAchievement(null);
                  }}
                  disabled={isMinting}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMint}
                  disabled={isMinting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isMinting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      Confirm Mint
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
