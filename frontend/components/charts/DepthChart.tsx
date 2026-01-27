'use client';

import { Activity, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrderBookLevel {
  price: number;
  volume: number;
  total: number;
}

interface DepthData {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  midPrice: number;
  spread: number;
}

export default function DepthChart() {
  const [depthData, setDepthData] = useState<DepthData>({
    bids: [],
    asks: [],
    midPrice: 50000,
    spread: 0,
  });
  const [hoveredLevel, setHoveredLevel] = useState<{
    price: number;
    volume: number;
    side: 'bid' | 'ask';
  } | null>(null);
  const [maxDepth, setMaxDepth] = useState(50);

  // Generate order book data
  useEffect(() => {
    const generateDepthData = () => {
      const midPrice = 50000 + (Math.random() - 0.5) * 100;
      const bids: OrderBookLevel[] = [];
      const asks: OrderBookLevel[] = [];

      let bidTotal = 0;
      let askTotal = 0;

      // Generate bids (buy orders)
      for (let i = 0; i < maxDepth; i++) {
        const price = midPrice - (i + 1) * 10;
        const volume = Math.random() * 5 + 0.5;
        bidTotal += volume;
        bids.push({ price, volume, total: bidTotal });
      }

      // Generate asks (sell orders)
      for (let i = 0; i < maxDepth; i++) {
        const price = midPrice + (i + 1) * 10;
        const volume = Math.random() * 5 + 0.5;
        askTotal += volume;
        asks.push({ price, volume, total: askTotal });
      }

      const spread = asks[0].price - bids[0].price;

      setDepthData({ bids, asks, midPrice, spread });
    };

    generateDepthData();
    const interval = setInterval(generateDepthData, 2000);
    return () => clearInterval(interval);
  }, [maxDepth]);

  const maxTotal = Math.max(
    depthData.bids[depthData.bids.length - 1]?.total || 0,
    depthData.asks[depthData.asks.length - 1]?.total || 0
  );

  const chartWidth = 700;
  const chartHeight = 400;
  const midX = chartWidth / 2;

  // Calculate support and resistance zones
  const supportZones = depthData.bids
    .filter((_, i) => i % 5 === 0)
    .filter((bid) => bid.volume > 3)
    .slice(0, 3);

  const resistanceZones = depthData.asks
    .filter((_, i) => i % 5 === 0)
    .filter((ask) => ask.volume > 3)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl">
              <Activity className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Depth Chart
                  </h1>
                  <p className="text-slate-400">
                    Real-time order book visualization with liquidity zones
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Live</span>
                </button>
              </div>
            </div>
          </div>

          {/* Price Info */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">Mid Price</div>
                <div className="text-2xl font-bold">
                  ${depthData.midPrice.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Spread</div>
                <div className="text-2xl font-bold text-amber-400">
                  ${depthData.spread.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Spread %</div>
                <div className="text-2xl font-bold text-amber-400">
                  {((depthData.spread / depthData.midPrice) * 100).toFixed(3)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Depth Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Order Book Depth</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Depth:</span>
              {[25, 50, 100].map((depth) => (
                <button
                  key={depth}
                  onClick={() => setMaxDepth(depth)}
                  className={`px-3 py-1.5 rounded transition-colors text-sm ${
                    maxDepth === depth
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {depth}
                </button>
              ))}
            </div>
          </div>

          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            {/* Background grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={`grid-${ratio}`}
                x1="0"
                y1={chartHeight * ratio}
                x2={chartWidth}
                y2={chartHeight * ratio}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4"
              />
            ))}

            {/* Support zones (bids) */}
            {supportZones.map((zone, idx) => {
              const y = chartHeight - (zone.total / maxTotal) * chartHeight;
              return (
                <rect
                  key={`support-${idx}`}
                  x="0"
                  y={y - 20}
                  width={midX}
                  height="40"
                  fill="rgba(16, 185, 129, 0.1)"
                  stroke="rgba(16, 185, 129, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              );
            })}

            {/* Resistance zones (asks) */}
            {resistanceZones.map((zone, idx) => {
              const y = chartHeight - (zone.total / maxTotal) * chartHeight;
              return (
                <rect
                  key={`resistance-${idx}`}
                  x={midX}
                  y={y - 20}
                  width={midX}
                  height="40"
                  fill="rgba(239, 68, 68, 0.1)"
                  stroke="rgba(239, 68, 68, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              );
            })}

            {/* Bid area (green) */}
            <path
              d={`
                M ${midX},${chartHeight}
                ${depthData.bids
                  .slice()
                  .reverse()
                  .map((bid, i) => {
                    const x = midX - (i / depthData.bids.length) * midX;
                    const y =
                      chartHeight - (bid.total / maxTotal) * chartHeight;
                    return `L ${x},${y}`;
                  })
                  .join(' ')}
                L 0,${chartHeight}
                Z
              `}
              fill="url(#bidGradient)"
              stroke="#10b981"
              strokeWidth="2"
            />

            {/* Ask area (red) */}
            <path
              d={`
                M ${midX},${chartHeight}
                ${depthData.asks
                  .map((ask, i) => {
                    const x = midX + (i / depthData.asks.length) * midX;
                    const y =
                      chartHeight - (ask.total / maxTotal) * chartHeight;
                    return `L ${x},${y}`;
                  })
                  .join(' ')}
                L ${chartWidth},${chartHeight}
                Z
              `}
              fill="url(#askGradient)"
              stroke="#ef4444"
              strokeWidth="2"
            />

            {/* Mid price line */}
            <line
              x1={midX}
              y1="0"
              x2={midX}
              y2={chartHeight}
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="8 4"
            />

            {/* Hover indicators */}
            {depthData.bids
              .slice()
              .reverse()
              .map((bid, i) => {
                const x = midX - (i / depthData.bids.length) * midX;
                const y = chartHeight - (bid.total / maxTotal) * chartHeight;
                return (
                  <circle
                    key={`bid-point-${i}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#10b981"
                    opacity="0"
                    className="cursor-pointer hover:opacity-100"
                    onMouseEnter={() =>
                      setHoveredLevel({
                        price: bid.price,
                        volume: bid.volume,
                        side: 'bid',
                      })
                    }
                    onMouseLeave={() => setHoveredLevel(null)}
                  />
                );
              })}

            {depthData.asks.map((ask, i) => {
              const x = midX + (i / depthData.asks.length) * midX;
              const y = chartHeight - (ask.total / maxTotal) * chartHeight;
              return (
                <circle
                  key={`ask-point-${i}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#ef4444"
                  opacity="0"
                  className="cursor-pointer hover:opacity-100"
                  onMouseEnter={() =>
                    setHoveredLevel({
                      price: ask.price,
                      volume: ask.volume,
                      side: 'ask',
                    })
                  }
                  onMouseLeave={() => setHoveredLevel(null)}
                />
              );
            })}

            {/* Gradients */}
            <defs>
              <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Price labels */}
            <text x="5" y="20" fill="#10b981" fontSize="12" fontWeight="600">
              Bids: ${depthData.bids[0]?.price.toFixed(2)}
            </text>
            <text
              x={chartWidth - 5}
              y="20"
              textAnchor="end"
              fill="#ef4444"
              fontSize="12"
              fontWeight="600"
            >
              Asks: ${depthData.asks[0]?.price.toFixed(2)}
            </text>
            <text
              x={midX}
              y="20"
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="12"
              fontWeight="600"
            >
              Mid: ${depthData.midPrice.toFixed(2)}
            </text>
          </svg>

          {/* Hover info */}
          {hoveredLevel && (
            <div className="mt-4 bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Side</div>
                  <div
                    className={`font-bold ${
                      hoveredLevel.side === 'bid'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {hoveredLevel.side === 'bid' ? 'BID' : 'ASK'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Price</div>
                  <div className="font-bold">
                    ${hoveredLevel.price.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Volume</div>
                  <div className="font-bold">
                    {hoveredLevel.volume.toFixed(3)} BTC
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="font-bold text-slate-300">Bid Liquidity</h3>
            </div>
            <div className="text-2xl font-bold mb-1 text-green-400">
              {depthData.bids[depthData.bids.length - 1]?.total.toFixed(2)} BTC
            </div>
            <div className="text-sm text-slate-400">
              $
              {(
                (depthData.bids[depthData.bids.length - 1]?.total *
                  depthData.midPrice) /
                1000
              ).toFixed(1)}
              K
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <h3 className="font-bold text-slate-300">Ask Liquidity</h3>
            </div>
            <div className="text-2xl font-bold mb-1 text-red-400">
              {depthData.asks[depthData.asks.length - 1]?.total.toFixed(2)} BTC
            </div>
            <div className="text-sm text-slate-400">
              $
              {(
                (depthData.asks[depthData.asks.length - 1]?.total *
                  depthData.midPrice) /
                1000
              ).toFixed(1)}
              K
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-slate-300">Support Zones</h3>
            </div>
            <div className="text-2xl font-bold mb-1">{supportZones.length}</div>
            <div className="text-sm text-slate-400">Strong buy walls</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-red-400" />
              <h3 className="font-bold text-slate-300">Resistance Zones</h3>
            </div>
            <div className="text-2xl font-bold mb-1">
              {resistanceZones.length}
            </div>
            <div className="text-sm text-slate-400">Strong sell walls</div>
          </div>
        </div>
      </div>
    </div>
  );
}
