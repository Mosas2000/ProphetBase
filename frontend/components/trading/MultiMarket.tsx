'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useState } from 'react';
import { useAccount } from 'wagmi';

interface MarketTrade {
  marketId: number;
  marketName: string;
  outcome: 'YES' | 'NO';
  amount: number;
  currentPrice: number;
}

export default function MultiMarket() {
  const { address } = useAccount();
  const [selectedTrades, setSelectedTrades] = useState<MarketTrade[]>([]);

  // Mock available markets
  const availableMarkets = [
    { id: 1, name: 'Will Bitcoin reach $100k by EOY?', yesPrice: 65, noPrice: 35 },
    { id: 2, name: 'Will ETH reach $5k by March?', yesPrice: 45, noPrice: 55 },
    { id: 3, name: 'Will SOL reach $200 by Q2?', yesPrice: 60, noPrice: 40 },
  ];

  const addTrade = (marketId: number, marketName: string, outcome: 'YES' | 'NO', price: number) => {
    const newTrade: MarketTrade = {
      marketId,
      marketName,
      outcome,
      amount: 50,
      currentPrice: price,
    };
    setSelectedTrades([...selectedTrades, newTrade]);
  };

  const removeTrade = (index: number) => {
    setSelectedTrades(selectedTrades.filter((_, i) => i !== index));
  };

  const updateAmount = (index: number, amount: number) => {
    const updated = [...selectedTrades];
    updated[index].amount = amount;
    setSelectedTrades(updated);
  };

  const totalCost = selectedTrades.reduce((sum, trade) => 
    sum + (trade.amount * trade.currentPrice / 100), 0
  );

  const executeBatchTrade = () => {
    console.log('Executing batch trade:', selectedTrades);
    // Implementation would batch transactions
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4">Multi-Market Trading</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Trade multiple markets in a single transaction to save on gas fees
        </p>

        <div className="space-y-3">
          <h4 className="font-medium">Available Markets</h4>
          {availableMarkets.map((market) => (
            <div
              key={market.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <h5 className="font-medium text-sm flex-1">{market.name}</h5>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => addTrade(market.id, market.name, 'YES', market.yesPrice)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-sm"
                >
                  Add YES ({market.yesPrice}¢)
                </Button>
                <Button
                  onClick={() => addTrade(market.id, market.name, 'NO', market.noPrice)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-sm"
                >
                  Add NO ({market.noPrice}¢)
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {selectedTrades.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold mb-4">Batch Trade Summary</h3>
          
          <div className="space-y-3 mb-4">
            {selectedTrades.map((trade, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm mb-1">{trade.marketName}</h5>
                    <Badge variant={trade.outcome === 'YES' ? 'green' : 'red'}>
                      {trade.outcome}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => removeTrade(index)}
                    variant="secondary"
                    className="text-sm"
                  >
                    Remove
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Amount ($)</label>
                    <input
                      type="number"
                      value={trade.amount}
                      onChange={(e) => updateAmount(index, parseFloat(e.target.value) || 0)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg"
                      min="1"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Price</div>
                    <div className="font-medium">{trade.currentPrice}¢</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Cost</div>
                    <div className="font-medium">${(trade.amount * trade.currentPrice / 100).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total Cost:</span>
              <span className="text-2xl font-bold">${totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Number of Trades:</span>
              <span>{selectedTrades.length}</span>
            </div>
          </div>

          <Button
            onClick={executeBatchTrade}
            fullWidth
            disabled={!address || selectedTrades.length === 0}
          >
            Execute Batch Trade ({selectedTrades.length} markets)
          </Button>

          <p className="text-xs text-gray-500 text-center mt-2">
            Save up to 70% on gas fees with batch trading
          </p>
        </Card>
      )}
    </div>
  );
}
