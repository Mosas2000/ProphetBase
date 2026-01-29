'use client';


interface SocialPulse {
  platform: string;
  mentions: number;
  sentiment: number; // 0-100
  trend: 'up' | 'down' | 'neutral';
}

const PULSE_DATA: SocialPulse[] = [
  { platform: 'Twitter/X', mentions: 12400, sentiment: 72, trend: 'up' },
  { platform: 'Reddit', mentions: 5200, sentiment: 64, trend: 'up' },
  { platform: 'ProphetBase Thread', mentions: 850, sentiment: 88, trend: 'up' },
  { platform: 'News/Media', mentions: 120, sentiment: 45, trend: 'down' },
];

/**
 * Aggregates social signals and mentions for AI analysis
 */
export default function SocialSignalAggregator() {
  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Social <span className="text-blue-600">Pulse</span></h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">AI-Aggregated Presence Signals</p>
        </div>
        <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active Monitoring</span>
        </div>
      </div>

      <div className="space-y-6">
        {PULSE_DATA.map((pulse) => (
          <div key={pulse.platform} className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl shadow-sm flex items-center justify-center font-black text-xs text-gray-400">
                 {pulse.platform.charAt(0)}
               </div>
               <div>
                  <div className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{pulse.platform}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">{pulse.mentions.toLocaleString()} Mentions</div>
               </div>
            </div>

            <div className="text-right">
               <div className="flex items-center gap-2 mb-1 justify-end">
                  <span className={`text-[10px] font-black uppercase ${
                    pulse.sentiment > 70 ? 'text-green-600' : pulse.sentiment < 50 ? 'text-red-500' : 'text-blue-500'
                  }`}>
                    {pulse.sentiment}% Pos
                  </span>
                  <span className={`text-xs ${pulse.trend === 'up' ? 'text-green-500' : 'text-red-400'}`}>
                    {pulse.trend === 'up' ? '▲' : '▼'}
                  </span>
               </div>
               <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      pulse.sentiment > 70 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${pulse.sentiment}%` }}
                  />
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
         <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50">
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="animate-ping w-1.5 h-1.5 bg-blue-600 rounded-full" /> AI Inference
            </h4>
            <p className="text-[10px] text-blue-800/70 dark:text-blue-400/70 font-medium leading-relaxed italic">
              "Social signals correlate with a 15% increase in volatility over the next 4 hours. Recommend monitoring Bid/Ask depth for large spreads."
            </p>
         </div>
      </div>
    </div>
  );
}
