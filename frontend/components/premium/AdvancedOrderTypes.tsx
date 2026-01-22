'use client';

import { useState } from 'react';

interface OrderType {
  id: string;
  type: 'stop-loss' | 'take-profit' | 'trailing-stop' | 'oco';
  marketId: number;
  outcome: boolean;
  triggerPrice: string;
  amount: string;
  status: 'pending' | 'active' | 'executed' | 'cancelled';
  createdAt: Date;
}

export default function AdvancedOrderTypes() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [orderType, setOrderType] = useState<OrderType['type']>('stop-loss');
  const [marketId, setMarketId] = useState<number>(0);
  const [outcome, setOutcome] = useState<boolean>(true);
  const [triggerPrice, setTriggerPrice] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [trailingPercent, setTrailingPercent] = useState<string>('5');
  const [ocoTakeProfitPrice, setOcoTakeProfitPrice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    if (!triggerPrice || !amount) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const newOrder: OrderType = {
        id: `order-${Date.now()}`,
        type: orderType,
        marketId,
        outcome,
        triggerPrice,
        amount,
        status: 'active',
        createdAt: new Date(),
      };

      setOrders([...orders, newOrder]);

      // Reset form
      setTriggerPrice('');
      setAmount('');

      alert(`${orderType.toUpperCase()} order created successfully!`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: 'cancelled' as const }
          : order
      )
    );
  };

  const getOrderTypeDescription = (type: OrderType['type']) => {
    switch (type) {
      case 'stop-loss':
        return 'Automatically sell when price drops below trigger';
      case 'take-profit':
        return 'Automatically sell when price rises above trigger';
      case 'trailing-stop':
        return 'Stop-loss that adjusts with favorable price movements';
      case 'oco':
        return 'One order cancels the other when executed';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Advanced Order Types
        </h1>
        <p className="text-gray-600">
          Set up automated orders to manage risk and lock in profits
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Order Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Create Order
            </h2>

            {/* Order Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  ['stop-loss', 'take-profit', 'trailing-stop', 'oco'] as const
                ).map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      orderType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type
                      .split('-')
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {getOrderTypeDescription(orderType)}
              </p>
            </div>

            {/* Market Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market ID
              </label>
              <input
                type="number"
                value={marketId}
                onChange={(e) => setMarketId(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Outcome Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outcome
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setOutcome(true)}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all ${
                    outcome
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  YES
                </button>
                <button
                  onClick={() => setOutcome(false)}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all ${
                    !outcome
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  NO
                </button>
              </div>
            </div>

            {/* Trigger Price */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {orderType === 'stop-loss'
                  ? 'Stop Price'
                  : orderType === 'take-profit'
                  ? 'Target Price'
                  : 'Trigger Price'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={triggerPrice}
                  onChange={(e) => setTriggerPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                  USDC
                </span>
              </div>
            </div>

            {/* Trailing Stop Percentage */}
            {orderType === 'trailing-stop' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trailing Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={trailingPercent}
                    onChange={(e) => setTrailingPercent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                    %
                  </span>
                </div>
              </div>
            )}

            {/* OCO Take Profit */}
            {orderType === 'oco' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Take Profit Price
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={ocoTakeProfitPrice}
                    onChange={(e) => setOcoTakeProfitPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                    USDC
                  </span>
                </div>
              </div>
            )}

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                  Shares
                </span>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={createOrder}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </div>

        {/* Active Orders List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Active Orders
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Active Orders
                </h3>
                <p className="text-gray-600">
                  Create your first advanced order to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      order.status === 'active'
                        ? 'border-blue-500 bg-blue-50'
                        : order.status === 'executed'
                        ? 'border-green-500 bg-green-50'
                        : order.status === 'cancelled'
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">
                            {order.type
                              .split('-')
                              .map(
                                (w) => w.charAt(0).toUpperCase() + w.slice(1)
                              )
                              .join(' ')}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              order.status === 'active'
                                ? 'bg-blue-600 text-white'
                                : order.status === 'executed'
                                ? 'bg-green-600 text-white'
                                : order.status === 'cancelled'
                                ? 'bg-gray-600 text-white'
                                : 'bg-yellow-600 text-white'
                            }`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Market #{order.marketId} •{' '}
                          {order.outcome ? 'YES' : 'NO'}
                        </p>
                      </div>
                      {order.status === 'active' && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Trigger Price</p>
                        <p className="font-semibold text-gray-900">
                          {order.triggerPrice} USDC
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Amount</p>
                        <p className="font-semibold text-gray-900">
                          {order.amount} shares
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Created</p>
                        <p className="font-semibold text-gray-900">
                          {order.createdAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Type Info Cards */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <h3 className="font-bold text-red-900 mb-2">🛑 Stop-Loss</h3>
              <p className="text-sm text-red-800">
                Limit losses by selling when price drops below your stop price
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">🎯 Take-Profit</h3>
              <p className="text-sm text-green-800">
                Lock in profits by selling when price reaches your target
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">
                📈 Trailing Stop
              </h3>
              <p className="text-sm text-purple-800">
                Dynamic stop-loss that follows favorable price movements
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">🔄 OCO</h3>
              <p className="text-sm text-blue-800">
                Combines stop-loss and take-profit - one cancels the other
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
