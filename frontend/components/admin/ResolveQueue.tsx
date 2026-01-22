'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextArea } from '@/components/ui/TextArea';
import { useState } from 'react';

interface MarketToResolve {
  id: number;
  question: string;
  category: string;
  endDate: string;
  volume: number;
  yesShares: number;
  noShares: number;
  resolutionSource: string;
  disputeCount: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

const mockQueue: MarketToResolve[] = [
  {
    id: 5,
    question: 'Will Bitcoin reach $100k by end of Q1 2024?',
    category: 'Crypto',
    endDate: '2024-03-31',
    volume: 45000,
    yesShares: 2500,
    noShares: 1800,
    resolutionSource: 'CoinGecko API - BTC/USD price at market close',
    disputeCount: 2,
    priority: 'HIGH',
  },
  {
    id: 8,
    question: 'Will ETH 2.0 fully launch by February 2024?',
    category: 'Crypto',
    endDate: '2024-02-29',
    volume: 32000,
    yesShares: 1800,
    noShares: 2200,
    resolutionSource: 'Official Ethereum Foundation announcement',
    disputeCount: 0,
    priority: 'MEDIUM',
  },
  {
    id: 12,
    question: 'Will Lakers make the playoffs?',
    category: 'Sports',
    endDate: '2024-04-15',
    volume: 18000,
    yesShares: 1200,
    noShares: 900,
    resolutionSource: 'NBA official standings',
    disputeCount: 1,
    priority: 'LOW',
  },
];

export function ResolveQueue() {
  const [queue, setQueue] = useState<MarketToResolve[]>(mockQueue);
  const [selectedMarket, setSelectedMarket] = useState<MarketToResolve | null>(null);
  const [outcome, setOutcome] = useState<'YES' | 'NO' | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleResolve = () => {
    if (!selectedMarket || !outcome) return;

    // Remove from queue
    setQueue(queue.filter(m => m.id !== selectedMarket.id));
    setSelectedMarket(null);
    setOutcome(null);
    setResolutionNotes('');
    alert(`Market #${selectedMarket.id} resolved as ${outcome}`);
  };

  const handleDispute = (marketId: number) => {
    setQueue(queue.map(m => 
      m.id === marketId 
        ? { ...m, disputeCount: m.disputeCount + 1, priority: 'HIGH' as const }
        : m
    ));
  };

  const getPriorityColor = (priority: MarketToResolve['priority']) => {
    switch (priority) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'default';
    }
  };

  const sortedQueue = [...queue].sort((a, b) => {
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Resolution Queue</h2>
              <p className="text-sm text-gray-400 mt-1">Markets awaiting resolution</p>
            </div>
          </div>

          {/* Queue Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Total in Queue</p>
              <p className="text-3xl font-bold">{queue.length}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <p className="text-sm text-gray-400">High Priority</p>
              <p className="text-3xl font-bold text-red-400">
                {queue.filter(m => m.priority === 'HIGH').length}
              </p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
              <p className="text-sm text-gray-400">With Disputes</p>
              <p className="text-3xl font-bold text-yellow-400">
                {queue.filter(m => m.disputeCount > 0).length}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Total Volume</p>
              <p className="text-3xl font-bold">
                ${queue.reduce((sum, m) => sum + m.volume, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Resolution Queue */}
          <div className="space-y-3">
            {sortedQueue.map(market => (
              <Card key={market.id} className={market.priority === 'HIGH' ? 'border-red-500' : ''}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">#{market.id} {market.question}</h4>
                        <Badge variant={getPriorityColor(market.priority)}>
                          {market.priority}
                        </Badge>
                        <Badge variant="default">{market.category}</Badge>
                        {market.disputeCount > 0 && (
                          <Badge variant="error">
                            {market.disputeCount} Dispute{market.disputeCount > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        Ended: {new Date(market.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Market Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-400">Volume</p>
                      <p className="font-medium">${market.volume.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500 rounded-lg p-3">
                      <p className="text-xs text-gray-400">YES Shares</p>
                      <p className="font-medium text-green-400">{market.yesShares}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                      <p className="text-xs text-gray-400">NO Shares</p>
                      <p className="font-medium text-red-400">{market.noShares}</p>
                    </div>
                  </div>

                  {/* Resolution Source */}
                  <div className="bg-gray-800 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-400 mb-1">Resolution Source</p>
                    <p className="text-sm">{market.resolutionSource}</p>
                  </div>

                  <Button
                    onClick={() => setSelectedMarket(market)}
                    className="w-full"
                  >
                    Resolve Market
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {queue.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No markets awaiting resolution</p>
              <p className="text-sm mt-2">All caught up! 🎉</p>
            </div>
          )}
        </div>
      </Card>

      {/* Resolution Modal */}
      {selectedMarket && (
        <Card className="border-2 border-blue-500">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Resolve Market #{selectedMarket.id}</h3>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-2">{selectedMarket.question}</h4>
              <p className="text-sm text-gray-400">{selectedMarket.resolutionSource}</p>
            </div>

            {/* Outcome Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Select Outcome</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setOutcome('YES')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    outcome === 'YES'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <p className="text-3xl mb-2">✓</p>
                  <p className="font-bold text-xl">YES</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {selectedMarket.yesShares} shares will win
                  </p>
                </button>

                <button
                  onClick={() => setOutcome('NO')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    outcome === 'NO'
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <p className="text-3xl mb-2">✗</p>
                  <p className="font-bold text-xl">NO</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {selectedMarket.noShares} shares will win
                  </p>
                </button>
              </div>
            </div>

            {/* Resolution Notes */}
            <TextArea
              label="Resolution Notes (Optional)"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Add any notes about the resolution process, data sources checked, etc..."
              rows={4}
            />

            {/* Impact Summary */}
            {outcome && (
              <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4 mb-6">
                <h4 className="font-medium mb-3">Resolution Impact</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Winning Shares:</span>
                    <span className="font-medium">
                      {outcome === 'YES' ? selectedMarket.yesShares : selectedMarket.noShares}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Losing Shares:</span>
                    <span className="font-medium">
                      {outcome === 'YES' ? selectedMarket.noShares : selectedMarket.yesShares}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payout per Share:</span>
                    <span className="font-medium">$1.00</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleResolve}
                disabled={!outcome}
                className="flex-1"
              >
                Confirm Resolution
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedMarket(null);
                  setOutcome(null);
                  setResolutionNotes('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>

            {selectedMarket.disputeCount > 0 && (
              <div className="mt-4 bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
                <p className="text-sm text-yellow-400">
                  ⚠️ This market has {selectedMarket.disputeCount} active dispute{selectedMarket.disputeCount > 1 ? 's' : ''}. 
                  Review carefully before resolving.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
