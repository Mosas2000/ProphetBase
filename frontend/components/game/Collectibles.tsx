'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface Collectible {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  type: 'nft' | 'card' | 'badge';
  owned: boolean;
  count?: number;
}

export function Collectibles() {
  const [filter, setFilter] = useState<'all' | 'owned' | 'missing'>('all');

  const collectibles: Collectible[] = [
    { id: '1', name: 'Genesis Trader', image: '🎯', rarity: 'legendary', type: 'nft', owned: true },
    { id: '2', name: 'Bull Market Card', image: '📈', rarity: 'epic', type: 'card', owned: true, count: 2 },
    { id: '3', name: 'Diamond Hands', image: '💎', rarity: 'rare', type: 'badge', owned: true },
    { id: '4', name: 'Market Maven', image: '🎓', rarity: 'rare', type: 'nft', owned: false },
    { id: '5', name: 'Profit Prophet', image: '🔮', rarity: 'epic', type: 'card', owned: false },
    { id: '6', name: 'Trading Master', image: '👑', rarity: 'legendary', type: 'nft', owned: false },
  ];

  const getRarityColor = (rarity: Collectible['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-600 to-gray-500';
      case 'rare': return 'from-blue-600 to-blue-500';
      case 'epic': return 'from-purple-600 to-purple-500';
      case 'legendary': return 'from-yellow-600 to-orange-500';
    }
  };

  const filteredCollectibles = collectibles.filter(c => {
    if (filter === 'owned') return c.owned;
    if (filter === 'missing') return !c.owned;
    return true;
  });

  const stats = {
    total: collectibles.length,
    owned: collectibles.filter(c => c.owned).length,
    completion: Math.round((collectibles.filter(c => c.owned).length / collectibles.length) * 100),
  };

  return (
    <div className="space-y-6">
      {/* Collection Stats */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">My Collection</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Collected</p>
              <p className="text-2xl font-bold">{stats.owned}/{stats.total}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Completion</p>
              <p className="text-2xl font-bold">{stats.completion}%</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Value</p>
              <p className="text-2xl font-bold">$2,450</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {(['all', 'owned', 'missing'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Collectibles Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredCollectibles.map(item => (
          <Card key={item.id}>
            <div className={`p-4 ${!item.owned && 'opacity-50'}`}>
              <div className={`bg-gradient-to-br ${getRarityColor(item.rarity)} rounded-lg p-8 mb-3 flex items-center justify-center`}>
                <span className="text-6xl">{item.image}</span>
              </div>
              
              <div className="mb-3">
                <h4 className="font-semibold mb-1">{item.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs">{item.rarity}</Badge>
                  <Badge variant="default" className="text-xs">{item.type}</Badge>
                </div>
              </div>

              {item.owned ? (
                <div>
                  {item.count && item.count > 1 && (
                    <p className="text-sm text-gray-400 mb-2">Owned: {item.count}x</p>
                  )}
                  <Button size="sm" variant="secondary" className="w-full">View Details</Button>
                </div>
              ) : (
                <Button size="sm" className="w-full" disabled>Not Owned</Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Collection Showcase */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Featured Collection</h4>
          
          <div className="flex gap-4 overflow-x-auto pb-2">
            {collectibles.filter(c => c.owned).map(item => (
              <div key={item.id} className="flex-shrink-0">
                <div className={`w-24 h-24 bg-gradient-to-br ${getRarityColor(item.rarity)} rounded-lg flex items-center justify-center text-4xl`}>
                  {item.image}
                </div>
                <p className="text-xs text-center mt-2">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Rarity System */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Rarity Distribution</h4>
          
          <div className="space-y-2">
            {['common', 'rare', 'epic', 'legendary'].map(rarity => {
              const count = collectibles.filter(c => c.rarity === rarity && c.owned).length;
              const total = collectibles.filter(c => c.rarity === rarity).length;
              
              return (
                <div key={rarity} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${getRarityColor(rarity as any)}`} />
                    <span className="capitalize">{rarity}</span>
                  </div>
                  <span className="font-medium">{count}/{total}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
