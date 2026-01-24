'use client';

import { Network, Users, TrendingUp, Layers, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Node {
  id: string;
  label: string;
  size: number;
  influence: number;
  type: 'whale' | 'trader' | 'bot' | 'market';
  connections: number;
  volume: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

interface Edge {
  source: string;
  target: string;
  value: number;
  type: 'strong' | 'medium' | 'weak';
}

export default function NetworkGraph() {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 20, y: 30 });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'whale' | 'trader' | 'bot'>('all');
  const [is3D, setIs3D] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate network data
  const [nodes] = useState<Node[]>(() => {
    const nodeTypes: Array<'whale' | 'trader' | 'bot' | 'market'> = ['whale', 'trader', 'bot', 'market'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: `node-${i}`,
      label: `${nodeTypes[i % 4].toUpperCase()}-${i}`,
      size: 10 + Math.random() * 30,
      influence: Math.random() * 100,
      type: nodeTypes[i % 4],
      connections: Math.floor(Math.random() * 10) + 1,
      volume: Math.random() * 1000000,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      z: (Math.random() - 0.5) * 400,
      vx: 0,
      vy: 0,
      vz: 0
    }));
  });

  const [edges] = useState<Edge[]>(() => {
    const newEdges: Edge[] = [];
    nodes.forEach((node, i) => {
      const numConnections = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < numConnections; j++) {
        const targetIdx = Math.floor(Math.random() * nodes.length);
        if (targetIdx !== i) {
          const value = Math.random() * 100;
          newEdges.push({
            source: node.id,
            target: nodes[targetIdx].id,
            value,
            type: value > 70 ? 'strong' : value > 40 ? 'medium' : 'weak'
          });
        }
      }
    });
    return newEdges;
  });

  // Force simulation
  useEffect(() => {
    const interval = setInterval(() => {
      nodes.forEach((node) => {
        // Apply forces
        let fx = 0, fy = 0, fz = 0;

        // Centering force
        fx -= node.x * 0.01;
        fy -= node.y * 0.01;
        fz -= node.z * 0.01;

        // Repulsion from other nodes
        nodes.forEach((other) => {
          if (other.id !== node.id) {
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dz = node.z - other.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1;
            const force = (node.size + other.size) / (dist * dist);
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
            fz += (dz / dist) * force;
          }
        });

        // Attraction along edges
        edges.forEach((edge) => {
          if (edge.source === node.id) {
            const target = nodes.find(n => n.id === edge.target);
            if (target) {
              const dx = target.x - node.x;
              const dy = target.y - node.y;
              const dz = target.z - node.z;
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1;
              const force = edge.value / 1000;
              fx += (dx / dist) * force;
              fy += (dy / dist) * force;
              fz += (dz / dist) * force;
            }
          }
        });

        // Update velocity
        node.vx = (node.vx + fx) * 0.85;
        node.vy = (node.vy + fy) * 0.85;
        node.vz = (node.vz + fz) * 0.85;

        // Update position
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [nodes, edges]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'whale': return '#10b981';
      case 'trader': return '#6366f1';
      case 'bot': return '#f59e0b';
      case 'market': return '#ec4899';
      default: return '#94a3b8';
    }
  };

  const getEdgeColor = (type: string) => {
    switch (type) {
      case 'strong': return 'rgba(99, 102, 241, 0.6)';
      case 'medium': return 'rgba(99, 102, 241, 0.4)';
      case 'weak': return 'rgba(99, 102, 241, 0.2)';
      default: return 'rgba(99, 102, 241, 0.3)';
    }
  };

  const project3D = (x: number, y: number, z: number) => {
    if (!is3D) {
      return { x: x * zoom + 400, y: y * zoom + 300 };
    }

    // Apply rotation
    const cosX = Math.cos((rotation.x * Math.PI) / 180);
    const sinX = Math.sin((rotation.x * Math.PI) / 180);
    const cosY = Math.cos((rotation.y * Math.PI) / 180);
    const sinY = Math.sin((rotation.y * Math.PI) / 180);

    // Rotate around X axis
    let y1 = y * cosX - z * sinX;
    let z1 = y * sinX + z * cosX;

    // Rotate around Y axis
    let x1 = x * cosY + z1 * sinY;
    let z2 = -x * sinY + z1 * cosY;

    // Perspective projection
    const perspective = 800;
    const scale = perspective / (perspective + z2);

    return {
      x: x1 * scale * zoom + 400,
      y: y1 * scale * zoom + 300
    };
  };

  const filteredNodes = filterType === 'all' 
    ? nodes 
    : nodes.filter(n => n.type === filterType);

  const clusters = {
    whale: nodes.filter(n => n.type === 'whale').length,
    trader: nodes.filter(n => n.type === 'trader').length,
    bot: nodes.filter(n => n.type === 'bot').length,
    market: nodes.filter(n => n.type === 'market').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl">
              <Network className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Network Graph</h1>
              <p className="text-slate-400">Visualize trader networks and influence mapping</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded transition-colors ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  All Nodes
                </button>
                <button
                  onClick={() => setFilterType('whale')}
                  className={`px-4 py-2 rounded transition-colors ${
                    filterType === 'whale'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Whales
                </button>
                <button
                  onClick={() => setFilterType('trader')}
                  className={`px-4 py-2 rounded transition-colors ${
                    filterType === 'trader'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Traders
                </button>
                <button
                  onClick={() => setFilterType('bot')}
                  className={`px-4 py-2 rounded transition-colors ${
                    filterType === 'bot'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Bots
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIs3D(!is3D)}
                  className={`px-4 py-2 rounded transition-colors ${
                    is3D
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {is3D ? '3D' : '2D'}
                </button>
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-400 min-w-[60px] text-center">
                  {(zoom * 100).toFixed(0)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Network Visualization */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <svg
            width="800"
            height="600"
            className="w-full"
            onMouseMove={(e) => {
              if (is3D && e.buttons === 1) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setRotation(prev => ({
                  x: prev.x + (y - 300) * 0.01,
                  y: prev.y + (x - 400) * 0.01
                }));
              }
            }}
          >
            {/* Draw edges */}
            {edges.map((edge, idx) => {
              const source = nodes.find(n => n.id === edge.source);
              const target = nodes.find(n => n.id === edge.target);
              if (!source || !target) return null;
              
              if (filterType !== 'all' && source.type !== filterType && target.type !== filterType) {
                return null;
              }

              const sourcePos = project3D(source.x, source.y, source.z);
              const targetPos = project3D(target.x, target.y, target.z);

              return (
                <line
                  key={`edge-${idx}`}
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={getEdgeColor(edge.type)}
                  strokeWidth={edge.type === 'strong' ? 2 : 1}
                />
              );
            })}

            {/* Draw nodes */}
            {filteredNodes.map((node) => {
              const pos = project3D(node.x, node.y, node.z);
              const size = node.size * (is3D ? (800 / (800 + node.z)) : 1);

              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setSelectedNode(node)}
                  onMouseLeave={() => setSelectedNode(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size / 2}
                    fill={getNodeColor(node.type)}
                    opacity={0.8}
                    stroke={selectedNode?.id === node.id ? '#fff' : 'none'}
                    strokeWidth="3"
                  />
                  {selectedNode?.id === node.id && (
                    <>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={size / 2 + 5}
                        fill="none"
                        stroke={getNodeColor(node.type)}
                        strokeWidth="2"
                        opacity="0.5"
                      />
                      <text
                        x={pos.x}
                        y={pos.y - size / 2 - 10}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="12"
                        fontWeight="600"
                      >
                        {node.label}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Node info */}
          {selectedNode && (
            <div className="mt-4 bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Node</div>
                  <div className="font-bold">{selectedNode.label}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Type</div>
                  <div className="font-bold capitalize" style={{ color: getNodeColor(selectedNode.type) }}>
                    {selectedNode.type}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Influence</div>
                  <div className="font-bold text-blue-400">{selectedNode.influence.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Connections</div>
                  <div className="font-bold">{selectedNode.connections}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <h3 className="font-bold text-slate-300">Whales</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{clusters.whale}</div>
            <div className="text-sm text-slate-400">High volume traders</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <h3 className="font-bold text-slate-300">Traders</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{clusters.trader}</div>
            <div className="text-sm text-slate-400">Active participants</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <h3 className="font-bold text-slate-300">Bots</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{clusters.bot}</div>
            <div className="text-sm text-slate-400">Automated trading</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <h3 className="font-bold text-slate-300">Markets</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{clusters.market}</div>
            <div className="text-sm text-slate-400">Trading pairs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
