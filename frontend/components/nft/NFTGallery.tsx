'use client';

import { Download, Eye, Grid3x3, Heart, LayoutGrid, LayoutList, Share2, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface GalleryNFT {
  id: string;
  tokenId: string;
  name: string;
  collection: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  rarityScore: number;
  category: 'trading-card' | 'achievement' | 'profile' | 'seasonal' | 'dynamic';
  acquiredDate: Date;
  estimatedValue: number;
  views: number;
  likes: number;
  icon: string;
  description: string;
  attributes: {
    name: string;
    value: string;
    rarity: number;
  }[];
}

type ViewMode = 'grid' | 'list' | '3d';
type SortMode = 'recent' | 'value' | 'rarity' | 'name' | 'likes';
type FilterCategory = 'all' | 'trading-card' | 'achievement' | 'profile' | 'seasonal' | 'dynamic';

export default function NFTGallery() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortMode>('recent');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<GalleryNFT | null>(null);

  const [galleryNFTs] = useState<GalleryNFT[]>([
    {
      id: '1',
      tokenId: '0x1a2b3c',
      name: 'Legendary Bull #0042',
      collection: 'Prediction Trading Cards',
      rarity: 'legendary',
      rarityScore: 98,
      category: 'trading-card',
      acquiredDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
      estimatedValue: 1250,
      views: 342,
      likes: 89,
      icon: '👑',
      description: 'A legendary trading card representing the ultimate prediction master.',
      attributes: [
        { name: 'Strength', value: '95', rarity: 98 },
        { name: 'Intelligence', value: '92', rarity: 95 },
        { name: 'Luck', value: '88', rarity: 90 },
        { name: 'Year', value: '2024', rarity: 100 }
      ]
    },
    {
      id: '2',
      tokenId: '0x4d5e6f',
      name: 'Diamond Achievement',
      collection: 'Achievement NFTs',
      rarity: 'legendary',
      rarityScore: 95,
      category: 'achievement',
      acquiredDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      estimatedValue: 890,
      views: 256,
      likes: 67,
      icon: '💎',
      description: 'Earned for reaching the highest tier of trading excellence.',
      attributes: [
        { name: 'Tier', value: 'Diamond', rarity: 99 },
        { name: 'Milestone', value: '1000 Wins', rarity: 98 },
        { name: 'Transferrable', value: 'No', rarity: 100 }
      ]
    },
    {
      id: '3',
      tokenId: '0x7g8h9i',
      name: 'Epic Prophet Profile',
      collection: 'Prophet Profiles',
      rarity: 'epic',
      rarityScore: 85,
      category: 'profile',
      acquiredDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      estimatedValue: 680,
      views: 189,
      likes: 45,
      icon: '🔮',
      description: 'Generative profile picture with rare trait combinations.',
      attributes: [
        { name: 'Background', value: 'Cosmic', rarity: 92 },
        { name: 'Body', value: 'Crystal', rarity: 88 },
        { name: 'Eyes', value: 'Laser', rarity: 85 },
        { name: 'Accessory', value: 'Crown', rarity: 90 }
      ]
    },
    {
      id: '4',
      tokenId: '0xj1k2l3',
      name: 'Winter Mythic #0012',
      collection: 'Seasonal Collectibles',
      rarity: 'legendary',
      rarityScore: 99,
      category: 'seasonal',
      acquiredDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      estimatedValue: 1450,
      views: 567,
      likes: 134,
      icon: '❄️',
      description: 'Ultra-rare winter edition collectible with limited supply.',
      attributes: [
        { name: 'Season', value: 'Winter 2024', rarity: 100 },
        { name: 'Edition', value: '#12/100', rarity: 99 },
        { name: 'Rarity', value: 'Mythic', rarity: 100 }
      ]
    },
    {
      id: '5',
      tokenId: '0xm4n5o6',
      name: 'Prophet Master Lvl 15',
      collection: 'Dynamic NFTs',
      rarity: 'legendary',
      rarityScore: 92,
      category: 'dynamic',
      acquiredDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      estimatedValue: 980,
      views: 298,
      likes: 72,
      icon: '🔮',
      description: 'Dynamic NFT that evolves based on trading performance.',
      attributes: [
        { name: 'Level', value: '15', rarity: 88 },
        { name: 'Accuracy', value: '87%', rarity: 92 },
        { name: 'Evolution', value: 'Expert', rarity: 90 },
        { name: 'Achievements', value: '5', rarity: 85 }
      ]
    },
    {
      id: '6',
      tokenId: '0xp7q8r9',
      name: 'Rare Strategist #2341',
      collection: 'Prediction Trading Cards',
      rarity: 'rare',
      rarityScore: 72,
      category: 'trading-card',
      acquiredDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      estimatedValue: 340,
      views: 123,
      likes: 28,
      icon: '🌟',
      description: 'A strategic trading card with balanced attributes.',
      attributes: [
        { name: 'Strength', value: '75', rarity: 75 },
        { name: 'Intelligence', value: '78', rarity: 72 },
        { name: 'Luck', value: '70', rarity: 68 }
      ]
    }
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'text-yellow-400 bg-yellow-600/20 border-yellow-500/30';
      case 'epic':
        return 'text-purple-400 bg-purple-600/20 border-purple-500/30';
      case 'rare':
        return 'text-blue-400 bg-blue-600/20 border-blue-500/30';
      case 'uncommon':
        return 'text-green-400 bg-green-600/20 border-green-500/30';
      case 'common':
        return 'text-slate-400 bg-slate-600/20 border-slate-500/30';
      default:
        return 'text-slate-400 bg-slate-600/20 border-slate-500/30';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'trading-card':
        return 'Trading Cards';
      case 'achievement':
        return 'Achievements';
      case 'profile':
        return 'Profiles';
      case 'seasonal':
        return 'Seasonal';
      case 'dynamic':
        return 'Dynamic';
      default:
        return 'All';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filterAndSortNFTs = () => {
    let filtered = [...galleryNFTs];

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter((nft) => nft.category === filterCategory);
    }

    // Rarity filter
    if (filterRarity !== 'all') {
      filtered = filtered.filter((nft) => nft.rarity === filterRarity);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.acquiredDate.getTime() - a.acquiredDate.getTime();
        case 'value':
          return b.estimatedValue - a.estimatedValue;
        case 'rarity':
          return b.rarityScore - a.rarityScore;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const totalValue = galleryNFTs.reduce((sum, nft) => sum + nft.estimatedValue, 0);
  const totalViews = galleryNFTs.reduce((sum, nft) => sum + nft.views, 0);
  const totalLikes = galleryNFTs.reduce((sum, nft) => sum + nft.likes, 0);
  const avgRarity = Math.round(
    galleryNFTs.reduce((sum, nft) => sum + nft.rarityScore, 0) / galleryNFTs.length
  );

  const filteredNFTs = filterAndSortNFTs();

  const handleShare = () => {
    if (selectedNFT) {
      alert(`Shared: ${selectedNFT.name}`);
      setShowShareModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl">
              <LayoutGrid className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">NFT Gallery</h1>
              <p className="text-slate-400">Your personal collection showcase with rarity rankings</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Collection Size</span>
              <LayoutGrid className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-bold text-pink-400">{galleryNFTs.length} NFTs</div>
            <div className="text-xs text-slate-400 mt-1">Total items</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Value</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(totalValue)}</div>
            <div className="text-xs text-slate-400 mt-1">Estimated worth</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Avg Rarity</span>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">{avgRarity}/100</div>
            <div className="text-xs text-slate-400 mt-1">Rarity score</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Engagement</span>
              <Heart className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">{totalLikes}</div>
            <div className="text-xs text-slate-400 mt-1">{totalViews} views</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                <LayoutList className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === '3d'
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex-1 flex flex-wrap gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="trading-card">Trading Cards</option>
                <option value="achievement">Achievements</option>
                <option value="profile">Profiles</option>
                <option value="seasonal">Seasonal</option>
                <option value="dynamic">Dynamic</option>
              </select>

              <select
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm"
              >
                <option value="all">All Rarities</option>
                <option value="legendary">Legendary</option>
                <option value="epic">Epic</option>
                <option value="rare">Rare</option>
                <option value="uncommon">Uncommon</option>
                <option value="common">Common</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortMode)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm"
              >
                <option value="recent">Recently Acquired</option>
                <option value="value">Highest Value</option>
                <option value="rarity">Highest Rarity</option>
                <option value="name">Name (A-Z)</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gallery Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNFTs.map((nft) => (
              <div
                key={nft.id}
                onClick={() => {
                  setSelectedNFT(nft);
                  setShowShareModal(true);
                }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden hover:border-pink-500 transition-all cursor-pointer"
              >
                <div className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 p-12 flex items-center justify-center relative">
                  <div className="text-8xl">{nft.icon}</div>
                  <div className="absolute top-3 right-3">
                    <div className={`px-2 py-1 rounded text-xs font-semibold border ${getRarityColor(nft.rarity)}`}>
                      {nft.rarity.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                  <p className="text-sm text-slate-400 mb-3">{nft.collection}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-700/30 rounded-lg p-2">
                      <div className="text-xs text-slate-400 mb-1">Value</div>
                      <div className="font-bold text-green-400">{formatCurrency(nft.estimatedValue)}</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-2">
                      <div className="text-xs text-slate-400 mb-1">Rarity</div>
                      <div className="font-bold text-yellow-400">{nft.rarityScore}/100</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {nft.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {nft.likes}
                    </div>
                    <div>{formatDate(nft.acquiredDate)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredNFTs.map((nft) => (
              <div
                key={nft.id}
                onClick={() => {
                  setSelectedNFT(nft);
                  setShowShareModal(true);
                }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:border-pink-500 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  <div className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 p-8 rounded-xl">
                    <div className="text-6xl">{nft.icon}</div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-xl mb-1">{nft.name}</h3>
                        <p className="text-sm text-slate-400">{nft.collection}</p>
                      </div>
                      <div className={`px-3 py-1 rounded text-xs font-semibold border ${getRarityColor(nft.rarity)}`}>
                        {nft.rarity.toUpperCase()}
                      </div>
                    </div>

                    <p className="text-slate-300 mb-4">{nft.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Value</div>
                        <div className="font-bold text-green-400">{formatCurrency(nft.estimatedValue)}</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Rarity Score</div>
                        <div className="font-bold text-yellow-400">{nft.rarityScore}/100</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Views</div>
                        <div className="font-bold">{nft.views}</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Likes</div>
                        <div className="font-bold text-red-400">{nft.likes}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {nft.attributes.slice(0, 4).map((attr, i) => (
                        <div key={i} className="px-3 py-1 bg-pink-600/20 border border-pink-600/30 rounded text-xs">
                          {attr.name}: {attr.value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery 3D View */}
        {viewMode === '3d' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-12">
            <div className="text-center">
              <Eye className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">3D Gallery View</h3>
              <p className="text-slate-400 mb-6">
                Experience your NFT collection in an immersive 3D environment
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {filteredNFTs.slice(0, 8).map((nft) => (
                  <div
                    key={nft.id}
                    className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-xl p-8 border border-pink-500/30 hover:scale-110 transition-transform cursor-pointer"
                    style={{
                      transform: 'perspective(1000px) rotateY(10deg)',
                    }}
                  >
                    <div className="text-6xl">{nft.icon}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-6">3D rendering preview - Full 3D view coming soon!</p>
            </div>
          </div>
        )}

        {/* Share/Detail Modal */}
        {showShareModal && selectedNFT && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-2xl w-full border border-slate-700 p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">NFT Details</h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-xl p-12 flex items-center justify-center">
                  <div className="text-9xl">{selectedNFT.icon}</div>
                </div>

                <div>
                  <h4 className="font-bold text-2xl mb-2">{selectedNFT.name}</h4>
                  <p className="text-slate-400 mb-3">{selectedNFT.collection}</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border mb-4 ${getRarityColor(selectedNFT.rarity)}`}>
                    {selectedNFT.rarity.toUpperCase()} • Score: {selectedNFT.rarityScore}/100
                  </div>

                  <p className="text-slate-300 mb-4">{selectedNFT.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Estimated Value</div>
                      <div className="font-bold text-green-400 text-lg">{formatCurrency(selectedNFT.estimatedValue)}</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Acquired</div>
                      <div className="font-semibold">{formatDate(selectedNFT.acquiredDate)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {selectedNFT.views} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-400" />
                      {selectedNFT.likes} likes
                    </div>
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
                <h5 className="font-bold mb-3">Attributes</h5>
                <div className="grid grid-cols-2 gap-3">
                  {selectedNFT.attributes.map((attr, i) => (
                    <div key={i} className="bg-slate-600/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">{attr.name}</div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{attr.value}</span>
                        <span className="text-xs text-pink-400">{attr.rarity}% rarity</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 px-4 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
