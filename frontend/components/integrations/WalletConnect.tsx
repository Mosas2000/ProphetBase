'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface Wallet {
  id: string;
  name: string;
  icon: string;
  installed: boolean;
  connected: boolean;
}

export function WalletConnect() {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const wallets: Wallet[] = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊', installed: true, connected: false },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', installed: true, connected: false },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '💼', installed: false, connected: false },
    { id: 'rainbow', name: 'Rainbow', icon: '🌈', installed: false, connected: false },
    { id: 'trust', name: 'Trust Wallet', icon: '🛡️', installed: false, connected: false },
    { id: 'phantom', name: 'Phantom', icon: '👻', installed: false, connected: false },
  ];

  const handleConnect = async (walletId: string) => {
    setIsConnecting(true);
    setSelectedWallet(walletId);
    
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsConnecting(false);
    alert(`Connected to ${wallets.find(w => w.id === walletId)?.name}`);
  };

  const handleDisconnect = () => {
    setSelectedWallet(null);
    alert('Wallet disconnected');
  };

  const handleSwitch = async (walletId: string) => {
    setIsConnecting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSelectedWallet(walletId);
    setIsConnecting(false);
    alert(`Switched to ${wallets.find(w => w.id === walletId)?.name}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Connect Wallet</h3>

          {/* Connected Wallet */}
          {selectedWallet && (
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-500/30 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{wallets.find(w => w.id === selectedWallet)?.icon}</span>
                  <div>
                    <p className="font-semibold">{wallets.find(w => w.id === selectedWallet)?.name}</p>
                    <p className="text-sm text-gray-400">0x1234...5678</p>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" onClick={handleDisconnect}>
                  Disconnect
                </Button>
                <Button variant="secondary">
                  Copy Address
                </Button>
              </div>
            </div>
          )}

          {/* Available Wallets */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-400 mb-3">
              {selectedWallet ? 'Switch Wallet' : 'Select Wallet'}
            </h4>
            
            {wallets.map(wallet => (
              <div
                key={wallet.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  selectedWallet === wallet.id
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{wallet.icon}</span>
                  <div>
                    <p className="font-medium">{wallet.name}</p>
                    {!wallet.installed && (
                      <p className="text-xs text-gray-400">Not installed</p>
                    )}
                  </div>
                </div>

                {selectedWallet === wallet.id ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => selectedWallet ? handleSwitch(wallet.id) : handleConnect(wallet.id)}
                    disabled={isConnecting || !wallet.installed}
                  >
                    {!wallet.installed ? 'Install' : selectedWallet ? 'Switch' : 'Connect'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Connection Info */}
      {selectedWallet && (
        <Card>
          <div className="p-6">
            <h4 className="font-semibold mb-4">Connection Details</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-400">Network</span>
                <span className="font-medium">Base Mainnet</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-400">Chain ID</span>
                <span className="font-medium">8453</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-400">Balance</span>
                <span className="font-medium">2.45 ETH</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Security Tips */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Security Tips</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p className="text-gray-300">Never share your private keys or seed phrase</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p className="text-gray-300">Always verify the website URL before connecting</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p className="text-gray-300">Use hardware wallets for large amounts</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
