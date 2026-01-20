'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { useState } from 'react';
import { useAccount } from 'wagmi';

interface LimitOrderProps {
  marketId: number;
  currentPrice: { yes: number; no: number };
}

interface Order {
  id: string;
  type: 'YES' | 'NO';
  price: number;
  amount: number;
  status: 'pending' | 'filled' | 'cancelled';
}

export default function LimitOrder({ marketId, currentPrice }: LimitOrderProps) {
  const { address } = useAccount();
  const [orderType, setOrderType] = useState<'YES' | 'NO'>('YES');
  const [targetPrice, setTargetPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  const handlePlaceOrder = () => {
    if (!address || !targetPrice || !amount) return;

    const newOrder: Order = {
      id: Date.now().toString(),
      type: orderType,
      price: parseFloat(targetPrice),
      amount: parseFloat(amount),
      status: 'pending',
    };

    setOrders([...orders, newOrder]);
    setTargetPrice('');
    setAmount('');
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'cancelled' as const } : o
    ));
  };

  const currentMarketPrice = orderType === 'YES' ? currentPrice.yes : currentPrice.no;

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4">Place Limit Order</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Order Type</label>
            <div className="flex gap-2">
              <Button
                onClick={() => setOrderType('YES')}
                variant={orderType === 'YES' ? 'primary' : 'secondary'}
                className="flex-1"
              >
                YES
              </Button>
              <Button
                onClick={() => setOrderType('NO')}
                variant={orderType === 'NO' ? 'primary' : 'secondary'}
                className="flex-1"
              >
                NO
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Target Price (¢)
            </label>
            <Input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="Enter target price"
              min="1"
              max="99"
            />
            <p className="text-sm text-gray-500 mt-1">
              Current market price: {currentMarketPrice}¢
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Amount (shares)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter number of shares"
              min="1"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span>Total Cost:</span>
              <span className="font-semibold">
                ${targetPrice && amount ? ((parseFloat(targetPrice) * parseFloat(amount)) / 100).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Potential Profit:</span>
              <span className="font-semibold text-green-600">
                ${amount ? ((100 - parseFloat(targetPrice || '0')) * parseFloat(amount) / 100).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          <Button
            onClick={handlePlaceOrder}
            fullWidth
            disabled={!address || !targetPrice || !amount}
          >
            Place Limit Order
          </Button>
        </div>
      </Card>

      {orders.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={order.type === 'YES' ? 'green' : 'red'}>
                      {order.type}
                    </Badge>
                    <span className="font-medium">{order.amount} shares @ {order.price}¢</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Total: ${((order.price * order.amount) / 100).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    order.status === 'filled' ? 'green' :
                    order.status === 'cancelled' ? 'gray' : 'blue'
                  }>
                    {order.status}
                  </Badge>
                  {order.status === 'pending' && (
                    <Button
                      onClick={() => handleCancelOrder(order.id)}
                      variant="secondary"
                      className="text-sm"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
