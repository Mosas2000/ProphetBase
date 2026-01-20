'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useState } from 'react';
import { useAccount } from 'wagmi';

interface QuickTradeProps {
  marketId: number;
  marketName: string;
  yesPrice: number;
  noPrice: number;
  onTrade?: (outcome: 'YES' | 'NO', amount: number) => void;
}

const PRESET_AMOUNTS = [10, 50, 100, 250, 500];

export default function QuickTrade({ marketId, marketName, yesPrice, noPrice, onTrade }: QuickTradeProps) {
  const { address } = useAccount();
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [outcome, setOutcome] = useState<'YES' | 'NO'>('YES');

  const currentPrice = outcome === 'YES' ? yesPrice : noPrice;
  const shares = Math.floor((selectedAmount * 100) / currentPrice);
  const potentialProfit = shares * (100 - currentPrice) / 100;

  const handleQuickTrade = () => {
    if (!address) return;
    onTrade?.(outcome, selectedAmount);
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Quick Trade</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{marketName}</p>

      {/* Outcome Selection */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => setOutcome('YES')}
          className={`p-4 rounded-lg border-2 transition-all ${
            outcome === 'YES'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="text-2xl font-bold text-green-600">YES</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{yesPrice}¢</div>
        </button>

        <button
          onClick={() => setOutcome('NO')}
          className={`p-4 rounded-lg border-2 transition-all ${
            outcome === 'NO'
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="text-2xl font-bold text-red-600">NO</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{noPrice}¢</div>
        </button>
      </div>

      {/* Amount Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Amount</label>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={`py-2 px-3 rounded-lg border-2 font-medium transition-all ${
                selectedAmount === amount
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {/* Trade Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">You pay:</span>
          <span className="font-semibold">${selectedAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">You receive:</span>
          <span className="font-semibold">{shares} shares @ {currentPrice}¢</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Potential profit:</span>
          <span className="font-semibold text-green-600">
            ${potentialProfit.toFixed(2)} ({((potentialProfit / selectedAmount) * 100).toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Execute Button */}
      <Button
        onClick={handleQuickTrade}
        fullWidth
        disabled={!address}
        className={outcome === 'YES' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
      >
        {address ? `Buy ${outcome} for $${selectedAmount}` : 'Connect Wallet'}
      </Button>

      <p className="text-xs text-gray-500 text-center mt-2">
        Instant execution • No slippage protection
      </p>
    </Card>
  );
}
