'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function DiscordWidget() {
  const memberCount = 1234;
  const onlineCount = 456;

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Discord Community</h3>

          {/* Server Info */}
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg p-6 border border-indigo-500/30 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-3xl">
                💬
              </div>
              <div>
                <h4 className="text-xl font-bold">ProphetBase</h4>
                <p className="text-sm text-gray-400">Official Discord Server</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-sm text-gray-400 mb-1">Members</p>
                <p className="text-2xl font-bold">{memberCount.toLocaleString()}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500 rounded-lg p-3">
                <p className="text-sm text-gray-400 mb-1">Online</p>
                <p className="text-2xl font-bold text-green-400">{onlineCount}</p>
              </div>
            </div>

            <Button className="w-full" onClick={() => window.open('https://discord.gg/prophetbase', '_blank')}>
              Join Discord
            </Button>
          </div>

          {/* Channels */}
          <div className="space-y-2 mb-6">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Popular Channels</h4>
            {[
              { name: '📢 announcements', members: 1234 },
              { name: '💬 general', members: 856 },
              { name: '📊 trading', members: 642 },
              { name: '🎯 market-discussion', members: 523 },
            ].map((channel, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <span className="font-medium">{channel.name}</span>
                <span className="text-sm text-gray-400">{channel.members} members</span>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {[
                { user: 'trader123', message: 'Just made my first trade!', time: '2m ago' },
                { user: 'cryptowhale', message: 'BTC looking bullish 🚀', time: '5m ago' },
                { user: 'analyst', message: 'New market analysis posted', time: '12m ago' },
              ].map((activity, idx) => (
                <div key={idx} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{activity.user}</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-400">{activity.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Benefits */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Community Benefits</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p className="text-gray-300">Get real-time market alerts and updates</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p className="text-gray-300">Connect with other traders and analysts</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p className="text-gray-300">Access exclusive trading strategies</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p className="text-gray-300">Participate in community events and giveaways</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
