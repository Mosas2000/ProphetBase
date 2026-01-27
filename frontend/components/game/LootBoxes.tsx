'use client';

import { Package, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface LootBox {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  cost: number;
  owned: number;
}

interface LootItem {
  name: string;
  type: 'token' | 'nft' | 'boost' | 'cosmetic';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  value: number;
  icon: string;
}

export default function LootBoxes() {
  const [selectedBox, setSelectedBox] = useState<LootBox | null>(null);
  const [opening, setOpening] = useState(false);
  const [revealedItem, setRevealedItem] = useState<LootItem | null>(null);

  const [boxes] = useState<LootBox[]>([
    { id: 'b1', name: 'Starter Box', rarity: 'common', cost: 100, owned: 3 },
    { id: 'b2', name: 'Silver Box', rarity: 'rare', cost: 250, owned: 1 },
    { id: 'b3', name: 'Gold Box', rarity: 'epic', cost: 500, owned: 0 },
    {
      id: 'b4',
      name: 'Diamond Box',
      rarity: 'legendary',
      cost: 1000,
      owned: 0,
    },
  ]);

  const lootPool: LootItem[] = [
    {
      name: '50 Tokens',
      type: 'token',
      rarity: 'common',
      value: 50,
      icon: '💰',
    },
    {
      name: '100 Tokens',
      type: 'token',
      rarity: 'common',
      value: 100,
      icon: '💰',
    },
    {
      name: '250 Tokens',
      type: 'token',
      rarity: 'rare',
      value: 250,
      icon: '💎',
    },
    {
      name: '500 Tokens',
      type: 'token',
      rarity: 'epic',
      value: 500,
      icon: '💎',
    },
    {
      name: '1000 Tokens',
      type: 'token',
      rarity: 'legendary',
      value: 1000,
      icon: '👑',
    },
    {
      name: '2x XP Boost',
      type: 'boost',
      rarity: 'rare',
      value: 1,
      icon: '🚀',
    },
    {
      name: '3x XP Boost',
      type: 'boost',
      rarity: 'epic',
      value: 1,
      icon: '🔥',
    },
    { name: 'Rare NFT', type: 'nft', rarity: 'rare', value: 300, icon: '🎨' },
    { name: 'Epic NFT', type: 'nft', rarity: 'epic', value: 800, icon: '🖼️' },
    {
      name: 'Legendary NFT',
      type: 'nft',
      rarity: 'legendary',
      value: 2000,
      icon: '👑',
    },
    {
      name: 'Rare Avatar',
      type: 'cosmetic',
      rarity: 'rare',
      value: 200,
      icon: '😎',
    },
    {
      name: 'Epic Avatar',
      type: 'cosmetic',
      rarity: 'epic',
      value: 500,
      icon: '🤩',
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-slate-400';
      case 'rare':
        return 'text-blue-400';
      case 'epic':
        return 'text-purple-400';
      case 'legendary':
        return 'text-amber-400';
      default:
        return 'text-slate-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-slate-500/20 border-slate-500';
      case 'rare':
        return 'bg-blue-500/20 border-blue-500';
      case 'epic':
        return 'bg-purple-500/20 border-purple-500';
      case 'legendary':
        return 'bg-amber-500/20 border-amber-500';
      default:
        return 'bg-slate-500/20 border-slate-500';
    }
  };

  const openBox = (box: LootBox) => {
    if (box.owned === 0) return;

    setSelectedBox(box);
    setOpening(true);

    // Simulate opening animation
    setTimeout(() => {
      const rarityWeights: Record<string, number> = {
        common:
          box.rarity === 'common'
            ? 60
            : box.rarity === 'rare'
            ? 40
            : box.rarity === 'epic'
            ? 20
            : 10,
        rare:
          box.rarity === 'common'
            ? 30
            : box.rarity === 'rare'
            ? 40
            : box.rarity === 'epic'
            ? 30
            : 20,
        epic:
          box.rarity === 'common'
            ? 9
            : box.rarity === 'rare'
            ? 18
            : box.rarity === 'epic'
            ? 40
            : 30,
        legendary:
          box.rarity === 'common'
            ? 1
            : box.rarity === 'rare'
            ? 2
            : box.rarity === 'epic'
            ? 10
            : 40,
      };

      const roll = Math.random() * 100;
      let rarity: LootItem['rarity'] = 'common';
      let cumulative = 0;

      for (const [r, weight] of Object.entries(rarityWeights)) {
        cumulative += weight;
        if (roll <= cumulative) {
          rarity = r as LootItem['rarity'];
          break;
        }
      }

      const itemsOfRarity = lootPool.filter((i) => i.rarity === rarity);
      const item =
        itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];

      setRevealedItem(item);
      setOpening(false);
      box.owned--;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-xl">
            <Package className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Loot Boxes</h1>
            <p className="text-slate-400">
              Open mystery boxes for rewards and rare items
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {boxes.map((box) => (
            <div
              key={box.id}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                box.owned > 0
                  ? `${getRarityBg(box.rarity)} hover:scale-105`
                  : 'bg-slate-800/50 border-slate-700 opacity-50'
              }`}
              onClick={() => box.owned > 0 && openBox(box)}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">📦</div>
                <h3
                  className={`text-xl font-bold mb-2 ${getRarityColor(
                    box.rarity
                  )}`}
                >
                  {box.name}
                </h3>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${getRarityBg(
                    box.rarity
                  )}`}
                >
                  {box.rarity.toUpperCase()}
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Owned:</span>
                  <span className="font-bold">{box.owned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cost:</span>
                  <span className="font-bold">{box.cost} tokens</span>
                </div>
              </div>

              <button
                disabled={box.owned === 0}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  box.owned > 0
                    ? 'bg-violet-600 hover:bg-violet-700'
                    : 'bg-slate-700 cursor-not-allowed'
                }`}
              >
                {box.owned > 0 ? 'Open Box' : 'Buy Box'}
              </button>
            </div>
          ))}
        </div>

        {/* Drop Rates */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold mb-4">
            Drop Rates & Probabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {boxes.map((box) => (
              <div key={box.id}>
                <h3 className={`font-bold mb-3 ${getRarityColor(box.rarity)}`}>
                  {box.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Common:</span>
                    <span>
                      {box.rarity === 'common'
                        ? '60%'
                        : box.rarity === 'rare'
                        ? '40%'
                        : box.rarity === 'epic'
                        ? '20%'
                        : '10%'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400">Rare:</span>
                    <span>
                      {box.rarity === 'common'
                        ? '30%'
                        : box.rarity === 'rare'
                        ? '40%'
                        : box.rarity === 'epic'
                        ? '30%'
                        : '20%'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Epic:</span>
                    <span>
                      {box.rarity === 'common'
                        ? '9%'
                        : box.rarity === 'rare'
                        ? '18%'
                        : box.rarity === 'epic'
                        ? '40%'
                        : '30%'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-400">Legendary:</span>
                    <span>
                      {box.rarity === 'common'
                        ? '1%'
                        : box.rarity === 'rare'
                        ? '2%'
                        : box.rarity === 'epic'
                        ? '10%'
                        : '40%'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opening Animation Modal */}
        {opening && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4 animate-bounce">📦</div>
              <Sparkles className="w-16 h-16 text-violet-400 mx-auto animate-spin" />
              <h2 className="text-3xl font-bold mt-4">Opening...</h2>
            </div>
          </div>
        )}

        {/* Reveal Modal */}
        {revealedItem && !opening && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setRevealedItem(null)}
          >
            <div
              className={`rounded-xl p-8 border-2 max-w-md w-full text-center ${getRarityBg(
                revealedItem.rarity
              )}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-8xl mb-4 animate-bounce">
                {revealedItem.icon}
              </div>
              <div
                className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 ${getRarityBg(
                  revealedItem.rarity
                )}`}
              >
                {revealedItem.rarity.toUpperCase()}
              </div>
              <h2
                className={`text-3xl font-bold mb-2 ${getRarityColor(
                  revealedItem.rarity
                )}`}
              >
                {revealedItem.name}
              </h2>
              <p className="text-slate-300 mb-6">
                You got {revealedItem.name}!
              </p>
              <button
                onClick={() => setRevealedItem(null)}
                className="w-full px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg font-bold"
              >
                Claim Reward
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
