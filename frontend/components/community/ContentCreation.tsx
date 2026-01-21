'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function ContentCreation() {
  const myContent = [
    { id: '1', title: 'Beginner\'s Guide to Crypto Markets', type: 'guide', votes: 145, views: 2340 },
    { id: '2', title: 'My Top 5 Trading Strategies', type: 'strategy', votes: 89, views: 1560 },
  ];

  const trending = [
    { title: 'Bitcoin Analysis: Q1 2024', author: 'CryptoKing', votes: 234, type: 'analysis' },
    { title: 'Risk Management Masterclass', author: 'TradeQueen', votes: 198, type: 'guide' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Content Creation</h3>
            <Button>Create Post</Button>
          </div>
        </div>
      </Card>

      {/* My Content */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">My Content</h4>
          
          <div className="space-y-3">
            {myContent.map(content => (
              <div key={content.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium">{content.title}</h5>
                      <Badge variant="default" className="capitalize text-xs">{content.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>👍 {content.votes} votes</span>
                      <span>👁️ {content.views} views</span>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Trending Content */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Trending Content</h4>
          
          <div className="space-y-3">
            {trending.map((content, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <button className="text-gray-400 hover:text-green-400">▲</button>
                    <span className="font-bold">{content.votes}</span>
                    <button className="text-gray-400 hover:text-red-400">▼</button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium">{content.title}</h5>
                      <Badge variant="default" className="capitalize text-xs">{content.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-400">by {content.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Content Stats */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Your Stats</h4>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Posts</p>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Votes</p>
              <p className="text-2xl font-bold">234</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Views</p>
              <p className="text-2xl font-bold">3.9K</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
