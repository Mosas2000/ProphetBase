'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export function InteractiveSimulator() {
  const [balance, setBalance] = useState(10000);
  const [positions, setPositions] = useState<any[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [tradeAmount, setTradeAmount] = useState('');

  const markets = [
    { id: '1', question: 'Bitcoin $100k by 2024?', yesPrice: 0.65, noPrice: 0.35 },
    { id: '2', question: 'ETH $5k by Q2?', yesPrice: 0.55, noPrice: 0.45 },
    { id: '3', question: 'Lakers Championship?', yesPrice: 0.40, noPrice: 0.60 },
  ];

  const handleTrade = (position: 'YES' | 'NO') => {
    const amount = parseFloat(tradeAmount);
    if (!amount || !selectedMarket) return;

    const market = markets.find(m => m.id === selectedMarket);
    if (!market) return;

    const price = position === 'YES' ? market.yesPrice : market.noPrice;
    const cost = amount * price;

    if (cost > balance) {
      alert('Insufficient balance!');
      return;
    }

    setBalance(balance - cost);
    setPositions([...positions, {
      market: market.question,
      position,
      shares: amount,
      cost,
      price,
    }]);
    setTradeAmount('');
    alert(`Bought ${amount} ${position} shares for $${cost.toFixed(2)}`);
  };

  const totalValue = positions.reduce((sum, p) => sum + p.cost, 0);
  const profit = totalValue - (10000 - balance);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Paper Trading Simulator</h3>
              <p className="text-sm text-gray-400">Practice risk-free with virtual money</p>
            </div>
            <Badge variant="warning">Learning Mode</Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Virtual Balance</p>
              <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Portfolio Value</p>
              <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">P&L</p>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Markets */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Available Markets</h4>
          
          <div className="space-y-3">
            {markets.map(market => (
              <div
                key={market.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedMarket === market.id
                    ? 'bg-blue-500/10 border-blue-500'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedMarket(market.id)}
              >
                <p className="font-medium mb-2">{market.question}</p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-gray-400">YES</p>
                    <p className="font-bold text-green-400">{(market.yesPrice * 100).toFixed(0)}¢</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">NO</p>
                    <p className="font-bold text-red-400">{(market.noPrice * 100).toFixed(0)}¢</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Trade Interface */}
      {selectedMarket && (
        <Card>
          <div className="p-6">
            <h4 className="font-semibold mb-4">Place Trade</h4>
            
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block">Number of Shares</label>
              <input
                type="number"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                placeholder="100"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => handleTrade('YES')} className="bg-green-500 hover:bg-green-600">
                Buy YES
              </Button>
              <Button onClick={() => handleTrade('NO')} className="bg-red-500 hover:bg-red-600">
                Buy NO
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Positions */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Your Positions</h4>
          
          {positions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No positions yet. Start trading!</p>
          ) : (
            <div className="space-y-2">
              {positions.map((pos, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{pos.market}</p>
                    <p className="text-xs text-gray-400">{pos.shares} {pos.position} shares @ {(pos.price * 100).toFixed(0)}¢</p>
                  </div>
                  <span className="font-bold">${pos.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Reset */}
      <Card>
        <div className="p-6 text-center">
          <Button
            variant="secondary"
            onClick={() => {
              setBalance(10000);
              setPositions([]);
              setSelectedMarket(null);
            }}
          >
            Reset Simulator
          </Button>
        </div>
      </Card>
    </div>
  );
}
