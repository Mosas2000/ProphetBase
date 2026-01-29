'use client';


interface WhaleMovement {
  id: string;
  trader: string;
  market: string;
  amount: number;
  type: 'buy_yes' | 'buy_no';
  timestamp: string;
  impact: number; // % price impact
}

const MOCK_WHALES: WhaleMovement[] = [
  { id: 'w1', trader: '0xWhale...4f2', market: 'BTC over $100k', amount: 45000, type: 'buy_yes', timestamp: '2m ago', impact: 1.2 },
  { id: 'w2', trader: '0xAlpha...92e', market: 'USA Election 2026', amount: 82000, type: 'buy_no', timestamp: '15m ago', impact: 3.5 },
  { id: 'w3', trader: '0xSmart...111', market: 'Liquid Staking Yield', amount: 25000, type: 'buy_yes', timestamp: '1h ago', impact: 0.8 },
];

/**
 * AI-powered monitoring for large market movements (Whales)
 */
export default function WhaleActivityTracker() {
  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Whale <span className="text-blue-600">Siren</span></h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">AI-Detected Institutional Accumulation</p>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center animate-pulse">
           <span className="text-white text-xl">🐋</span>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_WHALES.map((whale) => (
          <div 
            key={whale.id} 
            className="group relative p-6 bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 transition-all overflow-hidden"
          >
            {/* Impact indicator background */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"
              style={{ width: `${whale.impact * 20}%` }}
            />

            <div className="relative flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight truncate max-w-[120px]">
                    {whale.trader}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    whale.type === 'buy_yes' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {whale.type === 'buy_yes' ? 'BUY YES' : 'BUY NO'}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter truncate md:max-w-xs">
                  {whale.market}
                </p>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-gray-900 dark:text-white">
                  ${(whale.amount / 1000).toFixed(1)}k
                </div>
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  {whale.impact}% Impact
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
           Live Stream Active
         </span>
         <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
           Full Whale Map
         </button>
      </div>
    </div>
  );
}
