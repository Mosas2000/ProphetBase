'use client';

import Alert from '@/components/ui/Alert';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { useMemo } from 'react';

interface PriceImpactProps {
  tradeAmount: number;
  currentPrice: number;
  totalLiquidity: number;
  outcome: 'YES' | 'NO';
}

export default function PriceImpact({ tradeAmount, currentPrice, totalLiquidity, outcome }: PriceImpactProps) {
  const impact = useMemo(() => {
    if (tradeAmount === 0 || totalLiquidity === 0) return 0;
    // Simplified price impact calculation
    const impactPercent = (tradeAmount / totalLiquidity) * 100;
    return Math.min(impactPercent, 50); // Cap at 50%
  }, [tradeAmount, totalLiquidity]);

  const newPrice = useMemo(() => {
    return currentPrice + (currentPrice * impact / 100);
  }, [currentPrice, impact]);

  const recommendedMaxSize = useMemo(() => {
    // Recommend keeping impact under 2%
    return (totalLiquidity * 0.02);
  }, [totalLiquidity]);

  const getImpactLevel = () => {
    if (impact < 1) return { level: 'low', color: 'green', message: 'Low impact - good trade size' };
    if (impact < 3) return { level: 'moderate', color: 'yellow', message: 'Moderate impact - acceptable' };
    if (impact < 5) return { level: 'high', color: 'orange', message: 'High impact - consider reducing size' };
    return { level: 'extreme', color: 'red', message: 'Extreme impact - strongly recommend reducing size' };
  };

  const impactLevel = getImpactLevel();

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Price Impact Analysis</h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Price Impact</span>
            <span className={`text-2xl font-bold ${
              impact < 1 ? 'text-green-600' :
              impact < 3 ? 'text-yellow-600' :
              impact < 5 ? 'text-orange-600' : 'text-red-600'
            }`}>
              {impact.toFixed(2)}%
            </span>
          </div>
          <ProgressBar 
            value={Math.min(impact * 2, 100)} 
            className="h-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Current Price</div>
            <div className="text-lg font-bold">{currentPrice}¢</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Expected Price</div>
            <div className="text-lg font-bold">{newPrice.toFixed(1)}¢</div>
          </div>
        </div>

        <Alert variant={
          impactLevel.color === 'green' ? 'success' :
          impactLevel.color === 'yellow' ? 'warning' :
          impactLevel.color === 'orange' ? 'warning' : 'error'
        }>
          <strong>{impactLevel.level.toUpperCase()}:</strong> {impactLevel.message}
        </Alert>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-sm font-medium mb-2">💡 Recommendation</div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            For minimal price impact (&lt;2%), consider trading up to <strong>${recommendedMaxSize.toFixed(2)}</strong>
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Trade Size:</span>
            <span className="font-medium">${tradeAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Liquidity:</span>
            <span className="font-medium">${totalLiquidity.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">% of Liquidity:</span>
            <span className="font-medium">{((tradeAmount / totalLiquidity) * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
