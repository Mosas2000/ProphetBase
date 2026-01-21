'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

interface FeeBreakdown {
  platformFee: number;
  liquidityProviderFee: number;
  creatorFee: number;
  total: number;
}

interface RevenueProjection {
  daily: number;
  weekly: number;
  monthly: number;
}

export function FeeCalculator() {
  const [tradeVolume, setTradeVolume] = useState(10000);
  const [initialLiquidity, setInitialLiquidity] = useState(1000);
  const [estimatedTrades, setEstimatedTrades] = useState(500);

  // Fee structure (percentages)
  const PLATFORM_FEE = 0.2; // 0.2%
  const LP_FEE = 0.3; // 0.3%
  const CREATOR_FEE = 0.0; // 0% (optional)
  const TOTAL_FEE = PLATFORM_FEE + LP_FEE + CREATOR_FEE;

  const calculateFees = (): FeeBreakdown => {
    const platformFee = (tradeVolume * PLATFORM_FEE) / 100;
    const lpFee = (tradeVolume * LP_FEE) / 100;
    const creatorFee = (tradeVolume * CREATOR_FEE) / 100;
    const total = platformFee + lpFee + creatorFee;

    return {
      platformFee,
      liquidityProviderFee: lpFee,
      creatorFee,
      total,
    };
  };

  const calculateRevenue = (): RevenueProjection => {
    const fees = calculateFees();
    const avgTradeSize = tradeVolume / estimatedTrades;
    const feePerTrade = (avgTradeSize * TOTAL_FEE) / 100;

    return {
      daily: feePerTrade * (estimatedTrades / 30),
      weekly: feePerTrade * (estimatedTrades / 4),
      monthly: fees.total,
    };
  };

  const fees = calculateFees();
  const revenue = calculateRevenue();

  // Calculate LP APR
  const lpAPR = initialLiquidity > 0 
    ? ((fees.liquidityProviderFee / initialLiquidity) * 12 * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Fee Calculator</h3>
        <p className="text-sm text-gray-400">
          Estimate fees and potential revenue for your market
        </p>
      </div>

      {/* Input Parameters */}
      <Card>
        <div className="p-6 space-y-4">
          <h4 className="font-semibold mb-4">Market Parameters</h4>

          <Input
            label="Expected Monthly Volume ($)"
            type="number"
            value={tradeVolume}
            onChange={(e) => setTradeVolume(parseFloat(e.target.value) || 0)}
          />

          <Input
            label="Initial Liquidity ($)"
            type="number"
            value={initialLiquidity}
            onChange={(e) => setInitialLiquidity(parseFloat(e.target.value) || 0)}
          />

          <Input
            label="Estimated Monthly Trades"
            type="number"
            value={estimatedTrades}
            onChange={(e) => setEstimatedTrades(parseInt(e.target.value) || 0)}
          />
        </div>
      </Card>

      {/* Fee Breakdown */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Fee Structure</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Platform Fee</p>
                <p className="text-sm text-gray-400">{PLATFORM_FEE}% of trade volume</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-400">
                  ${fees.platformFee.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">per month</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Liquidity Provider Fee</p>
                <p className="text-sm text-gray-400">{LP_FEE}% of trade volume</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-400">
                  ${fees.liquidityProviderFee.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">per month</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500 rounded-lg">
              <div>
                <p className="font-medium">Total Trading Fee</p>
                <p className="text-sm text-gray-400">{TOTAL_FEE}% per trade</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ${fees.total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">per month</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Revenue Projection */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Revenue Projection</h4>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Daily</p>
              <p className="text-2xl font-bold text-green-400">
                ${revenue.daily.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Weekly</p>
              <p className="text-2xl font-bold text-green-400">
                ${revenue.weekly.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Monthly</p>
              <p className="text-2xl font-bold text-green-400">
                ${revenue.monthly.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* LP Returns */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Liquidity Provider Returns</h4>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Estimated APR</p>
                <Badge variant="success" className="text-lg">
                  {lpAPR.toFixed(1)}%
                </Badge>
              </div>
              <p className="text-sm text-gray-400">
                Based on ${initialLiquidity} initial liquidity and ${fees.liquidityProviderFee.toFixed(2)}/month in fees
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Monthly Earnings</p>
                <p className="text-xl font-bold">
                  ${fees.liquidityProviderFee.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">ROI</p>
                <p className="text-xl font-bold">
                  {((fees.liquidityProviderFee / initialLiquidity) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Fee Comparison */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Fee Comparison</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500 rounded-lg">
              <div>
                <p className="font-medium">ProphetBase</p>
                <p className="text-sm text-gray-400">Total: {TOTAL_FEE}%</p>
              </div>
              <Badge variant="success">Current</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Polymarket</p>
                <p className="text-sm text-gray-400">Total: 2%</p>
              </div>
              <span className="text-sm text-gray-400">Competitor</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Augur</p>
                <p className="text-sm text-gray-400">Total: 1-2%</p>
              </div>
              <span className="text-sm text-gray-400">Competitor</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Manifold</p>
                <p className="text-sm text-gray-400">Total: 0%</p>
              </div>
              <span className="text-sm text-gray-400">Competitor</span>
            </div>
          </div>

          <div className="mt-4 bg-green-500/10 border border-green-500 rounded-lg p-4">
            <p className="text-sm text-green-400">
              ✓ ProphetBase offers competitive fees while ensuring sustainable liquidity rewards
            </p>
          </div>
        </div>
      </Card>

      {/* Fee Breakdown Chart */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Fee Distribution</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Platform ({PLATFORM_FEE}%)</span>
                <span>${fees.platformFee.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${(PLATFORM_FEE / TOTAL_FEE) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Liquidity Providers ({LP_FEE}%)</span>
                <span>${fees.liquidityProviderFee.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${(LP_FEE / TOTAL_FEE) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Optimization Tips</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">💡</span>
              <p>Higher initial liquidity attracts more traders and reduces slippage</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">💡</span>
              <p>Markets with clear resolution criteria tend to have higher volume</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">💡</span>
              <p>Promote your market on social media to increase trading activity</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">💡</span>
              <p>Consider adding more liquidity during high-activity periods</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
