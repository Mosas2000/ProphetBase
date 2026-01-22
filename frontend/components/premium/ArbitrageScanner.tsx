'use client';

import { useState } from 'react';

interface Opportunity {
  id: string;
  markets: [number, number];
  prices: [number, number];
  profit: number;
  volume: number;
  timeRemaining: number;
}

export default function ArbitrageScanner() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [scanning, setScanning] = useState(false);
  const [autoExecute, setAutoExecute] = useState(false);
  const [minProfit, setMinProfit] = useState('0.5');

  const scanMarkets = () => {
    setScanning(true);
    // Simulate scanning
    setTimeout(() => {
      const newOpps: Opportunity[] = [
        {
          id: '1',
          markets: [0, 1],
          prices: [0.45, 0.58],
          profit: 0.13,
          volume: 1000,
          timeRemaining: 120,
        },
        {
          id: '2',
          markets: [1, 2],
          prices: [0.62, 0.71],
          profit: 0.09,
          volume: 500,
          timeRemaining: 45,
        },
      ];
      setOpportunities(newOpps);
      setScanning(false);
    }, 2000);
  };

  const executeArbitrage = (oppId: string) => {
    alert(`Executing arbitrage opportunity ${oppId}`);
    setOpportunities(opportunities.filter((o) => o.id !== oppId));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Arbitrage Scanner
        </h1>
        <p className="text-gray-600">
          Find and execute cross-market arbitrage opportunities
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Profit (%)
              </label>
              <input
                type="number"
                value={minProfit}
                onChange={(e) => setMinProfit(e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.5"
              />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={autoExecute}
                onChange={(e) => setAutoExecute(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <label className="text-sm font-medium text-gray-700">
                Auto-Execute
              </label>
            </div>
          </div>
          <button
            onClick={scanMarkets}
            disabled={scanning}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {scanning ? 'Scanning...' : 'Scan Markets'}
          </button>
        </div>
      </div>

      {/* Opportunities */}
      <div className="space-y-4">
        {opportunities.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Opportunities Found
            </h3>
            <p className="text-gray-600">
              Click "Scan Markets" to find arbitrage opportunities
            </p>
          </div>
        ) : (
          opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Market {opp.markets[0]} ↔ Market {opp.markets[1]}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Buy at ${opp.prices[0]} • Sell at ${opp.prices[1]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">
                    +{(opp.profit * 100).toFixed(2)}%
                  </p>
                  <p className="text-sm text-gray-600">Profit</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Volume Available</p>
                  <p className="text-lg font-semibold text-blue-600">
                    ${opp.volume}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Time Remaining</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {opp.timeRemaining}s
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Est. Profit</p>
                  <p className="text-lg font-semibold text-green-600">
                    ${(opp.profit * opp.volume).toFixed(2)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => executeArbitrage(opp.id)}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                Execute Arbitrage
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
