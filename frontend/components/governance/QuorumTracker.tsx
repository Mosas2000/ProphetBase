'use client';

/**
 * Visual indicator for proposal quorum progress
 */
export default function QuorumTracker() {
  const currentVP = 1850000;
  const targetQuorum = 2500000;
  const progress = (currentVP / targetQuorum) * 100;
  
  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-1">Quorum Reached</h3>
          <div className="text-3xl font-black text-blue-600 tracking-tighter">
            {progress.toFixed(1)}%
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            {(currentVP / 1000000).toFixed(2)}M / {(targetQuorum / 1000000).toFixed(2)}M
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total VP Counted</div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-4 shadow-inner">
        {/* Actual Progress */}
        <div 
          className="absolute inset-y-0 left-0 bg-blue-600 transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          {/* Animated Sheen */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" 
               style={{ animation: 'shimmer 2s infinite' }} 
          />
        </div>
        
        {/* Quorum Target Marker */}
        <div className="absolute top-0 bottom-0 w-1 bg-red-400/50" style={{ left: '100%' }} />
      </div>

      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-2">
           <div className={`w-3 h-3 rounded-full ${progress >= 100 ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-amber-400'}`} />
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
             {progress >= 100 ? 'Quorum Met' : 'Quorum Pending'}
           </span>
        </div>
        <p className="max-w-[180px] text-[10px] text-gray-400 font-medium leading-tight text-right uppercase">
           {(targetQuorum - currentVP).toLocaleString()} VP needed for validity
        </p>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
