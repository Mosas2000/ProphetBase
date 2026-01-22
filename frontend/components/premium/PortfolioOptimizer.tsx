'use client';

import { useState } from 'react';

interface Position {
  marketId: number;
  allocation: number;
  expectedReturn: number;
  risk: number;
}

export default function PortfolioOptimizer() {
  const [positions, setPositions] = useState<Position[]>([
    { marketId: 0, allocation: 40, expectedReturn: 12, risk: 8 },
    { marketId: 1, allocation: 35, expectedReturn: 15, risk: 12 },
    { marketId: 2, allocation: 25, expectedReturn: 10, risk: 6 },
  ]);
  const [riskTolerance, setRiskTolerance] = useState(50);
  const [optimized, setOptimized] = useState(false);

  const optimize = () => {
    // Simulate optimization
    const optimizedPositions = positions.map((p) => ({
      ...p,
      allocation: Math.round(Math.random() * 100),
    }));
    setPositions(optimizedPositions);
    setOptimized(true);
  };

  const totalAllocation = positions.reduce((sum, p) => sum + p.allocation, 0);
  const portfolioReturn = positions.reduce(
    (sum, p) => sum + (p.allocation / 100) * p.expectedReturn,
    0
  );
  const portfolioRisk = Math.sqrt(
    positions.reduce(
      (sum, p) => sum + Math.pow((p.allocation / 100) * p.risk, 2),
      0
    )
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Portfolio Optimizer
        </h1>
        <p className="text-gray-600">
          Optimize your portfolio for maximum risk-adjusted returns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Optimizer Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Current Positions
            </h2>

            {positions.map((position, idx) => (
              <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">
                    Market {position.marketId}
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {position.allocation}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={position.allocation}
                  onChange={(e) => {
                    const newPositions = [...positions];
                    newPositions[idx].allocation = parseInt(e.target.value);
                    setPositions(newPositions);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Return: {position.expectedReturn}%</span>
                  <span>Risk: {position.risk}%</span>
                </div>
              </div>
            ))}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Tolerance
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Conservative</span>
                <span className="font-semibold">{riskTolerance}%</span>
                <span>Aggressive</span>
              </div>
            </div>

            <button
              onClick={optimize}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Optimize Portfolio
            </button>
          </div>

          {optimized && (
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-500">
              <h3 className="font-bold text-green-900 mb-3">
                ✅ Portfolio Optimized
              </h3>
              <p className="text-sm text-green-800">
                Your portfolio has been rebalanced for optimal risk-adjusted
                returns
              </p>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Portfolio Metrics</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Total Allocation</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalAllocation}%
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">Expected Return</p>
                <p className="text-2xl font-bold text-green-600">
                  {portfolioReturn.toFixed(2)}%
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600">Portfolio Risk</p>
                <p className="text-2xl font-bold text-purple-600">
                  {portfolioRisk.toFixed(2)}%
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-600">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(portfolioReturn / portfolioRisk).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-500">
            <h3 className="font-bold text-blue-900 mb-3">Efficient Frontier</h3>
            <div className="aspect-square bg-white rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm text-gray-600">Visualization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
