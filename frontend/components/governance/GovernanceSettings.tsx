'use client';

/**
 * Interface for viewing and managing global protocol parameters
 */
export default function GovernanceSettings() {
  const parameters = [
    { id: 'min_power', label: 'Min Proposal Power', value: '5,000 VP', change: '+10%' },
    { id: 'vote_period', label: 'Voting Period', value: '72 Hours', change: 'None' },
    { id: 'platform_fee', label: 'Platform Fee', value: '2.5%', change: '-0.5%' },
    { id: 'quorum', label: 'Quorum Threshold', value: '12.5%', change: 'None' },
  ];

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Protocol Parameters</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Managed via Governance Proposals</p>
        </div>
        <button className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-[10px] font-black text-gray-400 hover:text-blue-600 rounded-xl uppercase tracking-widest border border-transparent hover:border-blue-100 transition-all">
          View History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {parameters.map((param) => (
          <div key={param.id} className="p-6 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-100 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{param.label}</span>
              {param.change !== 'None' && (
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                  param.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {param.change} Pending
                </span>
              )}
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">
              {param.value}
            </div>
            <button className="w-full py-2 bg-white dark:bg-gray-700 text-[10px] font-bold text-gray-500 hover:text-blue-600 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 opacity-0 group-hover:opacity-100 transition-all">
              PROPOSE CHANGE
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50">
        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase leading-relaxed text-center">
          Adjusting parameters requires a successful DAO vote with at least 12.5% quorum.
        </p>
      </div>
    </div>
  );
}
