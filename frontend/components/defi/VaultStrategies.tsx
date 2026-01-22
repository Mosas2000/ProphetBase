'use client';

import { useState } from 'react';

interface Vault {
  id: string;
  name: string;
  strategy: string;
  tvl: number;
  apy: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  myDeposit: number;
  autoCompound: boolean;
  fee: number;
  performance30d: number;
}

export default function VaultStrategies() {
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [filterRisk, setFilterRisk] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');

  const vaults: Vault[] = [
    {
      id: '1',
      name: 'Stable Yield',
      strategy: 'USDC Lending + LP Fees',
      tvl: 2500000,
      apy: 18.5,
      riskLevel: 'Low',
      myDeposit: 5000,
      autoCompound: true,
      fee: 0.5,
      performance30d: 1.52
    },
    {
      id: '2',
      name: 'Balanced Growth',
      strategy: 'Multi-Pool Farming',
      tvl: 1800000,
      apy: 42.3,
      riskLevel: 'Medium',
      myDeposit: 0,
      autoCompound: true,
      fee: 1.0,
      performance30d: 3.45
    },
    {
      id: '3',
      name: 'High Yield Alpha',
      strategy: 'Leveraged Farming',
      tvl: 950000,
      apy: 127.8,
      riskLevel: 'High',
      myDeposit: 2500,
      autoCompound: true,
      fee: 2.0,
      performance30d: 9.82
    },
    {
      id: '4',
      name: 'Conservative',
      strategy: 'Stablecoin Only',
      tvl: 3200000,
      apy: 12.1,
      riskLevel: 'Low',
      myDeposit: 10000,
      autoCompound: false,
      fee: 0.3,
      performance30d: 0.98
    }
  ];

  const filteredVaults = filterRisk === 'All' 
    ? vaults 
    : vaults.filter(v => v.riskLevel === filterRisk);

  const totalDeposited = vaults.reduce((sum, v) => sum + v.myDeposit, 0);
  const averageAPY = vaults
    .filter(v => v.myDeposit > 0)
    .reduce((sum, v) => sum + (v.apy * v.myDeposit), 0) / totalDeposited;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-700 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'High': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vault Strategies</h2>
        <p className="text-sm text-gray-600">Auto-compounding vaults with optimized strategies</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-2xl font-bold text-blue-700">${totalDeposited.toLocaleString()}</div>
          <div className="text-sm text-blue-600">Total Deposited</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-2xl font-bold text-green-700">{averageAPY.toFixed(1)}%</div>
          <div className="text-sm text-green-600">Avg APY</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <div className="text-2xl font-bold text-purple-700">
            {vaults.filter(v => v.myDeposit > 0).length}
          </div>
          <div className="text-sm text-purple-600">Active Vaults</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
          <div className="text-2xl font-bold text-orange-700">
            ${((totalDeposited * averageAPY) / 100 / 12).toFixed(2)}
          </div>
          <div className="text-sm text-orange-600">Monthly Est.</div>
        </div>
      </div>

      {/* Risk Filter */}
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-sm font-medium text-gray-700">Filter by Risk:</span>
        {(['All', 'Low', 'Medium', 'High'] as const).map(risk => (
          <button
            key={risk}
            onClick={() => setFilterRisk(risk)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterRisk === risk
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {risk}
          </button>
        ))}
      </div>

      {/* Vaults List */}
      <div className="space-y-4">
        {filteredVaults.map(vault => (
          <div key={vault.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{vault.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getRiskColor(vault.riskLevel)}`}>
                    {vault.riskLevel} Risk
                  </span>
                  {vault.autoCompound && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                      🔄 Auto-Compound
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{vault.strategy}</p>

                <div className="grid grid-cols-5 gap-3 text-sm">
                  <div>
                    <div className="text-gray-600 mb-1">TVL</div>
                    <div className="font-semibold text-gray-900">${(vault.tvl / 1000000).toFixed(2)}M</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">APY</div>
                    <div className="font-bold text-green-600 text-lg">{vault.apy}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Fee</div>
                    <div className="font-semibold text-gray-900">{vault.fee}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">30d Performance</div>
                    <div className={`font-semibold ${vault.performance30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      +{vault.performance30d}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">My Deposit</div>
                    <div className="font-semibold text-blue-600">${vault.myDeposit.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {vault.myDeposit > 0 && (
              <div className="pt-4 border-t">
                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="p-3 bg-green-50 rounded">
                    <div className="text-gray-600 mb-1">Accrued</div>
                    <div className="font-bold text-green-600">
                      ${((vault.myDeposit * vault.apy) / 100 / 365 * 30).toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="text-gray-600 mb-1">Daily Yield</div>
                    <div className="font-semibold text-blue-600">
                      ${((vault.myDeposit * vault.apy) / 100 / 365).toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <div className="text-gray-600 mb-1">Yearly Est.</div>
                    <div className="font-semibold text-purple-600">
                      ${((vault.myDeposit * vault.apy) / 100).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedVault(vault);
                      setShowDepositModal(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    Deposit More
                  </button>
                  <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg">
                    Withdraw
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
                    Claim Rewards
                  </button>
                </div>
              </div>
            )}

            {vault.myDeposit === 0 && (
              <button
                onClick={() => {
                  setSelectedVault(vault);
                  setShowDepositModal(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                Deposit into Vault
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Strategy Comparison */}
      <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4">📊 Strategy Performance Comparison</h3>
        <div className="grid grid-cols-4 gap-4">
          {vaults.map(vault => (
            <div key={vault.id} className="text-center">
              <div className="text-xs text-gray-600 mb-2">{vault.name}</div>
              <div className="h-24 bg-white rounded-lg flex items-end justify-center p-2">
                <div
                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded w-12 transition-all"
                  style={{ height: `${(vault.apy / 130) * 100}%` }}
                />
              </div>
              <div className="text-sm font-bold text-gray-900 mt-2">{vault.apy}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && selectedVault && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Deposit to {selectedVault.name}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USDC)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 text-lg"
              />
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">APY:</span>
                <span className="font-bold text-green-600">{selectedVault.apy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Risk Level:</span>
                <span className={`font-semibold ${
                  selectedVault.riskLevel === 'Low' ? 'text-green-600' :
                  selectedVault.riskLevel === 'Medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {selectedVault.riskLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Performance Fee:</span>
                <span className="font-semibold text-gray-900">{selectedVault.fee}%</span>
              </div>
              {depositAmount && (
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Est. Monthly:</span>
                  <span className="font-bold text-blue-600">
                    ${((parseFloat(depositAmount) * selectedVault.apy) / 100 / 12).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDepositModal(false);
                  setDepositAmount('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
