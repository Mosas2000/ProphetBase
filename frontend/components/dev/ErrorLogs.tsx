'use client';

import { useState } from 'react';

interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  endpoint: string;
  userId?: string;
  stackTrace?: string;
}

export default function ErrorLogs() {
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info'>(
    'all'
  );
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);

  const logs: ErrorLog[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 120000),
      level: 'error',
      code: 'TRADE_FAILED',
      message: 'Insufficient balance for trade',
      endpoint: '/api/v1/trades',
      userId: '0x1234...5678',
      stackTrace:
        'Error: Insufficient balance\n  at tradingService.buy (trading.ts:247)\n  at handler (route.ts:18)',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000),
      level: 'warning',
      code: 'RATE_LIMIT_APPROACHING',
      message: 'API rate limit at 85% capacity',
      endpoint: '/api/v1/markets',
      userId: '0xabcd...efgh',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000),
      level: 'error',
      code: 'MARKET_NOT_FOUND',
      message: 'Market ID 999 does not exist',
      endpoint: '/api/v1/markets/999',
      userId: '0x9876...5432',
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 900000),
      level: 'info',
      code: 'WEBHOOK_RETRY',
      message: 'Webhook delivery retry succeeded',
      endpoint: '/webhooks/deliver',
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 1200000),
      level: 'error',
      code: 'AUTH_FAILED',
      message: 'Invalid API key provided',
      endpoint: '/api/v1/user/profile',
      stackTrace:
        'Error: Invalid API key\n  at authenticate (auth.ts:42)\n  at middleware (middleware.ts:15)',
    },
  ];

  const filteredLogs =
    filter === 'all' ? logs : logs.filter((log) => log.level === filter);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return '🔴';
      case 'warning':
        return '🟡';
      case 'info':
        return '🔵';
      default:
        return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Error Logs</h2>
          <p className="text-sm text-gray-600">
            Monitor and debug application errors
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {(['all', 'error', 'warning', 'info'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f}
            {f !== 'all' && (
              <span className="ml-2 text-xs">
                ({logs.filter((l) => l.level === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Logs List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedLog(log)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedLog?.id === log.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span>{getLevelIcon(log.level)}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getLevelColor(
                      log.level
                    )}`}
                  >
                    {log.level}
                  </span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {log.code}
                  </code>
                </div>
                <span className="text-xs text-gray-500">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-900 font-medium mb-1">
                {log.message}
              </p>
              <p className="text-xs text-gray-600">{log.endpoint}</p>
              {log.userId && (
                <p className="text-xs text-gray-500 mt-1">User: {log.userId}</p>
              )}
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No {filter !== 'all' ? filter : ''} logs found
            </div>
          )}
        </div>

        {/* Log Details */}
        <div>
          {selectedLog ? (
            <div className="border-2 border-gray-200 rounded-lg p-6 sticky top-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Log Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Level
                  </label>
                  <div className="mt-1">
                    <span
                      className={`px-3 py-1 rounded font-semibold text-sm uppercase ${getLevelColor(
                        selectedLog.level
                      )}`}
                    >
                      {selectedLog.level}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Error Code
                  </label>
                  <p className="mt-1 text-gray-900 font-mono">
                    {selectedLog.code}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Timestamp
                  </label>
                  <p className="mt-1 text-gray-900">
                    {selectedLog.timestamp.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Message
                  </label>
                  <p className="mt-1 text-gray-900">{selectedLog.message}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Endpoint
                  </label>
                  <p className="mt-1 text-blue-600 font-mono text-sm">
                    {selectedLog.endpoint}
                  </p>
                </div>

                {selectedLog.userId && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">
                      User ID
                    </label>
                    <p className="mt-1 text-gray-900 font-mono text-sm">
                      {selectedLog.userId}
                    </p>
                  </div>
                )}

                {selectedLog.stackTrace && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">
                      Stack Trace
                    </label>
                    <pre className="bg-gray-900 text-red-400 p-4 rounded-lg text-xs overflow-x-auto">
                      {selectedLog.stackTrace}
                    </pre>
                  </div>
                )}

                <div className="pt-4 border-t flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    View Similar
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
              Select a log to view details
            </div>
          )}
        </div>
      </div>

      {/* Error Statistics */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
          <div className="text-2xl font-bold text-red-700">
            {logs.filter((l) => l.level === 'error').length}
          </div>
          <div className="text-sm text-red-600">Errors (24h)</div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
          <div className="text-2xl font-bold text-yellow-700">
            {logs.filter((l) => l.level === 'warning').length}
          </div>
          <div className="text-sm text-yellow-600">Warnings (24h)</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-2xl font-bold text-blue-700">
            {logs.filter((l) => l.level === 'info').length}
          </div>
          <div className="text-sm text-blue-600">Info (24h)</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-2xl font-bold text-green-700">99.2%</div>
          <div className="text-sm text-green-600">Success Rate</div>
        </div>
      </div>
    </div>
  );
}
