'use client';

import { Calendar, Clock, Gift, Lock, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';

interface SeasonalNFT {
  id: string;
  name: string;
  description: string;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'holiday' | 'anniversary';
  year: number;
  edition: number;
  totalSupply: number;
  remaining: number;
  icon: string;
  rarity: 'limited' | 'rare' | 'ultra-rare' | 'mythic';
  price: number;
  releaseDate: Date;
  expiryDate: Date;
  unlockCondition: string;
  owned: boolean;
  canClaim: boolean;
  commemorates: string;
  bonus: {
    type: 'multiplier' | 'discount' | 'exclusive' | 'airdrop';
    value: number;
    description: string;
  };
}

interface Drop {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  nfts: SeasonalNFT[];
  status: 'upcoming' | 'active' | 'ended';
  theme: string;
}

export default function SeasonalCollectibles() {
  const [selectedDrop, setSelectedDrop] = useState<Drop | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<SeasonalNFT | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimingNFT, setClaimingNFT] = useState<SeasonalNFT | null>(null);

  const [seasonalNFTs, setSeasonalNFTs] = useState<SeasonalNFT[]>([
    {
      id: '1',
      name: 'New Year 2026 Champion',
      description: 'Exclusive NFT for celebrating the new year with the platform',
      season: 'holiday',
      year: 2026,
      edition: 42,
      totalSupply: 1000,
      remaining: 0,
      icon: '🎆',
      rarity: 'limited',
      price: 0,
      releaseDate: new Date('2026-01-01'),
      expiryDate: new Date('2026-01-07'),
      unlockCondition: 'Active during New Year 2026',
      owned: true,
      canClaim: false,
      commemorates: 'New Year 2026 Celebration',
      bonus: {
        type: 'multiplier',
        value: 10,
        description: '10% bonus on all predictions for 30 days'
      }
    },
    {
      id: '2',
      name: 'Winter Solstice 2025',
      description: 'Rare collectible from the longest night of the year',
      season: 'winter',
      year: 2025,
      edition: 156,
      totalSupply: 500,
      remaining: 0,
      icon: '❄️',
      rarity: 'rare',
      price: 0,
      releaseDate: new Date('2025-12-21'),
      expiryDate: new Date('2025-12-27'),
      unlockCondition: 'Made a prediction during winter solstice',
      owned: true,
      canClaim: false,
      commemorates: 'Winter Solstice 2025',
      bonus: {
        type: 'discount',
        value: 25,
        description: '25% trading fee discount for winter season'
      }
    },
    {
      id: '3',
      name: 'Spring Festival 2026',
      description: 'Limited edition celebrating the spring season',
      season: 'spring',
      year: 2026,
      edition: 0,
      totalSupply: 2000,
      remaining: 847,
      icon: '🌸',
      rarity: 'limited',
      price: 100,
      releaseDate: new Date('2026-03-20'),
      expiryDate: new Date('2026-04-20'),
      unlockCondition: 'Trade during spring season',
      owned: false,
      canClaim: true,
      commemorates: 'Spring Equinox 2026',
      bonus: {
        type: 'airdrop',
        value: 500,
        description: '500 platform tokens airdrop'
      }
    },
    {
      id: '4',
      name: 'Platform Anniversary Year 1',
      description: 'Ultra-rare NFT commemorating the first year of ProphetBase',
      season: 'anniversary',
      year: 2026,
      edition: 0,
      totalSupply: 100,
      remaining: 23,
      icon: '🎂',
      rarity: 'ultra-rare',
      price: 1000,
      releaseDate: new Date('2026-06-15'),
      expiryDate: new Date('2026-07-15'),
      unlockCondition: 'Early adopter with 1 year+ membership',
      owned: false,
      canClaim: false,
      commemorates: 'ProphetBase 1st Anniversary',
      bonus: {
        type: 'exclusive',
        value: 1,
        description: 'Lifetime VIP access and governance rights'
      }
    },
    {
      id: '5',
      name: 'Summer Solstice Gold',
      description: 'Mythic NFT available only during the longest day',
      season: 'summer',
      year: 2026,
      edition: 0,
      totalSupply: 50,
      remaining: 50,
      icon: '☀️',
      rarity: 'mythic',
      price: 5000,
      releaseDate: new Date('2026-06-21'),
      expiryDate: new Date('2026-06-22'),
      unlockCondition: 'Complete 100 trades during summer solstice',
      owned: false,
      canClaim: false,
      commemorates: 'Summer Solstice 2026 - Longest Day',
      bonus: {
        type: 'multiplier',
        value: 50,
        description: '50% profit boost on all summer predictions'
      }
    }
  ]);

  const [drops, setDrops] = useState<Drop[]>([
    {
      id: 'd1',
      name: 'Winter Collection 2025',
      description: 'Exclusive NFTs celebrating the winter season',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2026-02-28'),
      status: 'ended',
      theme: '❄️ Winter',
      nfts: seasonalNFTs.filter(nft => nft.season === 'winter')
    },
    {
      id: 'd2',
      name: 'Spring Awakening 2026',
      description: 'New season, new opportunities with spring NFTs',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-05-31'),
      status: 'active',
      theme: '🌸 Spring',
      nfts: seasonalNFTs.filter(nft => nft.season === 'spring')
    },
    {
      id: 'd3',
      name: 'Anniversary Special',
      description: 'Ultra-rare NFTs for our first anniversary',
      startDate: new Date('2026-06-15'),
      endDate: new Date('2026-07-15'),
      status: 'upcoming',
      theme: '🎂 Anniversary',
      nfts: seasonalNFTs.filter(nft => nft.season === 'anniversary')
    }
  ]);

  const handleClaimNFT = async () => {
    if (!claimingNFT) return;

    // Simulate claim
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSeasonalNFTs(prev => prev.map(nft =>
      nft.id === claimingNFT.id
        ? { ...nft, owned: true, canClaim: false, edition: nft.totalSupply - nft.remaining + 1, remaining: nft.remaining - 1 }
        : nft
    ));

    setShowClaimModal(false);
    setClaimingNFT(null);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return 'from-red-600 to-orange-600';
      case 'ultra-rare':
        return 'from-purple-600 to-pink-600';
      case 'rare':
        return 'from-blue-600 to-cyan-600';
      case 'limited':
        return 'from-green-600 to-emerald-600';
      default:
        return 'from-slate-600 to-slate-700';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return 'bg-red-600/20 text-red-400 border-red-500/30';
      case 'ultra-rare':
        return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
      case 'rare':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'limited':
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
    }
  };

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'spring':
        return '🌸';
      case 'summer':
        return '☀️';
      case 'fall':
        return '🍂';
      case 'winter':
        return '❄️';
      case 'holiday':
        return '🎉';
      case 'anniversary':
        return '🎂';
      default:
        return '⭐';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'upcoming':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'ended':
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTimeRemaining = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Ending soon';
  };

  const ownedNFTs = seasonalNFTs.filter(nft => nft.owned);
  const claimableNFTs = seasonalNFTs.filter(nft => nft.canClaim);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl">
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Seasonal Collectibles</h1>
              <p className="text-slate-400">Limited edition NFTs for special events and occasions</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Owned NFTs</span>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">{ownedNFTs.length}</div>
            <div className="text-xs text-slate-400 mt-1">In your collection</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Claimable</span>
              <Gift className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{claimableNFTs.length}</div>
            <div className="text-xs text-slate-400 mt-1">Ready to claim</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Active Drops</span>
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {drops.filter(d => d.status === 'active').length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Live now</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Value</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">
              ${ownedNFTs.reduce((sum, nft) => sum + nft.price, 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">Collection worth</div>
          </div>
        </div>

        {/* Active Drops */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Featured Drops</h2>

          <div className="space-y-4">
            {drops.map((drop) => (
              <div
                key={drop.id}
                className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 cursor-pointer hover:border-blue-500 transition-all"
                onClick={() => setSelectedDrop(drop)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{drop.theme.split(' ')[0]}</div>
                    <div>
                      <h3 className="font-bold text-lg">{drop.name}</h3>
                      <p className="text-sm text-slate-400">{drop.description}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(drop.status)}`}>
                    {drop.status.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-600/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Start Date</div>
                    <div className="font-semibold">{formatDate(drop.startDate)}</div>
                  </div>
                  <div className="bg-slate-600/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">End Date</div>
                    <div className="font-semibold">{formatDate(drop.endDate)}</div>
                  </div>
                  <div className="bg-slate-600/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">NFTs Available</div>
                    <div className="font-semibold">{drop.nfts.length} items</div>
                  </div>
                </div>

                {drop.status === 'active' && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
                    <Clock className="w-4 h-4" />
                    {getTimeRemaining(drop.endDate)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal NFTs Grid */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">All Seasonal NFTs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seasonalNFTs.map((nft) => (
              <div
                key={nft.id}
                onClick={() => setSelectedNFT(nft)}
                className={`bg-slate-700/50 rounded-xl border cursor-pointer transition-all hover:scale-105 overflow-hidden ${
                  nft.owned 
                    ? 'border-green-500/30' 
                    : nft.canClaim 
                    ? 'border-blue-500/30' 
                    : 'border-slate-600'
                }`}
              >
                <div className={`h-48 bg-gradient-to-br ${getRarityColor(nft.rarity)} flex items-center justify-center relative`}>
                  <div className="text-7xl">{nft.icon}</div>
                  {nft.owned && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-600/80 rounded-full text-xs font-semibold">
                      Owned
                    </div>
                  )}
                  {nft.canClaim && !nft.owned && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600/80 rounded-full text-xs font-semibold animate-pulse">
                      Claimable
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-full text-xs">
                    {getSeasonIcon(nft.season)} {nft.season}
                  </div>
                </div>

                <div className="p-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold mb-3 border ${getRarityBadgeColor(nft.rarity)}`}>
                    {nft.rarity.toUpperCase()}
                  </div>

                  <h3 className="font-bold text-lg mb-2">{nft.name}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{nft.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Edition</span>
                      <span className="font-semibold">
                        {nft.owned ? `#${nft.edition}` : '--'} / {nft.totalSupply}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Remaining</span>
                      <span className="font-semibold">{nft.remaining}</span>
                    </div>
                  </div>

                  {nft.owned ? (
                    <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-3">
                      <div className="text-xs text-green-400 mb-1">Bonus Active</div>
                      <div className="text-sm font-semibold">{nft.bonus.description}</div>
                    </div>
                  ) : nft.canClaim ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setClaimingNFT(nft);
                        setShowClaimModal(true);
                      }}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                    >
                      Claim Free
                    </button>
                  ) : (
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Lock className="w-3 h-3" />
                        {nft.unlockCondition}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Claim Modal */}
        {showClaimModal && claimingNFT && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4">Claim Seasonal NFT</h3>

              <div className={`w-full h-64 rounded-xl bg-gradient-to-br ${getRarityColor(claimingNFT.rarity)} flex items-center justify-center text-8xl mb-4`}>
                {claimingNFT.icon}
              </div>

              <h4 className="font-bold text-lg mb-2">{claimingNFT.name}</h4>
              <p className="text-sm text-slate-400 mb-4">{claimingNFT.description}</p>

              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mb-4">
                <div className="text-sm text-blue-400 mb-2">NFT Bonus:</div>
                <div className="text-sm font-semibold">{claimingNFT.bonus.description}</div>
              </div>

              <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4 mb-6">
                <div className="text-xs text-yellow-400 mb-1">⚠️ Limited Edition</div>
                <div className="text-sm">Only {claimingNFT.remaining} / {claimingNFT.totalSupply} remaining!</div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowClaimModal(false);
                    setClaimingNFT(null);
                  }}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClaimNFT}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  Claim Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Panel */}
        <div className="bg-purple-600/10 border border-purple-600/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-purple-400 mb-2">About Seasonal Collectibles</h3>
              <p className="text-sm text-slate-300">
                Seasonal NFTs are limited edition collectibles released during special events, holidays, and platform milestones. 
                Each NFT comes with unique bonuses and benefits. Once the drop ends, these NFTs become permanently scarce and can only be traded on the secondary market.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
