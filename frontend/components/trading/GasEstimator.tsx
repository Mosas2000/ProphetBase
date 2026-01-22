'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { useEffect, useState } from 'react';

interface GasEstimatorProps {
  transactionType?: 'buy' | 'sell' | 'claim' | 'create';
  onGasSelect?: (gasPrice: number) => void;
}

interface GasOption {
  speed: 'slow' | 'normal' | 'fast';
  label: string;
  gwei: number;
  estimatedTime: string;
  usd: number;
}

export default function GasEstimator({ transactionType = 'buy', onGasSelect }: GasEstimatorProps) {
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [gasOptions, setGasOptions] = useState<GasOption[]>([]);

  useEffect(() => {
    // Simulate gas price fetching
    const fetchGasPrices = () => {
      const baseGas = 0.5 + Math.random() * 0.5; // 0.5-1.0 Gwei
      setGasOptions([
        {
          speed: 'slow',
          label: 'Slow',
          gwei: baseGas,
          estimatedTime: '~2 min',
          usd: baseGas * 0.002,
        },
        {
          speed: 'normal',
          label: 'Normal',
          gwei: baseGas * 1.2,
          estimatedTime: '~30 sec',
          usd: baseGas * 1.2 * 0.002,
        },
        {
          speed: 'fast',
          label: 'Fast',
          gwei: baseGas * 1.5,
          estimatedTime: '~15 sec',
          usd: baseGas * 1.5 * 0.002,
        },
      ]);
    };

    fetchGasPrices();
    const interval = setInterval(fetchGasPrices, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, []);

  const handleSelectSpeed = (speed: 'slow' | 'normal' | 'fast') => {
    setSelectedSpeed(speed);
    const option = gasOptions.find(o => o.speed === speed);
    if (option) {
      onGasSelect?.(option.gwei);
    }
  };

  const selectedOption = gasOptions.find(o => o.speed === selectedSpeed);

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Gas Estimator</h3>

      <div className="space-y-3 mb-4">
        {gasOptions.map((option) => (
          <button
            key={option.speed}
            onClick={() => handleSelectSpeed(option.speed)}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedSpeed === option.speed
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{option.label}</span>
                <Badge variant={
                  option.speed === 'fast' ? 'green' :
                  option.speed === 'normal' ? 'blue' : 'gray'
                }>
                  {option.estimatedTime}
                </Badge>
              </div>
              <div className="text-right">
                <div className="font-bold">${option.usd.toFixed(4)}</div>
                <div className="text-xs text-gray-500">{option.gwei.toFixed(2)} Gwei</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedOption && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Transaction Type:</span>
            <span className="font-medium capitalize">{transactionType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Estimated Gas:</span>
            <span className="font-medium">{selectedOption.gwei.toFixed(2)} Gwei</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Estimated Time:</span>
            <span className="font-medium">{selectedOption.estimatedTime}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Total Cost:</span>
            <span className="font-bold">${selectedOption.usd.toFixed(4)}</span>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-3">
        Gas prices update every 10 seconds • Estimates may vary
      </p>
    </Card>
  );
}
