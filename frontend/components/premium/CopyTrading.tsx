'use client';

import { useState } from 'react';

interface Trader {
  id: string;
  name: string;
  avatar: string;
  winRate: number;
  totalReturn: number;
  followers: number;
  isFollowing: boolean;
}

export default function CopyTrading() {
  const [traders, setTraders] = useState<Trader[]>([
    {
      id: '1',
      name: 'CryptoKing',
      avatar: '👑',
      winRate: 78,
      totalReturn: 234,
      followers: 1542,
      isFollowing: false,
    },
    {
      id: '2',
      name: 'MarketMaster',
      avatar: '🎯',
      winRate: 82,
      totalReturn: 187,
      followers: 2341,
      isFollowing: true,
    },
  ]);
  const [copyAmount, setCopyAmount] = useState('100');
  const [maxRisk, setMaxRisk] = useState('10');

  const toggleFollow = (traderId: string) => {
    setTraders(
      traders.map((t) =>
        t.id === traderId ? { ...t, isFollowing: !t.isFollowing } : t
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Copy Trading</h1>
        <p className="text-gray-600">
          Follow and copy top traders automatically
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Traders */}
        <div className="lg:col-span-2 space-y-6">
          {traders.map((trader) => (
            <div
              key={trader.id}
              className={`bg-white rounded-xl shadow-lg p-6 border-2 ${
                trader.isFollowing ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{trader.avatar}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {trader.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {trader.followers} followers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(trader.id)}
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    trader.isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {trader.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Win Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {trader.winRate}%
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">Total Return</p>
                  <p className="text-2xl font-bold text-blue-600">
                    +{trader.totalReturn}%
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600">Followers</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {trader.followers}
                  </p>
                </div>
              </div>

              {trader.isFollowing && (
                <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    ✅ Copying trades from {trader.name}
                  </p>
                  <p className="text-xs text-blue-700">
                    Amount per trade: ${copyAmount} • Max risk: {maxRisk}%
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500">
            <h3 className="font-bold text-gray-900 mb-4">Copy Settings</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount per Trade
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={copyAmount}
                  onChange={(e) => setCopyAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                  USD
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Risk per Trade (%)
              </label>
              <input
                type="number"
                value={maxRisk}
                onChange={(e) => setMaxRisk(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              Update Settings
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-500">
            <h3 className="font-bold text-green-900 mb-3">
              Your Copy Performance
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-green-800">Total Trades</span>
                <span className="font-semibold text-green-900">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-800">Win Rate</span>
                <span className="font-semibold text-green-900">75%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-800">Total Profit</span>
                <span className="font-semibold text-green-900">+$342.50</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-500">
            <h3 className="font-bold text-yellow-900 mb-3">⚠️ Risk Controls</h3>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li>• Maximum daily loss limit</li>
              <li>• Stop copying on drawdown</li>
              <li>• Auto-pause on volatility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
