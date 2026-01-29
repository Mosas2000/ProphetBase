'use client';

import { useState } from 'react';

interface MarketNode {
  id: string;
  name: string;
  correlation: number; // -1 to 1
  category: string;
}

const MOCK_NODES: MarketNode[] = [
  { id: '1', name: 'BTC Price', correlation: 1, category: 'Crypto' },
  { id: '2', name: 'ETH Price', correlation: 0.85, category: 'Crypto' },
  { id: '3', name: 'USA Election', correlation: -0.2, category: 'Politics' },
  { id: '4', name: 'Nvidia Earnings', correlation: 0.45, category: 'Tech' },
  { id: '5', name: 'Global Tech ETF', correlation: 0.72, category: 'Finance' },
];

/**
 * Visualizes correlations between different markets using a matrix-style heatmap
 */
export default function MarketCorrelationMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Market <span className="text-blue-600">Sync</span></h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Cross-market correlation analysis</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg text-[10px] font-black text-gray-400 uppercase">
             <div className="w-2 h-2 bg-blue-600 rounded-full" /> Pos
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg text-[10px] font-black text-gray-400 uppercase">
             <div className="w-2 h-2 bg-red-400 rounded-full" /> Neg
           </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Header Row */}
          <div className="flex mb-2">
            <div className="w-32" />
            {MOCK_NODES.map(node => (
              <div key={node.id} className="flex-1 text-center">
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter whitespace-nowrap">
                  {node.name}
                </span>
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {MOCK_NODES.map(row => (
            <div key={row.id} className="flex items-center mb-2">
              <div className="w-32 truncate pr-4 text-right">
                <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {row.name}
                </span>
              </div>
              {MOCK_NODES.map(col => {
                const correlation = row.id === col.id ? 1 : (row.correlation * col.correlation);
                const isPositive = correlation > 0;
                const opacity = Math.abs(correlation);
                
                return (
                  <div 
                    key={`${row.id}-${col.id}`}
                    onMouseEnter={() => setHovered(`${row.id}-${col.id}`)}
                    onMouseLeave={() => setHovered(null)}
                    className="flex-1 aspect-square p-0.5"
                  >
                    <div 
                      className={`w-full h-full rounded-md transition-all duration-300 relative group cursor-help ${
                        isPositive ? 'bg-blue-600' : 'bg-red-400'
                      }`}
                      style={{ opacity: 0.1 + (opacity * 0.9) }}
                    >
                      {hovered === `${row.id}-${col.id}` && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] font-bold py-2 px-3 rounded-lg z-50 whitespace-nowrap shadow-2xl">
                          {correlation.toFixed(2)} Correlation
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
         <div className="flex items-center gap-3">
            <span className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-lg">💡</span>
            <p className="text-[10px] text-gray-500 font-medium leading-tight uppercase tracking-tight">
              A high positive correlation implies these markets tend to move in the same direction. Use this for portfolio diversification and hedging.
            </p>
         </div>
      </div>
    </div>
  );
}
