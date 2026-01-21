'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export function BugBounty() {
  const [reportType, setReportType] = useState<'bug' | 'security'>('bug');

  const myReports = [
    { id: '1', title: 'Price display issue on mobile', severity: 'low', reward: 50, status: 'fixed' },
    { id: '2', title: 'Wallet connection timeout', severity: 'medium', reward: 150, status: 'in-review' },
  ];

  const topContributors = [
    { rank: 1, name: 'SecurityPro', bugs: 45, earned: 5000 },
    { rank: 2, name: 'BugHunter', bugs: 32, earned: 3500 },
    { rank: 3, name: 'DevUser', bugs: 28, earned: 2800 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Bug Bounty Program</h3>
              <p className="text-gray-400">Help us improve ProphetBase and earn rewards</p>
            </div>
            <Button>Report Issue</Button>
          </div>

          <div className="flex gap-2">
            {(['bug', 'security'] as const).map(type => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors capitalize ${
                  reportType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Reward Tiers */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Reward Tiers</h4>
          
          <div className="space-y-2">
            {[
              { severity: 'Critical', reward: '$1,000 - $5,000', color: 'text-red-400' },
              { severity: 'High', reward: '$500 - $1,000', color: 'text-orange-400' },
              { severity: 'Medium', reward: '$100 - $500', color: 'text-yellow-400' },
              { severity: 'Low', reward: '$50 - $100', color: 'text-green-400' },
            ].map((tier, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <span className={`font-semibold ${tier.color}`}>{tier.severity}</span>
                <span>{tier.reward}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* My Reports */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">My Reports</h4>
          
          <div className="space-y-3">
            {myReports.map(report => (
              <div key={report.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium mb-1">{report.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="capitalize text-xs">{report.severity}</Badge>
                      <Badge variant={report.status === 'fixed' ? 'success' : 'warning'} className="text-xs">
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                  <span className="font-bold text-yellow-400">${report.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Hall of Contributors */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">🏆 Hall of Contributors</h4>
          
          <div className="space-y-2">
            {topContributors.map(contributor => (
              <div key={contributor.rank} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    contributor.rank === 1 ? 'bg-yellow-500 text-black' :
                    contributor.rank === 2 ? 'bg-gray-400 text-black' :
                    'bg-orange-600 text-white'
                  }`}>
                    {contributor.rank}
                  </div>
                  <div>
                    <p className="font-medium">{contributor.name}</p>
                    <p className="text-sm text-gray-400">{contributor.bugs} bugs reported</p>
                  </div>
                </div>
                <span className="font-bold text-green-400">${contributor.earned.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
