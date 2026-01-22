'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface Thread {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  votes: number;
  lastActivity: string;
  pinned: boolean;
}

export function Forum() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const threads: Thread[] = [
    {
      id: '1',
      title: 'Best strategies for crypto markets?',
      author: 'CryptoKing',
      category: 'strategies',
      replies: 45,
      views: 1250,
      votes: 23,
      lastActivity: '2h ago',
      pinned: true,
    },
    {
      id: '2',
      title: 'How to interpret market sentiment?',
      author: 'TradeQueen',
      category: 'discussion',
      replies: 32,
      views: 890,
      votes: 18,
      lastActivity: '5h ago',
      pinned: false,
    },
    {
      id: '3',
      title: 'Bug: Price display issue on mobile',
      author: 'DevUser',
      category: 'support',
      replies: 8,
      views: 234,
      votes: 5,
      lastActivity: '1d ago',
      pinned: false,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Topics', count: threads.length },
    { id: 'strategies', name: 'Strategies', count: threads.filter(t => t.category === 'strategies').length },
    { id: 'discussion', name: 'Discussion', count: threads.filter(t => t.category === 'discussion').length },
    { id: 'support', name: 'Support', count: threads.filter(t => t.category === 'support').length },
  ];

  const filteredThreads = selectedCategory === 'all' 
    ? threads 
    : threads.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Community Forum</h3>
            <Button>New Thread</Button>
          </div>

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

      {/* Threads */}
      <div className="space-y-3">
        {filteredThreads.map(thread => (
          <Card key={thread.id}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Vote */}
                <div className="flex flex-col items-center gap-1">
                  <button className="text-gray-400 hover:text-green-400">▲</button>
                  <span className="font-bold">{thread.votes}</span>
                  <button className="text-gray-400 hover:text-red-400">▼</button>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    {thread.pinned && <span className="text-yellow-400">📌</span>}
                    <h4 className="font-semibold text-lg hover:text-blue-400 cursor-pointer">
                      {thread.title}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>by {thread.author}</span>
                    <Badge variant="default" className="capitalize">{thread.category}</Badge>
                    <span>{thread.replies} replies</span>
                    <span>{thread.views} views</span>
                    <span>Last activity {thread.lastActivity}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Forum Stats */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Forum Stats</h4>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Threads</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Posts</p>
              <p className="text-2xl font-bold">8,567</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Active Users</p>
              <p className="text-2xl font-bold">456</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Online Now</p>
              <p className="text-2xl font-bold">89</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
