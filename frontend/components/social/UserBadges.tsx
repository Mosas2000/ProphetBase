'use client';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const BADGES: Badge[] = [
  { id: 'early', name: 'Early Adopter', description: 'Joined during the beta phase', icon: '🚀', color: 'blue', rarity: 'rare' },
  { id: 'whale', name: 'High Roller', description: 'Traded over $100k in 30 days', icon: '🐋', color: 'indigo', rarity: 'epic' },
  { id: 'streak', name: 'Hot Streak', description: '10 consecutive winning predictions', icon: '🔥', color: 'orange', rarity: 'legendary' },
  { id: 'creator', name: 'Market Architect', description: 'Created 10+ high-volume markets', icon: '🏗️', color: 'emerald', rarity: 'epic' },
];

export default function UserBadges() {
  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          Achievements
        </h3>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {BADGES.length} Badges Earned
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {BADGES.map((badge) => (
          <div 
            key={badge.id}
            className="group relative p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-help"
          >
            <div className={`w-14 h-14 rounded-2xl bg-${badge.color}-100 dark:bg-${badge.color}-900/30 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
              {badge.icon}
            </div>
            
            <h4 className="font-bold text-gray-900 dark:text-white mb-1">{badge.name}</h4>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">{badge.rarity}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {badge.description}
            </p>

            {/* Tooltip on hover */}
            <div className="absolute inset-0 bg-blue-600/90 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 text-center">
              <p className="text-xs font-bold text-white uppercase tracking-widest">
                Share Achievement
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
