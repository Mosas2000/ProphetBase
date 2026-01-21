'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

interface ConnectedService {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  apiKey?: string;
}

export function ThirdPartyConnect() {
  const [services, setServices] = useState<ConnectedService[]>([
    { id: 'coingecko', name: 'CoinGecko', icon: '🦎', connected: false },
    { id: 'twitter', name: 'Twitter', icon: '🐦', connected: false },
    { id: 'discord', name: 'Discord', icon: '💬', connected: false },
    { id: 'telegram', name: 'Telegram', icon: '✈️', connected: false },
  ]);

  const [showApiKeyInput, setShowApiKeyInput] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');

  const handleConnect = (serviceId: string) => {
    if (serviceId === 'twitter' || serviceId === 'discord') {
      // OAuth flow
      alert(`Redirecting to ${services.find(s => s.id === serviceId)?.name} OAuth...`);
      setServices(services.map(s => 
        s.id === serviceId ? { ...s, connected: true } : s
      ));
    } else {
      // API key flow
      setShowApiKeyInput(serviceId);
    }
  };

  const handleSaveApiKey = (serviceId: string) => {
    if (!apiKey) {
      alert('Please enter an API key');
      return;
    }
    
    setServices(services.map(s => 
      s.id === serviceId ? { ...s, connected: true, apiKey } : s
    ));
    setShowApiKeyInput(null);
    setApiKey('');
    alert('API key saved successfully!');
  };

  const handleDisconnect = (serviceId: string) => {
    setServices(services.map(s => 
      s.id === serviceId ? { ...s, connected: false, apiKey: undefined } : s
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Third-Party Integrations</h3>

          {/* Services */}
          <div className="space-y-3">
            {services.map(service => (
              <div key={service.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{service.icon}</span>
                    <div>
                      <p className="font-semibold">{service.name}</p>
                      {service.connected && service.apiKey && (
                        <code className="text-xs text-gray-400">
                          {service.apiKey.slice(0, 8)}...
                        </code>
                      )}
                    </div>
                  </div>
                  {service.connected ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Connected</Badge>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDisconnect(service.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => handleConnect(service.id)}>
                      Connect
                    </Button>
                  )}
                </div>

                {/* API Key Input */}
                {showApiKeyInput === service.id && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter API key"
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSaveApiKey(service.id)}>
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setShowApiKeyInput(null);
                          setApiKey('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Connected Services */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Active Integrations</h4>
          
          {services.filter(s => s.connected).length > 0 ? (
            <div className="space-y-2">
              {services.filter(s => s.connected).map(service => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{service.icon}</span>
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No active integrations</p>
          )}
        </div>
      </Card>

      {/* OAuth Info */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">OAuth Permissions</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-400">ℹ️</span>
              <p className="text-gray-300">OAuth integrations require you to authorize ProphetBase</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">ℹ️</span>
              <p className="text-gray-300">You can revoke access at any time from your account settings</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">ℹ️</span>
              <p className="text-gray-300">We only request the minimum permissions needed</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Security</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p className="text-gray-300">API keys are encrypted at rest</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p className="text-gray-300">OAuth tokens are securely stored</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p className="text-gray-300">All connections use HTTPS</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
