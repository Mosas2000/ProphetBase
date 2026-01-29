'use client';


interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  type: 'trade' | 'market_creation' | 'milestone';
  content: string;
  timestamp: string;
  metadata?: any;
}

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    user: { name: 'Alice Trader', avatar: 'https://i.pravatar.cc/150?u=alice' },
    type: 'trade',
    content: 'placed a $500 YES stake on "Will Bitcoin hit $100k?"',
    timestamp: '2m ago',
  },
  {
    id: '2',
    user: { name: 'Bob Forecaster', avatar: 'https://i.pravatar.cc/150?u=bob' },
    type: 'market_creation',
    content: 'created a new market: "SpaceX Starship Mars Landing by 2027"',
    timestamp: '15m ago',
  },
  {
    id: '3',
    user: { name: 'Charlie Wins', avatar: 'https://i.pravatar.cc/150?u=charlie' },
    type: 'milestone',
    content: 'just reached a 10-trade winning streak! 🔥',
    timestamp: '1h ago',
  }
];

export default function SocialActivityFeed() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          Social Feed
        </h2>
        <button className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_ACTIVITY.map((item) => (
          <div 
            key={item.id} 
            className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 transition-colors group"
          >
            <img 
              src={item.user.avatar} 
              alt={item.user.name} 
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-gray-900 dark:text-white truncate">
                  {item.user.name}
                </span>
                <span className="text-[10px] text-gray-400 font-medium uppercase bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
                  {item.timestamp}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.content}
              </p>

              {item.type === 'trade' && (
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-[10px] font-bold text-gray-400 hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                    VIEW MARKET
                  </button>
                  <button className="px-3 py-1 bg-gray-50 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/30 text-[10px] font-bold text-gray-400 hover:text-green-600 rounded-lg transition-colors border border-transparent hover:border-green-100">
                    COPY TRADE
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 text-center">
        <button className="w-full py-3 bg-gray-50 dark:bg-gray-800 text-gray-400 text-xs font-bold rounded-xl hover:text-gray-600 dark:hover:text-gray-200 transition-colors uppercase tracking-widest">
          Load More Activity
        </button>
      </div>
    </div>
  );
}
