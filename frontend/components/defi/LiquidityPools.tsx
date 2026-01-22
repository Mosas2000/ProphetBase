'use client';

import { useState } from 'react';

interface Pool {
  id: string;
  name: string;
  pair: string;
  tvl: number;
  apy: number;
  volume24h: number;
  lpTokens: number;
  myLiquidity: number;
  feesEarned: number;
}

export default function LiquidityPools() {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [amount, setAmount] = useState('');

  const pools: Pool[] = [
    {
      id: '1',
      name: 'YES/USDC',
      pair: 'YES-USDC',
      tvl: 1250000,
      apy: 42.5,
      volume24h: 89000,
      lpTokens: 5420,
      myLiquidity: 2500,
      feesEarned: 125.50
    },
    {
      id: '2',
      name: 'NO/USDC',
      pair: 'NO-USDC',
      tvl: 980000,
      apy: 38.2,
      volume24h: 67000,
      lpTokens: 3890,
      myLiquidity: 1800,
      feesEarned: 89.20
    },
    {
      id: '3',
      name: 'PROPHET/USDC',
      pair: 'PROPHET-USDC',
      tvl: 2100000,
      apy: 56.8,
      volume24h: 142000,
      lpTokens: 8920,
      myLiquidity: 5000,
      feesEarned: 284.75
    }
  ];

  const calculateImpermanentLoss = (priceChange: number) => {
    // IL formula: 2 * sqrt(priceRatio) / (1 + priceRatio) - 1
    const ratio = 1 + priceChange / 100;
    const il = (2 * Math.sqrt(ratio) / (1 + ratio) - 1) * 100;
    return il.toFixed(2);
  };

  const totalLiquidity = pools.reduce((sum, pool) => sum + pool.myLiquidity, 0);
  const totalFeesEarned = pools.reduce((sum, pool) => sum + pool.feesEarned, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Liquidity Pools</h2>
          <p className="text-sm text-gray-600">Provide liquidity and earn fees</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Add Liquidity
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-sm text-blue-600 mb-1">Total Liquidity</div>
          <div className="text-2xl font-bold text-blue-900">${totalLiquidity.toLocaleString()}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-sm text-green-600 mb-1">Fees Earned</div>
          <div className="text-2xl font-bold text-green-900">${totalFeesEarned.toFixed(2)}</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <div className="text-sm text-purple-600 mb-1">LP Tokens</div>
          <div className="text-2xl font-bold text-purple-900">{pools.reduce((s, p) => s + p.lpTokens, 0).toLocaleString()}</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
          <div className="text-sm text-orange-600 mb-1">Avg APY</div>
          <div className="text-2xl font-bold text-orange-900">
            {(pools.reduce((s, p) => s + p.apy, 0) / pools.length).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Pools List */}
      <div className="space-y-4 mb-6">
        {pools.map(pool => (
          <div
            key={pool.id}
            className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{pool.name}</h3>
                <span className="text-sm text-gray-600">{pool.pair}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{pool.apy}%</div>
                <div className="text-xs text-gray-600">APY</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-600">TVL</div>
                <div className="font-semibold text-gray-900">${(pool.tvl / 1000000).toFixed(2)}M</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">24h Volume</div>
                <div className="font-semibold text-gray-900">${(pool.volume24h / 1000).toFixed(0)}k</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">My Liquidity</div>
                <div className="font-semibold text-blue-600">${pool.myLiquidity.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Fees Earned</div>
                <div className="font-semibold text-green-600">${pool.feesEarned.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedPool(pool)}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Add More
              </button>
              <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">
                Remove
              </button>
              <button className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Claim Fees
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Impermanent Loss Calculator */}
      <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
        <h3 className="font-bold text-gray-900 mb-3">💡 Impermanent Loss Calculator</h3>
        <div className="grid grid-cols-5 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-600">Price Change</div>
            <div className="font-bold text-gray-900">+25%</div>
            <div className="text-red-600">{calculateImpermanentLoss(25)}% IL</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">Price Change</div>
            <div className="font-bold text-gray-900">+50%</div>
            <div className="text-red-600">{calculateImpermanentLoss(50)}% IL</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">Price Change</div>
            <div className="font-bold text-gray-900">+100%</div>
            <div className="text-red-600">{calculateImpermanentLoss(100)}% IL</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">Price Change</div>
            <div className="font-bold text-gray-900">+200%</div>
            <div className="text-red-600">{calculateImpermanentLoss(200)}% IL</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">Price Change</div>
            <div className="font-bold text-gray-900">+500%</div>
            <div className="text-red-600">{calculateImpermanentLoss(500)}% IL</div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          * Impermanent loss is temporary and may be offset by trading fees earned
        </p>
      </div>

      {/* Add Liquidity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Liquidity</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Pool
              </label>
              <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg">
                {pools.map(pool => (
                  <option key={pool.id} value={pool.id}>{pool.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (USDC)
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">You will receive:</span>
                <span className="font-semibold text-gray-900">~{amount ? (parseFloat(amount) * 1.02).toFixed(2) : '0.00'} LP tokens</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Share of pool:</span>
                <span className="font-semibold text-gray-900">{amount ? ((parseFloat(amount) / 1000000) * 100).toFixed(4) : '0.0000'}%</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                Add Liquidity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
