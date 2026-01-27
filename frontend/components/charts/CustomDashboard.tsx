'use client';

import {
  LayoutGrid,
  Maximize2,
  Minimize2,
  Plus,
  Save,
  Settings,
  Upload,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface Widget {
  id: string;
  type: 'chart' | 'stats' | 'heatmap' | 'depth' | 'volume' | 'correlation';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minimized: boolean;
}

interface Layout {
  id: string;
  name: string;
  widgets: Widget[];
}

export default function CustomDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: '1',
      type: 'chart',
      title: 'Price Chart',
      position: { x: 0, y: 0 },
      size: { width: 600, height: 400 },
      minimized: false,
    },
    {
      id: '2',
      type: 'stats',
      title: 'Market Stats',
      position: { x: 620, y: 0 },
      size: { width: 300, height: 200 },
      minimized: false,
    },
    {
      id: '3',
      type: 'volume',
      title: 'Volume Profile',
      position: { x: 0, y: 420 },
      size: { width: 450, height: 300 },
      minimized: false,
    },
  ]);

  const [savedLayouts, setSavedLayouts] = useState<Layout[]>([
    { id: '1', name: 'Default', widgets: [...widgets] },
    { id: '2', name: 'Trading View', widgets: [] },
    { id: '3', name: 'Analysis', widgets: [] },
  ]);

  const [selectedLayout, setSelectedLayout] = useState('1');
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const widgetLibrary = [
    { type: 'chart', title: 'Price Chart', icon: '📈' },
    { type: 'stats', title: 'Market Stats', icon: '📊' },
    { type: 'heatmap', title: 'Heatmap', icon: '🔥' },
    { type: 'depth', title: 'Order Book', icon: '📚' },
    { type: 'volume', title: 'Volume Profile', icon: '📉' },
    { type: 'correlation', title: 'Correlation Matrix', icon: '🔗' },
  ];

  const addWidget = (type: string, title: string) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: type as Widget['type'],
      title,
      position: { x: 50, y: 50 },
      size: { width: 400, height: 300 },
      minimized: false,
    };
    setWidgets([...widgets, newWidget]);
    setShowWidgetLibrary(false);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id));
  };

  const toggleMinimize = (id: string) => {
    setWidgets(
      widgets.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w))
    );
  };

  const handleMouseDown = (e: React.MouseEvent, widgetId: string) => {
    const widget = widgets.find((w) => w.id === widgetId);
    if (!widget) return;

    setDraggedWidget(widgetId);
    setDragOffset({
      x: e.clientX - widget.position.x,
      y: e.clientY - widget.position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedWidget) return;

    setWidgets(
      widgets.map((w) =>
        w.id === draggedWidget
          ? {
              ...w,
              position: {
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y,
              },
            }
          : w
      )
    );
  };

  const handleMouseUp = () => {
    setDraggedWidget(null);
  };

  const saveCurrentLayout = () => {
    const layoutName = prompt('Enter layout name:');
    if (!layoutName) return;

    const newLayout: Layout = {
      id: Date.now().toString(),
      name: layoutName,
      widgets: [...widgets],
    };

    setSavedLayouts([...savedLayouts, newLayout]);
  };

  const loadLayout = (layoutId: string) => {
    const layout = savedLayouts.find((l) => l.id === layoutId);
    if (layout) {
      setWidgets([...layout.widgets]);
      setSelectedLayout(layoutId);
    }
  };

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case 'chart':
        return (
          <svg width="100%" height="100%" viewBox="0 0 400 250">
            {/* Simple candlestick chart */}
            {Array.from({ length: 20 }).map((_, i) => {
              const x = 20 + i * 18;
              const open = 100 + Math.random() * 100;
              const close = open + (Math.random() - 0.5) * 40;
              const high = Math.max(open, close) + Math.random() * 20;
              const low = Math.min(open, close) - Math.random() * 20;
              const isGreen = close > open;

              return (
                <g key={i}>
                  <line
                    x1={x + 6}
                    y1={high}
                    x2={x + 6}
                    y2={low}
                    stroke={isGreen ? '#10b981' : '#ef4444'}
                    strokeWidth="1"
                  />
                  <rect
                    x={x + 2}
                    y={Math.min(open, close)}
                    width="8"
                    height={Math.abs(close - open) || 1}
                    fill={isGreen ? '#10b981' : '#ef4444'}
                  />
                </g>
              );
            })}
          </svg>
        );

      case 'stats':
        return (
          <div className="p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Price</span>
              <span className="font-bold text-green-400">$50,234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">24h Change</span>
              <span className="font-bold text-green-400">+3.24%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Volume</span>
              <span className="font-bold">$2.4B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Market Cap</span>
              <span className="font-bold">$980B</span>
            </div>
          </div>
        );

      case 'heatmap':
        return (
          <div className="p-4">
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded"
                  style={{
                    backgroundColor: `rgba(99, 102, 241, ${Math.random()})`,
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'depth':
        return (
          <svg width="100%" height="100%" viewBox="0 0 400 250">
            <defs>
              <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="askGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M 50,250 L 50,150 L 100,130 L 150,100 L 200,80 L 200,250 Z"
              fill="url(#bidGrad)"
            />
            <path
              d="M 200,250 L 200,90 L 250,110 L 300,140 L 350,160 L 350,250 Z"
              fill="url(#askGrad)"
            />
          </svg>
        );

      case 'volume':
        return (
          <svg width="100%" height="100%" viewBox="0 0 400 250">
            {Array.from({ length: 25 }).map((_, i) => {
              const height = 50 + Math.random() * 150;
              return (
                <rect
                  key={i}
                  x={i * 16}
                  y={250 - height}
                  width="14"
                  height={height}
                  fill="#06b6d4"
                  opacity="0.7"
                />
              );
            })}
          </svg>
        );

      case 'correlation':
        return (
          <div className="p-4">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 25 }).map((_, i) => {
                const val = Math.random() * 2 - 1;
                const color =
                  val > 0
                    ? `rgba(16, 185, 129, ${Math.abs(val)})`
                    : `rgba(239, 68, 68, ${Math.abs(val)})`;

                return (
                  <div
                    key={i}
                    className="aspect-square rounded flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {val.toFixed(1)}
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return <div className="p-4 text-slate-400">Widget content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl">
              <LayoutGrid className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Custom Dashboard</h1>
              <p className="text-sm text-slate-400">
                Drag and drop widgets to customize your view
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWidgetLibrary(!showWidgetLibrary)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Widget</span>
            </button>
            <button
              onClick={saveCurrentLayout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Layout</span>
            </button>
          </div>
        </div>

        {/* Saved Layouts */}
        <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700">
          <Upload className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400 mr-2">Layouts:</span>
          {savedLayouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => loadLayout(layout.id)}
              className={`px-3 py-1.5 rounded transition-colors text-sm ${
                selectedLayout === layout.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {layout.name}
            </button>
          ))}
        </div>
      </div>

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Widget Library</h2>
              <button
                onClick={() => setShowWidgetLibrary(false)}
                className="p-2 hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {widgetLibrary.map((widget, idx) => (
                <button
                  key={idx}
                  onClick={() => addWidget(widget.type, widget.title)}
                  className="p-6 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors text-center"
                >
                  <div className="text-4xl mb-2">{widget.icon}</div>
                  <div className="font-medium">{widget.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Canvas */}
      <div
        className="relative bg-slate-800/30 rounded-xl border border-slate-700 overflow-auto"
        style={{ height: 'calc(100vh - 200px)' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className="absolute bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden"
            style={{
              left: widget.position.x,
              top: widget.position.y,
              width: widget.minimized ? 300 : widget.size.width,
              height: widget.minimized ? 50 : widget.size.height,
              cursor: draggedWidget === widget.id ? 'grabbing' : 'grab',
            }}
          >
            {/* Widget Header */}
            <div
              className="flex items-center justify-between p-3 bg-slate-700/50 border-b border-slate-600 cursor-grab"
              onMouseDown={(e) => handleMouseDown(e, widget.id)}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-sm">{widget.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMinimize(widget.id)}
                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {widget.minimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => removeWidget(widget.id)}
                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Widget Content */}
            {!widget.minimized && (
              <div
                className="overflow-auto"
                style={{ height: widget.size.height - 50 }}
              >
                {renderWidgetContent(widget)}
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {widgets.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <LayoutGrid className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">
                Empty Dashboard
              </h3>
              <p className="text-slate-500 mb-4">Add widgets to get started</p>
              <button
                onClick={() => setShowWidgetLibrary(true)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Add Your First Widget
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700 text-sm text-slate-300">
        <strong>Tips:</strong> Drag widgets to reposition • Click
        minimize/maximize to adjust size • Save layouts for quick access • Add
        multiple widgets of the same type
      </div>
    </div>
  );
}
