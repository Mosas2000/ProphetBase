'use client';

import { useState } from 'react';

export default function InstitutionalDashboard() {
  const [timeframe, setTimeframe] = useState('30d');
  const stats = {
    totalVolume: 12500000,
    avgDailyVolume: 450000,
    totalTrades: 5234,
    successRate: 82,
    totalAccounts: 15,
    activeTraders: 12,
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Institutional Dashboard</h1>
        <p className="text-gray-600">High-volume trading and analytics for institutions</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Total Volume</p>
          <p className="text-2xl font-bold text-blue-600">
            ${(stats.totalVolume / 1000000).toFixed(2)}M
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Avg Daily Volume</p>
          <p className="text-2xl font-bold text-green-600">
            ${(stats.avgDailyVolume / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-500">
          <p className="text-sm text-gray-600 mb-1">Total Trades</p>
          <p className="text-2xl font-bold text-purple-600">{stats.totalTrades}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-500">
          <p className="text-sm text-gray-600 mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.successRate}%</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-500">
          <p className="text-sm text-gray-600 mb-1">Total Accounts</p>
          <p className="text-2xl font-bold text-red-600">{stats.totalAccounts}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-500">
          <p className="text-sm text-gray-600 mb-1">Active Traders</p>
          <p className="text-2xl font-bold text-indigo-600">{stats.activeTraders}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Volume Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Trading Volume</h2>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
              </select>
            </div>
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-600">Volume Chart Visualization</p>
              </div>
            </div>
          </div>

          {/* Custom Reports */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Custom Reports</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Daily Summary', icon: '📅', color: 'blue' },
                { name: 'Risk Analysis', icon: '⚠️', color: 'red' },
                { name: 'P&L Statement', icon: '💰', color: 'green' },
                { name: 'Compliance Report', icon: '📋', color: 'purple' },
              ].map((report) => (
                <button
                  key={report.name}
                  className={`bg-${report.color}-50 hover:bg-${report.color}-100 border-2 border-${report.color}-500 rounded-lg p-4 text-left transition-all`}
                >
                  <div className="text-3xl mb-2">{report.icon}</div>
                  <p className="font-semibold text-gray-900">{report.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Priority Execution */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-500">
            <h3 className="font-bold text-blue-900 mb-3">⚡ Priority Execution</h3>
            <p className="text-sm text-blue-800 mb-4">
              Your orders are prioritized for fastest execution
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-800">Avg Execution Time</span>
                <span className="font-semibold text-blue-900">0.8s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-800">Success Rate</span>
                <span className="font-semibold text-blue-900">99.9%</span>
              </div>
            </div>
          </div>

          {/* Dedicated Support */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-500">
            <h3 className="font-bold text-green-900 mb-3">🎯 Dedicated Support</h3>
            <p className="text-sm text-green-800 mb-4">24/7 institutional support team</p>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">
              Contact Support
            </button>
          </div>

          {/* Account Manager */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Your Account Manager</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl">👤</div>
              <div>
                <p className="font-semibold text-gray-900">Sarah Johnson</p>
                <p className="text-sm text-gray-600">Senior Account Manager</p>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
              Schedule Call
            </button>
          </div>

          {/* Compliance */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-500">
            <h3 className="font-bold text-purple-900 mb-3">📋 Compliance</h3>
            <ul className="space-y-2 text-sm text-purple-800">
              <li>✅ KYC Verified</li>
              <li>✅ AML Compliant</li>
              <li>✅ SOC 2 Type II</li>
              <li>✅ GDPR Compliant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
