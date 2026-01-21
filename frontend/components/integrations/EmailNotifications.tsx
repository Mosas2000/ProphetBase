'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

export function EmailNotifications() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }
    setIsSubscribed(true);
    alert(`Subscribed! Check ${email} for confirmation.`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Email Notifications</h3>

          {!isSubscribed ? (
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-500/30 mb-6">
              <h4 className="text-xl font-bold mb-2">Stay Updated</h4>
              <p className="text-sm text-gray-400 mb-4">
                Get important market updates and notifications delivered to your inbox
              </p>

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mb-4"
              />

              <Button className="w-full" onClick={handleSubscribe}>
                Subscribe
              </Button>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 mb-6">
              <p className="font-semibold mb-1">✓ Subscribed</p>
              <p className="text-sm text-gray-400 mb-4">{email}</p>
              <Button variant="secondary" onClick={() => setIsSubscribed(false)}>
                Update Preferences
              </Button>
            </div>
          )}

          {/* Email Preferences */}
          {isSubscribed && (
            <div className="space-y-4">
              <h4 className="font-semibold">Email Preferences</h4>
              
              {[
                { label: 'Market Resolutions', desc: 'When markets you traded in resolve', enabled: true },
                { label: 'Price Alerts', desc: 'When prices hit your targets', enabled: true },
                { label: 'Portfolio Updates', desc: 'Daily portfolio summary', enabled: false },
                { label: 'New Markets', desc: 'Weekly digest of new markets', enabled: true },
                { label: 'Platform Updates', desc: 'Important announcements', enabled: true },
              ].map((pref, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">{pref.label}</p>
                    <p className="text-sm text-gray-400">{pref.desc}</p>
                  </div>
                  <button
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      pref.enabled ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        pref.enabled ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Digest Settings */}
      {isSubscribed && (
        <Card>
          <div className="p-6">
            <h4 className="font-semibold mb-4">Digest Frequency</h4>
            
            <div className="space-y-2">
              {['Daily', 'Weekly', 'Monthly'].map((freq) => (
                <label key={freq} className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750">
                  <input type="radio" name="frequency" className="mr-3" defaultChecked={freq === 'Weekly'} />
                  <span>{freq} Digest</span>
                </label>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Unsubscribe */}
      {isSubscribed && (
        <Card>
          <div className="p-6">
            <h4 className="font-semibold mb-4">Unsubscribe</h4>
            <p className="text-sm text-gray-400 mb-4">
              You can unsubscribe from all emails at any time
            </p>
            <Button variant="error" onClick={() => setIsSubscribed(false)}>
              Unsubscribe from All Emails
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
