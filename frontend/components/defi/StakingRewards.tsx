'use client';

import { useState } from 'react';

interface StakingPool {
  id: string;
  token: string;
  apr: number;
  totalStaked: number;
  myStaked: number;
  lockPeriod: number;
  multiplier: number;
  rewardsEarned: number;
  unlockDate?: Date;
}

export default function StakingRewards() {
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [lockDuration, setLockDuration] = useState(30);

  const pools: StakingPool[] = [
    {
      id: '1',
      token: 'PROPHET',
      apr: 45.2,
      totalStaked: 5000000,
      myStaked: 10000,
      lockPeriod: 90,
      multiplier: 2.0,
      rewardsEarned: 125.5,
      unlockDate: new Date(Date.now() + 45 * 86400000),
    },
    {
      id: '2',
      token: 'PROPHET',
      apr: 28.5,
      totalStaked: 8500000,
      myStaked: 0,
      lockPeriod: 30,
      multiplier: 1.2,
      rewardsEarned: 0,
    },
    {
      id: '3',
      token: 'PROPHET',
      apr: 72.8,
      totalStaked: 2000000,
      myStaked: 5000,
      lockPeriod: 180,
      multiplier: 3.5,
      rewardsEarned: 68.4,
      unlockDate: new Date(Date.now() + 150 * 86400000),
    },
  ];

  const totalStaked = pools.reduce((sum, p) => sum + p.myStaked, 0);
  const totalRewards = pools.reduce((sum, p) => sum + p.rewardsEarned, 0);
  const averageAPR =
    pools
      .filter((p) => p.myStaked > 0)
      .reduce((sum, p) => sum + p.apr * p.myStaked, 0) / totalStaked;

  const calculateBoost = (lockDays: number) => {
    if (lockDays >= 180) return 3.5;
    if (lockDays >= 90) return 2.0;
    if (lockDays >= 30) return 1.2;
    return 1.0;
  };

  const calculateAPR = (baseAPR: number, boost: number) => {
    return (baseAPR * boost).toFixed(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staking Rewards</h2>
          <p className="text-sm text-gray-600">
            Stake platform tokens and earn rewards
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-2xl font-bold text-blue-700">
            {totalStaked.toLocaleString()}
          </div>
          <div className="text-sm text-blue-600">Total Staked</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-2xl font-bold text-green-700">
            {totalRewards.toFixed(2)}
          </div>
          <div className="text-sm text-green-600">Rewards Earned</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <div className="text-2xl font-bold text-purple-700">
            {averageAPR.toFixed(1)}%
          </div>
          <div className="text-sm text-purple-600">Average APR</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
          <div className="text-2xl font-bold text-orange-700">
            ${(totalRewards * 1.5 + totalStaked * 1.5).toLocaleString()}
          </div>
          <div className="text-sm text-orange-600">Total Value</div>
        </div>
      </div>

      {/* Quick Claim */}
      {totalRewards > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Pending Rewards</div>
              <div className="text-2xl font-bold text-green-600">
                {totalRewards.toFixed(2)} PROPHET
              </div>
              <div className="text-sm text-gray-500">
                ${(totalRewards * 1.5).toFixed(2)} USD
              </div>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
              🎁 Claim All Rewards
            </button>
          </div>
        </div>
      )}

      {/* Staking Pools */}
      <div className="space-y-4 mb-6">
        {pools.map((pool) => (
          <div
            key={pool.id}
            className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {pool.lockPeriod}-Day Lock
                  </h3>
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {pool.multiplier}x BOOST
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Stake {pool.token} tokens
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {pool.apr}%
                </div>
                <div className="text-xs text-gray-600">APR</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-600 mb-1">Total Staked</div>
                <div className="font-semibold text-gray-900">
                  {(pool.totalStaked / 1000000).toFixed(2)}M
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-gray-600 mb-1">My Staked</div>
                <div className="font-semibold text-blue-600">
                  {pool.myStaked.toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-gray-600 mb-1">Rewards Earned</div>
                <div className="font-semibold text-green-600">
                  {pool.rewardsEarned.toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-gray-600 mb-1">Lock Period</div>
                <div className="font-semibold text-purple-600">
                  {pool.lockPeriod} days
                </div>
              </div>
            </div>

            {pool.myStaked > 0 && pool.unlockDate && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">🔒 Unlocks in:</span>
                  <span className="font-semibold text-gray-900">
                    {Math.ceil(
                      (pool.unlockDate.getTime() - Date.now()) / 86400000
                    )}{' '}
                    days
                  </span>
                </div>
              </div>
            )}

            {pool.myStaked > 0 ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedPool(pool);
                    setShowStakeModal(true);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  Stake More
                </button>
                <button
                  disabled={pool.unlockDate && pool.unlockDate > new Date()}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pool.unlockDate && pool.unlockDate > new Date()
                    ? '🔒 Locked'
                    : 'Unstake'}
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
                  Claim ({pool.rewardsEarned.toFixed(2)})
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSelectedPool(pool);
                  setLockDuration(pool.lockPeriod);
                  setShowStakeModal(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                Start Staking
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Boost Calculator */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-4">
          ⚡ Boost Calculator
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lock Duration
            </label>
            <div className="space-y-2">
              {[30, 90, 180].map((days) => (
                <button
                  key={days}
                  onClick={() => setLockDuration(days)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    lockDuration === days
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{days} Days</span>
                    <span className="text-sm">
                      {calculateBoost(days)}x boost
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Boosted APR
            </label>
            <div className="p-6 bg-white rounded-lg border-2 border-blue-200 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {calculateAPR(28.5, calculateBoost(lockDuration))}%
              </div>
              <div className="text-sm text-gray-600">Base: 28.5% APR</div>
              <div className="text-sm text-purple-600 font-semibold mt-2">
                {calculateBoost(lockDuration)}x multiplier applied
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stake Modal */}
      {showStakeModal && selectedPool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Stake PROPHET
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 text-lg"
              />
              <button className="text-xs text-blue-600 hover:underline mt-1">
                MAX
              </button>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">APR:</span>
                <span className="font-bold text-green-600">
                  {selectedPool.apr}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lock Period:</span>
                <span className="font-semibold text-gray-900">
                  {selectedPool.lockPeriod} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Boost Multiplier:</span>
                <span className="font-bold text-purple-600">
                  {selectedPool.multiplier}x
                </span>
              </div>
              {stakeAmount && (
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">
                    Est. Rewards ({selectedPool.lockPeriod}d):
                  </span>
                  <span className="font-bold text-green-600">
                    {(
                      ((parseFloat(stakeAmount) * selectedPool.apr) / 100) *
                      (selectedPool.lockPeriod / 365)
                    ).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowStakeModal(false);
                  setStakeAmount('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Stake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
