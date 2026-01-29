'use client';

import { useState } from 'react';

interface VolumeCell {
  hour: number;
  day: string;
  volume: number;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 12 }, (_, i) => i * 2); // Every 2 hours

/**
 * Visualizes market volume intensity over time with a professional heatmap
 */
export default function VolumeHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Generate mock data
  const getIntensity = (h: number) => {
    if (h >= 14 && h <= 18) return 0.8 + Math.random() * 0.2; // Peak hours
    if (h >= 2 && h <= 6) return 0.1 + Math.random() * 0.2; // Low hours
    return 0.3 + Math.random() * 0.4;
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Volume <span className="text-blue-600">Density</span></h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Trading intensity by time of day</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-blue-50 dark:bg-blue-900/20" />
              <span className="text-[8px] font-bold text-gray-400 uppercase">Low</span>
           </div>
           <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-blue-600" />
              <span className="text-[8px] font-bold text-gray-400 uppercase">High</span>
           </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[450px]">
          {/* Header */}
          <div className="flex mb-4">
             <div className="w-12" />
             {HOURS.map(h => (
               <div key={h} className="flex-1 text-center">
                 <span className="text-[8px] font-bold text-gray-400 uppercase">{h}:00</span>
               </div>
             ))}
          </div>

          {/* Rows */}
          {DAYS.map(day => (
            <div key={day} className="flex items-center mb-1.5">
              <div className="w-12">
                <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tighter">{day}</span>
              </div>
              {HOURS.map(hour => {
                const intensity = getIntensity(hour);
                const cellId = `${day}-${hour}`;
                
                return (
                  <div 
                    key={cellId}
                    onMouseEnter={() => setHoveredCell(cellId)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className="flex-1 aspect-square p-0.5"
                  >
                    <div 
                      className="w-full h-full rounded-md transition-all duration-300 relative bg-blue-600 cursor-pointer"
                      style={{ opacity: 0.05 + (intensity * 0.95) }}
                    >
                      {hoveredCell === cellId && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-2 rounded-lg text-[8px] font-black z-50 whitespace-nowrap shadow-xl">
                          ${(Math.floor(intensity * 12500)).toLocaleString()} VOL
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

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
        <button className="px-6 py-2 bg-gray-50 dark:bg-gray-800 text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest rounded-xl transition-all">
          Switch to Liquidity Map
        </button>
      </div>
    </div>
  );
}
