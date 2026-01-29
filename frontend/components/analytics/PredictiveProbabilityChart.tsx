'use client';

import { useState } from 'react';

interface DataPoint {
  timestamp: string;
  probability: number;
}

const MOCK_HISTORY: DataPoint[] = [
  { timestamp: '10:00', probability: 45 },
  { timestamp: '11:00', probability: 48 },
  { timestamp: '12:00', probability: 52 },
  { timestamp: '13:00', probability: 41 },
  { timestamp: '14:00', probability: 58 },
  { timestamp: '15:00', probability: 64 },
  { timestamp: '16:00', probability: 72 },
];

/**
 * Visualizes AI-predicted outcome probabilities over time with a professional line chart
 */
export default function PredictiveProbabilityChart() {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Outcome <span className="text-blue-600">Trajectory</span></h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">AI-Predicted Win Probability %</p>
        </div>
        <div className="px-3 py-1 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg">
           <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">+12.4% Probability Spike</span>
        </div>
      </div>

      <div className="relative h-64 flex items-end gap-2 px-2">
        {/* Simple CSS-based Line/Bar Chart (Hybrid) */}
        {MOCK_HISTORY.map((point, i) => (
          <div 
            key={i} 
            className="flex-1 flex flex-col justify-end group transition-all"
            onMouseEnter={() => setActiveSegment(i)}
            onMouseLeave={() => setActiveSegment(null)}
          >
            <div className="relative w-full">
               {/* Label on Hover */}
               {activeSegment === i && (
                 <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-3 rounded-xl z-50 text-[10px] font-bold shadow-2xl animate-in fade-in zoom-in duration-200">
                   <div className="text-blue-400 mb-0.5">{point.timestamp}</div>
                   <div>{point.probability}% Win Prob</div>
                 </div>
               )}

               {/* Bar/Point */}
               <div 
                 className={`w-full rounded-t-xl transition-all duration-500 ${
                   activeSegment === i ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800/50'
                 }`}
                 style={{ height: `${point.probability * 2}px` }}
               />
               
               {/* Line Connection (Mental visualization - using bar height as data points) */}
            </div>
          </div>
        ))}
        
        {/* Baseline */}
        <div className="absolute left-0 right-0 h-px bg-gray-100 dark:bg-gray-800 bottom-0" />
      </div>

      <div className="flex justify-between mt-6 px-4">
        {['10 AM', '1 PM', '4 PM'].map(label => (
          <span key={label} className="text-[10px] font-bold text-gray-400 uppercase">{label}</span>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Confidence Score</div>
           <div className="text-lg font-black text-gray-900 dark:text-white">High (89%)</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Major Driver</div>
           <div className="text-lg font-black text-blue-600">Volume Surge</div>
        </div>
      </div>
    </div>
  );
}
