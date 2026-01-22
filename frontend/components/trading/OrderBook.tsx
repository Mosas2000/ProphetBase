'use client';

import Card from '@/components/ui/Card';
import { useMemo } from 'react';

interface Order {
  price: number;
  amount: number;
  total: number;
  type: 'buy' | 'sell';
}

interface OrderBookProps {
  marketId: number;
  yesOrders?: Order[];
  noOrders?: Order[];
}

export default function OrderBook({ marketId, yesOrders = [], noOrders = [] }: OrderBookProps) {
  // Mock data for demonstration
  const buyOrders: Order[] = yesOrders.length > 0 ? yesOrders : [
    { price: 65, amount: 100, total: 65, type: 'buy' },
    { price: 64, amount: 250, total: 160, type: 'buy' },
    { price: 63, amount: 500, total: 315, type: 'buy' },
    { price: 62, amount: 150, total: 93, type: 'buy' },
    { price: 61, amount: 300, total: 183, type: 'buy' },
  ];

  const sellOrders: Order[] = noOrders.length > 0 ? noOrders : [
    { price: 66, amount: 200, total: 132, type: 'sell' },
    { price: 67, amount: 150, total: 100.5, type: 'sell' },
    { price: 68, amount: 400, total: 272, type: 'sell' },
    { price: 69, amount: 100, total: 69, type: 'sell' },
    { price: 70, amount: 250, total: 175, type: 'sell' },
  ];

  const maxAmount = useMemo(() => {
    const allAmounts = [...buyOrders, ...sellOrders].map(o => o.amount);
    return Math.max(...allAmounts);
  }, [buyOrders, sellOrders]);

  const spread = sellOrders[0]?.price - buyOrders[0]?.price;
  const midPrice = ((sellOrders[0]?.price + buyOrders[0]?.price) / 2).toFixed(1);

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Order Book</h3>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-gray-500">Spread:</span>
            <span className="ml-2 font-medium">{spread}¢</span>
          </div>
          <div>
            <span className="text-gray-500">Mid Price:</span>
            <span className="ml-2 font-medium">{midPrice}¢</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-500 mb-2 px-2">
        <div>Price (¢)</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Total ($)</div>
      </div>

      {/* Sell Orders (Asks) */}
      <div className="space-y-1 mb-4">
        {[...sellOrders].reverse().map((order, idx) => (
          <div
            key={`sell-${idx}`}
            className="relative grid grid-cols-3 gap-2 text-sm py-1.5 px-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded"
              style={{ width: `${(order.amount / maxAmount) * 100}%`, opacity: 0.3 }}
            />
            <div className="relative text-red-600 dark:text-red-400 font-medium">
              {order.price}
            </div>
            <div className="relative text-right">{order.amount}</div>
            <div className="relative text-right">${order.total.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Spread Indicator */}
      <div className="my-3 py-2 px-2 bg-gray-100 dark:bg-gray-800 rounded text-center">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          ← Spread: {spread}¢ →
        </span>
      </div>

      {/* Buy Orders (Bids) */}
      <div className="space-y-1">
        {buyOrders.map((order, idx) => (
          <div
            key={`buy-${idx}`}
            className="relative grid grid-cols-3 gap-2 text-sm py-1.5 px-2 rounded hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded"
              style={{ width: `${(order.amount / maxAmount) * 100}%`, opacity: 0.3 }}
            />
            <div className="relative text-green-600 dark:text-green-400 font-medium">
              {order.price}
            </div>
            <div className="relative text-right">{order.amount}</div>
            <div className="relative text-right">${order.total.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Order Depth Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500 mb-1">Buy Depth</div>
            <div className="font-semibold text-green-600">
              {buyOrders.reduce((sum, o) => sum + o.amount, 0)} shares
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Sell Depth</div>
            <div className="font-semibold text-red-600">
              {sellOrders.reduce((sum, o) => sum + o.amount, 0)} shares
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
