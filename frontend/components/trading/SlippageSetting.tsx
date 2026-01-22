'use client';

import Alert from '@/components/ui/Alert';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { useState } from 'react';

interface SlippageSettingProps {
  defaultSlippage?: number;
  onSlippageChange?: (slippage: number) => void;
}

const PRESET_SLIPPAGE = [0.1, 0.5, 1.0, 3.0];

export default function SlippageSetting({ defaultSlippage = 0.5, onSlippageChange }: SlippageSettingProps) {
  const [slippage, setSlippage] = useState(defaultSlippage);
  const [customSlippage, setCustomSlippage] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const handlePresetClick = (value: number) => {
    setSlippage(value);
    setIsCustom(false);
    setCustomSlippage('');
    onSlippageChange?.(value);
  };

  const handleCustomChange = (value: string) => {
    setCustomSlippage(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setSlippage(numValue);
      setIsCustom(true);
      onSlippageChange?.(numValue);
    }
  };

  const getSlippageWarning = () => {
    if (slippage < 0.1) {
      return { type: 'warning' as const, message: 'Very low slippage may cause transaction failures' };
    }
    if (slippage > 5) {
      return { type: 'error' as const, message: 'High slippage! You may lose significant value' };
    }
    if (slippage > 2) {
      return { type: 'warning' as const, message: 'Moderate slippage - consider reducing for better prices' };
    }
    return null;
  };

  const warning = getSlippageWarning();

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Slippage Tolerance</h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Maximum price movement you're willing to accept during trade execution
      </p>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {PRESET_SLIPPAGE.map((value) => (
          <button
            key={value}
            onClick={() => handlePresetClick(value)}
            className={`py-2 px-3 rounded-lg border-2 font-medium transition-all ${
              !isCustom && slippage === value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            {value}%
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Custom Slippage</label>
        <div className="relative">
          <Input
            type="number"
            value={customSlippage}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="Enter custom %"
            min="0"
            max="50"
            step="0.1"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
      </div>

      {warning && (
        <Alert variant={warning.type} className="mb-4">
          {warning.message}
        </Alert>
      )}

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Current Setting:</span>
          <span className="text-lg font-bold text-blue-600">{slippage.toFixed(2)}%</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Your transaction will revert if the price changes unfavorably by more than this percentage
        </p>
      </div>
    </Card>
  );
}
