'use client';

import { useState } from 'react';

interface ForumTopic {
  id: string;
  title: string;
  author: {
    username: string;
    avatar: string;
    reputation: number;
  };
  category: 'general' | 'strategy' | 'analysis' | 'support' | 'announcements';
  replies: number;
  views: number;
  lastActivity: number;
  isPinned: boolean;
  isLocked: boolean;
  tags: string[];
}

interface ForumPost {
  id: string;
  author: {
    username: string;
    avatar: string;
    reputation: number;
  };
  content: string;
  timestamp: number;
  likes: number;
  isEdited: boolean;
}

export default function Forum() {
  const [topics, setTopics] = useState<ForumTopic[]>([
    {
      id: '1',
      title: 'Best strategies for volatile markets?',
      author: { username: 'ProphetKing', avatar: '👑', reputation: 847 },
      category: 'strategy',
      replies: 45,
      views: 892,
      lastActivity: Date.now() - 120000,
      isPinned: false,
      isLocked: false,
      tags: ['strategy', 'volatility', 'risk-management'],
    },
    {
      id: '2',
      title: 'Welcome to ProphetBase Community!',
      author: { username: 'Admin', avatar: '⚡', reputation: 9999 },
      category: 'announcements',
      replies: 156,
      views: 5420,
      lastActivity: Date.now() - 3600000,
      isPinned: true,
      isLocked: false,
      tags: ['announcement', 'welcome'],
    },
    {
      id: '3',
      title: 'Technical Analysis: BTC $100k prediction',
      author: { username: 'CryptoAnalyst', avatar: '📊', reputation: 623 },
      category: 'analysis',
      replies: 89,
      views: 2341,
      lastActivity: Date.now() - 7200000,
      isPinned: false,
      isLocked: false,
      tags: ['btc', 'analysis', 'crypto'],
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'replies'>(
    'latest'
  );

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📋', count: 247 },
    { id: 'announcements', name: 'Announcements', icon: '📢', count: 12 },
    { id: 'general', name: 'General', icon: '💬', count: 89 },
    { id: 'strategy', name: 'Strategy', icon: '🎯', count: 54 },
    { id: 'analysis', name: 'Analysis', icon: '📊', count: 67 },
    { id: 'support', name: 'Support', icon: '🆘', count: 25 },
  ];

  const filteredTopics = topics
    .filter(
      (topic) =>
        selectedCategory === 'all' || topic.category === selectedCategory
    )
    .filter((topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      announcements: 'bg-red-100 text-red-700',
      general: 'bg-gray-100 text-gray-700',
      strategy: 'bg-blue-100 text-blue-700',
      analysis: 'bg-purple-100 text-purple-700',
      support: 'bg-green-100 text-green-700',
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Forum</h2>
          <p className="text-sm text-gray-600">
            Discuss strategies, share insights, and connect with traders
          </p>
        </div>

        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + New Topic
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="col-span-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-50 border-2 border-blue-600'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {category.count} topics
                </div>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Forum Stats
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Topics:</span>
                <span className="font-semibold">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Posts:</span>
                <span className="font-semibold">3,891</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Members:</span>
                <span className="font-semibold">2,341</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Online:</span>
                <span className="font-semibold text-green-600">156</span>
              </div>
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div className="col-span-3">
          {/* Search and Sort */}
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">Latest Activity</option>
              <option value="popular">Most Popular</option>
              <option value="replies">Most Replies</option>
            </select>
          </div>

          {/* Topics */}
          <div className="space-y-3">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className={`p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer ${
                  topic.isPinned
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-3xl">{topic.author.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {topic.isPinned && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                            📌 Pinned
                          </span>
                        )}
                        {topic.isLocked && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                            🔒 Locked
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded-full capitalize ${getCategoryColor(
                            topic.category
                          )}`}
                        >
                          {topic.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {topic.title}
                      </h3>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <span>{topic.author.username}</span>
                          <span className="text-blue-600">
                            ({topic.author.reputation})
                          </span>
                        </div>
                        <span>•</span>
                        <span>{formatTime(topic.lastActivity)}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {topic.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex space-x-6 text-center ml-4">
                    <div>
                      <div className="text-xl font-bold text-blue-600">
                        {topic.replies}
                      </div>
                      <div className="text-xs text-gray-600">Replies</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">
                        {topic.views}
                      </div>
                      <div className="text-xs text-gray-600">Views</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center space-x-2">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              2
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              3
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
