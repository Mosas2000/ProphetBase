'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

interface Term {
  term: string;
  definition: string;
  example: string;
  related: string[];
  category: string;
}

export function Glossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const terms: Term[] = [
    {
      term: 'Prediction Market',
      definition: 'A market where participants trade on the outcome of future events',
      example: 'A market asking "Will Bitcoin reach $100k by 2024?" is a prediction market',
      related: ['Share', 'Outcome', 'Resolution'],
      category: 'basics',
    },
    {
      term: 'Share',
      definition: 'A unit representing a position in a market outcome, worth $1 if correct',
      example: 'Buying 100 YES shares at 65¢ costs $65 and pays $100 if YES wins',
      related: ['Position', 'Payout'],
      category: 'basics',
    },
    {
      term: 'Liquidity',
      definition: 'The ease of buying or selling shares without affecting the price',
      example: 'High liquidity means you can trade large amounts with minimal slippage',
      related: ['Slippage', 'Market Depth'],
      category: 'trading',
    },
    {
      term: 'AMM',
      definition: 'Automated Market Maker - algorithm that sets prices based on supply/demand',
      example: 'ProphetBase uses an AMM to automatically price shares',
      related: ['Liquidity Pool', 'Price Discovery'],
      category: 'technical',
    },
    {
      term: 'Resolution',
      definition: 'The process of determining the correct outcome of a market',
      example: 'After the event occurs, the market resolves to YES or NO',
      related: ['Oracle', 'Settlement'],
      category: 'basics',
    },
    {
      term: 'Slippage',
      definition: 'The difference between expected and actual trade price',
      example: 'Large trades may experience slippage due to price impact',
      related: ['Liquidity', 'Price Impact'],
      category: 'trading',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Terms', count: terms.length },
    { id: 'basics', name: 'Basics', count: terms.filter(t => t.category === 'basics').length },
    { id: 'trading', name: 'Trading', count: terms.filter(t => t.category === 'trading').length },
    { id: 'technical', name: 'Technical', count: terms.filter(t => t.category === 'technical').length },
  ];

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Glossary</h3>
          
          <Input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Terms List */}
      <div className="space-y-4">
        {filteredTerms.map((term, idx) => (
          <Card key={idx}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-xl font-bold">{term.term}</h4>
                <Badge variant="default" className="capitalize">{term.category}</Badge>
              </div>
              
              <p className="text-gray-300 mb-4">{term.definition}</p>
              
              <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4 mb-4">
                <p className="text-sm">
                  <span className="font-semibold text-blue-400">Example:</span> {term.example}
                </p>
              </div>

              {term.related.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Related terms:</p>
                  <div className="flex gap-2 flex-wrap">
                    {term.related.map((rel, i) => (
                      <Badge key={i} variant="secondary">{rel}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <Card>
          <div className="p-8 text-center">
            <p className="text-gray-400">No terms found matching "{searchQuery}"</p>
          </div>
        </Card>
      )}

      {/* Quick Reference */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Quick Reference</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {terms.slice(0, 4).map((term, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-3">
                <p className="font-medium text-sm mb-1">{term.term}</p>
                <p className="text-xs text-gray-400 line-clamp-2">{term.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
