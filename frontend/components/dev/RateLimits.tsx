'use client';

import { useState } from 'react';

interface RateLimit {
  tier: 'free' | 'pro' | 'enterprise';
  requests: number;
  period: string;
  current: number;
  resetAt: Date;
}

export default function RateLimits() {
  const [tier] = useState<'free' | 'pro' | 'enterprise'>('pro');

  const limits: Record<string, RateLimit> = {
    'API Requests': {
      tier,
      requests: tier === 'free' ? 100 : tier === 'pro' ? 1000 : 999999,
      period: 'hour',
      current: 247,
      resetAt: new Date(Date.now() + 3600000),
    },
    'WebSocket Connections': {
      tier,
      requests: tier === 'free' ? 5 : tier === 'pro' ? 50 : 999,
      period: 'concurrent',
      current: 12,
      resetAt: new Date(Date.now() + 3600000),
    },
    'Webhook Deliveries': {
      tier,
      requests: tier === 'free' ? 100 : tier === 'pro' ? 5000 : 999999,
      period: 'day',
      current: 1847,
      resetAt: new Date(Date.now() + 86400000),
    },
    Trades: {
      tier,
      requests: tier === 'free' ? 50 : tier === 'pro' ? 500 : 999999,
      period: 'hour',
      current: 89,
      resetAt: new Date(Date.now() + 3600000),
    },
  };

  const getPercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  const getColor = (percentage: number) => {
    if (percentage >= 90) return 'red';
    if (percentage >= 70) return 'yellow';
    return 'green';
  };

  const timeUntilReset = (resetAt: Date) => {
    const diff = resetAt.getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rate Limits</h2>
          <p className="text-sm text-gray-600">
            Monitor your API usage and limits
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full font-semibold text-sm ${
            tier === 'free'
              ? 'bg-gray-100 text-gray-700'
              : tier === 'pro'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-purple-100 text-purple-700'
          }`}
        >
          {tier.toUpperCase()} TIER
        </span>
      </div>

      {/* Rate Limit Cards */}
      <div className="space-y-4 mb-8">
        {Object.entries(limits).map(([name, limit]) => {
          const percentage = getPercentage(limit.current, limit.requests);
          const color = getColor(percentage);

          return (
            <div key={name} className="border-2 border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{name}</h3>
                <span className="text-sm text-gray-600">
                  Resets in {timeUntilReset(limit.resetAt)}
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-3">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all ${
                        color === 'green'
                          ? 'bg-green-500'
                          : color === 'yellow'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-right min-w-[120px]">
                  <span className="font-bold text-gray-900">
                    {limit.current.toLocaleString()}
                  </span>
                  <span className="text-gray-500"> / </span>
                  <span className="text-gray-700">
                    {limit.requests.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {percentage.toFixed(1)}% used
                </span>
                <span
                  className={`font-medium ${
                    color === 'green'
                      ? 'text-green-600'
                      : color === 'yellow'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {limit.requests - limit.current} remaining
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tier Comparison */}
      <div className="p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Tier Comparison</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="font-semibold text-gray-700">Feature</div>
          <div className="text-center font-semibold text-gray-700">Free</div>
          <div className="text-center font-semibold text-blue-700">Pro</div>
          <div className="text-center font-semibold text-purple-700">
            Enterprise
          </div>

          <div className="text-gray-700">API Requests</div>
          <div className="text-center text-gray-600">100/hour</div>
          <div className="text-center text-blue-600">1,000/hour</div>
          <div className="text-center text-purple-600">Unlimited</div>

          <div className="text-gray-700">WebSocket</div>
          <div className="text-center text-gray-600">5 concurrent</div>
          <div className="text-center text-blue-600">50 concurrent</div>
          <div className="text-center text-purple-600">Unlimited</div>

          <div className="text-gray-700">Webhooks</div>
          <div className="text-center text-gray-600">100/day</div>
          <div className="text-center text-blue-600">5,000/day</div>
          <div className="text-center text-purple-600">Unlimited</div>

          <div className="text-gray-700">Support</div>
          <div className="text-center text-gray-600">Community</div>
          <div className="text-center text-blue-600">Email</div>
          <div className="text-center text-purple-600">Priority + Slack</div>

          <div className="text-gray-700">Price</div>
          <div className="text-center text-gray-600">Free</div>
          <div className="text-center text-blue-600">$49/mo</div>
          <div className="text-center text-purple-600">Custom</div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">
            Upgrade to Pro
          </button>
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold">
            Contact Sales
          </button>
        </div>
      </div>

      {/* Best Practices */}
      <div className="mt-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3">💡 Best Practices</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Implement exponential backoff when approaching rate limits</li>
          <li>• Cache responses when possible to reduce API calls</li>
          <li>
            • Use WebSocket subscriptions instead of polling for real-time data
          </li>
          <li>
            • Monitor the{' '}
            <code className="text-blue-600">X-RateLimit-Remaining</code> header
          </li>
          <li>• Batch requests when the API supports it</li>
        </ul>
      </div>
    </div>
  );
}
