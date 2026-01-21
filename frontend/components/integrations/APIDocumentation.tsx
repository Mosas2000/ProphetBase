'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export function APIDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('markets');
  const [response, setResponse] = useState('');

  const endpoints = {
    markets: {
      method: 'GET',
      path: '/api/markets',
      description: 'Get all active markets',
      params: [
        { name: 'category', type: 'string', required: false, desc: 'Filter by category' },
        { name: 'status', type: 'string', required: false, desc: 'Filter by status' },
      ],
      example: `curl -X GET "https://api.prophetbase.com/api/markets?category=crypto"`,
      response: `{
  "markets": [
    {
      "id": 1,
      "question": "Will Bitcoin reach $100k by 2024?",
      "category": "crypto",
      "yesPrice": 0.65,
      "noPrice": 0.35
    }
  ]
}`,
    },
    trade: {
      method: 'POST',
      path: '/api/trade',
      description: 'Execute a trade',
      params: [
        { name: 'marketId', type: 'number', required: true, desc: 'Market ID' },
        { name: 'position', type: 'string', required: true, desc: 'YES or NO' },
        { name: 'amount', type: 'number', required: true, desc: 'Trade amount' },
      ],
      example: `curl -X POST "https://api.prophetbase.com/api/trade" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"marketId": 1, "position": "YES", "amount": 100}'`,
      response: `{
  "success": true,
  "tradeId": "abc123",
  "shares": 153.85
}`,
    },
    portfolio: {
      method: 'GET',
      path: '/api/portfolio',
      description: 'Get user portfolio',
      params: [],
      example: `curl -X GET "https://api.prophetbase.com/api/portfolio" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      response: `{
  "positions": [
    {
      "marketId": 1,
      "position": "YES",
      "shares": 100,
      "avgPrice": 0.65,
      "currentValue": 75
    }
  ],
  "totalValue": 1250
}`,
    },
  };

  const handleTryIt = async () => {
    setResponse('Loading...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setResponse(endpoints[selectedEndpoint as keyof typeof endpoints].response);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">API Documentation</h3>

          {/* Endpoint Selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {Object.keys(endpoints).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedEndpoint(key)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  selectedEndpoint === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          {/* Endpoint Details */}
          {selectedEndpoint && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant={endpoints[selectedEndpoint as keyof typeof endpoints].method === 'GET' ? 'success' : 'warning'}>
                  {endpoints[selectedEndpoint as keyof typeof endpoints].method}
                </Badge>
                <code className="text-sm bg-gray-800 px-3 py-1 rounded">
                  {endpoints[selectedEndpoint as keyof typeof endpoints].path}
                </code>
              </div>

              <p className="text-gray-400">
                {endpoints[selectedEndpoint as keyof typeof endpoints].description}
              </p>

              {/* Parameters */}
              {endpoints[selectedEndpoint as keyof typeof endpoints].params.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Parameters</h4>
                  <div className="space-y-2">
                    {endpoints[selectedEndpoint as keyof typeof endpoints].params.map((param, idx) => (
                      <div key={idx} className="bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-blue-400">{param.name}</code>
                          <Badge variant="default" className="text-xs">{param.type}</Badge>
                          {param.required && <Badge variant="error" className="text-xs">Required</Badge>}
                        </div>
                        <p className="text-sm text-gray-400">{param.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Example */}
              <div>
                <h4 className="font-semibold mb-3">Example Request</h4>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400">
                    {endpoints[selectedEndpoint as keyof typeof endpoints].example}
                  </pre>
                </div>
              </div>

              {/* Try It Out */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Try It Out</h4>
                  <Button size="sm" onClick={handleTryIt}>
                    Send Request
                  </Button>
                </div>
                {response && (
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">{response}</pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Authentication */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Authentication</h4>
          <p className="text-sm text-gray-400 mb-4">
            All API requests require an API key. Include it in the Authorization header:
          </p>
          <div className="bg-gray-900 rounded-lg p-4">
            <code className="text-sm text-green-400">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
        </div>
      </Card>

      {/* Rate Limits */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Rate Limits</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Requests per minute</p>
              <p className="text-2xl font-bold">60</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Daily limit</p>
              <p className="text-2xl font-bold">10,000</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
