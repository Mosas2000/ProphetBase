'use client';'use client';






















































































































































































































































































































}  );    </div>      )}        </div>          </div>            </div>              </button>                Stake LP Tokens              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">              </button>                Cancel              >                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"                }}                  setStakeAmount('');                  setShowStakeModal(false);                onClick={() => {              <button            <div className="flex space-x-3">            )}              </div>                </div>                  </span>                    ${calculateProjectedAPY(parseFloat(stakeAmount), selectedFarm.apy).toFixed(2)}                  <span className="font-semibold text-green-600">                  <span className="text-gray-600">Yearly:</span>                <div className="flex justify-between text-sm">                </div>                  </span>                    ${(calculateProjectedAPY(parseFloat(stakeAmount), selectedFarm.apy) / 12).toFixed(2)}                  <span className="font-semibold text-green-600">                  <span className="text-gray-600">Monthly:</span>                <div className="flex justify-between text-sm mb-1">                </div>                  </span>                    ${(calculateProjectedAPY(parseFloat(stakeAmount), selectedFarm.apy) / 365).toFixed(2)}                  <span className="font-semibold text-green-600">                  <span className="text-gray-600">Daily:</span>                <div className="flex justify-between text-sm mb-1">                <div className="text-sm font-semibold text-gray-900 mb-2">Projected Earnings:</div>              <div className="mb-4 p-4 bg-green-50 rounded-lg">            {stakeAmount && parseFloat(stakeAmount) > 0 && (            </div>              </div>                Available: 1,234.56 {selectedFarm.lpToken}              <div className="text-xs text-gray-500 mt-1">              />                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"                placeholder="0.00"                onChange={e => setStakeAmount(e.target.value)}                value={stakeAmount}                type="number"              <input              </label>                Amount (LP Tokens)              <label className="block text-sm font-medium text-gray-700 mb-2">            <div className="mb-4">            </div>              )}                </div>                  <span className="font-semibold text-purple-600">{selectedFarm.multiplier}x</span>                  <span className="text-gray-600">Multiplier:</span>                <div className="flex justify-between text-sm">              {selectedFarm.multiplier > 1 && (              )}                </div>                  <span className="font-semibold text-orange-600">{selectedFarm.lockPeriod} days</span>                  <span className="text-gray-600">Lock Period:</span>                <div className="flex justify-between text-sm mb-2">              {selectedFarm.lockPeriod > 0 && (              </div>                <span className="font-bold text-green-600">{selectedFarm.apy.toFixed(1)}%</span>                <span className="text-gray-600">APY:</span>              <div className="flex justify-between text-sm mb-2">            <div className="mb-4 p-4 bg-gray-50 rounded-lg">            </h3>              Stake to {selectedFarm.name}            <h3 className="text-xl font-bold text-gray-900 mb-4">          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">      {showStakeModal && selectedFarm && (      {/* Stake Modal */}      </div>        </div>          ))}            </div>              </div>                <div className="text-xs text-gray-600">Yearly: <span className="font-bold text-green-600">${(amount * 1.5).toFixed(2)}</span></div>                <div className="text-xs text-gray-600">Monthly: <span className="font-bold text-green-600">${((amount * 1.5) / 12).toFixed(2)}</span></div>                <div className="text-xs text-gray-600">Daily: <span className="font-bold text-green-600">${((amount * 1.5) / 365).toFixed(2)}</span></div>              <div className="space-y-1">              <div className="text-xs text-gray-500 mb-3">@ 150% APY</div>              <div className="text-sm text-gray-600 mb-2">Stake ${amount.toLocaleString()}</div>            <div key={amount} className="text-center p-4 bg-white rounded-lg">          {[1000, 5000, 10000, 50000].map(amount => (        <div className="grid grid-cols-4 gap-4">        <h3 className="font-bold text-gray-900 mb-4">📊 APY Calculator</h3>      <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">      {/* APY Calculator */}      </div>        ))}          </div>            )}              </button>                Start Farming              >                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"                }}                  setShowStakeModal(true);                  setSelectedFarm(farm);                onClick={() => {              <button            ) : (              </div>                </button>                  Harvest {farm.pendingRewards.toFixed(2)}                <button className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">                </button>                  Unstake                <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">                </button>                  Stake More                >                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"                  }}                    setShowStakeModal(true);                    setSelectedFarm(farm);                  onClick={() => {                <button              <div className="flex space-x-2">            {farm.myStake > 0 ? (            </div>              </div>                <div className="font-semibold text-orange-600">${calculateDailyRewards(farm).toFixed(2)}</div>                <div className="text-xs text-gray-600">Daily Earnings</div>              <div>              </div>                <div className="font-semibold text-green-600">{farm.pendingRewards.toFixed(2)} PROPHET</div>                <div className="text-xs text-gray-600">Pending Rewards</div>              <div>              </div>                <div className="font-semibold text-blue-600">${farm.myStake.toLocaleString()}</div>                <div className="text-xs text-gray-600">My Stake</div>              <div>              </div>                <div className="font-semibold text-gray-900">${(farm.tvl / 1000000).toFixed(2)}M</div>                <div className="text-xs text-gray-600">TVL</div>              <div>            <div className="grid grid-cols-4 gap-4 mb-4">            </div>              </div>                <div className="text-xs text-gray-600">APY</div>                <div className="text-3xl font-bold text-green-600">{farm.apy.toFixed(1)}%</div>              <div className="text-right">              </div>                </div>                  <span>Rewards: {farm.rewardToken}</span>                  <span>•</span>                  <span>LP: {farm.lpToken}</span>                <div className="flex items-center space-x-4 text-sm text-gray-600">                </div>                  )}                    </span>                      {farm.multiplier}x Boost                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">                  {farm.multiplier > 1 && (                  )}                    </span>                      🔒 {farm.lockPeriod}D Lock                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">                  {farm.lockPeriod > 0 && (                  <h3 className="text-xl font-bold text-gray-900">{farm.name}</h3>                <div className="flex items-center space-x-3 mb-2">              <div>            <div className="flex items-start justify-between mb-4">          <div key={farm.id} className="border-2 border-gray-200 rounded-lg p-6">        {farms.map(farm => (      <div className="space-y-4">      {/* Farms List */}      </div>        </div>          </div>            ${farms.reduce((sum, f) => sum + calculateDailyRewards(f), 0).toFixed(2)}          <div className="text-2xl font-bold text-orange-900">          <div className="text-sm text-orange-600 mb-1">Daily Earnings</div>        <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">        </div>          <div className="text-2xl font-bold text-purple-900">{farms.filter(f => f.myStake > 0).length}/{farms.length}</div>          <div className="text-sm text-purple-600 mb-1">Active Farms</div>        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">        </div>          <div className="text-2xl font-bold text-green-900">{avgAPY.toFixed(1)}%</div>          <div className="text-sm text-green-600 mb-1">Avg APY</div>        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">        </div>          <div className="text-2xl font-bold text-blue-900">${totalStaked.toLocaleString()}</div>          <div className="text-sm text-blue-600 mb-1">Total Staked</div>        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">      <div className="grid grid-cols-4 gap-4 mb-6">      {/* Summary Cards */}      </div>        </div>          <div className="text-2xl font-bold text-green-600">{totalPendingRewards.toFixed(2)} PROPHET</div>          <div className="text-sm text-gray-600">Total Pending</div>        <div className="text-right">        </div>          <p className="text-sm text-gray-600">Stake LP tokens to earn rewards</p>          <h2 className="text-2xl font-bold text-gray-900">Yield Farming</h2>        <div>      <div className="flex items-center justify-between mb-6">    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">  return (  const avgAPY = farms.reduce((sum, farm) => sum + (farm.myStake > 0 ? farm.apy : 0), 0) / farms.filter(f => f.myStake > 0).length;  const totalPendingRewards = farms.reduce((sum, farm) => sum + farm.pendingRewards, 0);  const totalStaked = farms.reduce((sum, farm) => sum + farm.myStake, 0);  };    return (amount * apy) / 100;  const calculateProjectedAPY = (amount: number, apy: number) => {  };    return yearlyRewards / 365;    const yearlyRewards = (farm.myStake * farm.apy) / 100;    if (farm.myStake === 0) return 0;  const calculateDailyRewards = (farm: Farm) => {  ];    }      multiplier: 1.5      lockPeriod: 30,      pendingRewards: 0,      myStake: 0,      tvl: 3100000,      apy: 198.2,      rewardToken: 'PROPHET + BASE',      lpToken: 'YES-USDC-LP',      name: 'Multi-Reward Farm',      id: '4',    {    },      multiplier: 2      lockPeriod: 90,      pendingRewards: 124.60,      myStake: 8920,      tvl: 5200000,      apy: 289.5,      rewardToken: 'PROPHET',      lpToken: 'PROPHET-USDC-LP',      name: 'PROPHET/USDC Farm (Locked)',      id: '3',    {    },      multiplier: 1      lockPeriod: 0,      pendingRewards: 32.80,      myStake: 3890,      tvl: 1800000,      apy: 128.3,      rewardToken: 'PROPHET',      lpToken: 'NO-USDC-LP',      name: 'NO/USDC Farm',      id: '2',    {    },      multiplier: 1      lockPeriod: 0,      pendingRewards: 47.25,      myStake: 5420,      tvl: 2400000,      apy: 145.7,      rewardToken: 'PROPHET',      lpToken: 'YES-USDC-LP',      name: 'YES/USDC Farm',      id: '1',    {  const farms: Farm[] = [  const [showStakeModal, setShowStakeModal] = useState(false);  const [stakeAmount, setStakeAmount] = useState('');  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);export default function YieldFarming() {}  multiplier: number;  lockPeriod: number;  pendingRewards: number;  myStake: number;  tvl: number;  apy: number;  rewardToken: string;  lpToken: string;  name: string;  id: string;interface Farm {import { useState } from 'react';
import { useState } from 'react';

interface Farm {
  id: string;
  name: string;
  lpToken: string;
  totalStaked: number;
  myStaked: number;
  apy: number;
  rewardToken: string;
  pendingRewards: number;
  lockPeriod: number;
  multiplier: number;
}

export default function YieldFarming() {
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const farms: Farm[] = [
    {
      id: '1',
      name: 'BTC-100k Pool',
      lpToken: 'PROPHET-LP-42',
      totalStaked: 485000,
      myStaked: 4850,
      apy: 124.5,
      rewardToken: 'PROPHET',
      pendingRewards: 12.45,
      lockPeriod: 7,
      multiplier: 2.0
    },
    {
      id: '2',
      name: 'ETH-5k Pool',
      lpToken: 'PROPHET-LP-43',
      totalStaked: 312000,
      myStaked: 0,
      apy: 87.3,
      rewardToken: 'PROPHET',
      pendingRewards: 0,
      lockPeriod: 7,
      multiplier: 1.5
    },
    {
      id: '3',
      name: 'AI Jobs Pool',
      lpToken: 'PROPHET-LP-44',
      totalStaked: 198000,
      myStaked: 2430,
      apy: 156.8,
      rewardToken: 'PROPHET',
      pendingRewards: 8.92,
      lockPeriod: 14,
      multiplier: 3.0
    },
    {
      id: '4',
      name: 'USDC Stable Farm',
      lpToken: 'PROPHET-LP-STABLE',
      totalStaked: 750000,
      myStaked: 10000,
      apy: 42.1,
      rewardToken: 'USDC',
      pendingRewards: 4.21,
      lockPeriod: 0,
      multiplier: 1.0
    }
  ];

  const totalMyStaked = farms.reduce((sum, f) => sum + f.myStaked, 0);
  const totalPendingRewards = farms.reduce((sum, f) => sum + f.pendingRewards, 0);
  const activeFarms = farms.filter(f => f.myStaked > 0).length;

  const calculateAPY = (baseAPY: number, lockDays: number) => {
    // Bonus APY for longer lock periods
    const lockBonus = lockDays * 0.5;
    return (baseAPY + lockBonus).toFixed(1);
  };

  const calculateDailyRewards = (staked: number, apy: number) => {
    return ((staked * apy) / 100 / 365).toFixed(4);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Yield Farming</h2>
          <p className="text-sm text-gray-600">Stake LP tokens and earn rewards</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Get LP Tokens →
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-2xl font-bold text-blue-700">${totalMyStaked.toLocaleString()}</div>
          <div className="text-sm text-blue-600">Total Staked</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-2xl font-bold text-green-700">{totalPendingRewards.toFixed(2)}</div>
          <div className="text-sm text-green-600">Pending Rewards</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <div className="text-2xl font-bold text-purple-700">{activeFarms}</div>
          <div className="text-sm text-purple-600">Active Farms</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
          <div className="text-2xl font-bold text-orange-700">
            ${(totalPendingRewards * 1.5).toFixed(2)}
          </div>
          <div className="text-sm text-orange-600">Rewards Value</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-3 mb-6">
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
          🌾 Harvest All ({totalPendingRewards.toFixed(2)})
        </button>
        <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-lg font-semibold">
          Auto-Compound
        </button>
      </div>

      {/* Farms List */}
      <div className="space-y-4">
        {farms.map(farm => (
          <div key={farm.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{farm.name}</h3>
                  {farm.multiplier > 1 && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {farm.multiplier}x BOOST
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>LP Token: <code className="text-blue-600 font-mono text-xs">{farm.lpToken}</code></span>
                  <span>•</span>
                  <span>Lock: {farm.lockPeriod} days</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{farm.apy}%</div>
                <div className="text-xs text-gray-600">APY</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-600 mb-1">Total Staked</div>
                <div className="font-semibold text-gray-900">${farm.totalStaked.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-gray-600 mb-1">My Staked</div>
                <div className="font-semibold text-blue-600">${farm.myStaked.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-gray-600 mb-1">Pending Rewards</div>
                <div className="font-semibold text-green-600">{farm.pendingRewards.toFixed(4)} {farm.rewardToken}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-gray-600 mb-1">Daily Rewards</div>
                <div className="font-semibold text-purple-600">
                  {calculateDailyRewards(farm.myStaked, farm.apy)} {farm.rewardToken}
                </div>
              </div>
            </div>

            {farm.myStaked > 0 ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedFarm(farm);
                    setShowStakeModal(true);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  + Stake More
                </button>
                <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg">
                  Unstake
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
                  🌾 Harvest
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSelectedFarm(farm);
                  setShowStakeModal(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                Start Farming
              </button>
            )}
          </div>
        ))}
      </div>

      {/* APY Calculator */}
      <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
        <h3 className="font-semibold text-gray-900 mb-4">📊 APY Calculator</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stake Amount</label>
            <input
              type="number"
              placeholder="1000"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Farm</label>
            <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500">
              {farms.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.apy}% APY)</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4 text-center">
          <div className="p-3 bg-white rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Daily</div>
            <div className="font-bold text-green-600">$3.42</div>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Weekly</div>
            <div className="font-bold text-green-600">$23.92</div>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Monthly</div>
            <div className="font-bold text-green-600">$103.75</div>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Yearly</div>
            <div className="font-bold text-green-600">$1,245.00</div>
          </div>
        </div>
      </div>

      {/* Stake Modal */}
      {showStakeModal && selectedFarm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Stake LP Tokens</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedFarm.name}</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ({selectedFarm.lpToken})
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={e => setStakeAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 text-lg"
              />
              <button className="text-xs text-blue-600 hover:underline mt-1">MAX</button>
            </div>

            <div className="mb-6 space-y-3">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">APY:</span>
                  <span className="font-bold text-green-600">{selectedFarm.apy}%</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Lock Period:</span>
                  <span className="font-semibold text-gray-900">{selectedFarm.lockPeriod} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Daily Rewards:</span>
                  <span className="font-semibold text-gray-900">
                    {stakeAmount ? calculateDailyRewards(parseFloat(stakeAmount), selectedFarm.apy) : '0.00'} {selectedFarm.rewardToken}
                  </span>
                </div>
              </div>
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
