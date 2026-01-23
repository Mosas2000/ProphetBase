'use client';

import {
  AlertTriangle,
  ArrowRightLeft,
  Download,
  FileText,
  Filter,
  LogIn,
  Search,
  Settings,
  Shield,
} from 'lucide-react';
import { useState } from 'react';

interface AuditEntry {
  id: string;
  timestamp: Date;
  type: 'login' | 'logout' | 'transaction' | 'security' | 'settings' | 'admin';
  action: string;
  description: string;
  ip: string;
  location: string;
  device: string;
  status: 'success' | 'failed' | 'warning';
  metadata?: Record<string, any>;
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([
    {
      id: '1',
      timestamp: new Date(),
      type: 'transaction',
      action: 'Transfer USDC',
      description: 'Transferred 100 USDC to 0x8ba1...DBA72',
      ip: '192.168.1.100',
      location: 'San Francisco, US',
      device: 'Chrome on macOS',
      status: 'success',
      metadata: { amount: 100, token: 'USDC', txHash: '0xabc123...' },
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'login',
      action: 'Successful Login',
      description: 'Logged in with 2FA verification',
      ip: '192.168.1.100',
      location: 'San Francisco, US',
      device: 'Chrome on macOS',
      status: 'success',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: 'security',
      action: 'Password Changed',
      description: 'Password updated successfully',
      ip: '192.168.1.100',
      location: 'San Francisco, US',
      device: 'Chrome on macOS',
      status: 'success',
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      type: 'login',
      action: 'Failed Login Attempt',
      description: 'Invalid password entered',
      ip: '203.45.67.89',
      location: 'Los Angeles, US',
      device: 'Firefox on Windows',
      status: 'failed',
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      type: 'transaction',
      action: 'Stake PROPHET',
      description: 'Staked 5000 PROPHET tokens',
      ip: '192.168.1.105',
      location: 'San Francisco, US',
      device: 'Safari on iOS',
      status: 'success',
      metadata: { amount: 5000, token: 'PROPHET', duration: '90 days' },
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
      type: 'settings',
      action: 'Notification Preferences Updated',
      description: 'Email notifications enabled',
      ip: '192.168.1.100',
      location: 'San Francisco, US',
      device: 'Chrome on macOS',
      status: 'success',
    },
    {
      id: '7',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      type: 'security',
      action: '2FA Enabled',
      description: 'Two-factor authentication activated',
      ip: '192.168.1.100',
      location: 'San Francisco, US',
      device: 'Chrome on macOS',
      status: 'success',
    },
    {
      id: '8',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
      type: 'transaction',
      action: 'Withdraw Failed',
      description: 'Insufficient balance for withdrawal',
      ip: '192.168.1.100',
      location: 'San Francisco, US',
      device: 'Chrome on macOS',
      status: 'warning',
      metadata: { amount: 1000, token: 'USDC' },
    },
    {
      id: '9',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      type: 'login',
      action: 'Session Expired',
      description: 'Automatic logout due to inactivity',
      ip: '192.168.1.100',
      location: 'San Francisco, US',
      device: 'Chrome on macOS',
      status: 'warning',
    },
    {
      id: '10',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
      type: 'admin',
      action: 'KYC Verification',
      description: 'Identity verification completed',
      ip: '192.168.1.100',
      location: 'San Francisco, US',
      device: 'Chrome on macOS',
      status: 'success',
    },
  ]);

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'all'>(
    '7d'
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login':
      case 'logout':
        return <LogIn className="w-4 h-4" />;
      case 'transaction':
        return <ArrowRightLeft className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'settings':
        return <Settings className="w-4 h-4" />;
      case 'admin':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'login':
      case 'logout':
        return 'bg-blue-600/20 text-blue-400';
      case 'transaction':
        return 'bg-purple-600/20 text-purple-400';
      case 'security':
        return 'bg-green-600/20 text-green-400';
      case 'settings':
        return 'bg-yellow-600/20 text-yellow-400';
      case 'admin':
        return 'bg-red-600/20 text-red-400';
      default:
        return 'bg-slate-600/20 text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return '✓ Success';
      case 'failed':
        return '✗ Failed';
      case 'warning':
        return '⚠ Warning';
      default:
        return status;
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filterType !== 'all' && log.type !== filterType) return false;
    if (filterStatus !== 'all' && log.status !== filterStatus) return false;
    if (
      searchQuery &&
      !log.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    const cutoffTime = {
      '24h': Date.now() - 1000 * 60 * 60 * 24,
      '7d': Date.now() - 1000 * 60 * 60 * 24 * 7,
      '30d': Date.now() - 1000 * 60 * 60 * 24 * 30,
      all: 0,
    }[dateRange];

    if (log.timestamp.getTime() < cutoffTime) return false;

    return true;
  });

  const handleExportLogs = (format: 'json' | 'csv') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(filteredLogs, null, 2);
      filename = 'audit-logs.json';
      mimeType = 'application/json';
    } else {
      const headers = [
        'Timestamp',
        'Type',
        'Action',
        'Description',
        'IP',
        'Location',
        'Device',
        'Status',
      ];
      const rows = filteredLogs.map((log) => [
        log.timestamp.toISOString(),
        log.type,
        log.action,
        log.description,
        log.ip,
        log.location,
        log.device,
        log.status,
      ]);
      content = [headers, ...rows].map((row) => row.join(',')).join('\n');
      filename = 'audit-logs.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: filteredLogs.length,
    success: filteredLogs.filter((l) => l.status === 'success').length,
    failed: filteredLogs.filter((l) => l.status === 'failed').length,
    warning: filteredLogs.filter((l) => l.status === 'warning').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Audit Log</h1>
              <p className="text-slate-400">
                Complete activity history and security events
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Total Events</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Success</div>
            <div className="text-2xl font-bold text-green-400">
              {stats.success}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Failed</div>
            <div className="text-2xl font-bold text-red-400">
              {stats.failed}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Warnings</div>
            <div className="text-2xl font-bold text-yellow-400">
              {stats.warning}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm text-slate-400 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search actions or descriptions..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Types</option>
                <option value="login">Login/Logout</option>
                <option value="transaction">Transactions</option>
                <option value="security">Security</option>
                <option value="settings">Settings</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {/* Date Range */}
            <div className="flex gap-2">
              {(['24h', '7d', '30d', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {range === 'all' ? 'All Time' : range}
                </button>
              ))}
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2 sm:ml-auto">
              <button
                onClick={() => handleExportLogs('csv')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleExportLogs('json')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">
                    Timestamp
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">
                    Type
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">
                    Action
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">
                    Location
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">
                    Device
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={`border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                      index === filteredLogs.length - 1 ? '' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        {log.timestamp.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          log.type
                        )}`}
                      >
                        {getTypeIcon(log.type)}
                        <span className="capitalize">{log.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium">{log.action}</div>
                      <div className="text-sm text-slate-400">
                        {log.description}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">{log.location}</div>
                      <div className="text-xs text-slate-400">{log.ip}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">{log.device}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-sm font-medium ${getStatusColor(
                          log.status
                        )}`}
                      >
                        {getStatusLabel(log.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <div>No audit logs found matching your filters</div>
            </div>
          )}
        </div>

        {/* GDPR Notice */}
        <div className="mt-8 p-4 bg-blue-600/10 border border-blue-600/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <strong className="text-blue-400">Privacy Notice:</strong> Audit
              logs are retained for 90 days for security purposes in compliance
              with GDPR. You can export your logs at any time or request
              deletion by contacting support.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
