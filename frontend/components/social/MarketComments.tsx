'use client';

import { useState } from 'react';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    username: string;
  };
  text: string;
  timestamp: string;
  likes: number;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    user: { name: 'Alpha Trader', username: '@alpha', avatar: 'https://i.pravatar.cc/150?u=alpha' },
    text: 'This market is undervalued. The sentiment data shows clear upward trend for YES.',
    timestamp: '2h ago',
    likes: 12,
  },
  {
    id: 'c2',
    user: { name: 'Market Watcher', username: '@mkt_watcher', avatar: 'https://i.pravatar.cc/150?u=watcher' },
    text: 'I disagree. Regulatory pressure is increasing, which might flip this market by next week.',
    timestamp: '5h ago',
    likes: 8,
  }
];

export default function MarketComments() {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: { name: 'Demo User', username: '@demo', avatar: 'https://i.pravatar.cc/150?u=demo' },
      text: newComment,
      timestamp: 'Just now',
      likes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">
        Discussion
      </h3>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="mb-10">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your insights..."
          className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all h-24 mb-3"
        />
        <div className="flex justify-end">
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <img 
              src={comment.user.avatar} 
              alt={comment.user.name} 
              className="w-10 h-10 rounded-xl shrink-0"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-900 dark:text-white text-sm">{comment.user.name}</span>
                <span className="text-[10px] text-gray-400 font-medium uppercase">{comment.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                {comment.text}
              </p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  {comment.likes}
                </button>
                <button className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
