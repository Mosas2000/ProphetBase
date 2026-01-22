'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      name: 'Response Time',
      value: 247,
      unit: 'ms',
      status: 'good',
      trend: 'stable',
    },
    {
      name: 'Requests/sec',
      value: 142,
      unit: 'req/s',
      status: 'good',
      trend: 'up',
    },
    {
      name: 'Error Rate',
      value: 0.8,
      unit: '%',
      status: 'good',
      trend: 'down',
    },
    {
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      status: 'good',
      trend: 'stable',
    },
    {
      name: 'Memory Usage',
      value: 62,
      unit: '%',
      status: 'warning',
      trend: 'up',
    },
    {
      name: 'DB Query Time',
      value: 89,
      unit: 'ms',
      status: 'good',
      trend: 'stable',
    },
  ]);

  const [history, setHistory] = useState<number[][]>(
    metrics.map(() =>
      Array(20)
        .fill(0)
        .map(() => Math.random() * 100)
    )
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: Math.max(0, m.value + (Math.random() - 0.5) * 10),
        }))
      );

      setHistory((prev) =>
        prev.map((h) => {
          const newHistory = [...h.slice(1), Math.random() * 100];
          return newHistory;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '➡️';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Performance Monitor
          </h2>
          <p className="text-sm text-gray-600">
            Real-time system performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div
            key={metric.name}
            className={`border-2 rounded-lg p-5 ${getStatusColor(
              metric.status
            )}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{metric.name}</h3>
              <span className="text-2xl">{getTrendIcon(metric.trend)}</span>
            </div>
            <div className="flex items-baseline space-x-2 mb-3">
              <span className="text-3xl font-bold text-gray-900">
                {metric.value.toFixed(metric.unit === '%' ? 1 : 0)}
              </span>
              <span className="text-lg text-gray-600">{metric.unit}</span>
            </div>
            {/* Mini Chart */}
            <div className="flex items-end space-x-0.5 h-12">
              {history[index]?.slice(-15).map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-700 rounded-t opacity-60 hover:opacity-100 transition-opacity"
                  style={{ height: `${(h / 100) * 100}%`, minHeight: '2px' }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 gap-6">
        {/* Endpoint Performance */}
        <div className="border-2 border-gray-200 rounded-lg p-5">
          <h3 className="font-semibold text-gray-900 mb-4">
            Slowest Endpoints
          </h3>
          <div className="space-y-3">
            {[
              { endpoint: '/api/v1/analytics/market/:id', time: 892 },
              { endpoint: '/api/v1/trades', time: 547 },
              { endpoint: '/api/v1/markets', time: 324 },
              { endpoint: '/api/v1/user/portfolio', time: 289 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <code className="text-xs text-blue-600">{item.endpoint}</code>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.time > 500
                          ? 'bg-red-500'
                          : item.time > 300
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.min((item.time / 1000) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                    {item.time}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Database Stats */}
        <div className="border-2 border-gray-200 rounded-lg p-5">
          <h3 className="font-semibold text-gray-900 mb-4">
            Database Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Active Connections</span>
              <span className="font-semibold text-gray-900">47 / 100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Avg Query Time</span>
              <span className="font-semibold text-gray-900">89ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Slow Queries</span>
              <span className="font-semibold text-red-600">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Cache Hit Rate</span>
              <span className="font-semibold text-green-600">94.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">
              System Health Score
            </h3>
            <p className="text-sm text-gray-600">All systems operational</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-5xl font-bold text-green-600">94</div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">API</div>
            <div className="font-semibold text-green-600">✓ Healthy</div>
          </div>
          <div>
            <div className="text-gray-600">Database</div>
            <div className="font-semibold text-green-600">✓ Healthy</div>
          </div>
          <div>
            <div className="text-gray-600">Cache</div>
            <div className="font-semibold text-green-600">✓ Healthy</div>
          </div>
          <div>
            <div className="text-gray-600">WebSocket</div>
            <div className="font-semibold text-yellow-600">⚠ Warning</div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-900 mb-3">Recent Alerts</h3>
        <div className="space-y-2">
          {[
            {
              time: '2 mins ago',
              message: 'Memory usage exceeded 60%',
              severity: 'warning',
            },
            {
              time: '15 mins ago',
              message: 'Slow query detected on trades table',
              severity: 'warning',
            },
            {
              time: '1 hour ago',
              message: 'API rate limit reached for user 0x1234...',
              severity: 'info',
            },
          ].map((alert, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border-2 ${
                alert.severity === 'warning'
                  ? 'bg-yellow-50 border-yellow-300'
                  : alert.severity === 'error'
                  ? 'bg-red-50 border-red-300'
                  : 'bg-blue-50 border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{alert.message}</span>
                <span className="text-sm text-gray-600">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
