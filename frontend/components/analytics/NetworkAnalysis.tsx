'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function NetworkAnalysis() {
  const influencers = [
    { name: 'CryptoKing', followers: 234, influence: 92, trades: 1234 },
    { name: 'TradeQueen', followers: 189, influence: 85, trades: 987 },
  ];

  const clusters = [
    { name: 'Crypto Bulls', members: 45, avgProfit: 2340, correlation: 0.78 },
    { name: 'Risk Takers', members: 32, avgProfit: 1890, correlation: 0.65 },
  ];

  const copyTrading = [
    { copier: 'User123', copying: 'CryptoKing', trades: 12, success: 75 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Network Analysis</h3>
          <p className="text-gray-400">Trader network and influence mapping</p>
        </div>
      </Card>

      {/* Network Graph */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Trader Network</h4>
          
          <div className="bg-gray-900 rounded-lg p-8 h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl mb-2">🕸️</p>
              <p className="text-sm text-gray-400">Network graph visualization</p>
              <p className="text-xs text-gray-500 mt-1">Showing connections between traders</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Top Influencers */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Top Influencers</h4>
          
          <div className="space-y-3">
            {influencers.map((influencer, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium mb-1">{influencer.name}</p>
                    <p className="text-sm text-gray-400">
                      {influencer.followers} followers • {influencer.trades} trades
                    </p>
                  </div>
                  <Badge variant="default">Rank #{idx + 1}</Badge>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Influence Score</span>
                  <span className="font-medium">{influencer.influence}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${influencer.influence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Community Clusters */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Community Clusters</h4>
          
          <div className="space-y-3">
            {clusters.map((cluster, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{cluster.name}</p>
                  <span className="text-sm text-gray-400">{cluster.members} members</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Avg Profit</p>
                    <p className="font-bold text-green-400">${cluster.avgProfit.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Correlation</p>
                    <p className="font-bold">{cluster.correlation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Copy Trading Detection */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Copy Trading Activity</h4>
          
          <div className="space-y-2">
            {copyTrading.map((activity, idx) => (
              <div key={idx} className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
                <p className="font-medium mb-2">
                  {activity.copier} → {activity.copying}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">{activity.trades} trades copied</span>
                  <span className="text-green-400">{activity.success}% success</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
