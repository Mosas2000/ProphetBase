'use client';

import { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface OrderLevel {
  price: number;
  volume: number;
  cumulative: number;
  count: number;
}

interface DepthData {
  bids: OrderLevel[];
  asks: OrderLevel[];
  spread: number;
  midPrice: number;
}

export default function OrderBookDepth() {
  const [depthData, setDepthData] = useState<DepthData>({
    bids: [],
    asks: [],
    spread: 0,
    midPrice: 50000,
  });
  const [hoveredLevel, setHoveredLevel] = useState<OrderLevel | null>(null);
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const midPrice = 50000;
    const generateOrders = (side: 'bid' | 'ask', count: number): OrderLevel[] => {
      const orders: OrderLevel[] = [];
      let cumulative = 0;

      for (let i = 0; i < count; i++) {
        const priceOffset = (i + 1) * (side === 'bid' ? -10 : 10);
        const price = midPrice + priceOffset;
        const volume = Math.random() * 5 + (count - i) * 0.5;
        cumulative += volume;
        const orderCount = Math.floor(Math.random() * 20) + 1;

        orders.push({
          price,
          volume,
          cumulative,
          count: orderCount,
        });
      }

      return orders;
    };

    const bids = generateOrders('bid', 25);
    const asks = generateOrders('ask', 25);
    const spread = asks[0].price - bids[0].price;

    setDepthData({
      bids,
      asks,
      spread,
      midPrice,
    });

    const interval = setInterval(() => {
      const newBids = generateOrders('bid', 25);
      const newAsks = generateOrders('ask', 25);
      const newSpread = newAsks[0].price - newBids[0].price;

      setDepthData({
        bids: newBids,
        asks: newAsks,
        spread: newSpread,
        midPrice,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const maxCumulative = Math.max(
      depthData.bids[depthData.bids.length - 1]?.cumulative || 0,
      depthData.asks[depthData.asks.length - 1]?.cumulative || 0
    );

    const midX = width / 2;
    const priceRange = 500;

    ctx.beginPath();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';

    depthData.bids.forEach((level, i) => {
      const x = midX - ((depthData.midPrice - level.price) / priceRange) * midX;
      const y = height - (level.cumulative / maxCumulative) * height;

      if (i === 0) {
        ctx.moveTo(x, height);
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(midX, height);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';

    depthData.asks.forEach((level, i) => {
      const x = midX + ((level.price - depthData.midPrice) / priceRange) * midX;
      const y = height - (level.cumulative / maxCumulative) * height;

      if (i === 0) {
        ctx.moveTo(midX, height);
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(width, height);
    ctx.fill();
    ctx.stroke();

    if (hoveredPrice !== null) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      const x = hoveredPrice < depthData.midPrice
        ? midX - ((depthData.midPrice - hoveredPrice) / priceRange) * midX
        : midX + ((hoveredPrice - depthData.midPrice) / priceRange) * midX;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [depthData, hoveredPrice]);

  const findLevelAtPrice = (price: number): OrderLevel | null => {
    const allLevels = [...depthData.bids, ...depthData.asks];
    return allLevels.find((level) => Math.abs(level.price - price) < 5) || null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = canvas.width;
    const midX = width / 2;
    const priceRange = 500;

    let price: number;
    if (x < midX) {
      price = depthData.midPrice - ((midX - x) / midX) * priceRange;
    } else {
      price = depthData.midPrice + ((x - midX) / midX) * priceRange;
    }

    setHoveredPrice(price);
    setHoveredLevel(findLevelAtPrice(price));
  };

  const maxVolume = Math.max(
    ...depthData.bids.map((b) => b.volume),
    ...depthData.asks.map((a) => a.volume)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Book Depth</h1>
          <p className="text-slate-400">Real-time market depth visualization with liquidity analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Bid-Ask Spread</div>
            <div className="text-2xl font-bold text-amber-400">${depthData.spread.toFixed(2)}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Mid Price</div>
            <div className="text-2xl font-bold">${depthData.midPrice.toFixed(2)}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Total Orders</div>
            <div className="text-2xl font-bold text-cyan-400">
              {depthData.bids.length + depthData.asks.length}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold mb-4">Depth Chart</h2>
          <canvas
            ref={canvasRef}
            width={1200}
            height={400}
            className="w-full h-auto cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              setHoveredPrice(null);
              setHoveredLevel(null);
            }}
          />
          
          {hoveredLevel && (
            <div className="mt-4 bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-slate-400 mb-1">Price</div>
                  <div className="font-bold">${hoveredLevel.price.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Volume</div>
                  <div className="font-bold text-cyan-400">{hoveredLevel.volume.toFixed(3)}</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Cumulative</div>
                  <div className="font-bold text-purple-400">{hoveredLevel.cumulative.toFixed(3)}</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Orders</div>
                  <div className="font-bold">{hoveredLevel.count}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold">Bids</h3>
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {depthData.bids.slice(0, 15).map((bid, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded hover:bg-slate-700/30 transition-colors"
                >
                  <span className="text-green-400 font-mono">${bid.price.toFixed(2)}</span>
                  <div className="flex-1 mx-3 relative h-6">
                    <div
                      className="absolute right-0 h-full bg-green-500/20 rounded"
                      style={{ width: `${(bid.volume / maxVolume) * 100}%` }}
                    />
                  </div>
                  <span className="text-slate-300 font-mono">{bid.volume.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-bold">Asks</h3>
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {depthData.asks.slice(0, 15).map((ask, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded hover:bg-slate-700/30 transition-colors"
                >
                  <span className="text-red-400 font-mono">${ask.price.toFixed(2)}</span>
                  <div className="flex-1 mx-3 relative h-6">
                    <div
                      className="absolute left-0 h-full bg-red-500/20 rounded"
                      style={{ width: `${(ask.volume / maxVolume) * 100}%` }}
                    />
                  </div>
                  <span className="text-slate-300 font-mono">{ask.volume.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
