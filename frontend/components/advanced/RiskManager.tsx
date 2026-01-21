'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

interface Position {
  marketId: number;
  marketName: string;
  outcome: 'YES' | 'NO';
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

interface RiskMetrics {
  portfolioValue: number;
  totalRisk: number;
  maxLoss: number;
  diversificationScore: number;
  concentrationRisk: number;
}

export function RiskManager() {
  const [positions] = useState<Position[]>([
    {
      marketId: 0,
      marketName: 'Bitcoin $100k by 2024',
      outcome: 'YES',
      shares: 150,
      avgPrice: 45,
      currentPrice: 65,
    },
    {
      marketId: 1,
      marketName: 'ETH $5k by Q2',
      outcome: 'YES',
      shares: 200,
      avgPrice: 38,
      currentPrice: 42,
    },
  ]);

  const [tradeAmount, setTradeAmount] = useState(100);
  const [marketPrice, setMarketPrice] = useState(50);
  const [stopLossPercent, setStopLossPercent] = useState(20);

  // Calculate portfolio metrics
  const portfolioValue = positions.reduce(
    (sum, p) => sum + (p.shares * p.currentPrice) / 100,
    0
  );

  const totalCost = positions.reduce(
    (sum, p) => sum + (p.shares * p.avgPrice) / 100,
    0
  );

  const unrealizedPnL = portfolioValue - totalCost;

  // Calculate risk metrics
  const calculateRiskMetrics = (): RiskMetrics => {
    const maxLoss = positions.reduce(
      (sum, p) => sum + (p.shares * p.avgPrice) / 100,
      0
    );

    // Concentration risk (0-100, lower is better)
    const largestPosition = Math.max(
      ...positions.map(p => (p.shares * p.currentPrice) / 100)
    );
    const concentrationRisk = portfolioValue > 0 
      ? (largestPosition / portfolioValue) * 100 
      : 0;

    // Diversification score (0-100, higher is better)
    const diversificationScore = Math.min(
      (positions.length / 10) * 100,
      100
    );

    // Total risk as percentage of portfolio
    const totalRisk = portfolioValue > 0 
      ? (maxLoss / portfolioValue) * 100 
      : 0;

    return {
      portfolioValue,
      totalRisk,
      maxLoss,
      diversificationScore,
      concentrationRisk,
    };
  };

  const metrics = calculateRiskMetrics();

  // Position size calculator
  const calculatePositionSize = () => {
    const riskPerTrade = portfolioValue * 0.02; // 2% risk per trade
    const stopLossAmount = (tradeAmount * stopLossPercent) / 100;
    const suggestedSize = Math.floor(riskPerTrade / (stopLossAmount / tradeAmount));
    return Math.min(suggestedSize, tradeAmount);
  };

  const suggestedSize = calculatePositionSize();

  // Stop loss calculator
  const calculateStopLoss = () => {
    const stopLossPrice = marketPrice * (1 - stopLossPercent / 100);
    const potentialLoss = (marketPrice - stopLossPrice) * (tradeAmount / marketPrice);
    return { price: stopLossPrice, loss: potentialLoss };
  };

  const stopLoss = calculateStopLoss();

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Risk Manager</h3>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Portfolio Value</p>
              <p className="text-2xl font-bold">${portfolioValue.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Unrealized P&L</p>
              <p className={`text-2xl font-bold ${unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Max Loss</p>
              <p className="text-2xl font-bold text-red-400">${metrics.maxLoss.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Positions</p>
              <p className="text-2xl font-bold">{positions.length}</p>
            </div>
          </div>

          {/* Risk Metrics */}
          <div className="mb-6">
            <h4 className="font-semibold mb-4">Risk Analysis</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Diversification Score</span>
                  <span className="text-sm font-medium">{metrics.diversificationScore.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${metrics.diversificationScore}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {metrics.diversificationScore < 30 && 'Low - Consider diversifying across more markets'}
                  {metrics.diversificationScore >= 30 && metrics.diversificationScore < 70 && 'Moderate - Good balance'}
                  {metrics.diversificationScore >= 70 && 'High - Well diversified portfolio'}
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Concentration Risk</span>
                  <span className="text-sm font-medium">{metrics.concentrationRisk.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${metrics.concentrationRisk}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {metrics.concentrationRisk > 50 && 'High - Largest position is over 50% of portfolio'}
                  {metrics.concentrationRisk > 30 && metrics.concentrationRisk <= 50 && 'Moderate - Monitor largest positions'}
                  {metrics.concentrationRisk <= 30 && 'Low - Well balanced position sizes'}
                </p>
              </div>
            </div>
          </div>

          {/* Positions */}
          <div className="mb-6">
            <h4 className="font-semibold mb-4">Active Positions</h4>
            <div className="space-y-2">
              {positions.map((position) => {
                const positionValue = (position.shares * position.currentPrice) / 100;
                const positionPnL = (position.shares * (position.currentPrice - position.avgPrice)) / 100;
                const positionPercent = (positionValue / portfolioValue) * 100;

                return (
                  <Card key={position.marketId}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium">{position.marketName}</h5>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={position.outcome === 'YES' ? 'success' : 'error'}>
                              {position.outcome}
                            </Badge>
                            <span className="text-sm text-gray-400">
                              {position.shares} shares @ {position.avgPrice}¢
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${positionValue.toFixed(2)}</p>
                          <p className={`text-sm ${positionPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {positionPnL >= 0 ? '+' : ''}${positionPnL.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Current: {position.currentPrice}¢</span>
                        <span>{positionPercent.toFixed(1)}% of portfolio</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Position Size Calculator */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Position Size Calculator</h4>
          <div className="space-y-4">
            <Input
              label="Trade Amount ($)"
              type="number"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(parseFloat(e.target.value))}
            />
            <Input
              label="Market Price (¢)"
              type="number"
              value={marketPrice}
              onChange={(e) => setMarketPrice(parseFloat(e.target.value))}
            />
            <Input
              label="Stop Loss (%)"
              type="number"
              value={stopLossPercent}
              onChange={(e) => setStopLossPercent(parseFloat(e.target.value))}
            />

            <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Recommended Position Size</p>
              <p className="text-3xl font-bold text-blue-400">${suggestedSize}</p>
              <p className="text-xs text-gray-400 mt-2">
                Based on 2% portfolio risk rule
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Stop Loss</p>
              <p className="text-xl font-bold text-red-400">{stopLoss.price.toFixed(1)}¢</p>
              <p className="text-sm text-gray-400 mt-1">
                Max Loss: ${stopLoss.loss.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Risk Guidelines */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Risk Management Guidelines</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-green-400">✓</span>
              <p>Never risk more than 2% of your portfolio on a single trade</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400">✓</span>
              <p>Maintain at least 5-10 different positions for diversification</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400">✓</span>
              <p>No single position should exceed 20% of your portfolio</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400">✓</span>
              <p>Always use stop losses to limit downside risk</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400">✓</span>
              <p>Review and rebalance your portfolio regularly</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
