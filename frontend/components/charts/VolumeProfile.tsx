'use client';

import { Activity, BarChart3, Target, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface VolumeNode {
  price: number;
  volume: number;
  percentage: number;
}

interface ValueArea {
  high: number;
  low: number;
  poc: number;
}

export default function VolumeProfile() {
  const [timeframe, setTimeframe] = useState('1D');
  const [priceRange, setPriceRange] = useState({ min: 49000, max: 51000 });
  const [hoveredNode, setHoveredNode] = useState<VolumeNode | null>(null);
  const [volumeProfile, setVolumeProfile] = useState<VolumeNode[]>([]);
  const [valueArea, setValueArea] = useState<ValueArea>({
    high: 50500,
    low: 49500,
    poc: 50000,
  });

  useEffect(() => {
    const numBins = 50;
    const priceStep = (priceRange.max - priceRange.min) / numBins;
    let totalVolume = 0;

    const nodes: VolumeNode[] = [];

    for (let i = 0; i < numBins; i++) {
      const price = priceRange.min + i * priceStep;
      const distanceFromCenter = Math.abs(
        price - (priceRange.min + priceRange.max) / 2
      );
      const centerWeight =
        1 - distanceFromCenter / ((priceRange.max - priceRange.min) / 2);
      const volume = (Math.random() * 50 + centerWeight * 100) * 1000;
      totalVolume += volume;

      nodes.push({
        price,
        volume,
        percentage: 0,
      });
    }

    nodes.forEach((node) => {
      node.percentage = (node.volume / totalVolume) * 100;
    });

    const poc = nodes.reduce((max, node) =>
      node.volume > max.volume ? node : max
    );

    const sortedByVolume = [...nodes].sort((a, b) => b.volume - a.volume);
    let valueAreaVolume = 0;
    const valueAreaPrices: number[] = [];

    for (const node of sortedByVolume) {
      valueAreaPrices.push(node.price);
      valueAreaVolume += node.volume;
      if (valueAreaVolume >= totalVolume * 0.7) break;
    }

    setValueArea({
      poc: poc.price,
      high: Math.max(...valueAreaPrices),
      low: Math.min(...valueAreaPrices),
    });

    setVolumeProfile(nodes);
  }, [timeframe, priceRange]);

  const maxVolume = Math.max(...volumeProfile.map((n) => n.volume));
  const chartHeight = 600;
  const chartWidth = 800;
  const profileWidth = 300;

  const volumeNodes = volumeProfile.filter((n) => n.percentage > 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-xl">
              <BarChart3 className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Volume Profile</h1>
              <p className="text-slate-400">
                Price distribution analysis with point of control and value area
              </p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                {['5m', '15m', '1H', '4H', '1D', '1W'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1.5 rounded transition-colors text-sm ${
                      timeframe === tf
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-cyan-500" />
                  <span>Volume</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-500" />
                  <span>POC</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-500/50" />
                  <span>Value Area</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Volume Profile Analysis</h2>
            <p className="text-sm text-slate-400">
              Horizontal volume distribution across price levels
            </p>
          </div>

          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            <line
              x1="100"
              y1="50"
              x2="100"
              y2={chartHeight - 50}
              stroke="#475569"
              strokeWidth="2"
            />

            <rect
              x="100"
              y={
                50 +
                ((priceRange.max - valueArea.high) /
                  (priceRange.max - priceRange.min)) *
                  (chartHeight - 100)
              }
              width={profileWidth}
              height={
                ((valueArea.high - valueArea.low) /
                  (priceRange.max - priceRange.min)) *
                (chartHeight - 100)
              }
              fill="rgba(168, 85, 247, 0.15)"
              stroke="rgba(168, 85, 247, 0.4)"
              strokeWidth="2"
              strokeDasharray="4"
            />

            {volumeProfile.map((node, idx) => {
              const y =
                50 +
                ((priceRange.max - node.price) /
                  (priceRange.max - priceRange.min)) *
                  (chartHeight - 100);
              const barWidth = (node.volume / maxVolume) * profileWidth;
              const isPOC = Math.abs(node.price - valueArea.poc) < 10;

              return (
                <g key={idx}>
                  <rect
                    x="100"
                    y={y - 5}
                    width={barWidth}
                    height="10"
                    fill={isPOC ? '#f59e0b' : '#06b6d4'}
                    opacity={hoveredNode === node ? 1 : 0.7}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                  />
                  {hoveredNode === node && (
                    <rect
                      x="100"
                      y={y - 5}
                      width={barWidth}
                      height="10"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}

            <line
              x1="100"
              y1={
                50 +
                ((priceRange.max - valueArea.poc) /
                  (priceRange.max - priceRange.min)) *
                  (chartHeight - 100)
              }
              x2={chartWidth - 50}
              y2={
                50 +
                ((priceRange.max - valueArea.poc) /
                  (priceRange.max - priceRange.min)) *
                  (chartHeight - 100)
              }
              stroke="#f59e0b"
              strokeWidth="3"
              strokeDasharray="8 4"
            />

            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const price =
                priceRange.min + (priceRange.max - priceRange.min) * ratio;
              const y = 50 + (1 - ratio) * (chartHeight - 100);

              return (
                <g key={ratio}>
                  <line
                    x1="95"
                    y1={y}
                    x2="105"
                    y2={y}
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                  <text
                    x="85"
                    y={y + 5}
                    textAnchor="end"
                    fill="#94a3b8"
                    fontSize="12"
                  >
                    ${price.toFixed(0)}
                  </text>
                </g>
              );
            })}

            <text
              x={100 + profileWidth / 2}
              y="35"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="12"
              fontWeight="600"
            >
              Volume Distribution
            </text>

            <g transform={`translate(${100 + profileWidth + 50}, 0)`}>
              {Array.from({ length: 20 }).map((_, i) => {
                const x = i * 15;
                const open =
                  priceRange.min +
                  Math.random() * (priceRange.max - priceRange.min);
                const close = open + (Math.random() - 0.5) * 200;
                const high = Math.max(open, close) + Math.random() * 100;
                const low = Math.min(open, close) - Math.random() * 100;

                const openY =
                  50 +
                  ((priceRange.max - open) /
                    (priceRange.max - priceRange.min)) *
                    (chartHeight - 100);
                const closeY =
                  50 +
                  ((priceRange.max - close) /
                    (priceRange.max - priceRange.min)) *
                    (chartHeight - 100);
                const highY =
                  50 +
                  ((priceRange.max - high) /
                    (priceRange.max - priceRange.min)) *
                    (chartHeight - 100);
                const lowY =
                  50 +
                  ((priceRange.max - low) / (priceRange.max - priceRange.min)) *
                    (chartHeight - 100);

                const isGreen = close > open;

                return (
                  <g key={i}>
                    <line
                      x1={x + 6}
                      y1={highY}
                      x2={x + 6}
                      y2={lowY}
                      stroke={isGreen ? '#10b981' : '#ef4444'}
                      strokeWidth="1"
                    />
                    <rect
                      x={x + 2}
                      y={Math.min(openY, closeY)}
                      width="8"
                      height={Math.abs(closeY - openY) || 1}
                      fill={isGreen ? '#10b981' : '#ef4444'}
                    />
                  </g>
                );
              })}
            </g>

            <text
              x={100 + profileWidth + 180}
              y="35"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="12"
              fontWeight="600"
            >
              Price Action
            </text>
          </svg>

          {hoveredNode && (
            <div className="mt-4 bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Price Level</div>
                  <div className="font-bold text-lg">
                    ${hoveredNode.price.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Volume</div>
                  <div className="font-bold text-cyan-400">
                    {(hoveredNode.volume / 1000).toFixed(1)}K
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">% of Total</div>
                  <div className="font-bold">
                    {hoveredNode.percentage.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-slate-300">Point of Control</h3>
            </div>
            <div className="text-2xl font-bold mb-1 text-amber-400">
              ${valueArea.poc.toFixed(2)}
            </div>
            <div className="text-sm text-slate-400">Highest volume price</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-slate-300">Value Area High</h3>
            </div>
            <div className="text-2xl font-bold mb-1 text-purple-400">
              ${valueArea.high.toFixed(2)}
            </div>
            <div className="text-sm text-slate-400">Top 70% volume</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400 rotate-180" />
              <h3 className="font-bold text-slate-300">Value Area Low</h3>
            </div>
            <div className="text-2xl font-bold mb-1 text-purple-400">
              ${valueArea.low.toFixed(2)}
            </div>
            <div className="text-sm text-slate-400">Bottom 70% volume</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-slate-300">Volume Nodes</h3>
            </div>
            <div className="text-2xl font-bold mb-1">{volumeNodes.length}</div>
            <div className="text-sm text-slate-400">Significant levels</div>
          </div>
        </div>

        <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="font-bold mb-3">Understanding Volume Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
            <div>
              <strong className="text-amber-400">
                Point of Control (POC):
              </strong>{' '}
              The price level with the highest traded volume. Acts as a strong
              support/resistance level.
            </div>
            <div>
              <strong className="text-purple-400">Value Area:</strong> The price
              range where 70% of the volume was traded. Represents fair value
              according to market participants.
            </div>
            <div>
              <strong className="text-cyan-400">Volume Nodes:</strong> Price
              levels with significantly high volume. These act as magnetic zones
              for price action.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
