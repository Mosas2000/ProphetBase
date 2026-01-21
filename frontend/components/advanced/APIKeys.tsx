'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  secret: string;
  permissions: ('READ' | 'TRADE' | 'WITHDRAW')[];
  rateLimit: number;
  usage: {
    today: number;
    thisMonth: number;
  };
  createdAt: string;
  lastUsed?: string;
}

export function APIKeys() {
  const [keys, setKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Trading Bot',
      key: 'pk_live_abc123...',
      secret: 'sk_live_xyz789...',
      permissions: ['READ', 'TRADE'],
      rateLimit: 1000,
      usage: { today: 234, thisMonth: 5678 },
      createdAt: '2024-01-15',
      lastUsed: '2024-01-20',
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newKey, setNewKey] = useState({
    name: '',
    permissions: [] as APIKey['permissions'],
    rateLimit: 1000,
  });
  const [showSecret, setShowSecret] = useState<string | null>(null);

  const handleCreateKey = () => {
    const apiKey: APIKey = {
      id: Date.now().toString(),
      name: newKey.name,
      key: `pk_live_${Math.random().toString(36).substring(2, 15)}`,
      secret: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
      permissions: newKey.permissions,
      rateLimit: newKey.rateLimit,
      usage: { today: 0, thisMonth: 0 },
      createdAt: new Date().toISOString().split('T')[0],
    };

    setKeys([...keys, apiKey]);
    setShowSecret(apiKey.id);
    setIsCreating(false);
    setNewKey({ name: '', permissions: [], rateLimit: 1000 });
  };

  const deleteKey = (id: string) => {
    if (confirm('Are you sure? This action cannot be undone.')) {
      setKeys(keys.filter(k => k.id !== id));
    }
  };

  const togglePermission = (permission: APIKey['permissions'][0]) => {
    setNewKey({
      ...newKey,
      permissions: newKey.permissions.includes(permission)
        ? newKey.permissions.filter(p => p !== permission)
        : [...newKey.permissions, permission],
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">API Keys</h3>
              <p className="text-sm text-gray-400 mt-1">Manage your API access credentials</p>
            </div>
            <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
              + Generate Key
            </Button>
          </div>

          {/* Usage Overview */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Active Keys</p>
              <p className="text-2xl font-bold">{keys.length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Requests Today</p>
              <p className="text-2xl font-bold">
                {keys.reduce((sum, k) => sum + k.usage.today, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">This Month</p>
              <p className="text-2xl font-bold">
                {keys.reduce((sum, k) => sum + k.usage.thisMonth, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Create Key Form */}
          {isCreating && (
            <Card className="mb-6 border border-blue-500">
              <div className="p-4 space-y-4">
                <h4 className="font-semibold">Generate New API Key</h4>

                <Input
                  label="Key Name"
                  value={newKey.name}
                  onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                  placeholder="e.g., Trading Bot, Analytics Dashboard"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Permissions</label>
                  <div className="space-y-2">
                    {(['READ', 'TRADE', 'WITHDRAW'] as const).map(permission => (
                      <label key={permission} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newKey.permissions.includes(permission)}
                          onChange={() => togglePermission(permission)}
                          className="w-4 h-4"
                        />
                        <span>{permission}</span>
                        <span className="text-xs text-gray-400">
                          {permission === 'READ' && '- View markets and positions'}
                          {permission === 'TRADE' && '- Execute trades'}
                          {permission === 'WITHDRAW' && '- Withdraw funds'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Input
                  label="Rate Limit (requests/hour)"
                  type="number"
                  value={newKey.rateLimit}
                  onChange={(e) => setNewKey({ ...newKey, rateLimit: parseInt(e.target.value) })}
                  placeholder="1000"
                />

                <div className="flex gap-2">
                  <Button onClick={handleCreateKey} disabled={!newKey.name || newKey.permissions.length === 0}>
                    Generate Key
                  </Button>
                  <Button variant="secondary" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* API Keys List */}
          <div className="space-y-4">
            {keys.map(key => (
              <Card key={key.id}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{key.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Created {new Date(key.createdAt).toLocaleDateString()}
                        {key.lastUsed && ` • Last used ${new Date(key.lastUsed).toLocaleDateString()}`}
                      </p>
                    </div>
                    <Button variant="error" size="sm" onClick={() => deleteKey(key.id)}>
                      Revoke
                    </Button>
                  </div>

                  {/* API Key */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Public Key</label>
                      <div className="flex gap-2">
                        <code className="flex-1 bg-gray-800 px-3 py-2 rounded text-sm font-mono">
                          {key.key}
                        </code>
                        <Button size="sm" onClick={() => copyToClipboard(key.key)}>
                          Copy
                        </Button>
                      </div>
                    </div>

                    {showSecret === key.id && (
                      <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-3">
                        <p className="text-sm text-yellow-400 mb-2">
                          ⚠️ Save your secret key now. It won't be shown again!
                        </p>
                        <div className="flex gap-2">
                          <code className="flex-1 bg-gray-800 px-3 py-2 rounded text-sm font-mono">
                            {key.secret}
                          </code>
                          <Button size="sm" onClick={() => copyToClipboard(key.secret)}>
                            Copy
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Permissions */}
                  <div className="flex gap-2 mb-4">
                    {key.permissions.map(permission => (
                      <Badge key={permission} variant="default">
                        {permission}
                      </Badge>
                    ))}
                  </div>

                  {/* Usage Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Rate Limit</p>
                      <p className="font-medium">{key.rateLimit.toLocaleString()}/hr</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Today</p>
                      <p className="font-medium">{key.usage.today.toLocaleString()}</p>
                      <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: `${(key.usage.today / key.rateLimit) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">This Month</p>
                      <p className="font-medium">{key.usage.thisMonth.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Documentation */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">API Documentation</h4>
          <div className="space-y-3 text-sm">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="font-medium mb-2">Authentication</p>
              <code className="text-xs">Authorization: Bearer YOUR_API_KEY</code>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="font-medium mb-2">Base URL</p>
              <code className="text-xs">https://api.prophetbase.com/v1</code>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="font-medium mb-2">Example Request</p>
              <code className="text-xs block whitespace-pre">
{`curl -X GET https://api.prophetbase.com/v1/markets \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
              </code>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
