'use client';

import { useState } from 'react';

export default function APITrading() {
  const [apiKey, setApiKey] = useState('pk_live_...');
  const [endpoint, setEndpoint] = useState('/api/markets');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState('');
  const [rateLimit, setRateLimit] = useState({ used: 450, limit: 1000, reset: 3600 });

  const makeRequest = async () => {
    setResponse(JSON.stringify({
      success: true,
      data: { markets: [{ id: 0, question: 'Will ETH hit $5k?' }] }
    }, null, 2));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Trading</h1>
        <p className="text-gray-600">Trade programmatically via REST API</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Playground */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">API Playground</h2>

            {/* API Key */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium">
                  Show
                </button>
              </div>
            </div>

            {/* Method & Endpoint */}
            <div className="flex gap-2 mb-4">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="/api/markets"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={makeRequest}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-4"
            >
              Send Request
            </button>

            {/* Response */}
            {response && (
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Response</span>
                  <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">200 OK</span>
                </div>
                <pre className="text-green-400 text-sm font-mono overflow-x-auto">{response}</pre>
              </div>
            )}
          </div>

          {/* Code Examples */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Code Examples</h2>
            <div className="space-y-4">
              {['JavaScript', 'Python', 'cURL'].map((lang) => (
                <div key={lang} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">{lang}</p>
                  <pre className="text-sm text-gray-700 font-mono overflow-x-auto">
                    {lang === 'cURL'
                      ? `curl -X GET "https://api.prophetbase.io/v1/markets" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
                      : `// ${lang} example coming soon...`}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Documentation & Limits */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Rate Limits</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Usage</span>
                  <span className="font-semibold">{rateLimit.used}/{rateLimit.limit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(rateLimit.used / rateLimit.limit) * 100}%` }}
                  />
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Resets in</p>
                <p className="text-lg font-bold text-blue-600">
                  {Math.floor(rateLimit.reset / 60)}m {rateLimit.reset % 60}s
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Endpoints</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-mono text-xs">GET</span>
                <span className="font-mono">/markets</span>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-mono text-xs">POST</span>
                <span className="font-mono">/trades</span>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-mono text-xs">GET</span>
                <span className="font-mono">/balances</span>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded font-mono text-xs">PUT</span>
                <span className="font-mono">/orders</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-500">
            <h3 className="font-bold text-blue-900 mb-3">API Keys</h3>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 mb-2">
              Generate New Key
            </button>
            <p className="text-xs text-blue-800">
              Keep your API keys secure. Never share them publicly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
