'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function Ambassadors() {
  const ambassadors = [
    { name: 'CryptoKing', region: 'North America', members: 234, events: 12, avatar: '👑' },
    { name: 'TradeQueen', region: 'Europe', members: 189, events: 8, avatar: '👸' },
  ];

  const perks = [
    'Exclusive Ambassador badge',
    'Early access to new features',
    'Monthly rewards (up to $500)',
    'Direct line to the team',
    'Special Discord channel',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Ambassador Program</h3>
          <p className="text-gray-400">Lead your community and earn exclusive rewards</p>
        </div>
      </Card>

      {/* Ambassadors */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Community Leaders</h4>
          
          <div className="space-y-3">
            {ambassadors.map((ambassador, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{ambassador.avatar}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{ambassador.name}</p>
                        <Badge variant="default" className="bg-purple-500">Ambassador</Badge>
                      </div>
                      <p className="text-sm text-gray-400">{ambassador.region}</p>
                      <p className="text-sm">{ambassador.members} members • {ambassador.events} events hosted</p>
                    </div>
                  </div>
                  <Button size="sm">Contact</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Perks */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Ambassador Perks</h4>
          
          <div className="space-y-2">
            {perks.map((perk, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-purple-400">✓</span>
                <p>{perk}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Dashboard */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">My Dashboard</h4>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Members Recruited</p>
              <p className="text-2xl font-bold">45</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Events Hosted</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Rewards Earned</p>
              <p className="text-2xl font-bold text-yellow-400">$150</p>
            </div>
          </div>

          <Button className="w-full">Apply to Become Ambassador</Button>
        </div>
      </Card>
    </div>
  );
}
