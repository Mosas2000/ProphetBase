'use client';


interface ArbitrageOpportunity {
  id: string;
  market: string;
  markets: { name: string; price: number }[];
  profit: number; // %
  risk: 'low' | 'medium' | 'high';
}

const OPPORTUNITIES: ArbitrageOpportunity[] = [
  { 
    id: 'arb1', 
    market: 'Will BTC hit $100k?', 
    markets: [
      { name: 'ProphetBase', price: 0.52 },
      { name: 'Polymarket', price: 0.58 }
    ], 
    profit: 11.5, 
    risk: 'low' 
  },
  { 
    id: 'arb2', 
    market: 'Nvidia Market Cap $5T', 
    markets: [
      { name: 'ProphetBase', price: 0.64 },
      { name: 'PredictIt', price: 0.61 }
    ], 
    profit: 4.8, 
    risk: 'medium' 
  },
];

/**
 * AI-powered detection of price discrepancies across different prediction markets
 */
export default function ArbitrageDetector() {
  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Arbitrage <span className="text-blue-600">Scan</span></h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">AI-Detected Price Discrepancies</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
           <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
           </svg>
        </div>
      </div>

      <div className="space-y-4">
        {OPPORTUNITIES.map((arb) => (
          <div key={arb.id} className="p-6 bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl border border-transparent hover:border-blue-100 transition-all group">
            <div className="flex justify-between items-start mb-6">
               <div className="flex-1">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1 truncate md:max-w-xs">{arb.market}</h4>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      arb.risk === 'low' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {arb.risk} Risk Arb
                    </span>
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-2xl font-black text-green-600">+{arb.profit}%</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expected ROI</div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {arb.markets.map((m) => (
                <div key={m.name} className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                   <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">{m.name}</div>
                   <div className="text-sm font-black text-gray-900 dark:text-white">{m.price} USDC</div>
                </div>
              ))}
            </div>

            <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black rounded-xl uppercase tracking-widest hover:scale-[1.02] transition-transform">
               Execute Arb Flow
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-relaxed">
          ProphetBase uses AI oracles to monitor 15+ external platforms for delta opportunities.
        </p>
      </div>
    </div>
  );
}
