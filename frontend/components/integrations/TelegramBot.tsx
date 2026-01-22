'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

export function TelegramBot() {
  const [botConnected, setBotConnected] = useState(false);
  const [username, setUsername] = useState('');

  const commands = [
    { cmd: '/start', desc: 'Start the bot and get welcome message' },
    { cmd: '/markets', desc: 'View trending markets' },
    { cmd: '/portfolio', desc: 'Check your portfolio' },
    { cmd: '/alerts', desc: 'Manage price alerts' },
    { cmd: '/notify', desc: 'Toggle notifications' },
    { cmd: '/help', desc: 'Show all available commands' },
  ];

  const handleConnect = () => {
    if (!username) {
      alert('Please enter your Telegram username');
      return;
    }
    setBotConnected(true);
    alert(`Connected! Message @ProphetBaseBot on Telegram to get started.`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Telegram Bot</h3>

          {!botConnected ? (
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-6 border border-blue-500/30 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">✈️</span>
                <div>
                  <h4 className="text-xl font-bold mb-1">Connect Telegram</h4>
                  <p className="text-sm text-gray-400">Get real-time notifications and trade via Telegram</p>
                </div>
              </div>

              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your Telegram username"
                className="mb-4"
              />

              <Button className="w-full" onClick={handleConnect}>
                Connect Bot
              </Button>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">✈️</span>
                  <div>
                    <p className="font-semibold">Bot Connected</p>
                    <p className="text-sm text-gray-400">@{username}</p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              <Button variant="secondary" onClick={() => setBotConnected(false)}>
                Disconnect
              </Button>
            </div>
          )}

          {/* Bot Commands */}
          <div className="mb-6">
            <h4 className="font-semibold mb-4">Available Commands</h4>
            <div className="space-y-2">
              {commands.map((cmd, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <code className="text-blue-400 font-mono text-sm">{cmd.cmd}</code>
                    <p className="text-sm text-gray-400 mt-1">{cmd.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          {botConnected && (
            <div>
              <h4 className="font-semibold mb-4">Notification Settings</h4>
              <div className="space-y-3">
                {[
                  { label: 'Market Resolutions', enabled: true },
                  { label: 'Price Alerts', enabled: true },
                  { label: 'New Markets', enabled: false },
                  { label: 'Portfolio Updates', enabled: true },
                ].map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-sm">{setting.label}</span>
                    <button
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        setting.enabled ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          setting.enabled ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Group Integration */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Group Integration</h4>
          <p className="text-sm text-gray-400 mb-4">
            Add @ProphetBaseBot to your Telegram group to get market updates and trade together!
          </p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">1.</span>
              <p className="text-gray-300">Add @ProphetBaseBot to your group</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">2.</span>
              <p className="text-gray-300">Make the bot an admin</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">3.</span>
              <p className="text-gray-300">Use /setup to configure group settings</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
