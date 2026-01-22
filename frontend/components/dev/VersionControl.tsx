'use client';

import { useState } from 'react';

interface Version {
  version: string;
  date: Date;
  author: string;
  changes: string[];
  breaking: boolean;
  status: 'deployed' | 'staging' | 'development';
}

export default function VersionControl() {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

  const versions: Version[] = [
    {
      version: 'v2.4.1',
      date: new Date(Date.now() - 86400000),
      author: 'dev@prophetbase.com',
      changes: [
        'Fixed market resolution bug',
        'Improved error handling for trades',
        'Updated UI styling for mobile',
      ],
      breaking: false,
      status: 'deployed',
    },
    {
      version: 'v2.4.0',
      date: new Date(Date.now() - 86400000 * 3),
      author: 'dev@prophetbase.com',
      changes: [
        'Added webhook support',
        'New analytics dashboard',
        'Performance improvements',
        'WebSocket optimization',
      ],
      breaking: true,
      status: 'deployed',
    },
    {
      version: 'v2.3.2',
      date: new Date(Date.now() - 86400000 * 7),
      author: 'dev@prophetbase.com',
      changes: [
        'Security patch for API keys',
        'Fixed memory leak in WebSocket',
        'Updated dependencies',
      ],
      breaking: false,
      status: 'deployed',
    },
    {
      version: 'v2.5.0-beta',
      date: new Date(Date.now() - 3600000),
      author: 'dev@prophetbase.com',
      changes: [
        'New trading bot features',
        'AI-powered predictions (experimental)',
        'Advanced charting tools',
      ],
      breaking: true,
      status: 'staging',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-100 text-green-700';
      case 'staging':
        return 'bg-yellow-100 text-yellow-700';
      case 'development':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Version Control</h2>
          <p className="text-sm text-gray-600">
            API version history and release management
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Current Version</div>
          <div className="text-2xl font-bold text-blue-600">v2.4.1</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Versions List */}
        <div className="col-span-1 space-y-3">
          {versions.map((version) => (
            <div
              key={version.version}
              onClick={() => setSelectedVersion(version)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedVersion?.version === version.version
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">
                  {version.version}
                </span>
                {version.breaking && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">
                    BREAKING
                  </span>
                )}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded font-semibold uppercase ${getStatusColor(
                  version.status
                )}`}
              >
                {version.status}
              </span>
              <p className="text-xs text-gray-500 mt-2">
                {version.date.toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Version Details */}
        <div className="col-span-2">
          {selectedVersion ? (
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedVersion.version}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-gray-600">
                      Released {selectedVersion.date.toLocaleString()}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      by {selectedVersion.author}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full font-semibold uppercase text-sm ${getStatusColor(
                    selectedVersion.status
                  )}`}
                >
                  {selectedVersion.status}
                </span>
              </div>

              {selectedVersion.breaking && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-700 font-semibold mb-2">
                    <span>⚠️</span>
                    <span>Breaking Changes</span>
                  </div>
                  <p className="text-sm text-red-600">
                    This version contains breaking changes that may require code
                    updates.
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Changelog</h4>
                <ul className="space-y-2">
                  {selectedVersion.changes.map((change, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-gray-700">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">
                  View Full Changelog
                </button>
                {selectedVersion.status !== 'deployed' && (
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold">
                    Deploy to Production
                  </button>
                )}
              </div>

              {/* Migration Guide */}
              {selectedVersion.breaking && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Migration Guide
                  </h4>
                  <pre className="bg-gray-900 text-gray-300 p-4 rounded text-sm overflow-x-auto">
                    {`// Before (v2.3.x)
const trade = await client.buy({
  market: '42',
  outcome: 'YES',
  amount: 100
});

// After (v2.4.0+)
const trade = await client.trading.buy({
  marketId: '42',
  outcome: 'YES',
  amount: 100
});`}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
              Select a version to view details
            </div>
          )}
        </div>
      </div>

      {/* Version Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-2xl font-bold text-blue-700">v2.4.1</div>
          <div className="text-sm text-blue-600">Latest Version</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-2xl font-bold text-green-700">12</div>
          <div className="text-sm text-green-600">Total Releases</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <div className="text-2xl font-bold text-purple-700">42</div>
          <div className="text-sm text-purple-600">Features Added</div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
          <div className="text-2xl font-bold text-yellow-700">3</div>
          <div className="text-sm text-yellow-600">Breaking Changes</div>
        </div>
      </div>

      {/* Deprecation Warnings */}
      <div className="mt-6 p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
        <h3 className="font-semibold text-gray-900 mb-3">
          📢 Deprecation Notices
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="text-orange-700">
            •{' '}
            <code className="bg-orange-100 px-2 py-1 rounded">
              /api/v1/legacy/markets
            </code>{' '}
            will be removed in v3.0.0 (use{' '}
            <code className="bg-orange-100 px-2 py-1 rounded">
              /api/v1/markets
            </code>
            )
          </li>
          <li className="text-orange-700">
            • The <code className="bg-orange-100 px-2 py-1 rounded">buy()</code>{' '}
            method signature will change in v2.5.0
          </li>
        </ul>
      </div>
    </div>
  );
}
