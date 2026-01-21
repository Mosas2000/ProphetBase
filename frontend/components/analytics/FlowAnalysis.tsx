'use client';

import { Card } from '@/components/ui/Card';

export function FlowAnalysis() {
  const flowData = {
    totalInflow: 125000,
    totalOutflow: 87000,
    netFlow: 38000,
    smartMoney: 65,
    retail: 35,
  };

  const indicators = [
    { name: 'Accumulation/Distribution', value: 'Accumulation', strength: 'Strong', color: 'text-green-400' },
    { name: 'Money Flow Index', value: '68', strength: 'Bullish', color: 'text-green-400' },
    { name: 'Chaikin Money Flow', value: '0.24', strength: 'Positive', color: 'text-green-400' },
  ];

  const topFlows = [
    { market: 'Bitcoin $100k', inflow: 45000, outflow: 12000, net: 33000 },
    { market: 'ETH $5k', inflow: 28000, outflow: 35000, net: -7000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Flow Analysis</h3>
          <p className="text-gray-400">Track money flow and smart money movements</p>
        </div>
      </Card>

      {/* Flow Overview */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">24h Flow Overview</h4>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Inflow</p>
              <p className="text-2xl font-bold text-green-400">${flowData.totalInflow.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Outflow</p>
              <p className="text-2xl font-bold text-red-400">${flowData.totalOutflow.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Net Flow</p>
              <p className="text-2xl font-bold text-green-400">+${flowData.netFlow.toLocaleString()}</p>
            </div>
          </div>

          {/* Smart Money vs Retail */}
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Smart Money vs Retail</p>
            <div className="flex h-8 rounded-lg overflow-hidden">
              <div className="bg-blue-500 flex items-center justify-center text-sm font-bold" style={{ width: `${flowData.smartMoney}%` }}>
                {flowData.smartMoney}%
              </div>
              <div className="bg-gray-600 flex items-center justify-center text-sm font-bold" style={{ width: `${flowData.retail}%` }}>
                {flowData.retail}%
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Smart Money</span>
              <span>Retail</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Flow Indicators */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Flow Indicators</h4>
          
          <div className="space-y-3">
            {indicators.map((indicator, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium mb-1">{indicator.name}</p>
                  <p className={`text-sm ${indicator.color}`}>{indicator.strength}</p>
                </div>
                <span className="text-xl font-bold">{indicator.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Top Flows */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Top Market Flows</h4>
          
          <div className="space-y-3">
            {topFlows.map((flow, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <p className="font-medium mb-3">{flow.market}</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Inflow</p>
                    <p className="font-bold text-green-400">${flow.inflow.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Outflow</p>
                    <p className="font-bold text-red-400">${flow.outflow.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Net</p>
                    <p className={`font-bold ${flow.net > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {flow.net > 0 ? '+' : ''}${flow.net.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
