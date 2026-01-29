'use client';


interface DepthPoint {
  price: number;
  liquidity: number;
}

const ASKS: DepthPoint[] = [
  { price: 0.52, liquidity: 4500 },
  { price: 0.55, liquidity: 8200 },
  { price: 0.60, liquidity: 12500 },
  { price: 0.65, liquidity: 18000 },
];

const BIDS: DepthPoint[] = [
  { price: 0.48, liquidity: 4200 },
  { price: 0.45, liquidity: 7800 },
  { price: 0.40, liquidity: 11000 },
  { price: 0.35, liquidity: 15500 },
];

/**
 * Visualizes order book depth and liquidity levels with a professional chart
 */
export default function LiquidityDepthChart() {
  const maxLiquidity = 20000;

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Liquidity <span className="text-blue-600">Depth</span></h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Market support & resistance levels</p>
        </div>
        <div className="text-right">
           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Spread</div>
           <div className="text-sm font-black text-blue-600 uppercase">0.04 USDC</div>
        </div>
      </div>

      <div className="relative h-64 flex flex-col justify-center">
        {/* Depth Chart Area */}
        <div className="flex h-full w-full items-end gap-px">
          {/* Bids (Green) */}
          <div className="flex-1 flex flex-row-reverse items-end h-full">
            {BIDS.map((bid, i) => (
              <div 
                key={bid.price} 
                className="flex-1 bg-green-500/10 border-t-2 border-green-500 transition-all hover:bg-green-500/20 group relative cursor-crosshair"
                style={{ height: `${(bid.liquidity / maxLiquidity) * 100}%` }}
              >
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-gray-900 text-white p-2 text-[8px] font-black rounded-lg whitespace-nowrap z-50">
                  Buy @ {bid.price}: {bid.liquidity.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Spread Gap */}
          <div className="w-8 flex items-center justify-center">
             <div className="w-0.5 h-full bg-gray-100 dark:bg-gray-800" />
          </div>

          {/* Asks (Red) */}
          <div className="flex-1 flex items-end h-full">
            {ASKS.map((ask) => (
              <div 
                key={ask.price} 
                className="flex-1 bg-red-500/10 border-t-2 border-red-500 transition-all hover:bg-red-500/20 group relative cursor-crosshair"
                style={{ height: `${(ask.liquidity / maxLiquidity) * 100}%` }}
              >
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-gray-900 text-white p-2 text-[8px] font-black rounded-lg whitespace-nowrap z-50">
                  Sell @ {ask.price}: {ask.liquidity.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-4">
           <div className="text-[10px] font-bold text-green-600 uppercase">Bids</div>
           <div className="text-[10px] font-bold text-red-500 uppercase">Asks</div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Slippage (10k)</div>
           <div className="text-sm font-black text-gray-900 dark:text-white">0.42%</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">24h Change</div>
           <div className="text-sm font-black text-green-600">+12% Depth</div>
        </div>
      </div>
    </div>
  );
}
