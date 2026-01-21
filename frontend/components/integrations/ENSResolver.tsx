'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

interface ENSProfile {
  name: string;
  address: string;
  avatar?: string;
  description?: string;
  twitter?: string;
  github?: string;
}

export function ENSResolver() {
  const [ensName, setEnsName] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [profile, setProfile] = useState<ENSProfile | null>(null);

  // Mock ENS profiles
  const mockProfiles: Record<string, ENSProfile> = {
    'vitalik.eth': {
      name: 'vitalik.eth',
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      avatar: '🧙',
      description: 'Ethereum co-founder',
      twitter: '@VitalikButerin',
      github: 'vbuterin',
    },
    'nick.eth': {
      name: 'nick.eth',
      address: '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5',
      avatar: '👨‍💻',
      description: 'ENS Lead Developer',
      twitter: '@nicksdjohnson',
    },
  };

  const handleResolve = async () => {
    if (!ensName) return;

    setIsResolving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const resolved = mockProfiles[ensName.toLowerCase()];
    setProfile(resolved || null);
    setIsResolving(false);

    if (!resolved) {
      alert('ENS name not found');
    }
  };

  const handleClear = () => {
    setEnsName('');
    setProfile(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">ENS Name Resolver</h3>

          {/* Search */}
          <div className="flex gap-3 mb-6">
            <Input
              value={ensName}
              onChange={(e) => setEnsName(e.target.value)}
              placeholder="Enter ENS name (e.g., vitalik.eth)"
              onKeyPress={(e) => e.key === 'Enter' && handleResolve()}
            />
            <Button onClick={handleResolve} disabled={isResolving || !ensName}>
              {isResolving ? 'Resolving...' : 'Resolve'}
            </Button>
          </div>

          {/* Profile Display */}
          {profile && (
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-blue-500/30">
              <div className="flex items-start gap-4 mb-4">
                {profile.avatar && (
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-3xl">
                    {profile.avatar}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-1">{profile.name}</h4>
                  {profile.description && (
                    <p className="text-sm text-gray-400 mb-2">{profile.description}</p>
                  )}
                  <code className="text-xs bg-gray-800 px-2 py-1 rounded">
                    {profile.address}
                  </code>
                </div>
              </div>

              {/* Social Links */}
              {(profile.twitter || profile.github) && (
                <div className="flex gap-3 mb-4">
                  {profile.twitter && (
                    <a
                      href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      {profile.twitter}
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-300 text-sm"
                    >
                      GitHub: {profile.github}
                    </a>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(profile.address)}>
                  Copy Address
                </Button>
                <Button variant="secondary" size="sm" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Lookups */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Recent Lookups</h4>
          
          <div className="space-y-2">
            {Object.values(mockProfiles).slice(0, 3).map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750"
                onClick={() => {
                  setEnsName(p.name);
                  setProfile(p);
                }}
              >
                <div className="flex items-center gap-3">
                  {p.avatar && <span className="text-2xl">{p.avatar}</span>}
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.address.slice(0, 10)}...</p>
                  </div>
                </div>
                <span className="text-gray-500">→</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ENS Info */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">About ENS</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              ENS (Ethereum Name Service) allows you to use human-readable names instead of long addresses.
            </p>
            <p>
              Get your own ENS name at <a href="https://ens.domains" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">ens.domains</a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
