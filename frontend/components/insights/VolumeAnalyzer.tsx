'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface VolumeData {
  hourly: { time: string; volume: number }[];
  daily: { date: string; volume: number }[];
  total24h: number;
  change24h: number;
  avgHourly: number;
  peakHour: string;
}

export function VolumeAnalyzer() {
  const [timeframe, setTimeframe] = useState<'hourly' | 'daily'>('hourly');

  // Mock data
  const volumeData: VolumeData = {
    hourly: [
      { time: '00:00', volume: 1200 },
      { time: '01:00', volume: 800 },
      { time: '02:00', volume: 600 },
      { time: '03:00', volume: 500 },
      { time: '04:00', volume: 700 },
      { time: '05:00', volume: 900 },
      { time: '06:00', volume: 1500 },
      { time: '07:00', volume: 2100 },
      { time: '08:00', volume: 2800 },
      { time: '09:00', volume: 3200 },
      { time: '10:00', volume: 2900 },
      { time: '11:00', volume: 2600 },
    ],
    daily: [
      { date: 'Mon', volume: 45000 },
      { date: 'Tue', volume: 52000 },
      { date: 'Wed', volume: 48000 },
      { date: 'Thu', volume: 61000 },
      { date: 'Fri', volume: 58000 },
      { date: 'Sat', volume: 42000 },
      { date: 'Sun', volume: 38000 },
    ],
    total24h: 125000,
    change24h: 15.5,
    avgHourly: 5200,
    peakHour: '09:00',
  };

  const data = timeframe === 'hourly' ? volumeData.hourly : volumeData.daily;
  const maxVolume = Math.max(...data.map(d => d.volume));

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Volume Analysis</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeframe('hourly')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  timeframe === 'hourly'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
              >
                Hourly
              </button>
              <button
                onClick={() => setTimeframe('daily')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  timeframe === 'daily'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
              >
                Daily
              </button>
            </div>
          </div>

          {/* Volume Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-500/30">
              <p className="text-sm text-gray-400 mb-1">24h Volume</p>
              <p className="text-2xl font-bold">${volumeData.total24h.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-sm ${volumeData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {volumeData.change24h >= 0 ? '↗' : '↘'} {Math.abs(volumeData.change24h)}%
                </span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Avg Hourly</p>
              <p className="text-2xl font-bold">${volumeData.avgHourly.toLocaleString()}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Peak Hour</p>
              <p className="text-2xl font-bold">{volumeData.peakHour}</p>
            </div>
          </div>

          {/* Volume Chart */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-end justify-between h-64 gap-1">
              {data.map((item, idx) => {
                const height = (item.volume / maxVolume) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative w-full group">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all hover:opacity-80"
                        style={{ height: `${height}%` }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs whitespace-nowrap">
                          ${item.volume.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {'time' in item ? item.time : item.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Volume Patterns */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Volume Patterns</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📈</span>
                <div>
                  <p className="font-medium">High Activity Period</p>
                  <p className="text-sm text-gray-400">Peak trading hours: 8AM - 12PM</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌙</span>
                <div>
                  <p className="font-medium">Low Activity Period</p>
                  <p className="text-sm text-gray-400">Quiet hours: 2AM - 6AM</p>
                </div>
              </div>
              <Badge variant="default">Normal</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-medium">Volume Spike Detected</p>
                  <p className="text-sm text-gray-400">+45% above average at 9AM</p>
                </div>
              </div>
              <Badge variant="warning">Alert</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Volume Breakdown */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Volume Breakdown</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Buy Volume</span>
                <span className="font-medium text-green-400">$72,500 (58%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '58%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Sell Volume</span>
                <span className="font-medium text-red-400">$52,500 (42%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-500/10 border border-blue-500 rounded-lg p-4">
            <p className="text-sm text-blue-400">
              💡 Buy pressure is dominant, indicating bullish sentiment
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
