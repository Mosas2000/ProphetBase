'use client';

import { Card } from '@/components/ui/Card';

export function VolatilityTracker() {
  const volatilityData = {
    historical: 28.5,
    implied: 32.4,
    percentile: 65,
  };

  const riskMetrics = [
    { metric: 'Value at Risk (95%)', value: '$450', description: 'Max expected loss' },
    { metric: 'Sharpe Ratio', value: '1.8', description: 'Risk-adjusted return' },
    { metric: 'Beta', value: '1.2', description: 'Market correlation' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Volatility Tracker</h3>
          <p className="text-gray-400">Historical and implied volatility analysis</p>
        </div>
      </Card>

      {/* Volatility Overview */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Volatility Overview</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Historical Volatility</p>
              <p className="text-3xl font-bold">{volatilityData.historical}%</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Implied Volatility</p>
              <p className="text-3xl font-bold text-blue-400">{volatilityData.implied}%</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Volatility Percentile</span>
              <span className="font-bold">{volatilityData.percentile}th</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${volatilityData.percentile}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Higher than 65% of historical values</p>
          </div>
        </div>
      </Card>

      {/* Volatility Smile */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Volatility Smile</h4>
          
          <div className="bg-gray-900 rounded-lg p-6 h-48 flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl mb-2">📈</p>
              <p className="text-sm text-gray-400">Volatility curve visualization</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Risk Metrics */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Risk Metrics</h4>
          
          <div className="space-y-3">
            {riskMetrics.map((metric, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">{metric.metric}</p>
                  <span className="text-xl font-bold">{metric.value}</span>
                </div>
                <p className="text-sm text-gray-400">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
