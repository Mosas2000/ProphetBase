'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export function CustomDashboard() {
  const [layout, setLayout] = useState('default');

  const availableWidgets = [
    { id: '1', name: 'AI Insights', category: 'analytics', size: 'large' },
    { id: '2', name: 'Sentiment Gauge', category: 'analytics', size: 'medium' },
    { id: '3', name: 'Flow Tracker', category: 'analytics', size: 'medium' },
    { id: '4', name: 'Top Markets', category: 'markets', size: 'small' },
    { id: '5', name: 'Portfolio Summary', category: 'portfolio', size: 'medium' },
  ];

  const savedLayouts = [
    { id: '1', name: 'Trading Dashboard', widgets: 5, shared: false },
    { id: '2', name: 'Analytics Focus', widgets: 3, shared: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Custom Dashboard</h3>
              <p className="text-gray-400">Build your personalized analytics dashboard</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary">Save Layout</Button>
              <Button>Share Dashboard</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Dashboard Canvas */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Dashboard Canvas</h4>
          
          <div className="bg-gray-900 rounded-lg p-8 min-h-96 border-2 border-dashed border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              {/* Example Widgets */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium">AI Insights</p>
                  <button className="text-gray-400 hover:text-white">⋮</button>
                </div>
                <div className="h-32 flex items-center justify-center text-gray-500">
                  Widget Content
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium">Sentiment Gauge</p>
                  <button className="text-gray-400 hover:text-white">⋮</button>
                </div>
                <div className="h-32 flex items-center justify-center text-gray-500">
                  Widget Content
                </div>
              </div>

              <div className="col-span-2 bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium">Flow Tracker</p>
                  <button className="text-gray-400 hover:text-white">⋮</button>
                </div>
                <div className="h-32 flex items-center justify-center text-gray-500">
                  Widget Content
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Drag and drop widgets to customize</p>
              <Button size="sm" variant="secondary">+ Add Widget</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Available Widgets */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Available Widgets</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {availableWidgets.map(widget => (
              <div key={widget.id} className="p-3 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{widget.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{widget.category}</p>
                  </div>
                  <Badge variant="default" className="text-xs">{widget.size}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Saved Layouts */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Saved Layouts</h4>
          
          <div className="space-y-2">
            {savedLayouts.map(layout => (
              <div key={layout.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{layout.name}</p>
                    {layout.shared && <Badge variant="default" className="text-xs">Shared</Badge>}
                  </div>
                  <p className="text-sm text-gray-400">{layout.widgets} widgets</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">Load</Button>
                  <Button size="sm" variant="secondary">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
