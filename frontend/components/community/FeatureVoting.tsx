'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function FeatureVoting() {
  const features = [
    { id: '1', title: 'Mobile App', description: 'Native iOS and Android apps', votes: 1234, status: 'planned', category: 'platform' },
    { id: '2', title: 'Advanced Charts', description: 'TradingView-style charting', votes: 987, status: 'in-progress', category: 'features' },
    { id: '3', title: 'API Access', description: 'Public API for developers', votes: 756, status: 'under-review', category: 'platform' },
  ];

  const myVotes = [
    { feature: 'Mobile App', votedAt: '2 days ago' },
    { feature: 'Advanced Charts', votedAt: '1 week ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Feature Voting</h3>
              <p className="text-gray-400">Help shape the future of ProphetBase</p>
            </div>
            <Button>Submit Request</Button>
          </div>
        </div>
      </Card>

      {/* Features */}
      <div className="space-y-3">
        {features.map(feature => (
          <Card key={feature.id}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Vote */}
                <div className="flex flex-col items-center gap-1">
                  <button className="text-gray-400 hover:text-green-400">▲</button>
                  <span className="font-bold text-lg">{feature.votes}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-400 mb-2">{feature.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="capitalize text-xs">{feature.category}</Badge>
                        <Badge variant={
                          feature.status === 'in-progress' ? 'success' :
                          feature.status === 'planned' ? 'warning' : 'default'
                        } className="text-xs">
                          {feature.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Roadmap */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Roadmap</h4>
          
          <div className="space-y-4">
            {[
              { quarter: 'Q1 2024', features: ['Mobile App Beta', 'Advanced Charts'] },
              { quarter: 'Q2 2024', features: ['API Access', 'Guild System v2'] },
            ].map((quarter, idx) => (
              <div key={idx}>
                <p className="font-semibold mb-2">{quarter.quarter}</p>
                <div className="space-y-1">
                  {quarter.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-blue-400">•</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* My Votes */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">My Votes</h4>
          
          <div className="space-y-2">
            {myVotes.map((vote, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-sm">{vote.feature}</span>
                <span className="text-xs text-gray-400">{vote.votedAt}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
