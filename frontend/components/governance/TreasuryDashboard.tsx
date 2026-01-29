'use client';


interface TreasuryAsset {
  symbol: string;
  name: string;
  amount: number;
  valueUsd: number;
  change24h: number;
}

const ASSETS: TreasuryAsset[] = [
  { symbol: 'ETH', name: 'Ethereum', amount: 450.5, valueUsd: 1125000, change24h: 2.4 },
  { symbol: 'USDC', name: 'USD Coin', amount: 2500000, valueUsd: 2500000, change24h: 0 },
  { symbol: 'PRPT', name: 'ProphetBase', amount: 15000000, valueUsd: 750000, change24h: -1.2 },
];

/**
 * Professional DAO Treasury monitoring dashboard
 */
export default function TreasuryDashboard() {
  const totalValue = ASSETS.reduce((sum, asset) => sum + asset.valueUsd, 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden">
      <div className="p-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2 italic">
              DAO Treasury
            </h2>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Global Asset Reserves</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-black text-blue-600 tracking-tighter">
              ${(totalValue / 1000000).toFixed(2)}M
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Net Worth (USD)</div>
          </div>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {ASSETS.map((asset) => (
            <div key={asset.symbol} className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl shadow-sm flex items-center justify-center font-black text-xs">
                  {asset.symbol}
                </div>
                <span className={`text-xs font-bold ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {asset.amount.toLocaleString()}
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                ${asset.valueUsd.toLocaleString()} USD
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="px-10 pb-10">
        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
          Recent Allocations
        </h3>
        <div className="space-y-4">
          {[
            { id: 'tx1', type: 'Grant', recipient: 'Security Audit', amount: '50,000 USDC', status: 'Completed', date: 'Jan 28' },
            { id: 'tx2', type: 'Yield', recipient: 'Staking Rewards', amount: '12.5 ETH', status: 'Pending', date: 'Jan 29' },
          ].map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-transparent hover:border-blue-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{tx.type} • {tx.recipient}</div>
                  <div className="text-[10px] text-gray-400 font-medium uppercase">{tx.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-gray-900 dark:text-white uppercase">{tx.amount}</div>
                <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{tx.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
