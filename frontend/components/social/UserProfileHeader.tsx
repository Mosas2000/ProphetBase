'use client';

import { useState } from 'react';

interface UserProfile {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  socialLinks: {
    twitter?: string;
    discord?: string;
    github?: string;
  };
  stats: {
    totalVolume: number;
    winRate: number;
    marketsCreated: number;
    followers: number;
    following: number;
  };
}

const MOCK_PROFILE: UserProfile = {
  name: 'Prophet Trader',
  username: '@prophet_master',
  bio: 'Mastering the art of prediction. Specialized in tech and political markets. Trading on Base since Day 1.',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100',
  socialLinks: {
    twitter: 'https://twitter.com/prophetbase',
    github: 'https://github.com/prophetbase',
  },
  stats: {
    totalVolume: 125400,
    winRate: 68.5,
    marketsCreated: 42,
    followers: 1240,
    following: 85,
  }
};

export default function UserProfileHeader() {
  const [profile, setProfile] = useState<UserProfile>(MOCK_PROFILE);
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl">
      {/* Cover Pattern */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-20" />
      
      <div className="px-8 pb-8">
        <div className="relative flex flex-col md:flex-row md:items-end -mt-16 mb-6 gap-6">
          {/* Avatar */}
          <div className="relative">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-32 h-32 rounded-3xl border-4 border-white dark:border-gray-900 shadow-2xl object-cover"
            />
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {profile.name}
              </h1>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded uppercase">
                Pro Trader
              </span>
            </div>
            <p className="text-gray-500 font-medium">{profile.username}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${
                isFollowing 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-2xl">
          {profile.bio}
        </p>

        {/* Socials & Stats */}
        <div className="flex flex-col lg:flex-row justify-between pt-8 border-t border-gray-100 dark:border-gray-800 gap-8">
          <div className="flex gap-4">
            {profile.socialLinks.twitter && (
              <a href={profile.socialLinks.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            )}
            {profile.socialLinks.github && (
              <a href={profile.socialLinks.github} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-8 items-center">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                ${(profile.stats.totalVolume / 1000).toFixed(1)}k
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-green-600 uppercase tracking-tighter">
                {profile.stats.winRate}%
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                {profile.stats.followers}
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Followers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
