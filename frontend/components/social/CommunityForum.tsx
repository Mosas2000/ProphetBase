'use client';

import { useState } from 'react';

interface ForumPost {
  id: string;
  author: { name: string; avatar: string };
  title: string;
  preview: string;
  category: string;
  replies: number;
  votes: number;
  timestamp: string;
}

const POSTS: ForumPost[] = [
  {
    id: 'p1',
    author: { name: 'Dev Lead', avatar: 'https://i.pravatar.cc/150?u=dev' },
    title: 'Upcoming V2 Governance Proposals',
    preview: 'We are preparing the first set of on-chain governance proposals for the ProphetBase V2 upgrade...',
    category: 'Governance',
    replies: 24,
    votes: 156,
    timestamp: '2h ago',
  },
  {
    id: 'p2',
    author: { name: 'Alpha Hunter', avatar: 'https://i.pravatar.cc/150?u=hunter' },
    title: 'Best strategies for political markets in 2026',
    preview: 'After analyzing 100+ political cycles, I have identified three key indicators that correlate with...',
    category: 'Trading Strategies',
    replies: 42,
    votes: 89,
    timestamp: '5h ago',
  }
];

export default function CommunityForum() {
  const [activeTab, setActiveTab] = useState('hot');

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Community Forum</h1>
          <p className="text-gray-500 font-medium">Discuss strategies, governance, and platform updates.</p>
        </div>
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all">
          New Discussion
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-100 dark:border-gray-800">
        {['Hot', 'New', 'Top', 'Pinned'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab.toLowerCase() 
                ? 'text-blue-600' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            {tab}
            {activeTab === tab.toLowerCase() && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {POSTS.map((post) => (
          <div 
            key={post.id}
            className="group p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer flex gap-6"
          >
            {/* Voting */}
            <div className="hidden sm:flex flex-col items-center gap-1 py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-xl h-fit">
              <button className="text-gray-400 hover:text-blue-600 transition-colors">▲</button>
              <span className="text-sm font-black text-gray-900 dark:text-white">{post.votes}</span>
              <button className="text-gray-400 hover:text-red-600 transition-colors">▼</button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded uppercase">
                  {post.category}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">• {post.timestamp}</span>
              </div>
              
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors truncate">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                {post.preview}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={post.author.avatar} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{post.author.name}</span>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    {post.replies} Replies
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
