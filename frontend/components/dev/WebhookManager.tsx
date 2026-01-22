'use client';

import { useState } from 'react';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered?: Date;
  successRate: number;
  secret: string;
}

export default function WebhookManager() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      url: 'https://api.example.com/webhooks/trades',
      events: ['trade.created', 'trade.settled'],
      active: true,
      lastTriggered: new Date(Date.now() - 3600000),
      successRate: 98.5,
      secret: 'whsec_***********************'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ url: '', events: [] as string[] });

  const availableEvents = [
    { id: 'trade.created', label: 'Trade Created' },
    { id: 'trade.settled', label: 'Trade Settled' },
    { id: 'market.created', label: 'Market Created' },
    { id: 'market.resolved', label: 'Market Resolved' },
    { id: 'user.registered', label: 'User Registered' },
    { id: 'position.liquidated', label: 'Position Liquidated' }
  ];

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(w => 
      w.id === id ? { ...w, active: !w.active } : w
    ));
  };

  const deleteWebhook = (id: string) => {
    if (confirm('Delete this webhook?')) {
      setWebhooks(prev => prev.filter(w => w.id !== id));
    }
  };

  const testWebhook = async (id: string) => {
    const webhook = webhooks.find(w => w.id === id);
    if (!webhook) return;

    try {
      await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhook.url })
      });
      alert('Test webhook sent successfully!');
    } catch (error) {
      alert('Failed to send test webhook');
    }
  };

  const addWebhook = () => {
    if (!newWebhook.url || newWebhook.events.length === 0) {
      alert('Please provide URL and select at least one event');
      return;
    }

    const webhook: Webhook = {
      id: Date.now().toString(),
      url: newWebhook.url,
      events: newWebhook.events,
      active: true,
      successRate: 100,
      secret: 'whsec_' + Math.random().toString(36).substring(2)
    };

    setWebhooks(prev => [...prev, webhook]);
    setNewWebhook({ url: '', events: [] });
    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Webhook Manager</h2>
          <p className="text-sm text-gray-600">Configure webhooks for real-time event notifications</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Webhook
        </button>
      </div>

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.map(webhook => (
          <div key={webhook.id} className="border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`w-3 h-3 rounded-full ${webhook.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <code className="text-blue-600 font-mono text-sm">{webhook.url}</code>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {webhook.events.map(event => (
                    <span key={event} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                      {event}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  <div>
                    <span className="text-gray-600">Success Rate:</span>
                    <span className={`ml-2 font-semibold ${
                      webhook.successRate >= 95 ? 'text-green-600' : 
                      webhook.successRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {webhook.successRate}%
                    </span>
                  </div>
                  {webhook.lastTriggered && (
                    <div>
                      <span className="text-gray-600">Last Triggered:</span>
                      <span className="ml-2 text-gray-900">
                        {webhook.lastTriggered.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <span className="text-gray-600 text-sm">Secret:</span>
                  <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{webhook.secret}</code>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => toggleWebhook(webhook.id)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    webhook.active
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {webhook.active ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => testWebhook(webhook.id)}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded text-sm font-medium hover:bg-blue-200"
                >
                  Test
                </button>
                <button
                  onClick={() => deleteWebhook(webhook.id)}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-medium hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {webhooks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No webhooks configured. Click "Add Webhook" to get started.
          </div>
        )}
      </div>

      {/* Add Webhook Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Webhook</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                value={newWebhook.url}
                onChange={e => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://api.example.com/webhooks"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Events to Subscribe
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableEvents.map(event => (
                  <label key={event.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newWebhook.events.includes(event.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setNewWebhook(prev => ({ ...prev, events: [...prev.events, event.id] }));
                        } else {
                          setNewWebhook(prev => ({ ...prev, events: prev.events.filter(ev => ev !== event.id) }));
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{event.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={addWebhook}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Webhook
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
