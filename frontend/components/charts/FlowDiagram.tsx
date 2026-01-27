'use client';

import { Download, Filter, GitBranch, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface FlowNode {
  id: string;
  label: string;
  value: number;
  level: number;
  type: 'source' | 'intermediate' | 'destination';
}

interface FlowLink {
  source: string;
  target: string;
  value: number;
}

export default function FlowDiagram() {
  const [timeRange, setTimeRange] = useState('24h');
  const [minFlow, setMinFlow] = useState(100000);
  const [selectedFlow, setSelectedFlow] = useState<FlowLink | null>(null);

  // Generate Sankey diagram data
  const [flowData] = useState<{ nodes: FlowNode[]; links: FlowLink[] }>(() => {
    const nodes: FlowNode[] = [
      // Sources (Level 0)
      {
        id: 'btc-pool',
        label: 'BTC Pool',
        value: 5000000,
        level: 0,
        type: 'source',
      },
      {
        id: 'eth-pool',
        label: 'ETH Pool',
        value: 3000000,
        level: 0,
        type: 'source',
      },
      {
        id: 'stable-pool',
        label: 'Stablecoin',
        value: 2000000,
        level: 0,
        type: 'source',
      },

      // Intermediates (Level 1)
      {
        id: 'dex-1',
        label: 'DEX Alpha',
        value: 4000000,
        level: 1,
        type: 'intermediate',
      },
      {
        id: 'dex-2',
        label: 'DEX Beta',
        value: 3500000,
        level: 1,
        type: 'intermediate',
      },
      {
        id: 'cex-1',
        label: 'CEX Gamma',
        value: 2500000,
        level: 1,
        type: 'intermediate',
      },

      // Destinations (Level 2)
      {
        id: 'market-1',
        label: 'Market A',
        value: 3000000,
        level: 2,
        type: 'destination',
      },
      {
        id: 'market-2',
        label: 'Market B',
        value: 2500000,
        level: 2,
        type: 'destination',
      },
      {
        id: 'market-3',
        label: 'Market C',
        value: 2000000,
        level: 2,
        type: 'destination',
      },
      {
        id: 'liquidity',
        label: 'Liquidity',
        value: 2500000,
        level: 2,
        type: 'destination',
      },
    ];

    const links: FlowLink[] = [
      // Source to intermediate
      { source: 'btc-pool', target: 'dex-1', value: 2500000 },
      { source: 'btc-pool', target: 'dex-2', value: 1500000 },
      { source: 'btc-pool', target: 'cex-1', value: 1000000 },
      { source: 'eth-pool', target: 'dex-1', value: 1500000 },
      { source: 'eth-pool', target: 'dex-2', value: 1000000 },
      { source: 'eth-pool', target: 'cex-1', value: 500000 },
      { source: 'stable-pool', target: 'dex-2', value: 1000000 },
      { source: 'stable-pool', target: 'cex-1', value: 1000000 },

      // Intermediate to destination
      { source: 'dex-1', target: 'market-1', value: 1500000 },
      { source: 'dex-1', target: 'market-2', value: 1500000 },
      { source: 'dex-1', target: 'liquidity', value: 1000000 },
      { source: 'dex-2', target: 'market-2', value: 1000000 },
      { source: 'dex-2', target: 'market-3', value: 1500000 },
      { source: 'dex-2', target: 'liquidity', value: 1000000 },
      { source: 'cex-1', target: 'market-1', value: 1500000 },
      { source: 'cex-1', target: 'market-3', value: 500000 },
      { source: 'cex-1', target: 'liquidity', value: 500000 },
    ];

    return { nodes, links };
  });

  const filteredLinks = flowData.links.filter((link) => link.value >= minFlow);

  // Calculate node positions
  const getNodePosition = (node: FlowNode) => {
    const nodesAtLevel = flowData.nodes.filter((n) => n.level === node.level);
    const index = nodesAtLevel.indexOf(node);
    const levelX = 100 + node.level * 300;
    const levelY = 50 + (index + 1) * (500 / (nodesAtLevel.length + 1));
    return { x: levelX, y: levelY };
  };

  // Calculate link path
  const getLinkPath = (link: FlowLink) => {
    const sourceNode = flowData.nodes.find((n) => n.id === link.source);
    const targetNode = flowData.nodes.find((n) => n.id === link.target);
    if (!sourceNode || !targetNode) return '';

    const source = getNodePosition(sourceNode);
    const target = getNodePosition(targetNode);

    const sourceY = source.y;
    const targetY = target.y;
    const width = Math.max(2, (link.value / 5000000) * 40);

    const midX = (source.x + target.x) / 2;

    return `
      M ${source.x + 100},${sourceY - width / 2}
      C ${midX},${sourceY - width / 2} ${midX},${targetY - width / 2} ${
      target.x
    },${targetY - width / 2}
      L ${target.x},${targetY + width / 2}
      C ${midX},${targetY + width / 2} ${midX},${sourceY + width / 2} ${
      source.x + 100
    },${sourceY + width / 2}
      Z
    `;
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'source':
        return '#10b981';
      case 'intermediate':
        return '#6366f1';
      case 'destination':
        return '#f59e0b';
      default:
        return '#94a3b8';
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  const totalFlow = flowData.links.reduce((sum, link) => sum + link.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl">
              <GitBranch className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Flow Diagram</h1>
              <p className="text-slate-400">
                Visualize money flow and trade patterns with Sankey diagrams
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Min Flow:</span>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="50000"
                    value={minFlow}
                    onChange={(e) => setMinFlow(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-sm font-medium">
                    {formatCurrency(minFlow)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {['1h', '24h', '7d', '30d'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1.5 rounded transition-colors text-sm ${
                        timeRange === range
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Money Flow Analysis</h2>
            <p className="text-sm text-slate-400">
              Total Flow: {formatCurrency(totalFlow)}
            </p>
          </div>

          <div className="relative overflow-x-auto">
            <svg width="900" height="550" className="min-w-[900px]">
              {/* Draw links */}
              {filteredLinks.map((link, idx) => (
                <path
                  key={`link-${idx}`}
                  d={getLinkPath(link)}
                  fill="rgba(99, 102, 241, 0.4)"
                  stroke="rgba(99, 102, 241, 0.6)"
                  strokeWidth="1"
                  className="cursor-pointer transition-all hover:fill-indigo-500/60"
                  onMouseEnter={() => setSelectedFlow(link)}
                  onMouseLeave={() => setSelectedFlow(null)}
                  opacity={selectedFlow === link ? 1 : 0.7}
                />
              ))}

              {/* Draw nodes */}
              {flowData.nodes.map((node) => {
                const pos = getNodePosition(node);
                return (
                  <g key={node.id}>
                    <rect
                      x={pos.x}
                      y={pos.y - 30}
                      width="100"
                      height="60"
                      fill={getNodeColor(node.type)}
                      rx="8"
                      opacity="0.9"
                      stroke="#1e293b"
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x + 50}
                      y={pos.y - 5}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {node.label}
                    </text>
                    <text
                      x={pos.x + 50}
                      y={pos.y + 12}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="11"
                    >
                      {formatCurrency(node.value)}
                    </text>
                  </g>
                );
              })}

              {/* Level labels */}
              <text
                x="100"
                y="30"
                fill="#94a3b8"
                fontSize="14"
                fontWeight="600"
              >
                Sources
              </text>
              <text
                x="400"
                y="30"
                fill="#94a3b8"
                fontSize="14"
                fontWeight="600"
              >
                Exchanges
              </text>
              <text
                x="700"
                y="30"
                fill="#94a3b8"
                fontSize="14"
                fontWeight="600"
              >
                Destinations
              </text>
            </svg>
          </div>

          {/* Flow info */}
          {selectedFlow && (
            <div className="mt-4 bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">From</div>
                  <div className="font-bold">
                    {
                      flowData.nodes.find((n) => n.id === selectedFlow.source)
                        ?.label
                    }
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">To</div>
                  <div className="font-bold">
                    {
                      flowData.nodes.find((n) => n.id === selectedFlow.target)
                        ?.label
                    }
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Flow Volume</div>
                  <div className="font-bold text-indigo-400">
                    {formatCurrency(selectedFlow.value)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <h3 className="font-bold">Top Sources</h3>
            </div>
            <div className="space-y-3">
              {flowData.nodes
                .filter((n) => n.type === 'source')
                .sort((a, b) => b.value - a.value)
                .map((node) => (
                  <div
                    key={node.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{node.label}</span>
                    <span className="font-bold text-green-400">
                      {formatCurrency(node.value)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <h3 className="font-bold">Exchanges</h3>
            </div>
            <div className="space-y-3">
              {flowData.nodes
                .filter((n) => n.type === 'intermediate')
                .sort((a, b) => b.value - a.value)
                .map((node) => (
                  <div
                    key={node.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{node.label}</span>
                    <span className="font-bold text-indigo-400">
                      {formatCurrency(node.value)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold">Flow Metrics</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Volume</span>
                <span className="font-semibold">
                  {formatCurrency(totalFlow)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Flows</span>
                <span className="font-semibold">{filteredLinks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Flow Size</span>
                <span className="font-semibold">
                  {formatCurrency(totalFlow / filteredLinks.length)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Largest Flow</span>
                <span className="font-semibold text-indigo-400">
                  {formatCurrency(
                    Math.max(...filteredLinks.map((l) => l.value))
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
