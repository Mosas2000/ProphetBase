'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useState } from 'react';

interface BacktestStrategy {
  name: string;
  buyCondition: 'PRICE_BELOW' | 'VOLUME_SPIKE' | 'MOMENTUM';
  buyThreshold: number;
  sellCondition: 'PRICE_ABOVE' | 'TIME_LIMIT' | 'STOP_LOSS';
  sellThreshold: number;
  positionSize: number;
}

interface BacktestResult {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalProfit: number;
  winRate: number;
  avgProfit: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: Array<{
    date: string;
    market: string;
    entry: number;
    exit: number;
    profit: number;
  }>;
}

export function BacktestTool() {
  const [strategy, setStrategy] = useState<BacktestStrategy>({
    name: 'Value Buying Strategy',
    buyCondition: 'PRICE_BELOW',
    buyThreshold: 40,
    sellCondition: 'PRICE_ABOVE',
    sellThreshold: 70,
    positionSize: 100,
  });

  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-20',
  });

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);

  const runBacktest = async () => {
    setIsRunning(true);
    
    // Simulate backtesting
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock results
    const mockResults: BacktestResult = {
      totalTrades: 45,
      winningTrades: 28,
      losingTrades: 17,
      totalProfit: 1250,
      winRate: 62.2,
      avgProfit: 27.78,
      maxDrawdown: -180,
      sharpeRatio: 1.85,
      trades: [
        {
          date: '2024-01-05',
          market: 'Bitcoin $100k',
          entry: 35,
          exit: 72,
          profit: 105,
        },
        {
          date: '2024-01-08',
          market: 'ETH $5k',
          entry: 38,
          exit: 68,
          profit: 78,
        },
        {
          date: '2024-01-12',
          market: 'BTC Halving',
          entry: 42,
          exit: 45,
          profit: -15,
        },
      ],
    };

    setResults(mockResults);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Backtest Tool</h3>

          {/* Strategy Configuration */}
          <div className="space-y-4 mb-6">
            <Input
              label="Strategy Name"
              value={strategy.name}
              onChange={(e) => setStrategy({ ...strategy, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Buy Condition"
                value={strategy.buyCondition}
                onChange={(e) => setStrategy({ ...strategy, buyCondition: e.target.value as any })}
              >
                <option value="PRICE_BELOW">Price Below</option>
                <option value="VOLUME_SPIKE">Volume Spike</option>
                <option value="MOMENTUM">Momentum</option>
              </Select>

              <Input
                label="Buy Threshold"
                type="number"
                value={strategy.buyThreshold}
                onChange={(e) => setStrategy({ ...strategy, buyThreshold: parseFloat(e.target.value) })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Sell Condition"
                value={strategy.sellCondition}
                onChange={(e) => setStrategy({ ...strategy, sellCondition: e.target.value as any })}
              >
                <option value="PRICE_ABOVE">Price Above</option>
                <option value="TIME_LIMIT">Time Limit</option>
                <option value="STOP_LOSS">Stop Loss</option>
              </Select>

              <Input
                label="Sell Threshold"
                type="number"
                value={strategy.sellThreshold}
                onChange={(e) => setStrategy({ ...strategy, sellThreshold: parseFloat(e.target.value) })}
              />
            </div>

            <Input
              label="Position Size ($)"
              type="number"
              value={strategy.positionSize}
              onChange={(e) => setStrategy({ ...strategy, positionSize: parseFloat(e.target.value) })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>

            <Button onClick={runBacktest} disabled={isRunning} className="w-full">
              {isRunning ? 'Running Backtest...' : 'Run Backtest'}
            </Button>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-6">
              <div className="border-t border-gray-700 pt-6">
                <h4 className="font-semibold mb-4">Performance Metrics</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Total Profit</p>
                    <p className="text-2xl font-bold text-green-400">${results.totalProfit}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Win Rate</p>
                    <p className="text-2xl font-bold">{results.winRate}%</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Avg Profit</p>
                    <p className="text-2xl font-bold">${results.avgProfit}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Sharpe Ratio</p>
                    <p className="text-2xl font-bold">{results.sharpeRatio}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Total Trades</p>
                    <p className="text-xl font-bold">{results.totalTrades}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Winning</p>
                    <p className="text-xl font-bold text-green-400">{results.winningTrades}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Losing</p>
                    <p className="text-xl font-bold text-red-400">{results.losingTrades}</p>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-400">Max Drawdown</p>
                  <p className="text-2xl font-bold text-red-400">${results.maxDrawdown}</p>
                </div>
              </div>

              {/* Trade History */}
              <div>
                <h4 className="font-semibold mb-4">Trade History</h4>
                <div className="space-y-2">
                  {results.trades.map((trade, idx) => (
                    <Card key={idx}>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{trade.market}</p>
                            <p className="text-sm text-gray-400">{trade.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">
                              Entry: {trade.entry}¢ → Exit: {trade.exit}¢
                            </p>
                            <p className={`font-bold ${trade.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {trade.profit > 0 ? '+' : ''}${trade.profit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Strategy Templates */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Strategy Templates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border border-gray-700 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <h5 className="font-medium mb-1">Value Buying</h5>
              <p className="text-sm text-gray-400">Buy below 40¢, sell above 70¢</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <h5 className="font-medium mb-1">Momentum Trading</h5>
              <p className="text-sm text-gray-400">Follow strong price movements</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <h5 className="font-medium mb-1">Mean Reversion</h5>
              <p className="text-sm text-gray-400">Bet on price returning to average</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <h5 className="font-medium mb-1">Contrarian</h5>
              <p className="text-sm text-gray-400">Trade against the crowd</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
