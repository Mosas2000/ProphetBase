'use client';

import { ArrowUpDown, ExternalLink, Eye, Filter, Heart, ShoppingCart, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface MarketplaceNFT {
  id: string;
  tokenId: string;
  name: string;
  collection: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  price: number;
  floorPrice: number;
  lastSale: number;
  volume24h: number;
  priceChange24h: number;
  owner: string;
  openseaUrl: string;
  imageUrl: string;
  listed: boolean;
  icon: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  floorPrice: number;
  volume24h: number;
  totalVolume: number;
  items: number;
  owners: number;
  priceChange: number;
  icon: string;
}

export default function MarketplaceIntegration() {
  const [activeTab, setActiveTab] = useState<'browse' | 'collections' | 'my-listings'>('browse');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under-100' | '100-500' | '500-1000' | 'over-1000'>('all');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'recent' | 'volume'>('recent');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<MarketplaceNFT | null>(null);
  const [listPrice, setListPrice] = useState('');

  const [collections] = useState<Collection[]>([
    {
      id: 'trading-cards',
      name: 'Prediction Trading Cards',
      description: 'Collectible NFT cards for prediction market enthusiasts',
      floorPrice: 250,
      volume24h: 124500,
      totalVolume: 8950000,
      items: 10000,
      owners: 3421,
      priceChange: 15.4,
      icon: '🎴'
    },
    {
      id: 'achievement-nfts',
      name: 'Achievement NFTs',
      description: 'Rare milestone and accomplishment NFTs',
      floorPrice: 180,
      volume24h: 89300,
      totalVolume: 5430000,
      items: 5000,
      owners: 2156,
      priceChange: -5.2,
      icon: '🏆'
    },
    {
      id: 'profile-pics',
      name: 'Prophet Profiles',
      description: 'Generative NFT profile pictures with unique traits',
      floorPrice: 320,
      volume24h: 156700,
      totalVolume: 12340000,
      items: 15000,
      owners: 5623,
      priceChange: 22.8,
      icon: '👤'
    },
    {
      id: 'seasonal',
      name: 'Seasonal Collectibles',
      description: 'Limited edition seasonal and event NFTs',
      floorPrice: 450,
      volume24h: 203400,
      totalVolume: 6780000,
      items: 3000,
      owners: 1847,
      priceChange: 8.6,
      icon: '❄️'
    }
  ]);

  const [marketplaceNFTs, setMarketplaceNFTs] = useState<MarketplaceNFT[]>([
    {
      id: '1',
      tokenId: '0x1a2b3c',
      name: 'Legendary Bull #0042',
      collection: 'trading-cards',
      rarity: 'legendary',
      price: 1250,
      floorPrice: 250,
      lastSale: 1100,
      volume24h: 15600,
      priceChange24h: 13.6,
      owner: '0x1234...5678',
      openseaUrl: 'https://opensea.io/assets/0x1a2b3c',
      imageUrl: '',
      listed: true,
      icon: '👑'
    },
    {
      id: '2',
      tokenId: '0x4d5e6f',
      name: 'Epic Prophet #0156',
      collection: 'profile-pics',
      rarity: 'epic',
      price: 680,
      floorPrice: 320,
      lastSale: 590,
      volume24h: 8900,
      priceChange24h: 15.3,
      owner: '0x9abc...def0',
      openseaUrl: 'https://opensea.io/assets/0x4d5e6f',
      imageUrl: '',
      listed: true,
      icon: '💎'
    },
    {
      id: '3',
      tokenId: '0x7g8h9i',
      name: 'Diamond Achievement #0089',
      collection: 'achievement-nfts',
      rarity: 'legendary',
      price: 890,
      floorPrice: 180,
      lastSale: 820,
      volume24h: 12300,
      priceChange24h: 8.5,
      owner: '0x2345...6789',
      openseaUrl: 'https://opensea.io/assets/0x7g8h9i',
      imageUrl: '',
      listed: true,
      icon: '💠'
    },
    {
      id: '4',
      tokenId: '0xj1k2l3',
      name: 'Winter Mythic #0012',
      collection: 'seasonal',
      rarity: 'legendary',
      price: 1450,
      floorPrice: 450,
      lastSale: 1320,
      volume24h: 23400,
      priceChange24h: 9.8,
      owner: '0x3456...789a',
      openseaUrl: 'https://opensea.io/assets/0xj1k2l3',
      imageUrl: '',
      listed: true,
      icon: '❄️'
    },
    {
      id: '5',
      tokenId: '0xm4n5o6',
      name: 'Rare Strategist #2341',
      collection: 'trading-cards',
      rarity: 'rare',
      price: 340,
      floorPrice: 250,
      lastSale: 315,
      volume24h: 4200,
      priceChange24h: 7.9,
      owner: '0x4567...89ab',
      openseaUrl: 'https://opensea.io/assets/0xm4n5o6',
      imageUrl: '',
      listed: true,
      icon: '🌟'
    },
    {
      id: '6',
      tokenId: '0xp7q8r9',
      name: 'Epic Trader #0789',
      collection: 'trading-cards',
      rarity: 'epic',
      price: 720,
      floorPrice: 250,
      lastSale: 680,
      volume24h: 9800,
      priceChange24h: 5.9,
      owner: '0x5678...9abc',
      openseaUrl: 'https://opensea.io/assets/0xp7q8r9',
      imageUrl: '',
      listed: true,
      icon: '⚡'
    }
  ]);

  const [myNFTs] = useState<MarketplaceNFT[]>([
    {
      id: '7',
      tokenId: '0xs1t2u3',
      name: 'Uncommon Analyst #3421',
      collection: 'trading-cards',
      rarity: 'uncommon',
      price: 0,
      floorPrice: 250,
      lastSale: 280,
      volume24h: 3400,
      priceChange24h: 4.2,
      owner: 'You',
      openseaUrl: 'https://opensea.io/assets/0xs1t2u3',
      imageUrl: '',
      listed: false,
      icon: '✨'
    },
    {
      id: '8',
      tokenId: '0xv4w5x6',
      name: 'Rare Profile #8765',
      collection: 'profile-pics',
      rarity: 'rare',
      price: 0,
      floorPrice: 320,
      lastSale: 390,
      volume24h: 5600,
      priceChange24h: 6.8,
      owner: 'You',
      openseaUrl: 'https://opensea.io/assets/0xv4w5x6',
      imageUrl: '',
      listed: false,
      icon: '🎨'
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const filterNFTs = (nfts: MarketplaceNFT[]) => {
    let filtered = [...nfts];

    // Collection filter
    if (selectedCollection !== 'all') {
      filtered = filtered.filter(nft => nft.collection === selectedCollection);
    }

    // Price filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(nft => {
        switch (priceRange) {
          case 'under-100':
            return nft.price < 100;
          case '100-500':
            return nft.price >= 100 && nft.price < 500;
          case '500-1000':
            return nft.price >= 500 && nft.price < 1000;
          case 'over-1000':
            return nft.price >= 1000;
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'volume':
          return b.volume24h - a.volume24h;
        case 'recent':
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleBuyNFT = () => {
    if (selectedNFT) {
      // Simulate purchase
      alert(`Purchased ${selectedNFT.name} for ${formatCurrency(selectedNFT.price)}`);
      setShowBuyModal(false);
      setSelectedNFT(null);
    }
  };

  const handleListNFT = () => {
    if (selectedNFT && listPrice) {
      const price = parseFloat(listPrice);
      const updatedNFT = { ...selectedNFT, price, listed: true };
      alert(`Listed ${selectedNFT.name} for ${formatCurrency(price)}`);
      setShowListModal(false);
      setSelectedNFT(null);
      setListPrice('');
    }
  };

  const filteredMarketplaceNFTs = filterNFTs(marketplaceNFTs);
  const totalVolume = collections.reduce((sum, col) => sum + col.volume24h, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl">
              <ShoppingCart className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">NFT Marketplace</h1>
              <p className="text-slate-400">Buy, sell, and trade NFTs with OpenSea integration</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">24h Volume</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(totalVolume)}</div>
            <div className="text-xs text-slate-400 mt-1">+12.3% from yesterday</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Collections</span>
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">{collections.length}</div>
            <div className="text-xs text-slate-400 mt-1">Active collections</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Listed NFTs</span>
              <ShoppingCart className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400">{marketplaceNFTs.length}</div>
            <div className="text-xs text-slate-400 mt-1">Available to purchase</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">My NFTs</span>
              <Heart className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-bold text-pink-400">{myNFTs.length}</div>
            <div className="text-xs text-slate-400 mt-1">In your wallet</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'browse'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Browse Marketplace
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'collections'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => setActiveTab('my-listings')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'my-listings'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
            }`}
          >
            My NFTs
          </button>
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <>
            {/* Filters */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm text-slate-400 mb-2">Collection</label>
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2"
                  >
                    <option value="all">All Collections</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm text-slate-400 mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value as any)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2"
                  >
                    <option value="all">All Prices</option>
                    <option value="under-100">Under $100</option>
                    <option value="100-500">$100 - $500</option>
                    <option value="500-1000">$500 - $1,000</option>
                    <option value="over-1000">Over $1,000</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm text-slate-400 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2"
                  >
                    <option value="recent">Recently Listed</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="volume">24h Volume</option>
                  </select>
                </div>
              </div>
            </div>

            {/* NFT Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarketplaceNFTs.map((nft) => (
                <div
                  key={nft.id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden hover:border-purple-500 transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedNFT(nft);
                    setShowBuyModal(true);
                  }}
                >
                  <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-12 flex items-center justify-center">
                    <div className="text-8xl">{nft.icon}</div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg">{nft.name}</h3>
                      <div className={`px-2 py-1 rounded text-xs font-semibold border ${getRarityColor(nft.rarity)}`}>
                        {nft.rarity.toUpperCase()}
                      </div>
                    </div>

                    <div className="text-sm text-slate-400 mb-4">Token ID: {nft.tokenId}</div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Current Price</div>
                        <div className="font-bold text-lg text-purple-400">{formatCurrency(nft.price)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Floor Price</div>
                        <div className="font-semibold">{formatCurrency(nft.floorPrice)}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">24h Vol:</span>
                        <span className="font-semibold">{formatCurrency(nft.volume24h)}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${nft.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {nft.priceChange24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {formatPercent(nft.priceChange24h)}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <a
                        href={nft.openseaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                      >
                        View on OpenSea
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div className="space-y-4">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition-all cursor-pointer"
                onClick={() => {
                  setSelectedCollection(collection.id);
                  setActiveTab('browse');
                }}
              >
                <div className="flex items-start gap-6">
                  <div className="text-7xl">{collection.icon}</div>

                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2">{collection.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{collection.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Floor Price</div>
                        <div className="font-bold text-purple-400">{formatCurrency(collection.floorPrice)}</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">24h Volume</div>
                        <div className="font-bold text-blue-400">{formatCurrency(collection.volume24h)}</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Total Volume</div>
                        <div className="font-bold">{formatCurrency(collection.totalVolume)}</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Items / Owners</div>
                        <div className="font-bold">
                          {collection.items.toLocaleString()} / {collection.owners.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          collection.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {collection.priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {formatPercent(collection.priceChange)} 24h
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Listings Tab */}
        {activeTab === 'my-listings' && (
          <>
            {myNFTs.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">You don't own any NFTs yet. Browse the marketplace to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myNFTs.map((nft) => (
                  <div key={nft.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
                    <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-12 flex items-center justify-center">
                      <div className="text-8xl">{nft.icon}</div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg">{nft.name}</h3>
                        <div className={`px-2 py-1 rounded text-xs font-semibold border ${getRarityColor(nft.rarity)}`}>
                          {nft.rarity.toUpperCase()}
                        </div>
                      </div>

                      <div className="text-sm text-slate-400 mb-4">Token ID: {nft.tokenId}</div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-slate-400 mb-1">Floor Price</div>
                          <div className="font-bold">{formatCurrency(nft.floorPrice)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400 mb-1">Last Sale</div>
                          <div className="font-semibold">{formatCurrency(nft.lastSale)}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setSelectedNFT(nft);
                            setShowListModal(true);
                          }}
                          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {nft.listed ? 'Update Listing' : 'List for Sale'}
                        </button>

                        <a
                          href={nft.openseaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                        >
                          View on OpenSea
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Buy Modal */}
        {showBuyModal && selectedNFT && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4">Purchase NFT</h3>

              <div className="text-center mb-6">
                <div className="text-7xl mb-3">{selectedNFT.icon}</div>
                <h4 className="font-bold text-lg mb-2">{selectedNFT.name}</h4>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border ${getRarityColor(selectedNFT.rarity)}`}>
                  {selectedNFT.rarity.toUpperCase()}
                </div>
              </div>

              <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Price:</span>
                  <span className="font-bold text-xl">{formatCurrency(selectedNFT.price)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Floor Price:</span>
                  <span>{formatCurrency(selectedNFT.floorPrice)}</span>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-3 mb-6 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Gas Fee (est.):</span>
                  <span>$12.50</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedNFT.price + 12.5)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBuyModal(false);
                    setSelectedNFT(null);
                  }}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyNFT}
                  className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List Modal */}
        {showListModal && selectedNFT && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4">List NFT for Sale</h3>

              <div className="text-center mb-6">
                <div className="text-7xl mb-3">{selectedNFT.icon}</div>
                <h4 className="font-bold text-lg mb-2">{selectedNFT.name}</h4>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">Listing Price (USD)</label>
                <input
                  type="number"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  placeholder="Enter price..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-lg"
                />
                <div className="text-xs text-slate-400 mt-2">Floor price: {formatCurrency(selectedNFT.floorPrice)}</div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowListModal(false);
                    setSelectedNFT(null);
                    setListPrice('');
                  }}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleListNFT}
                  disabled={!listPrice || parseFloat(listPrice) <= 0}
                  className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  List NFT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
