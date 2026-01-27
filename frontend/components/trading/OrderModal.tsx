'use client';

import { useState } from 'react';
import { X, AlertCircle, Shield } from 'lucide-react';
import { OrderPlacementService, Order, OrderType, OrderSide, OrderPreview } from '@/lib/trading/OrderPlacementService';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  currentPrice: number;
}

export default function OrderModal({ isOpen, onClose, symbol, currentPrice }: OrderModalProps) {
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [side, setSide] = useState<OrderSide>('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState<OrderPreview | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loading, setLoading] = useState(false);

  const service = new OrderPlacementService();

  if (!isOpen) return null;

  const handlePreview = () => {
    const order = {
      type: orderType,
      side,
      symbol,
      quantity: parseFloat(quantity),
      price: price ? parseFloat(price) : undefined,
      stopPrice: stopPrice ? parseFloat(stopPrice) : undefined,
    };

    const validation = service.validateOrder(order);
    if (!validation.valid) {
      alert(validation.errors.join('\n'));
      return;
    }

    const orderPreview = service.generateOrderPreview(order, currentPrice);
    setPreview(orderPreview);
    setShowPreview(true);
  };

  const handleSubmit = async () => {
    if (!preview) return;

    setLoading(true);
    try {
      await service.placeOrder(preview.order, twoFactorCode || undefined);
      alert('Order placed successfully!');
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full border border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Place Order - {symbol}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!showPreview ? (
          <div className="p-6 space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSide('buy')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  side === 'buy' ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setSide('sell')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  side === 'sell' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                Sell
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Order Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as OrderType)}
                className="w-full bg-slate-700 text-white rounded-lg p-3 border border-slate-600"
              >
                <option value="market">Market</option>
                <option value="limit">Limit</option>
                <option value="stop-loss">Stop Loss</option>
                <option value="stop-limit">Stop Limit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-700 text-white rounded-lg p-3 border border-slate-600"
              />
            </div>

            {(orderType === 'limit' || orderType === 'stop-limit') && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Limit Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={currentPrice.toFixed(2)}
                  className="w-full bg-slate-700 text-white rounded-lg p-3 border border-slate-600"
                />
              </div>
            )}

            {(orderType === 'stop-loss' || orderType === 'stop-limit') && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Stop Price</label>
                <input
                  type="number"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  placeholder={currentPrice.toFixed(2)}
                  className="w-full bg-slate-700 text-white rounded-lg p-3 border border-slate-600"
                />
              </div>
            )}

            <button
              onClick={handlePreview}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Preview Order
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Type</span>
                <span className="text-white font-medium">{preview?.order.type?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Side</span>
                <span className={`font-medium ${side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                  {side.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantity</span>
                <span className="text-white font-medium">{quantity}</span>
              </div>
              {price && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Price</span>
                  <span className="text-white font-medium">${price}</span>
                </div>
              )}
              <div className="border-t border-slate-600 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Estimated Fee</span>
                  <span className="text-slate-300">${preview?.fees.estimatedFee.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-400">Slippage</span>
                  <span className="text-slate-300">{preview?.slippage.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span className="text-white">Total</span>
                  <span className="text-white">${preview?.estimatedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {preview && preview.estimatedTotal > 10000 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span className="font-medium text-amber-400">2FA Required</span>
                </div>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full bg-slate-700 text-white rounded-lg p-3 border border-slate-600"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Placing...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
