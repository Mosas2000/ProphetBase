'use client';

import { Download, Eye, Filter, Search, ShoppingCart, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface TradingCard {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  marketTitle: string;
  imageUrl: string;
  price: number;
  volume: number;
  owned: boolean;
  ownedCount: number;
  totalSupply: number;
  attributes: {
    predictionAccuracy: number;
    marketCategory: string;
    yearMinted: number;
    specialTrait: string;
  };
  stats: {
    strength: number;
    intelligence: number;
    luck: number;
    rarity: number;
  };
  listedForSale: boolean;
  lastSale: number | null;
}

interface Collection {
  name: string;
  cards: TradingCard[];
  completionPercentage: number;
}

export default function TradingCards() {
  const [selectedRarity, setSelectedRarity] = useState<'all' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'>('all');
  const [selectedCard, setSelectedCard] = useState<TradingCard | null>(null);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rarity' | 'volume'>('rarity');

  const [tradingCards, setTradingCards] = useState<TradingCard[]>([
    {
      id: '1',
      name: 'Bitcoin Bull #0042',
      rarity: 'legendary',
      marketTitle: 'Will Bitcoin reach $100k by Q2 2026?',
      imageUrl: '/nft/bitcoin-bull.png',
      price: 2500,
      volume: 45000,
      owned: true,
      ownedCount: 1,
      totalSupply: 100,
      attributes: {
        predictionAccuracy: 94,
        marketCategory: 'Crypto',
        yearMinted: 2025,
        specialTrait: 'Golden Horns'
      },
      stats: {
        strength: 95,
        intelligence: 92,
        luck: 88,
        rarity: 99
      },
      listedForSale: false,
      lastSale: 2200
    },
    {
      id: '2',
      name: 'Market Prophet #0156',
      rarity: 'epic',
      marketTitle: 'Will inflation exceed 3% in 2026?',
      imageUrl: '/nft/market-prophet.png',
      price: 850,
      volume: 28000,
      owned: true,
      ownedCount: 2,
      totalSupply: 500,
      attributes: {
        predictionAccuracy: 87,
        marketCategory: 'Economy',
        yearMinted: 2025,
        specialTrait: 'Crystal Ball'
      },
      stats: {
        strength: 75,
        intelligence: 90,
        luck: 82,
        rarity: 85
      },
      listedForSale: true,
      lastSale: 780
    },
    {
      id: '3',
      name: 'Prediction Master #1243',
      rarity: 'rare',
      marketTitle: 'Will Tesla stock reach $300 this year?',
      imageUrl: '/nft/prediction-master.png',
      price: 320,
      volume: 15000,
      owned: false,
      ownedCount: 0,
      totalSupply: 2000,
      attributes: {
        predictionAccuracy: 78,
        marketCategory: 'Stocks',
        yearMinted: 2024,
        specialTrait: 'Diamond Hands'
      },
      stats: {
        strength: 65,
        intelligence: 82,
        luck: 70,
        rarity: 70
      },
      listedForSale: true,
      lastSale: 295
    },
    {
      id: '4',
      name: 'Trader Elite #3421',
      rarity: 'uncommon',
      marketTitle: 'Will S&P 500 gain 10% this quarter?',
      imageUrl: '/nft/trader-elite.png',
      price: 95,
      volume: 8500,
      owned: true,
      ownedCount: 5,
      totalSupply: 5000,
      attributes: {
        predictionAccuracy: 68,
        marketCategory: 'Indices',
        yearMinted: 2024,
        specialTrait: 'Bull Flag'
      },
      stats: {
        strength: 55,
        intelligence: 65,
        luck: 60,
        rarity: 45
      },
      listedForSale: false,
      lastSale: 88
    },
    {
      id: '5',
      name: 'Market Novice #8765',
      rarity: 'common',
      marketTitle: 'Will gold prices hit $2500/oz?',
      imageUrl: '/nft/market-novice.png',
      price: 25,
      volume: 3200,
      owned: true,
      ownedCount: 12,
      totalSupply: 10000,
      attributes: {
        predictionAccuracy: 55,
        marketCategory: 'Commodities',
        yearMinted: 2024,
        specialTrait: 'Lucky Charm'
      },
      stats: {
        strength: 40,
        intelligence: 45,
        luck: 50,
        rarity: 20
      },
      listedForSale: false,
      lastSale: 22
    }
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-600 to-orange-600';
      case 'epic':
        return 'from-purple-600 to-pink-600';
      case 'rare':
        return 'from-blue-600 to-cyan-600';
      case 'uncommon':
        return 'from-green-600 to-emerald-600';
      case 'common':
        return 'from-slate-600 to-slate-500';
      default:
        return 'from-slate-600 to-slate-500';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-400 border-yellow-500/30';
      case 'epic':
        return 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 border-purple-500/30';
      case 'rare':
        return 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border-blue-500/30';
      case 'uncommon':
        return 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400 border-green-500/30';
      case 'common':
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
    }
  };

  const filteredCards = tradingCards
    .filter(card => selectedRarity === 'all' || card.rarity === selectedRarity)
    .filter(card => searchTerm === '' || card.name.toLowerCase().includes(searchTerm.toLowerCase()) || card.marketTitle.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'volume':
          return b.volume - a.volume;
        case 'rarity':
          const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        default:
          return 0;
      }
    });

  const ownedCards = tradingCards.filter(card => card.owned);
  const totalValue = ownedCards.reduce((sum, card) => sum + (card.price * card.ownedCount), 0);
  const uniqueCards = ownedCards.length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl">
              <Star className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Prediction NFT Cards</h1>
              <p className="text-slate-400">Collect, trade, and showcase rare prediction market cards</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Collection Value</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(totalValue)}</div>
            <div className="text-xs text-slate-400 mt-1">+12.5% this month</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Unique Cards</span>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">{uniqueCards}</div>
            <div className="text-xs text-slate-400 mt-1">of {tradingCards.length} available</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Cards</span>
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {ownedCards.reduce((sum, card) => sum + card.ownedCount, 0)}
            </div>
            <div className="text-xs text-slate-400 mt-1">Owned items</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">For Sale</span>
              <ShoppingCart className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {ownedCards.filter(card => card.listedForSale).length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Listed items</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cards..."
                className="w-full pl-10 pr-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value as any)}
                className="px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="rarity">Sort by Rarity</option>
                <option value="price">Sort by Price</option>
                <option value="volume">Sort by Volume</option>
              </select>

              <button
                onClick={() => setShowMarketplace(!showMarketplace)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  showMarketplace 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showMarketplace && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm">Show only owned</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm">Show only for sale</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm">Hide common</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden cursor-pointer hover:border-blue-500 transition-all hover:scale-105"
            >
              {/* Card Image */}
              <div className={`relative h-64 bg-gradient-to-br ${getRarityColor(card.rarity)} p-1`}>
                <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">
                      {card.rarity === 'legendary' ? '👑' :
                       card.rarity === 'epic' ? '💎' :
                       card.rarity === 'rare' ? '🌟' :
                       card.rarity === 'uncommon' ? '✨' : '🎴'}
                    </div>
                    <div className="text-xs text-slate-400">#{card.id.padStart(4, '0')}</div>
                  </div>
                </div>
                {card.owned && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-green-600/80 rounded-full text-xs font-semibold">
                    Owned x{card.ownedCount}
                  </div>
                )}
                {card.listedForSale && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600/80 rounded-full text-xs font-semibold">
                    For Sale
                  </div>
                )}
              </div>

              {/* Card Info */}
              <div className="p-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold mb-3 border ${getRarityBadgeColor(card.rarity)}`}>
                  <Star className="w-3 h-3" />
                  {card.rarity.toUpperCase()}
                </div>

                <h3 className="font-bold text-lg mb-1">{card.name}</h3>
                <p className="text-xs text-slate-400 mb-3 line-clamp-2">{card.marketTitle}</p>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs text-slate-400">Floor Price</div>
                    <div className="text-lg font-bold text-blue-400">{formatCurrency(card.price)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Supply</div>
                    <div className="text-sm font-semibold">{card.totalSupply}</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-slate-400">STR</div>
                    <div className="font-semibold">{card.stats.strength}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">INT</div>
                    <div className="font-semibold">{card.stats.intelligence}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">LCK</div>
                    <div className="font-semibold">{card.stats.luck}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">RAR</div>
                    <div className="font-semibold">{card.stats.rarity}</div>
                  </div>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                  {card.owned ? 'View Details' : 'Buy Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Card Detail Modal */}
        {selectedCard && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedCard.name}</h2>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold border ${getRarityBadgeColor(selectedCard.rarity)}`}>
                      <Star className="w-4 h-4" />
                      {selectedCard.rarity.toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card Display */}
                  <div>
                    <div className={`relative h-96 bg-gradient-to-br ${getRarityColor(selectedCard.rarity)} p-1 rounded-xl`}>
                      <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-9xl mb-4">
                            {selectedCard.rarity === 'legendary' ? '👑' :
                             selectedCard.rarity === 'epic' ? '💎' :
                             selectedCard.rarity === 'rare' ? '🌟' :
                             selectedCard.rarity === 'uncommon' ? '✨' : '🎴'}
                          </div>
                          <div className="text-lg text-slate-400">#{selectedCard.id.padStart(4, '0')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        {selectedCard.owned ? 'List for Sale' : `Buy for ${formatCurrency(selectedCard.price)}`}
                      </button>
                      {selectedCard.owned && (
                        <button className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                          <Download className="w-5 h-5" />
                          Download NFT
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Market Information</h3>
                      <p className="text-slate-400 text-sm mb-4">{selectedCard.marketTitle}</p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <div className="text-sm text-slate-400 mb-1">Current Price</div>
                          <div className="text-xl font-bold text-blue-400">{formatCurrency(selectedCard.price)}</div>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <div className="text-sm text-slate-400 mb-1">Last Sale</div>
                          <div className="text-xl font-bold">{selectedCard.lastSale ? formatCurrency(selectedCard.lastSale) : 'N/A'}</div>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <div className="text-sm text-slate-400 mb-1">Volume</div>
                          <div className="text-xl font-bold">{formatCurrency(selectedCard.volume)}</div>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <div className="text-sm text-slate-400 mb-1">Supply</div>
                          <div className="text-xl font-bold">{selectedCard.totalSupply}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Attributes</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <span className="text-sm text-slate-400">Prediction Accuracy</span>
                          <span className="font-semibold">{selectedCard.attributes.predictionAccuracy}%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <span className="text-sm text-slate-400">Category</span>
                          <span className="font-semibold">{selectedCard.attributes.marketCategory}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <span className="text-sm text-slate-400">Year Minted</span>
                          <span className="font-semibold">{selectedCard.attributes.yearMinted}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <span className="text-sm text-slate-400">Special Trait</span>
                          <span className="font-semibold">{selectedCard.attributes.specialTrait}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Stats</h3>
                      <div className="space-y-3">
                        {Object.entries(selectedCard.stats).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-slate-400 capitalize">{key}</span>
                              <span className="text-sm font-semibold">{value}/100</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
