'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useState } from 'react';

interface Alert {
  id: string;
  type: 'PRICE' | 'RESOLUTION' | 'VOLUME' | 'CUSTOM';
  marketId: number;
  marketName: string;
  condition: string;
  value: number;
  triggered: boolean;
  createdAt: string;
}

interface AlertsProps {
  markets?: Array<{ id: number; name: string }>;
}

export function Alerts({ markets = [] }: AlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'PRICE',
      marketId: 0,
      marketName: 'Will Bitcoin reach $100k by 2024?',
      condition: 'ABOVE',
      value: 75,
      triggered: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: 'PRICE' as Alert['type'],
    marketId: 0,
    condition: 'ABOVE',
    value: 0,
  });

  const handleCreateAlert = () => {
    const market = markets.find(m => m.id === newAlert.marketId);
    if (!market) return;

    const alert: Alert = {
      id: Date.now().toString(),
      type: newAlert.type,
      marketId: newAlert.marketId,
      marketName: market.name,
      condition: newAlert.condition,
      value: newAlert.value,
      triggered: false,
      createdAt: new Date().toISOString(),
    };

    setAlerts([...alerts, alert]);
    setIsCreating(false);
    setNewAlert({
      type: 'PRICE',
      marketId: 0,
      condition: 'ABOVE',
      value: 0,
    });
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const getAlertDescription = (alert: Alert) => {
    switch (alert.type) {
      case 'PRICE':
        return `Price ${alert.condition.toLowerCase()} ${alert.value}¢`;
      case 'RESOLUTION':
        return 'Market resolved';
      case 'VOLUME':
        return `Volume ${alert.condition.toLowerCase()} $${alert.value.toLocaleString()}`;
      case 'CUSTOM':
        return `Custom condition: ${alert.condition}`;
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'PRICE':
        return '💰';
      case 'RESOLUTION':
        return '🎯';
      case 'VOLUME':
        return '📊';
      case 'CUSTOM':
        return '⚙️';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Alert Manager</h3>
              <p className="text-sm text-gray-400 mt-1">Get notified about market events</p>
            </div>
            <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
              + New Alert
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Active Alerts</p>
              <p className="text-2xl font-bold">{alerts.filter(a => !a.triggered).length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Triggered</p>
              <p className="text-2xl font-bold text-green-400">{alerts.filter(a => a.triggered).length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-2xl font-bold">{alerts.length}</p>
            </div>
          </div>

          {/* Create Alert Form */}
          {isCreating && (
            <Card className="mb-6 border border-blue-500">
              <div className="p-4 space-y-4">
                <h4 className="font-semibold">Create New Alert</h4>

                <Select
                  label="Alert Type"
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as Alert['type'] })}
                >
                  <option value="PRICE">Price Alert</option>
                  <option value="RESOLUTION">Resolution Alert</option>
                  <option value="VOLUME">Volume Alert</option>
                  <option value="CUSTOM">Custom Alert</option>
                </Select>

                <Select
                  label="Market"
                  value={newAlert.marketId}
                  onChange={(e) => setNewAlert({ ...newAlert, marketId: parseInt(e.target.value) })}
                >
                  {markets.length === 0 ? (
                    <option value={0}>No markets available</option>
                  ) : (
                    markets.map(market => (
                      <option key={market.id} value={market.id}>
                        {market.name}
                      </option>
                    ))
                  )}
                </Select>

                {newAlert.type !== 'RESOLUTION' && (
                  <>
                    <Select
                      label="Condition"
                      value={newAlert.condition}
                      onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                    >
                      <option value="ABOVE">Above</option>
                      <option value="BELOW">Below</option>
                      <option value="EQUALS">Equals</option>
                    </Select>

                    <Input
                      label={newAlert.type === 'PRICE' ? 'Price (¢)' : 'Value'}
                      type="number"
                      value={newAlert.value}
                      onChange={(e) => setNewAlert({ ...newAlert, value: parseFloat(e.target.value) })}
                      placeholder="0"
                    />
                  </>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleCreateAlert} disabled={!newAlert.value && newAlert.type !== 'RESOLUTION'}>
                    Create Alert
                  </Button>
                  <Button variant="secondary" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Alerts List */}
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No alerts configured</p>
                <p className="text-sm mt-2">Create your first alert to stay informed</p>
              </div>
            ) : (
              alerts.map(alert => (
                <Card key={alert.id} className={alert.triggered ? 'border border-green-500' : ''}>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3 flex-1">
                        <div className="text-2xl">{getAlertIcon(alert.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{alert.marketName}</h4>
                            <Badge variant={alert.triggered ? 'success' : 'default'}>
                              {alert.triggered ? 'Triggered' : 'Active'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">{getAlertDescription(alert)}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Created {new Date(alert.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="error"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Notification Preferences</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive alerts via email</p>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-400">Browser push notifications</p>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750">
              <div>
                <p className="font-medium">Telegram Alerts</p>
                <p className="text-sm text-gray-400">Send alerts to Telegram</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
}
