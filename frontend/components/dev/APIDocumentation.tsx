'use client';

import { useState } from 'react';

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  auth: boolean;
  params?: { name: string; type: string; required: boolean; description: string }[];
  response: string;
  example: string;
}

export default function APIDocumentation() {
  const [selectedCategory, setSelectedCategory] = useState<'markets' | 'trading' | 'user' | 'analytics'>('markets');

  const endpoints: Record<string, APIEndpoint[]> = {
    markets: [
      {
        method: 'GET',
        path: '/api/v1/markets',
        description: 'Get list of all markets',
        auth: false,
        params: [
          { name: 'limit', type: 'number', required: false, description: 'Number of results (default: 50)' },
          { name: 'category', type: 'string', required: false, description: 'Filter by category' }
        ],
        response: '{ "markets": [...], "total": 247 }',
        example: 'curl https://api.prophetbase.com/v1/markets?limit=10'
      },
      {
        method: 'GET',
        path: '/api/v1/markets/:id',
        description: 'Get specific market details',
        auth: false,
        params: [{ name: 'id', type: 'string', required: true, description: 'Market ID' }],
        response: '{ "id": "42", "question": "...", "volume": 125000, ... }',
        example: 'curl https://api.prophetbase.com/v1/markets/42'
      }
    ],
    trading: [
      {
        method: 'POST',
        path: '/api/v1/trades',
        description: 'Place a trade',
        auth: true,
        params: [
          { name: 'marketId', type: 'string', required: true, description: 'Market ID' },
          { name: 'outcome', type: 'string', required: true, description: 'YES or NO' },
          { name: 'amount', type: 'number', required: true, description: 'Amount in USDC' }
        ],
        response: '{ "success": true, "txHash": "0x..." }',
        example: 'curl -X POST https://api.prophetbase.com/v1/trades ...'
      }
    ],
    user: [
      {
        method: 'GET',
        path: '/api/v1/user/profile',
        description: 'Get user profile',
        auth: true,
        response: '{ "address": "0x...", "username": "...", "stats": {...} }',
        example: 'curl https://api.prophetbase.com/v1/user/profile ...'
      }
    ],
    analytics: [
      {
        method: 'GET',
        path: '/api/v1/analytics/market/:id',
        description: 'Get market analytics',
        auth: false,
        params: [{ name: 'id', type: 'string', required: true, description: 'Market ID' }],
        response: '{ "volume": 125000, "traders": 847, "volatility": 18.5, ... }',
        example: 'curl https://api.prophetbase.com/v1/analytics/market/42'
      }
    ]
  };

  const currentEndpoints = endpoints[selectedCategory];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Documentation</h2>
          <p className="text-sm text-gray-600">RESTful API for ProphetBase integration</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          v1.0.0
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 mb-6 border-b">
        {(['markets', 'trading', 'user', 'analytics'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-3 font-medium capitalize transition-colors ${
              selectedCategory === cat
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Endpoints */}
      <div className="space-y-4">
        {currentEndpoints.map((endpoint, index) => (
          <div key={index} className="border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded font-semibold text-sm ${
                endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {endpoint.method}
              </span>
              <span className="font-mono text-gray-900">{endpoint.path}</span>
              {endpoint.auth && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  🔒 Auth Required
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-4">{endpoint.description}</p>

            {endpoint.params && endpoint.params.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Parameters:</h4>
                <div className="bg-gray-50 rounded p-4">
                  {endpoint.params.map((param, i) => (
                    <div key={i} className="mb-2 last:mb-0">
                      <code className="text-blue-600">{param.name}</code>
                      <span className="text-gray-500 text-sm mx-2">({param.type})</span>
                      {param.required && <span className="text-red-600 text-xs">*required</span>}
                      <p className="text-sm text-gray-600 ml-4">{param.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Response:</h4>
              <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
                {endpoint.response}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Example:</h4>
              <pre className="bg-gray-900 text-gray-300 p-4 rounded overflow-x-auto text-sm">
                {endpoint.example}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Base URL Info */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">Base URL</h3>
        <code className="text-blue-600 font-mono">https://api.prophetbase.com</code>
        
        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Authentication</h3>
        <p className="text-gray-700 text-sm">
          Include your API key in the <code className="text-blue-600">X-API-Key</code> header for authenticated endpoints.
        </p>

        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Rate Limits</h3>
        <p className="text-gray-700 text-sm">
          • Free tier: 100 requests/hour<br />
          • Pro tier: 1000 requests/hour<br />
          • Enterprise: Unlimited
        </p>
      </div>
    </div>
  );
}
