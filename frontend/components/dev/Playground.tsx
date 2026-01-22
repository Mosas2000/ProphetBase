'use client';

import { useState } from 'react';

export default function Playground() {
  const [endpoint, setEndpoint] = useState('/api/v1/markets');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>(
    'GET'
  );
  const [params, setParams] = useState(
    '{\n  "limit": 10,\n  "category": "crypto"\n}'
  );
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const quickActions = [
    {
      label: 'Get Markets',
      endpoint: '/api/v1/markets',
      method: 'GET',
      params: '{\n  "limit": 10\n}',
    },
    {
      label: 'Get Market #42',
      endpoint: '/api/v1/markets/42',
      method: 'GET',
      params: '{}',
    },
    {
      label: 'Place Trade',
      endpoint: '/api/v1/trades',
      method: 'POST',
      params: '{\n  "marketId": "42",\n  "outcome": "YES",\n  "amount": 10\n}',
    },
    {
      label: 'User Profile',
      endpoint: '/api/v1/user/profile',
      method: 'GET',
      params: '{}',
    },
  ];

  const executeRequest = async () => {
    setLoading(true);
    setResponse('');
    setStatusCode(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResponse = {
        markets: [
          {
            id: '42',
            question: 'Will Bitcoin reach $100k by EOY?',
            volume: 125000,
          },
          { id: '43', question: 'Will ETH pass $5k in 2024?', volume: 89000 },
        ],
        total: 247,
        page: 1,
      };

      setResponse(JSON.stringify(mockResponse, null, 2));
      setStatusCode(200);
    } catch (error) {
      setResponse(JSON.stringify({ error: 'Request failed' }, null, 2));
      setStatusCode(500);
    } finally {
      setLoading(false);
    }
  };

  const loadQuickAction = (action: (typeof quickActions)[0]) => {
    setEndpoint(action.endpoint);
    setMethod(action.method as any);
    setParams(action.params);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          API Playground
        </h2>
        <p className="text-sm text-gray-600">
          Test API endpoints in real-time without writing code
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => loadQuickAction(action)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Request Panel */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Request</h3>

          {/* Method Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Method
            </label>
            <div className="flex space-x-2">
              {(['GET', 'POST', 'PUT', 'DELETE'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                    method === m
                      ? m === 'GET'
                        ? 'bg-green-600 text-white'
                        : m === 'POST'
                        ? 'bg-blue-600 text-white'
                        : m === 'PUT'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endpoint
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 font-mono text-sm"
              placeholder="/api/v1/markets"
            />
          </div>

          {/* Parameters */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {method === 'GET' ? 'Query Parameters' : 'Request Body'}
            </label>
            <textarea
              value={params}
              onChange={(e) => setParams(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 font-mono text-sm"
            />
          </div>

          {/* Execute Button */}
          <button
            onClick={executeRequest}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? '⏳ Executing...' : '▶ Execute Request'}
          </button>
        </div>

        {/* Response Panel */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Response</h3>
            {statusCode && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  statusCode === 200
                    ? 'bg-green-100 text-green-700'
                    : statusCode >= 400
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {statusCode}
              </span>
            )}
          </div>

          {response ? (
            <div className="relative">
              <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-auto text-sm max-h-[600px]">
                {response}
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(response)}
                className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
              >
                Copy
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
              Response will appear here after execution
            </div>
          )}

          {/* Response Info */}
          {response && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Response Time:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    247ms
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Size:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {(response.length / 1024).toFixed(2)} KB
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Code Snippet Generator */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Generated Code</h3>
        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
          {`// JavaScript/TypeScript
const response = await fetch('https://api.prophetbase.com${endpoint}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: ${method !== 'GET' ? `JSON.stringify(${params})` : 'null'}
});
const data = await response.json();`}
        </pre>
      </div>
    </div>
  );
}
