'use client';

import { useState } from 'react';

interface YieldSource {
  id: string;
  name: string;
  type: 'lending' | 'farming' | 'staking' | 'liquidity';
  amount: number;
  apy: number;
  dailyYield: number;
  totalEarned: number;
}

export default function PortfolioYield() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>(
    '30d'
  );
  const [compoundFrequency, setCompoundFrequency] = useState<
    'daily' | 'weekly' | 'monthly'
  >('daily');

  const yieldSources: YieldSource[] = [
    {
      id: '1',
      name: 'USDC Lending',
      type: 'lending',
      amount: 10000,
      apy: 8.5,
      dailyYield: 2.33,
      totalEarned: 42.3,
    },
    {
      id: '2',
      name: 'LP Farming - BTC Pool',
      type: 'farming',
      amount: 5000,
      apy: 124.5,
      dailyYield: 17.05,
      totalEarned: 125.5,
    },
    {
      id: '3',
      name: 'PROPHET Staking',
      type: 'staking',
      amount: 10000,
      apy: 45.2,
      dailyYield: 12.38,
      totalEarned: 193.9,
    },
    {
      id: '4',
      name: 'ETH Liquidity Pool',
      type: 'liquidity',
      amount: 3200,
      apy: 18.7,
      dailyYield: 1.64,
      totalEarned: 18.75,
    },
  ];

  const totalInvested = yieldSources.reduce((sum, s) => sum + s.amount, 0);
  const totalDailyYield = yieldSources.reduce(
    (sum, s) => sum + s.dailyYield,
    0
  );
  const totalEarned = yieldSources.reduce((sum, s) => sum + s.totalEarned, 0);
  const averageAPY =
    yieldSources.reduce((sum, s) => sum + s.apy * s.amount, 0) / totalInvested;

  const calculateCompoundedYield = (
    principal: number,
    apy: number,
    days: number,
    frequency: string
  ) => {
    const rate = apy / 100;
    let periods;
    switch (frequency) {
      case 'daily':
        periods = days;
        break;
      case 'weekly':
        periods = days / 7;
        break;
      case 'monthly':
        periods = days / 30;
        break;
      default:
        periods = days;
    }
    return (
      principal * Math.pow(1 + rate / periods, periods) -
      principal
    ).toFixed(2);
  };

  const projectedYield = {
    '1w': calculateCompoundedYield(
      totalInvested,
      averageAPY,
      7,
      compoundFrequency
    ),
    '1m': calculateCompoundedYield(
      totalInvested,
      averageAPY,
      30,
      compoundFrequency
    ),
    '3m': calculateCompoundedYield(
      totalInvested,
      averageAPY,
      90,
      compoundFrequency
    ),
    '1y': calculateCompoundedYield(
      totalInvested,
      averageAPY,
      365,
      compoundFrequency
    ),
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lending':
        return 'bg-blue-100 text-blue-700';
      case 'farming':
        return 'bg-green-100 text-green-700';
      case 'staking':
        return 'bg-purple-100 text-purple-700';
      case 'liquidity':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Portfolio Yield
        </h2>
        <p className="text-sm text-gray-600">
          Track all your DeFi yields in one place
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-2xl font-bold text-blue-700">
            ${totalInvested.toLocaleString()}
          </div>
          <div className="text-sm text-blue-600">Total Invested</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-2xl font-bold text-green-700">
            {averageAPY.toFixed(1)}%
          </div>
          <div className="text-sm text-green-600">Average APY</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <div className="text-2xl font-bold text-purple-700">
            ${totalDailyYield.toFixed(2)}
          </div>
          <div className="text-sm text-purple-600">Daily Yield</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
          <div className="text-2xl font-bold text-orange-700">
            ${totalEarned.toFixed(2)}
          </div>
          <div className="text-sm text-orange-600">Total Earned</div>
        </div>
      </div>

      {/* Yield Sources */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Yield Sources</h3>
        <div className="space-y-3">
          {yieldSources.map((source) => (
            <div
              key={source.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTypeColor(
                      source.type
                    )}`}
                  >
                    {source.type}
                  </span>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {source.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      ${source.amount.toLocaleString()} @ {source.apy}% APY
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 text-right">
                  <div>
                    <div className="text-sm text-gray-600">Daily Yield</div>
                    <div className="font-semibold text-gray-900">
                      ${source.dailyYield.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Earned</div>
                    <div className="font-bold text-green-600">
                      ${source.totalEarned.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Contribution</div>
                    <div className="font-semibold text-blue-600">
                      {((source.amount / totalInvested) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                    style={{
                      width: `${(source.amount / totalInvested) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compound Calculator */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          🧮 Compound Calculator
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compound Frequency
          </label>
          <div className="flex space-x-2">
            {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
              <button
                key={freq}
                onClick={() => setCompoundFrequency(freq)}
                className={`flex-1 py-2 rounded-lg font-medium capitalize transition-colors ${
                  compoundFrequency === freq
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white rounded-lg border-2 border-green-200">
            <div className="text-sm text-gray-600 mb-1">1 Week</div>
            <div className="text-xl font-bold text-green-600">
              ${projectedYield['1w']}
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg border-2 border-green-200">
            <div className="text-sm text-gray-600 mb-1">1 Month</div>
            <div className="text-xl font-bold text-green-600">
              ${projectedYield['1m']}
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg border-2 border-green-200">
            <div className="text-sm text-gray-600 mb-1">3 Months</div>
            <div className="text-xl font-bold text-green-600">
              ${projectedYield['3m']}
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg border-2 border-green-200">
            <div className="text-sm text-gray-600 mb-1">1 Year</div>
            <div className="text-xl font-bold text-green-600">
              ${projectedYield['1y']}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          💡 More frequent compounding leads to higher returns through
          exponential growth
        </p>
      </div>

      {/* Optimization Suggestions */}
      <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4">
          💡 Optimization Suggestions
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="text-green-600 mt-0.5">✓</span>
            <div>
              <div className="font-medium text-gray-900">
                Increase LP Farming Allocation
              </div>
              <div className="text-sm text-gray-600">
                Your LP farming has the highest APY (124.5%). Consider
                allocating more funds here for higher returns.
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-blue-600 mt-0.5">ℹ</span>
            <div>
              <div className="font-medium text-gray-900">
                Enable Auto-Compounding
              </div>
              <div className="text-sm text-gray-600">
                Auto-compound your rewards daily to maximize returns through
                exponential growth.
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-purple-600 mt-0.5">★</span>
            <div>
              <div className="font-medium text-gray-900">
                Diversify Yield Sources
              </div>
              <div className="text-sm text-gray-600">
                Consider adding more yield sources to reduce risk while
                maintaining strong returns.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
