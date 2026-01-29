'use client';

import { useState } from 'react';

interface Argument {
  id: string;
  side: 'for' | 'against';
  author: { name: string; avatar: string; vp: number };
  text: string;
  votes: number;
}

const ARGUMENTS: Argument[] = [
  {
    id: 'a1',
    side: 'for',
    author: { name: 'Protocol Architect', avatar: 'https://i.pravatar.cc/150?u=arch', vp: 125000 },
    text: 'Increasing the duration allows for more long-term hedging strategies which will boost platform TVL by an estimated 20%.',
    votes: 45,
  },
  {
    id: 'a2',
    side: 'against',
    author: { name: 'Risk Auditor', avatar: 'https://i.pravatar.cc/150?u=risk', vp: 85000 },
    text: 'Longer durations increase exposure to underlying oracle volatility. We should consider a tiered duration approach instead.',
    votes: 12,
  }
];

/**
 * Specialized discussion thread for governance proposals
 */
export default function GovernanceDiscussion() {
  const [filter, setFilter] = useState<'all' | 'for' | 'against'>('all');

  const filteredArgs = ARGUMENTS.filter(arg => filter === 'all' || arg.side === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Technical Discussion</h3>
        
        <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-xl border border-gray-100 dark:border-gray-700">
          {['All', 'For', 'Against'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f.toLowerCase() as any)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                filter === f.toLowerCase() 
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* For Side */}
        {(filter === 'all' || filter === 'for') && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em] mb-4">Arguments For</h4>
            {filteredArgs.filter(a => a.side === 'for').map(arg => (
              <ArgumentCard key={arg.id} arg={arg} />
            ))}
          </div>
        )}

        {/* Against Side */}
        {(filter === 'all' || filter === 'against') && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mb-4">Arguments Against</h4>
            {filteredArgs.filter(a => a.side === 'against').map(arg => (
              <ArgumentCard key={arg.id} arg={arg} />
            ))}
          </div>
        )}
      </div>

      <button className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-sm font-bold text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all uppercase tracking-widest">
        + Add Technical Argument
      </button>
    </div>
  );
}

function ArgumentCard({ arg }: { arg: Argument }) {
  return (
    <div className={`p-6 bg-white dark:bg-gray-900 rounded-3xl border-2 transition-all ${
      arg.side === 'for' ? 'border-green-50 dark:border-green-900/10' : 'border-red-50 dark:border-red-900/10'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={arg.author.avatar} alt="" className="w-8 h-8 rounded-lg" />
          <div>
            <div className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{arg.author.name}</div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{(arg.author.vp / 1000).toFixed(0)}k VP • AUTHOR</div>
          </div>
        </div>
        <button className="flex items-center gap-1.5 p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors">
          ▲ {arg.votes}
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium italic">
        "{arg.text}"
      </p>
    </div>
  );
}
