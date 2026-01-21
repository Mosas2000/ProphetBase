'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

interface LiquidityPosition {
  marketId: number;
  marketName: string;
  yesLiquidity: number;
  noLiquidity: number;
  totalValue: number;
  feesEarned: number;
  apr: number;
}

export function MarketMaker() {
  const [positions, setPositions] = useState<LiquidityPosition[]>([
    {
      marketId: 0,
      marketName: 'Bitcoin $100k by 2024',
      yesLiquidity: 500,
      noLiquidity: 500,
      totalValue: 1000,
      feesEarned: 45.50,
      apr: 18.2,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newPosition, setNewPosition] = useState({
    marketId: 0,
    yesAmount: 0,
    noAmount: 0,
  });

  const totalLiquidity = positions.reduce((sum, p) => sum + p.totalValue, 0);
  const totalFeesEarned = positions.reduce((sum, p) => sum + p.feesEarned, 0);
  const avgAPR = positions.length > 0
    ? positions.reduce((sum, p) => sum + p.apr, 0) / positions.length
    : 0;

  const handleAddLiquidity = () => {
    const newLP: LiquidityPosition = {
      marketId: newPosition.marketId,
      marketName: 'New Market',
      yesLiquidity: newPosition.yesAmount,
      noLiquidity: newPosition.noAmount,
      totalValue: newPosition.yesAmount + newPosition.noAmount,
      feesEarned: 0,
      apr: 15.0,
    };

    setPositions([...positions, newLP]);
    setIsAdding(false);
    setNewPosition({ marketId: 0, yesAmount: 0, noAmount: 0 });
  };

  const removeLiquidity = (marketId: number) => {
    if (confirm('Remove all liquidity from this market?')) {
      setPositions(positions.filter(p => p.marketId !== marketId));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Market Maker</h3>
              <p className="text-sm text-gray-400 mt-1">Provide liquidity and earn trading fees</p>
            </div>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
              + Add Liquidity
            </Button>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-500/30">
              <p className="text-sm text-gray-400">Total Liquidity</p>
              <p className="text-2xl font-bold">${totalLiquidity.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
              <p className="text-sm text-gray-400">Fees Earned</p>
              <p className="text-2xl font-bold text-green-400">${totalFeesEarned.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
              <p className="text-sm text-gray-400">Avg APR</p>
              <p className="text-2xl font-bold text-yellow-400">{avgAPR.toFixed(1)}%</p>
            </div>
          </div>

          {/* Add Liquidity Form */}
          {isAdding && (
            <Card className="mb-6 border border-blue-500">
              <div className="p-4 space-y-4">
                <h4 className="font-semibold">Add Liquidity</h4>

                <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3 text-sm">
                  <p className="text-blue-400">💡 Tip: Provide balanced liquidity (50/50 YES/NO) for optimal returns</p>
                </div>

                <Input
                  label="Market ID"
                  type="number"
                  value={newPosition.marketId}
                  onChange={(e) => setNewPosition({ ...newPosition, marketId: parseInt(e.target.value) })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="YES Amount ($)"
                    type="number"
                    value={newPosition.yesAmount}
                    onChange={(e) => setNewPosition({ ...newPosition, yesAmount: parseFloat(e.target.value) })}
                  />
                  <Input
                    label="NO Amount ($)"
                    type="number"
                    value={newPosition.noAmount}
                    onChange={(e) => setNewPosition({ ...newPosition, noAmount: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Total Investment</span>
                    <span className="font-medium">${(newPosition.yesAmount + newPosition.noAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated APR</span>
                    <span className="font-medium text-green-400">~15-20%</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddLiquidity} disabled={!newPosition.yesAmount || !newPosition.noAmount}>
                    Add Liquidity
                  </Button>
                  <Button variant="secondary" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Liquidity Positions */}
          <div className="space-y-4">
            <h4 className="font-semibold">Your Liquidity Positions</h4>
            
            {positions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No liquidity positions</p>
                <p className="text-sm mt-2">Start earning fees by providing liquidity</p>
              </div>
            ) : (
              positions.map((position) => (
                <Card key={position.marketId}>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h5 className="font-medium mb-1">{position.marketName}</h5>
                        <div className="flex gap-2">
                          <Badge variant="success">Active</Badge>
                          <span className="text-sm text-gray-400">
                            APR: {position.apr}%
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="error"
                        size="sm"
                        onClick={() => removeLiquidity(position.marketId)}
                      >
                        Remove
                      </Button>
                    </div>

                    {/* Liquidity Breakdown */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-500/10 border border-green-500 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">YES Liquidity</p>
                        <p className="text-lg font-bold text-green-400">${position.yesLiquidity}</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">NO Liquidity</p>
                        <p className="text-lg font-bold text-red-400">${position.noLiquidity}</p>
                      </div>
                    </div>

                    {/* Performance */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Total Value</p>
                        <p className="font-medium">${position.totalValue}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Fees Earned</p>
                        <p className="font-medium text-green-400">+${position.feesEarned}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">ROI</p>
                        <p className="font-medium">
                          {((position.feesEarned / position.totalValue) * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* How It Works */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">How Market Making Works</h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h5 className="font-medium mb-1">Provide Liquidity</h5>
                <p className="text-sm text-gray-400">
                  Deposit equal amounts of YES and NO shares to create a balanced liquidity pool
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h5 className="font-medium mb-1">Earn Trading Fees</h5>
                <p className="text-sm text-gray-400">
                  Collect a 0.5% fee on every trade that uses your liquidity
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h5 className="font-medium mb-1">Withdraw Anytime</h5>
                <p className="text-sm text-gray-400">
                  Remove your liquidity at any time and claim your earned fees
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
            <p className="text-sm text-yellow-400">
              ⚠️ <strong>Risk Warning:</strong> Providing liquidity exposes you to impermanent loss if market prices move significantly. Only provide liquidity to markets you understand.
            </p>
          </div>
        </div>
      </Card>

      {/* Top Markets for LP */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Top Markets for Liquidity Providers</h4>
          <div className="space-y-2">
            {[
              { name: 'Bitcoin $100k by 2024', volume: 125000, apr: 22.5 },
              { name: 'ETH $5k by Q2', volume: 98000, apr: 19.8 },
              { name: 'BTC Halving Impact', volume: 75000, apr: 16.2 },
            ].map((market, idx) => (
              <Card key={idx} className="hover:border-blue-500 cursor-pointer transition-colors">
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{market.name}</p>
                      <p className="text-sm text-gray-400">Volume: ${market.volume.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">{market.apr}%</p>
                      <p className="text-xs text-gray-400">APR</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
