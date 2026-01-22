'use client';

import { Card } from '@/components/ui/Card';

export function LiquidityMap() {
  const liquidityLevels = [
    { price: 45, liquidity: 5000, type: 'buy' },
    { price: 50, liquidity: 8000, type: 'buy' },
    { price: 55, liquidity: 12000, type: 'buy' },
    { price: 60, liquidity: 15000, type: 'buy' },
    { price: 65, liquidity: 18000, type: 'current' },
    { price: 70, liquidity: 14000, type: 'sell' },
    { price: 75, liquidity: 10000, type: 'sell' },
    { price: 80, liquidity: 7000, type: 'sell' },
    { price: 85, liquidity: 4000, type: 'sell' },
  ];

  const maxLiquidity = Math.max(...liquidityLevels.map(l => l.liquidity));

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Liquidity Heatmap</h3>

          {/* Heatmap */}
          <div className="space-y-2 mb-6">
            {liquidityLevels.map((level, idx) => {
              const width = (level.liquidity / maxLiquidity) * 100;
              const isCurrent = level.type === 'current';
              
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className={`text-sm font-medium w-12 ${isCurrent ? 'text-blue-400' : 'text-gray-400'}`}>
                    {level.price}¢
                  </span>
                  <div className="flex-1 bg-gray-800 rounded h-8 relative overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isCurrent ? 'bg-blue-500' :
                        level.type === 'buy' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${width}%`, opacity: 0.7 }}
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">CURRENT</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-400 w-20 text-right">
                    ${(level.liquidity / 1000).toFixed(1)}k
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-gray-400">Buy Liquidity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-gray-400">Sell Liquidity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="text-gray-400">Current Price</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Best Execution Paths */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Best Execution Paths</h4>
          
          <div className="space-y-3">
            {[
              { size: 1000, path: 'Direct', slippage: 0.2, cost: 650 },
              { size: 5000, path: 'Split 3 orders', slippage: 0.8, cost: 3250 },
              { size: 10000, path: 'Split 5 orders', slippage: 1.5, cost: 6500 },
            ].map((path, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">${path.size} Order</span>
                  <span className="text-blue-400">{path.path}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Slippage</p>
                    <p className="font-medium">{path.slippage}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Cost</p>
                    <p className="font-medium">${path.cost}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Slippage Predictions */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Slippage Predictions</h4>
          
          <div className="space-y-4">
            {[
              { amount: 100, slippage: 0.1, impact: 'Minimal' },
              { amount: 500, slippage: 0.3, impact: 'Low' },
              { amount: 1000, slippage: 0.6, impact: 'Moderate' },
              { amount: 5000, slippage: 2.1, impact: 'High' },
            ].map((pred, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">${pred.amount} trade</span>
                  <span className="font-medium">{pred.slippage}% ({pred.impact})</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      pred.slippage < 0.5 ? 'bg-green-500' :
                      pred.slippage < 1 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(pred.slippage * 20, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
