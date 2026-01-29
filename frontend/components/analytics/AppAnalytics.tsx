'use client';

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';

const USER_ACTIVITY_DATA = [
  { time: '00:00', users: 400 },
  { time: '04:00', users: 300 },
  { time: '08:00', users: 900 },
  { time: '12:00', users: 1200 },
  { time: '16:00', users: 1500 },
  { time: '20:00', users: 1100 },
];

const FEATURE_USAGE = [
  { name: 'Market Trading', value: 85 },
  { name: 'Analytics', value: 45 },
  { name: 'Social Feed', value: 30 },
  { name: 'Command Palette', value: 65 },
];

export default function AnalyticsDashboard() {
  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>
          <p className="text-gray-500">Real-time platform performance and user behavior.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-500">Uptime</div>
            <div className="text-xl font-bold text-green-600">99.98%</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-500">Avg. Latency</div>
            <div className="text-xl font-bold text-blue-600">42ms</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6">User Activity (24h)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={USER_ACTIVITY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Usage */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6">Feature Adoption (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FEATURE_USAGE} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#888" fontSize={11} width={100} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {FEATURE_USAGE.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white">
          <div className="text-sm opacity-80 mb-2">Total Volume (24h)</div>
          <div className="text-3xl font-bold">$1,245,670</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white">
          <div className="text-sm opacity-80 mb-2">New Users (Today)</div>
          <div className="text-3xl font-bold">+245</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl text-white">
          <div className="text-sm opacity-80 mb-2">Resolution Accuracy</div>
          <div className="text-3xl font-bold">98.2%</div>
        </div>
      </div>
    </div>
  );
}
