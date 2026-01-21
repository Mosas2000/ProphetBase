'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function OnChainMetrics() {
  const walletStats = {
    totalWallets: 12450,
    activeWallets: 3420,
    newWallets: 234,
    whaleWallets: 45,
  };

  const holderDistribution = [
    { category: 'Whales (>$10k)', percentage: 35, count: 45 },
    { category: 'Large ($1k-$10k)', percentage: 28, count: 156 },
    { category: 'Medium ($100-$1k)', percentage: 22, count: 890 },
    { category: 'Small (<$100)', percentage: 15, count: 11359 },
  ];

  const onChainSignals = [
    { signal: 'Whale Accumulation', status: 'Active', strength: 'Strong', detected: '2h ago' },
    { signal: 'Large Transfer', status: 'Detected', strength: 'Moderate', detected: '5h ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">On-Chain Metrics</h3>
          <p className="text-gray-400">Blockchain analytics and wallet insights</p>
        </div>
      </Card>

      {/* Wallet Analytics */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Wallet Analytics</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Wallets</p>
              <p className="text-2xl font-bold">{walletStats.totalWallets.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Active (24h)</p>
              <p className="text-2xl font-bold text-green-400">{walletStats.activeWallets.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">New (24h)</p>
              <p className="text-2xl font-bold text-blue-400">{walletStats.newWallets}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Whales</p>
              <p className="text-2xl font-bold text-yellow-400">{walletStats.whaleWallets}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Holder Distribution */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Holder Distribution</h4>
          
          <div className="space-y-3">
            {holderDistribution.map((holder, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{holder.category}</span>
                  <span className="text-sm text-gray-400">{holder.count.toLocaleString()} wallets</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${holder.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold">{holder.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Transaction Patterns */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Transaction Patterns</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">24h Volume</p>
              <p className="text-xl font-bold">$2.4M</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Avg Tx Size</p>
              <p className="text-xl font-bold">$450</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Txs</p>
              <p className="text-xl font-bold">5,340</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Gas Used</p>
              <p className="text-xl font-bold">0.45 ETH</p>
            </div>
          </div>
        </div>
      </Card>

      {/* On-Chain Signals */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">On-Chain Signals</h4>
          
          <div className="space-y-2">
            {onChainSignals.map((signal, idx) => (
              <div key={idx} className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{signal.signal}</p>
                    <p className="text-sm text-gray-400">{signal.detected}</p>
                  </div>
                  <Badge variant="default">{signal.strength}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
