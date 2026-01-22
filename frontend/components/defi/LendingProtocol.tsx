'use client';

import { useState } from 'react';

interface LendingPosition {
  id: string;
  type: 'lend' | 'borrow';
  asset: string;
  amount: number;
  apy: number;
  collateral?: number;
  collateralAsset?: string;
  healthFactor?: number;
  accrued: number;
}

export default function LendingProtocol() {
  const [activeTab, setActiveTab] = useState<'lend' | 'borrow'>('lend');
  const [selectedAsset, setSelectedAsset] = useState('USDC');
  const [amount, setAmount] = useState('');

  const lendingRates = {
    USDC: { supply: 8.5, borrow: 12.3, available: 850000, utilization: 72 },
    ETH: { supply: 4.2, borrow: 7.8, available: 45, utilization: 68 },
    BTC: { supply: 3.8, borrow: 6.5, available: 2.5, utilization: 65 }
  };

  const myPositions: LendingPosition[] = [
    {
      id: '1',
      type: 'lend',
      asset: 'USDC',
      amount: 10000,
      apy: 8.5,
      accrued: 42.30
    },
    {
      id: '2',
      type: 'borrow',
      asset: 'USDC',
      amount: 5000,
      apy: 12.3,
      collateral: 0.05,
      collateralAsset: 'ETH',
      healthFactor: 1.85,
      accrued: -15.40
    }
  ];

  const totalLent = myPositions.filter(p => p.type === 'lend').reduce((sum, p) => sum + p.amount, 0);
  const totalBorrowed = myPositions.filter(p => p.type === 'borrow').reduce((sum, p) => sum + p.amount, 0);
  const netAPY = myPositions.reduce((sum, p) => {
    return p.type === 'lend' ? sum + (p.amount * p.apy / 100) : sum - (p.amount * p.apy / 100);
  }, 0) / (totalLent + totalBorrowed) * 100;

  const calculateHealthFactor = (collateralValue: number, borrowValue: number) => {
    // Health Factor = (Collateral Value * LTV) / Borrow Value
    const ltv = 0.75; // 75% loan-to-value
    return ((collateralValue * ltv) / borrowValue).toFixed(2);
  };

  const getHealthFactorColor = (hf: number) => {
    if (hf >= 2) return 'text-green-600';
    if (hf >= 1.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lending Protocol</h2>
          <p className="text-sm text-gray-600">Lend assets for interest or borrow against collateral</p>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-2xl font-bold text-green-700">${totalLent.toLocaleString()}</div>
          <div className="text-sm text-green-600">Total Lent</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-2xl font-bold text-blue-700">${totalBorrowed.toLocaleString()}</div>
          <div className="text-sm text-blue-600">Total Borrowed</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <div className="text-2xl font-bold text-purple-700">{netAPY.toFixed(2)}%</div>
          <div className="text-sm text-purple-600">Net APY</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
          <div className="text-2xl font-bold text-orange-700">
            ${Math.abs(myPositions.reduce((sum, p) => sum + p.accrued, 0)).toFixed(2)}
          </div>
          <div className="text-sm text-orange-600">Net Interest</div>
        </div>
      </div>

      {/* Lend/Borrow Interface */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setActiveTab('lend')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'lend'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lend
            </button>
            <button
              onClick={() => setActiveTab('borrow')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'borrow'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Borrow
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Asset</label>
            <select
              value={selectedAsset}
              onChange={e => setSelectedAsset(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500"
            >
              <option value="USDC">USDC</option>
              <option value="ETH">ETH</option>
              <option value="BTC">BTC</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 text-lg"
            />
            <button className="text-xs text-blue-600 hover:underline mt-1">MAX</button>
          </div>

          {activeTab === 'borrow' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Collateral (ETH)</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Min. collateral: {amount ? (parseFloat(amount) / 3200 / 0.75).toFixed(4) : '0'} ETH</p>
            </div>
          )}

          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{activeTab === 'lend' ? 'Supply APY' : 'Borrow APY'}:</span>
              <span className={`font-bold ${activeTab === 'lend' ? 'text-green-600' : 'text-blue-600'}`}>
                {activeTab === 'lend' 
                  ? lendingRates[selectedAsset as keyof typeof lendingRates].supply 
                  : lendingRates[selectedAsset as keyof typeof lendingRates].borrow}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available to {activeTab}:</span>
              <span className="font-semibold text-gray-900">
                {lendingRates[selectedAsset as keyof typeof lendingRates].available.toLocaleString()} {selectedAsset}
              </span>
            </div>
            {activeTab === 'lend' && amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Daily Interest:</span>
                <span className="font-semibold text-green-600">
                  ${((parseFloat(amount) * lendingRates[selectedAsset as keyof typeof lendingRates].supply / 100) / 365).toFixed(4)}
                </span>
              </div>
            )}
            {activeTab === 'borrow' && amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Health Factor:</span>
                <span className={`font-bold ${getHealthFactorColor(2.5)}`}>
                  2.50
                </span>
              </div>
            )}
          </div>

          <button className={`w-full py-3 rounded-lg font-semibold ${
            activeTab === 'lend'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}>
            {activeTab === 'lend' ? 'Lend' : 'Borrow'}
          </button>
        </div>

        {/* Interest Rate Model */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Interest Rate Model</h3>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Utilization Rate</span>
              <span className="font-semibold text-gray-900">
                {lendingRates[selectedAsset as keyof typeof lendingRates].utilization}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                style={{ width: `${lendingRates[selectedAsset as keyof typeof lendingRates].utilization}%` }}
              />
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Supply APY</span>
              <span className="font-bold text-green-600">
                {lendingRates[selectedAsset as keyof typeof lendingRates].supply}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Borrow APY</span>
              <span className="font-bold text-blue-600">
                {lendingRates[selectedAsset as keyof typeof lendingRates].borrow}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700">Spread</span>
              <span className="font-bold text-purple-600">
                {(lendingRates[selectedAsset as keyof typeof lendingRates].borrow - 
                  lendingRates[selectedAsset as keyof typeof lendingRates].supply).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">How it works</h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Higher utilization = Higher rates</li>
              <li>• Rates adjust dynamically</li>
              <li>• Borrow rate > Supply rate</li>
              <li>• Protocol takes small spread</li>
            </ul>
          </div>
        </div>
      </div>

      {/* My Positions */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">My Positions</h3>
        <div className="space-y-3">
          {myPositions.map(position => (
            <div key={position.id} className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      position.type === 'lend'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {position.type.toUpperCase()}
                    </span>
                    <span className="font-semibold text-gray-900">{position.amount.toLocaleString()} {position.asset}</span>
                    <span className="text-sm text-gray-600">@ {position.apy}% APY</span>
                  </div>

                  {position.type === 'borrow' && position.healthFactor && (
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">
                        Collateral: {position.collateral} {position.collateralAsset}
                      </span>
                      <span className="text-gray-600">
                        Health Factor: <span className={`font-bold ${getHealthFactorColor(position.healthFactor)}`}>
                          {position.healthFactor}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className={`text-xl font-bold ${position.accrued >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {position.accrued >= 0 ? '+' : ''}{position.accrued.toFixed(2)} {position.asset}
                  </div>
                  <div className="text-xs text-gray-600">Accrued Interest</div>
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  {position.type === 'lend' ? (
                    <>
                      <button className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded text-sm font-medium">
                        Add More
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium">
                        Withdraw
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded text-sm font-medium">
                        Repay
                      </button>
                      <button className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded text-sm font-medium">
                        Add Collateral
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Warning */}
      <div className="mt-6 p-4 bg-red-50 rounded-lg border-2 border-red-200">
        <h4 className="font-semibold text-red-700 mb-2">⚠️ Liquidation Risk</h4>
        <p className="text-sm text-red-600">
          Maintain a health factor above 1.0 to avoid liquidation. Add collateral if your health factor drops below 1.5.
        </p>
      </div>
    </div>
  );
}
