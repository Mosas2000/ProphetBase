'use client';

import { useState } from 'react';

export default function MarginTrading() {
  const [leverage, setLeverage] = useState(2);
  const [collateral, setCollateral] = useState('');
  const [positionSize, setPositionSize] = useState('');
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [maintenanceMargin, setMaintenanceMargin] = useState(20);

  const calculateLiquidation = () => {
    if (!collateral || !positionSize) return;
    const entryPrice = parseFloat(positionSize) / parseFloat(collateral);
    const liqPrice =
      entryPrice * (1 - (1 / leverage) * (maintenanceMargin / 100));
    setLiquidationPrice(liqPrice);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Margin Trading
        </h1>
        <p className="text-gray-600">
          Trade with leverage to amplify your positions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Open Leveraged Position
            </h2>

            {/* Leverage Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Leverage
                </label>
                <span className="text-2xl font-bold text-blue-600">
                  {leverage}x
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1x</span>
                <span>5x</span>
                <span>10x</span>
              </div>
            </div>

            {/* Collateral */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collateral (USDC)
              </label>
              <input
                type="number"
                value={collateral}
                onChange={(e) => setCollateral(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            {/* Position Size */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position Size
              </label>
              <input
                type="number"
                value={positionSize}
                onChange={(e) => setPositionSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              <p className="text-sm text-gray-500 mt-1">
                Max position:{' '}
                {collateral
                  ? (parseFloat(collateral) * leverage).toFixed(2)
                  : '0.00'}{' '}
                USDC
              </p>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateLiquidation}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
            >
              Calculate Liquidation Price
            </button>

            {/* Results */}
            {liquidationPrice > 0 && (
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
                <h3 className="font-bold text-red-900 mb-2">
                  ⚠️ Liquidation Warning
                </h3>
                <p className="text-lg font-semibold text-red-700">
                  Liquidation Price: ${liquidationPrice.toFixed(4)}
                </p>
                <p className="text-sm text-red-600 mt-2">
                  Your position will be liquidated if price falls below this
                  level
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Risk Calculator */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-500">
            <h3 className="font-bold text-blue-900 mb-4">Position Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-blue-800">Leverage:</span>
                <span className="font-semibold text-blue-900">{leverage}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-800">Collateral:</span>
                <span className="font-semibold text-blue-900">
                  ${collateral || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-800">Buying Power:</span>
                <span className="font-semibold text-blue-900">
                  $
                  {collateral
                    ? (parseFloat(collateral) * leverage).toFixed(2)
                    : '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-800">
                  Maintenance Margin:
                </span>
                <span className="font-semibold text-blue-900">
                  {maintenanceMargin}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-500">
            <h3 className="font-bold text-red-900 mb-4">Risk Management</h3>
            <ul className="space-y-2 text-sm text-red-800">
              <li>• Monitor liquidation price closely</li>
              <li>• Use stop-loss orders</li>
              <li>• Don't over-leverage</li>
              <li>• Keep emergency collateral</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-500">
            <h3 className="font-bold text-green-900 mb-3">Active Positions</h3>
            <p className="text-center text-green-800 py-4">
              No active positions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
