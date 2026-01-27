'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, AlertTriangle, Target, X } from 'lucide-react';

interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  margin: number;
  leverage: number;
  liquidationPrice: number;
  stopLoss?: number;
  takeProfit?: number;
}

export default function PositionManagement() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [closeAmount, setCloseAmount] = useState('');

  useEffect(() => {
    const mockPositions: Position[] = [
      {
        id: 'POS-1',
        symbol: 'BTC/USD',
        side: 'long',
        entryPrice: 49500,
        currentPrice: 50200,
        quantity: 0.5,
        unrealizedPnL: 350,
        unrealizedPnLPercent: 1.41,
        margin: 5000,
        leverage: 5,
        liquidationPrice: 45000,
        stopLoss: 48000,
      },
      {
        id: 'POS-2',
        symbol: 'ETH/USD',
        side: 'short',
        entryPrice: 2850,
        currentPrice: 2820,
        quantity: 5,
        unrealizedPnL: 150,
        unrealizedPnLPercent: 1.05,
        margin: 1500,
        leverage: 10,
        liquidationPrice: 3100,
        takeProfit: 2750,
      },
    ];

    const updatePrices = () => {
      setPositions((prev) =>
        prev.length > 0 ? prev : mockPositions.map((pos) => {
          const priceChange = (Math.random() - 0.5) * 20;
          const newPrice = pos.currentPrice + priceChange;
          const priceDiff = newPrice - pos.entryPrice;
          const multiplier = pos.side === 'long' ? 1 : -1;
          const pnl = priceDiff * pos.quantity * multiplier;
          const pnlPercent = (priceDiff / pos.entryPrice) * 100 * multiplier;

          return {
            ...pos,
            currentPrice: newPrice,
            unrealizedPnL: pnl,
            unrealizedPnLPercent: pnlPercent,
          };
        })
      );
    };

    updatePrices();
    const interval = setInterval(updatePrices, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);
  const totalMargin = positions.reduce((sum, pos) => sum + pos.margin, 0);
  const avgMarginUtilization = totalMargin > 0 ? (totalMargin / (totalMargin + Math.abs(totalPnL))) * 100 : 0;

  const handleOpenControls = (position: Position) => {
    setSelectedPosition(position);
    setStopLoss(position.stopLoss?.toString() || '');
    setTakeProfit(position.takeProfit?.toString() || '');
    setCloseAmount('');
    setShowControls(true);
  };

  const handleUpdatePosition = () => {
    if (!selectedPosition) return;

    setPositions((prev) =>
      prev.map((pos) =>
        pos.id === selectedPosition.id
          ? {
              ...pos,
              stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
              takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
            }
          : pos
      )
    );
    setShowControls(false);
  };

  const handleClosePosition = (partial: boolean) => {
    if (!selectedPosition) return;

    if (partial && closeAmount) {
      const amount = parseFloat(closeAmount);
      setPositions((prev) =>
        prev.map((pos) =>
          pos.id === selectedPosition.id
            ? { ...pos, quantity: pos.quantity - amount }
            : pos
        )
      );
    } else {
      setPositions((prev) => prev.filter((pos) => pos.id !== selectedPosition.id));
    }
    setShowControls(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Position Management</h1>
          <p className="text-slate-400">Monitor and manage your open positions with real-time P&L tracking</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-slate-400">Total P&L</span>
            </div>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${totalPnL.toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-400">Open Positions</span>
            </div>
            <div className="text-2xl font-bold">{positions.length}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-amber-400" />
              <span className="text-sm text-slate-400">Total Margin</span>
            </div>
            <div className="text-2xl font-bold">${totalMargin.toFixed(2)}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-slate-400">Margin Utilization</span>
            </div>
            <div className="text-2xl font-bold">{avgMarginUtilization.toFixed(1)}%</div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-4">Active Positions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-3 text-slate-400 font-medium">Symbol</th>
                  <th className="text-left p-3 text-slate-400 font-medium">Side</th>
                  <th className="text-right p-3 text-slate-400 font-medium">Entry</th>
                  <th className="text-right p-3 text-slate-400 font-medium">Current</th>
                  <th className="text-right p-3 text-slate-400 font-medium">Size</th>
                  <th className="text-right p-3 text-slate-400 font-medium">P&L</th>
                  <th className="text-right p-3 text-slate-400 font-medium">Liquidation</th>
                  <th className="text-center p-3 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="p-3 font-medium">{position.symbol}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          position.side === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {position.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono">${position.entryPrice.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono">${position.currentPrice.toFixed(2)}</td>
                    <td className="p-3 text-right">{position.quantity}</td>
                    <td className="p-3 text-right">
                      <div className={`font-bold ${position.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${position.unrealizedPnL.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {position.unrealizedPnLPercent >= 0 ? '+' : ''}
                        {position.unrealizedPnLPercent.toFixed(2)}%
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono text-red-400">${position.liquidationPrice.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleOpenControls(position)}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-sm transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showControls && selectedPosition && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h3 className="text-xl font-bold">Manage Position - {selectedPosition.symbol}</h3>
                <button onClick={() => setShowControls(false)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Stop Loss Price</label>
                  <input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="Enter stop loss price"
                    className="w-full bg-slate-700 text-white rounded-lg p-3 border border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Take Profit Price</label>
                  <input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder="Enter take profit price"
                    className="w-full bg-slate-700 text-white rounded-lg p-3 border border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Partial Close Amount</label>
                  <input
                    type="number"
                    value={closeAmount}
                    onChange={(e) => setCloseAmount(e.target.value)}
                    placeholder="Amount to close"
                    max={selectedPosition.quantity}
                    className="w-full bg-slate-700 text-white rounded-lg p-3 border border-slate-600"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdatePosition}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleClosePosition(true)}
                    disabled={!closeAmount}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Partial Close
                  </button>
                  <button
                    onClick={() => handleClosePosition(false)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    Close All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
