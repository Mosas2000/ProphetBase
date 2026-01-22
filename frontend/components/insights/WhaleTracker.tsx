'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface WhalePosition {
  address: string;
  position: 'YES' | 'NO';
  shares: number;
  value: number;
  percentOfSupply: number;
  timestamp: string;
}

export function WhaleTracker() {
  const whales: WhalePosition[] = [
    {
      address: '0x1234...5678',
      position: 'YES',
      shares: 15000,
      value: 12500,
      percentOfSupply: 12.5,
      timestamp: '2 hours ago',
    },
    {
      address: '0xabcd...efgh',
      position: 'NO',
      shares: 12000,
      value: 9600,
      percentOfSupply: 10.2,
      timestamp: '5 hours ago',
    },
    {
      address: '0x9876...5432',
      position: 'YES',
      shares: 10000,
      value: 8500,
      percentOfSupply: 8.5,
      timestamp: '1 day ago',
    },
  ];

  const totalWhaleValue = whales.reduce((sum, w) => sum + w.value, 0);

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">🐋 Whale Tracker</h3>

          {/* Whale Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
              <p className="text-sm text-gray-400 mb-1">Total Whale Value</p>
              <p className="text-2xl font-bold">${totalWhaleValue.toLocaleString()}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Whale Count</p>
              <p className="text-2xl font-bold">{whales.length}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Avg Position</p>
              <p className="text-2xl font-bold">${(totalWhaleValue / whales.length).toLocaleString()}</p>
            </div>
          </div>

          {/* Whale Positions */}
          <div className="space-y-3">
            {whales.map((whale, idx) => (
              <Card key={idx}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm font-mono">{whale.address}</code>
                        <Badge variant={whale.position === 'YES' ? 'success' : 'error'}>
                          {whale.position}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{whale.timestamp}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Shares</p>
                      <p className="font-medium">{whale.shares.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Value</p>
                      <p className="font-medium">${whale.value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">% of Supply</p>
                      <p className="font-medium">{whale.percentOfSupply}%</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Position Size Distribution */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Position Size Distribution</h4>
          
          <div className="space-y-3">
            {[
              { range: '$10K+', count: 3, percent: 2 },
              { range: '$5K - $10K', count: 8, percent: 5 },
              { range: '$1K - $5K', count: 45, percent: 28 },
              { range: '$100 - $1K', count: 120, percent: 65 },
            ].map((tier, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">{tier.range}</span>
                  <span className="font-medium">{tier.count} positions ({tier.percent}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${tier.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Whale Activity Feed */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Recent Whale Activity</h4>
          
          <div className="space-y-3">
            {[
              { action: 'Bought', amount: '$12,500', outcome: 'YES', address: '0x1234...5678', time: '2h ago' },
              { action: 'Sold', amount: '$8,200', outcome: 'NO', address: '0xabcd...efgh', time: '5h ago' },
              { action: 'Bought', amount: '$15,000', outcome: 'YES', address: '0x9876...5432', time: '8h ago' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activity.action === 'Bought' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium">
                      {activity.action} {activity.amount} {activity.outcome}
                    </p>
                    <p className="text-sm text-gray-400">{activity.address}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
