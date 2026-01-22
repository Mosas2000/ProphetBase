'use client';

import { useState } from 'react';

type DataType = 'markets' | 'trades' | 'users' | 'positions';

export default function TestDataGenerator() {
  const [dataType, setDataType] = useState<DataType>('markets');
  const [count, setCount] = useState(10);
  const [generatedData, setGeneratedData] = useState('');
  const [generating, setGenerating] = useState(false);

  const generateData = async () => {
    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let data: any = [];

    switch (dataType) {
      case 'markets':
        data = Array.from({ length: count }, (_, i) => ({
          id: `${1000 + i}`,
          question: [
            'Will Bitcoin reach $100k by EOY?',
            'Will ETH pass $5k in 2024?',
            'Will AI replace 50% of jobs by 2030?',
            'Will we land on Mars by 2030?',
            'Will crypto market cap exceed $10T?',
          ][i % 5],
          category: ['crypto', 'tech', 'politics', 'sports', 'entertainment'][
            i % 5
          ],
          volume: Math.floor(Math.random() * 500000) + 10000,
          yesPrice: Math.random() * 0.8 + 0.1,
          noPrice: Math.random() * 0.8 + 0.1,
          liquidityPool: Math.floor(Math.random() * 100000) + 5000,
          expiryDate: new Date(
            Date.now() + Math.random() * 90 * 86400000
          ).toISOString(),
          resolved: Math.random() > 0.8,
          outcome: Math.random() > 0.5 ? 'YES' : 'NO',
        }));
        break;

      case 'trades':
        data = Array.from({ length: count }, (_, i) => ({
          id: `trade_${Date.now() + i}`,
          marketId: `${Math.floor(Math.random() * 100) + 1000}`,
          userId: `0x${Math.random()
            .toString(16)
            .slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          outcome: Math.random() > 0.5 ? 'YES' : 'NO',
          amount: Math.floor(Math.random() * 1000) + 10,
          shares: Math.floor(Math.random() * 100) + 5,
          price: (Math.random() * 0.8 + 0.1).toFixed(4),
          timestamp: new Date(
            Date.now() - Math.random() * 86400000
          ).toISOString(),
          txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
        }));
        break;

      case 'users':
        data = Array.from({ length: count }, (_, i) => ({
          id: `user_${i}`,
          address: `0x${Math.random()
            .toString(16)
            .slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          username:
            [
              'trader_pro',
              'crypto_king',
              'market_maker',
              'hodl_master',
              'degen_123',
            ][i % 5] + i,
          balance: Math.floor(Math.random() * 10000),
          totalVolume: Math.floor(Math.random() * 100000),
          winRate: (Math.random() * 40 + 40).toFixed(2) + '%',
          totalTrades: Math.floor(Math.random() * 500),
          reputation: Math.floor(Math.random() * 1000),
          joinedAt: new Date(
            Date.now() - Math.random() * 365 * 86400000
          ).toISOString(),
        }));
        break;

      case 'positions':
        data = Array.from({ length: count }, (_, i) => ({
          id: `pos_${Date.now() + i}`,
          userId: `0x${Math.random()
            .toString(16)
            .slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          marketId: `${Math.floor(Math.random() * 100) + 1000}`,
          outcome: Math.random() > 0.5 ? 'YES' : 'NO',
          shares: Math.floor(Math.random() * 100) + 5,
          avgPrice: (Math.random() * 0.8 + 0.1).toFixed(4),
          currentValue: Math.floor(Math.random() * 1000) + 50,
          profit: Math.floor(Math.random() * 500) - 200,
          profitPercent: (Math.random() * 100 - 50).toFixed(2) + '%',
        }));
        break;
    }

    setGeneratedData(JSON.stringify(data, null, 2));
    setGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedData);
  };

  const downloadJSON = () => {
    const blob = new Blob([generatedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataType}_${count}_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Test Data Generator
        </h2>
        <p className="text-sm text-gray-600">
          Generate realistic mock data for testing and development
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Data Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Type
          </label>
          <div className="space-y-2">
            {(['markets', 'trades', 'users', 'positions'] as DataType[]).map(
              (type) => (
                <label
                  key={type}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={dataType === type}
                    onChange={() => setDataType(type)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 capitalize">{type}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Records
          </label>
          <input
            type="number"
            value={count}
            onChange={(e) =>
              setCount(
                Math.max(1, Math.min(1000, parseInt(e.target.value) || 10))
              )
            }
            min="1"
            max="1000"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Max: 1000 records</p>
        </div>

        {/* Actions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Actions
          </label>
          <button
            onClick={generateData}
            disabled={generating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold mb-2"
          >
            {generating ? '⏳ Generating...' : '🎲 Generate Data'}
          </button>
          {generatedData && (
            <>
              <button
                onClick={copyToClipboard}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium mb-2"
              >
                📋 Copy to Clipboard
              </button>
              <button
                onClick={downloadJSON}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
              >
                💾 Download JSON
              </button>
            </>
          )}
        </div>
      </div>

      {/* Generated Data */}
      {generatedData ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Generated Data</h3>
            <span className="text-sm text-gray-600">
              {generatedData.split('\n').length} lines,{' '}
              {(generatedData.length / 1024).toFixed(2)} KB
            </span>
          </div>
          <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-auto text-sm max-h-[500px]">
            {generatedData}
          </pre>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
          Configure options and click "Generate Data" to create test data
        </div>
      )}

      {/* Data Field Reference */}
      <div className="mt-6 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">
          Data Field Reference
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">Markets</h4>
            <ul className="text-gray-700 space-y-1">
              <li>• id, question, category</li>
              <li>• volume, yesPrice, noPrice</li>
              <li>• liquidityPool, expiryDate</li>
              <li>• resolved, outcome</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">Trades</h4>
            <ul className="text-gray-700 space-y-1">
              <li>• id, marketId, userId</li>
              <li>• outcome, amount, shares</li>
              <li>• price, timestamp, txHash</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">Users</h4>
            <ul className="text-gray-700 space-y-1">
              <li>• id, address, username</li>
              <li>• balance, totalVolume</li>
              <li>• winRate, totalTrades</li>
              <li>• reputation, joinedAt</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">Positions</h4>
            <ul className="text-gray-700 space-y-1">
              <li>• id, userId, marketId</li>
              <li>• outcome, shares, avgPrice</li>
              <li>• currentValue, profit</li>
              <li>• profitPercent</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
