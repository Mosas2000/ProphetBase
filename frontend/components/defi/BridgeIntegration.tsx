'use client';

import { useState } from 'react';

interface Network {
  id: string;
  name: string;
  logo: string;
  gasPrice: number;
  bridgeFee: number;
  estimatedTime: string;
}

interface BridgeTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  asset: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  txHash: string;
  timestamp: Date;
}

export default function BridgeIntegration() {
  const [fromNetwork, setFromNetwork] = useState('base');
  const [toNetwork, setToNetwork] = useState('ethereum');
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('USDC');

  const networks: Record<string, Network> = {
    base: { id: 'base', name: 'Base', logo: '🔵', gasPrice: 0.0001, bridgeFee: 0.1, estimatedTime: '5-10 mins' },
    ethereum: { id: 'ethereum', name: 'Ethereum', logo: '⟠', gasPrice: 15, bridgeFee: 0.3, estimatedTime: '15-20 mins' },
    optimism: { id: 'optimism', name: 'Optimism', logo: '🔴', gasPrice: 0.0005, bridgeFee: 0.15, estimatedTime: '7-12 mins' },
    arbitrum: { id: 'arbitrum', name: 'Arbitrum', logo: '🔷', gasPrice: 0.0003, bridgeFee: 0.12, estimatedTime: '10-15 mins' },
    polygon: { id: 'polygon', name: 'Polygon', logo: '🟣', gasPrice: 0.01, bridgeFee: 0.08, estimatedTime: '3-5 mins' }
  };

  const transactions: BridgeTransaction[] = [
    {
      id: '1',
      from: 'Base',
      to: 'Ethereum',
      amount: 1000,
      asset: 'USDC',
      status: 'completed',
      txHash: '0x123...abc',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      from: 'Ethereum',
      to: 'Base',
      amount: 0.5,
      asset: 'ETH',
      status: 'processing',
      txHash: '0x456...def',
      timestamp: new Date(Date.now() - 600000)
    }
  ];

  const totalFee = amount ? (
    networks[fromNetwork].bridgeFee + networks[toNetwork].gasPrice
  ).toFixed(4) : '0.00';

  const estimatedReceive = amount ? (
    parseFloat(amount) - parseFloat(totalFee)
  ).toFixed(4) : '0.00';

  const switchNetworks = () => {
    const temp = fromNetwork;
    setFromNetwork(toNetwork);
    setToNetwork(temp);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bridge Integration</h2>
        <p className="text-sm text-gray-600">Transfer assets across different networks</p>
      </div>

      {/* Bridge Interface */}
      <div className="mb-6">
        {/* From Network */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">From Network</label>
          <div className="border-2 border-gray-200 rounded-lg p-4 focus-within:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <select
                value={fromNetwork}
                onChange={e => setFromNetwork(e.target.value)}
                className="text-lg font-semibold text-gray-900 outline-none bg-transparent"
              >
                {Object.values(networks).map(network => (
                  <option key={network.id} value={network.id}>
                    {network.logo} {network.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedAsset}
                  onChange={e => setSelectedAsset(e.target.value)}
                  className="bg-gray-100 px-3 py-2 rounded-lg font-medium"
                >
                  <option value="USDC">USDC</option>
                  <option value="ETH">ETH</option>
                  <option value="BTC">BTC</option>
                </select>
              </div>
            </div>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full text-2xl font-semibold text-gray-900 outline-none"
            />
            <div className="text-sm text-gray-500 mt-2">
              Gas: ${networks[fromNetwork].gasPrice.toFixed(4)} | Fee: {networks[fromNetwork].bridgeFee}%
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center my-3">
          <button
            onClick={switchNetworks}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            ⇅
          </button>
        </div>

        {/* To Network */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">To Network</label>
          <div className="border-2 border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <select
                value={toNetwork}
                onChange={e => setToNetwork(e.target.value)}
                className="text-lg font-semibold text-gray-900 outline-none bg-transparent"
              >
                {Object.values(networks).filter(n => n.id !== fromNetwork).map(network => (
                  <option key={network.id} value={network.id}>
                    {network.logo} {network.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {estimatedReceive} {selectedAsset}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Est. Time: {networks[toNetwork].estimatedTime}
            </div>
          </div>
        </div>

        {/* Summary */}
        {amount && parseFloat(amount) > 0 && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">{amount} {selectedAsset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bridge Fee:</span>
                <span className="font-semibold text-gray-900">{networks[fromNetwork].bridgeFee}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gas Cost:</span>
                <span className="font-semibold text-gray-900">${networks[fromNetwork].gasPrice.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Fees:</span>
                <span className="font-semibold text-red-600">${totalFee}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-300">
                <span className="text-gray-900 font-medium">You will receive:</span>
                <span className="font-bold text-blue-600">{estimatedReceive} {selectedAsset}</span>
              </div>
            </div>
          </div>
        )}

        <button
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-colors"
        >
          {!amount || parseFloat(amount) <= 0 ? 'Enter an amount' : 'Bridge Assets'}
        </button>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Recent Bridges</h3>
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{networks[tx.from.toLowerCase()].logo}</span>
                  <span className="text-gray-700">→</span>
                  <span className="text-xl">{networks[tx.to.toLowerCase()].logo}</span>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {tx.amount} {tx.asset}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tx.from} to {tx.to}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {tx.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <code className="text-blue-600">{tx.txHash}</code>
                <button className="text-blue-600 hover:underline">View →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Network Comparison */}
      <div className="mt-6 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Network Fee Comparison</h3>
        <div className="grid grid-cols-5 gap-3">
          {Object.values(networks).map(network => (
            <div key={network.id} className="text-center p-3 bg-white rounded-lg border-2 border-gray-200">
              <div className="text-2xl mb-1">{network.logo}</div>
              <div className="text-xs font-medium text-gray-700 mb-2">{network.name}</div>
              <div className="text-sm font-semibold text-gray-900">{network.bridgeFee}%</div>
              <div className="text-xs text-gray-500">${network.gasPrice.toFixed(4)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
