'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

interface Position {
  marketId: number;
  marketName: string;
  outcome: 'YES' | 'NO';
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  profitLoss: number;
  profitLossPercent: number;
}

export default function Portfolio() {
  const { address } = useAccount();

  // Mock portfolio data
  const positions: Position[] = [
    {
      marketId: 1,
      marketName: 'Will Bitcoin reach $100k by EOY?',
      outcome: 'YES',
      shares: 100,
      avgPrice: 65,
      currentPrice: 70,
      value: 70,
      profitLoss: 5,
      profitLossPercent: 7.69,
    },
    {
      marketId: 2,
      marketName: 'Will ETH reach $5k by March?',
      outcome: 'NO',
      shares: 50,
      avgPrice: 45,
      currentPrice: 40,
      value: 20,
      profitLoss: -2.5,
      profitLossPercent: -11.11,
    },
    {
      marketId: 3,
      marketName: 'Will SOL reach $200 by Q2?',
      outcome: 'YES',
      shares: 75,
      avgPrice: 55,
      currentPrice: 60,
      value: 45,
      profitLoss: 3.75,
      profitLossPercent: 9.09,
    },
  ];

  const totalValue = useMemo(() => {
    return positions.reduce((sum, p) => sum + p.value, 0);
  }, [positions]);

  const totalCost = useMemo(() => {
    return positions.reduce((sum, p) => sum + (p.shares * p.avgPrice / 100), 0);
  }, [positions]);

  const totalProfitLoss = useMemo(() => {
    return positions.reduce((sum, p) => sum + p.profitLoss, 0);
  }, [positions]);

  const totalProfitLossPercent = useMemo(() => {
    return totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;
  }, [totalCost, totalProfitLoss]);

  if (!address) {
    return (
      <Card>
        <p className="text-center text-gray-500">Connect wallet to view portfolio</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-2xl font-bold mb-6">Portfolio Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Total Value</div>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Total Cost</div>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Total P&L</div>
            <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toFixed(2)}
              <span className="text-sm ml-2">
                ({totalProfitLoss >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Active Positions</h4>
          {positions.map((position) => (
            <div
              key={position.marketId}
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h5 className="font-medium mb-1">{position.marketName}</h5>
                  <Badge variant={position.outcome === 'YES' ? 'green' : 'red'}>
                    {position.outcome}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {position.profitLoss >= 0 ? '+' : ''}${position.profitLoss.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {position.profitLoss >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-sm">
                <div>
                  <div className="text-gray-500 text-xs">Shares</div>
                  <div className="font-medium">{position.shares}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Avg Price</div>
                  <div className="font-medium">{position.avgPrice}¢</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Current</div>
                  <div className="font-medium">{position.currentPrice}¢</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Value</div>
                  <div className="font-medium">${position.value.toFixed(2)}</div>
                </div>
              </div>

              <div className="mt-3">
                <ProgressBar 
                  value={position.currentPrice} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
