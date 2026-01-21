'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const preferences = [
    { id: 'weekly', label: 'Weekly Digest', description: 'Top markets and trends', enabled: true },
    { id: 'new-markets', label: 'New Markets', description: 'Alerts for new prediction markets', enabled: true },
    { id: 'events', label: 'Community Events', description: 'Upcoming AMAs and competitions', enabled: false },
    { id: 'updates', label: 'Platform Updates', description: 'New features and improvements', enabled: true },
  ];

  const archive = [
    { title: 'Weekly Digest - Jan 15, 2024', date: 'Jan 15, 2024', topics: 5 },
    { title: 'Weekly Digest - Jan 8, 2024', date: 'Jan 8, 2024', topics: 6 },
    { title: 'Platform Update - Jan 1, 2024', date: 'Jan 1, 2024', topics: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
          <p className="text-gray-400">Stay updated with the latest from ProphetBase</p>
        </div>
      </Card>

      {/* Subscribe */}
      {!isSubscribed ? (
        <Card>
          <div className="p-6">
            <h4 className="font-semibold mb-4">Subscribe to Updates</h4>
            
            <div className="flex gap-4 mb-4">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => setIsSubscribed(true)}>Subscribe</Button>
            </div>

            <p className="text-sm text-gray-400">
              Get weekly updates, market insights, and exclusive content delivered to your inbox
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="p-6 text-center">
            <div className="inline-block bg-green-500/10 rounded-full p-4 mb-4">
              <span className="text-4xl">✓</span>
            </div>
            <h4 className="font-semibold mb-2">You're Subscribed!</h4>
            <p className="text-gray-400 mb-4">Check your email to confirm your subscription</p>
            <Button variant="secondary" onClick={() => setIsSubscribed(false)}>
              Unsubscribe
            </Button>
          </div>
        </Card>
      )}

      {/* Preferences */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Email Preferences</h4>
          
          <div className="space-y-3">
            {preferences.map(pref => (
              <div key={pref.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium mb-1">{pref.label}</p>
                  <p className="text-sm text-gray-400">{pref.description}</p>
                </div>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    pref.enabled ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    pref.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Archive */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Newsletter Archive</h4>
          
          <div className="space-y-2">
            {archive.map((newsletter, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer">
                <div>
                  <p className="font-medium text-sm">{newsletter.title}</p>
                  <p className="text-xs text-gray-400">{newsletter.date} • {newsletter.topics} topics</p>
                </div>
                <Button size="sm" variant="secondary">Read</Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Newsletter Stats</h4>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Subscribers</p>
              <p className="text-2xl font-bold">12.5K</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Open Rate</p>
              <p className="text-2xl font-bold">68%</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Issues Sent</p>
              <p className="text-2xl font-bold">52</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
