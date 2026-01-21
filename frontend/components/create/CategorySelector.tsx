'use client';

import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  marketCount: number;
}

const categories: Category[] = [
  {
    id: 'crypto',
    name: 'Crypto',
    icon: '₿',
    description: 'Cryptocurrency prices, launches, and events',
    color: 'from-orange-500 to-yellow-500',
    marketCount: 1234,
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '⚽',
    description: 'Sports matches, tournaments, and athlete performance',
    color: 'from-green-500 to-emerald-500',
    marketCount: 856,
  },
  {
    id: 'politics',
    name: 'Politics',
    icon: '🏛️',
    description: 'Elections, policy decisions, and political events',
    color: 'from-blue-500 to-indigo-500',
    marketCount: 432,
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    description: 'Product launches, tech trends, and innovations',
    color: 'from-purple-500 to-pink-500',
    marketCount: 678,
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    description: 'Stock markets, economic indicators, and financial events',
    color: 'from-green-500 to-teal-500',
    marketCount: 543,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    description: 'Movies, music, awards, and celebrity events',
    color: 'from-red-500 to-pink-500',
    marketCount: 321,
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    description: 'Scientific discoveries, research, and breakthroughs',
    color: 'from-cyan-500 to-blue-500',
    marketCount: 234,
  },
  {
    id: 'weather',
    name: 'Weather',
    icon: '🌤️',
    description: 'Weather predictions and climate events',
    color: 'from-sky-500 to-blue-500',
    marketCount: 156,
  },
];

interface CategorySelectorProps {
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export function CategorySelector({ selectedCategory, onSelectCategory }: CategorySelectorProps) {
  const [selected, setSelected] = useState<string>(selectedCategory || '');

  const handleSelect = (categoryId: string) => {
    setSelected(categoryId);
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Category</h3>
        <p className="text-sm text-gray-400">Choose the category that best fits your market</p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(category => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selected === category.id
                ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'hover:border-gray-600'
            }`}
            onClick={() => handleSelect(category.id)}
          >
            <div className="p-4">
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl mb-3 mx-auto`}
              >
                {category.icon}
              </div>
              <h4 className="font-semibold text-center mb-2">{category.name}</h4>
              <p className="text-xs text-gray-400 text-center mb-3">{category.description}</p>
              <div className="text-center">
                <span className="text-xs text-gray-500">
                  {category.marketCount.toLocaleString()} markets
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Selected Category Info */}
      {selected && (
        <Card className="border border-blue-500">
          <div className="p-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                  categories.find(c => c.id === selected)?.color
                } flex items-center justify-center text-2xl`}
              >
                {categories.find(c => c.id === selected)?.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">
                  {categories.find(c => c.id === selected)?.name} Selected
                </h4>
                <p className="text-sm text-gray-400">
                  {categories.find(c => c.id === selected)?.description}
                </p>
              </div>
              <button
                onClick={() => handleSelect('')}
                className="text-sm text-gray-400 hover:text-white"
              >
                Change
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Category Guidelines */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Category Guidelines</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-400">💡</span>
              <p>Choose the most specific category that applies to your market</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">💡</span>
              <p>Categories help users discover markets they're interested in</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">💡</span>
              <p>Markets in popular categories tend to get more trading volume</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
