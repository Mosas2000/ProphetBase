'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  active: boolean;
  secret: string;
  createdAt: string;
  lastTriggered?: string;
  deliveryCount: number;
  failureCount: number;
}

type WebhookEvent = 
  | 'market.created'
  | 'market.resolved'
  | 'trade.executed'
  | 'position.opened'
  | 'position.closed'
  | 'alert.triggered';

export function WebhookManager() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'Trading Bot Webhook',
      url: 'https://api.example.com/webhook',
      events: ['trade.executed', 'position.opened'],
      active: true,
      secret: 'whsec_' + Math.random().toString(36).substring(2, 15),
      createdAt: '2024-01-15',
      lastTriggered: '2024-01-20',
      deliveryCount: 1234,
      failureCount: 5,
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as WebhookEvent[],
  });
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);

  const allEvents: WebhookEvent[] = [
    'market.created',
    'market.resolved',
    'trade.executed',
    'position.opened',
    'position.closed',
    'alert.triggered',
  ];

  const handleCreateWebhook = () => {
    const webhook: Webhook = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      active: true,
      secret: 'whsec_' + Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString().split('T')[0],
      deliveryCount: 0,
      failureCount: 0,
    };

    setWebhooks([...webhooks, webhook]);
    setIsCreating(false);
    setNewWebhook({ name: '', url: '', events: [] });
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(webhooks.map(w => 
      w.id === id ? { ...w, active: !w.active } : w
    ));
  };

  const deleteWebhook = (id: string) => {
    if (confirm('Are you sure you want to delete this webhook?')) {
      setWebhooks(webhooks.filter(w => w.id !== id));
    }
  };

  const testWebhook = async (id: string) => {
    setTestingWebhook(id);
    // Simulate webhook test
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTestingWebhook(null);
    alert('Test webhook sent successfully!');
  };

  const toggleEvent = (event: WebhookEvent) => {
    setNewWebhook({
      ...newWebhook,
      events: newWebhook.events.includes(event)
        ? newWebhook.events.filter(e => e !== event)
        : [...newWebhook.events, event],
    });
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Webhook Manager</h3>
              <p className="text-sm text-gray-400 mt-1">Configure webhooks for real-time event notifications</p>
            </div>
            <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
              + New Webhook
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Active Webhooks</p>
              <p className="text-2xl font-bold">{webhooks.filter(w => w.active).length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Total Deliveries</p>
              <p className="text-2xl font-bold">
                {webhooks.reduce((sum, w) => sum + w.deliveryCount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Failures</p>
              <p className="text-2xl font-bold text-red-400">
                {webhooks.reduce((sum, w) => sum + w.failureCount, 0)}
              </p>
            </div>
          </div>

          {/* Create Webhook Form */}
          {isCreating && (
            <Card className="mb-6 border border-blue-500">
              <div className="p-4 space-y-4">
                <h4 className="font-semibold">Create New Webhook</h4>

                <Input
                  label="Webhook Name"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  placeholder="e.g., Trading Bot, Analytics Service"
                />

                <Input
                  label="Endpoint URL"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  placeholder="https://api.example.com/webhook"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Events to Subscribe</label>
                  <div className="grid grid-cols-2 gap-2">
                    {allEvents.map(event => (
                      <label key={event} className="flex items-center gap-2 cursor-pointer p-2 bg-gray-800 rounded hover:bg-gray-750">
                        <input
                          type="checkbox"
                          checked={newWebhook.events.includes(event)}
                          onChange={() => toggleEvent(event)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateWebhook} disabled={!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0}>
                    Create Webhook
                  </Button>
                  <Button variant="secondary" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Webhooks List */}
          <div className="space-y-4">
            {webhooks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No webhooks configured</p>
                <p className="text-sm mt-2">Create your first webhook to receive real-time events</p>
              </div>
            ) : (
              webhooks.map(webhook => (
                <Card key={webhook.id}>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{webhook.name}</h4>
                          <Badge variant={webhook.active ? 'success' : 'default'}>
                            {webhook.active ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{webhook.url}</p>
                        <p className="text-xs text-gray-500">
                          Created {new Date(webhook.createdAt).toLocaleDateString()}
                          {webhook.lastTriggered && ` • Last triggered ${new Date(webhook.lastTriggered).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleWebhook(webhook.id)}
                        >
                          {webhook.active ? 'Pause' : 'Resume'}
                        </Button>
                        <Button
                          variant="error"
                          size="sm"
                          onClick={() => deleteWebhook(webhook.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Events */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">Subscribed Events</p>
                      <div className="flex flex-wrap gap-2">
                        {webhook.events.map(event => (
                          <Badge key={event} variant="default">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Secret */}
                    <div className="mb-4">
                      <label className="text-xs text-gray-400 block mb-1">Signing Secret</label>
                      <div className="flex gap-2">
                        <code className="flex-1 bg-gray-800 px-3 py-2 rounded text-sm font-mono">
                          {webhook.secret}
                        </code>
                        <Button size="sm" onClick={() => copySecret(webhook.secret)}>
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Deliveries</p>
                        <p className="font-medium">{webhook.deliveryCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Failures</p>
                        <p className="font-medium text-red-400">{webhook.failureCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Success Rate</p>
                        <p className="font-medium">
                          {((webhook.deliveryCount / (webhook.deliveryCount + webhook.failureCount)) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Test Button */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => testWebhook(webhook.id)}
                      disabled={testingWebhook === webhook.id}
                    >
                      {testingWebhook === webhook.id ? 'Sending...' : 'Send Test Event'}
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Payload Example */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Example Payload</h4>
          <div className="bg-gray-800 rounded-lg p-4">
            <code className="text-xs block whitespace-pre text-gray-300">
{`{
  "event": "trade.executed",
  "timestamp": "2024-01-20T12:34:56Z",
  "data": {
    "marketId": 123,
    "marketName": "Will Bitcoin reach $100k?",
    "trader": "0x1234...5678",
    "outcome": "YES",
    "amount": 100,
    "price": 65
  }
}`}
            </code>
          </div>
          <p className="text-sm text-gray-400 mt-3">
            All webhook requests include a <code className="text-xs bg-gray-800 px-2 py-1 rounded">X-Webhook-Signature</code> header for verification.
          </p>
        </div>
      </Card>
    </div>
  );
}
