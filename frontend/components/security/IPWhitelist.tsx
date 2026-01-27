'use client';

import {
  AlertTriangle,
  Check,
  Download,
  Globe,
  MapPin,
  Plus,
  Shield,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface WhitelistedIP {
  id: string;
  address: string;
  label: string;
  country: string;
  addedDate: Date;
  lastUsed: Date | null;
  active: boolean;
}

interface GeoBlockRule {
  id: string;
  country: string;
  countryCode: string;
  action: 'block' | 'allow';
  reason: string;
}

interface AccessLog {
  id: string;
  ip: string;
  country: string;
  action: 'allowed' | 'blocked';
  reason: string;
  timestamp: Date;
  vpnDetected: boolean;
}

export default function IPWhitelist() {
  const [whitelistedIPs, setWhitelistedIPs] = useState<WhitelistedIP[]>([
    {
      id: '1',
      address: '203.0.113.42',
      label: 'Home Network',
      country: 'United States',
      addedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2),
      active: true,
    },
    {
      id: '2',
      address: '198.51.100.15',
      label: 'Office',
      country: 'United States',
      addedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24),
      active: true,
    },
    {
      id: '3',
      address: '192.0.2.123',
      label: 'VPN Server',
      country: 'Germany',
      addedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      lastUsed: null,
      active: false,
    },
  ]);

  const [geoBlockRules, setGeoBlockRules] = useState<GeoBlockRule[]>([
    {
      id: '1',
      country: 'North Korea',
      countryCode: 'KP',
      action: 'block',
      reason: 'Sanctions compliance',
    },
    {
      id: '2',
      country: 'Iran',
      countryCode: 'IR',
      action: 'block',
      reason: 'Sanctions compliance',
    },
    {
      id: '3',
      country: 'Syria',
      countryCode: 'SY',
      action: 'block',
      reason: 'Sanctions compliance',
    },
  ]);

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([
    {
      id: '1',
      ip: '203.0.113.42',
      country: 'United States',
      action: 'allowed',
      reason: 'IP whitelisted',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      vpnDetected: false,
    },
    {
      id: '2',
      ip: '185.220.101.34',
      country: 'Russia',
      action: 'blocked',
      reason: 'VPN/Proxy detected',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      vpnDetected: true,
    },
    {
      id: '3',
      ip: '91.108.56.123',
      country: 'Iran',
      action: 'blocked',
      reason: 'Geo-blocked country',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      vpnDetected: false,
    },
  ]);

  const [currentIP, setCurrentIP] = useState('203.0.113.42');
  const [currentCountry, setCurrentCountry] = useState('United States');

  const [newIP, setNewIP] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [isAddingIP, setIsAddingIP] = useState(false);

  const [whitelistMode, setWhitelistMode] = useState<
    'disabled' | 'enabled' | 'strict'
  >('enabled');
  const [blockVPNs, setBlockVPNs] = useState(true);
  const [blockTor, setBlockTor] = useState(true);
  const [requireWhitelist, setRequireWhitelist] = useState(false);

  const handleAddIP = () => {
    if (!newIP || !newLabel) return;

    const newEntry: WhitelistedIP = {
      id: Date.now().toString(),
      address: newIP,
      label: newLabel,
      country: currentCountry,
      addedDate: new Date(),
      lastUsed: null,
      active: true,
    };

    setWhitelistedIPs((prev) => [newEntry, ...prev]);
    setNewIP('');
    setNewLabel('');
    setIsAddingIP(false);
  };

  const handleRemoveIP = (id: string) => {
    setWhitelistedIPs((prev) => prev.filter((ip) => ip.id !== id));
  };

  const toggleIPStatus = (id: string) => {
    setWhitelistedIPs((prev) =>
      prev.map((ip) => (ip.id === id ? { ...ip, active: !ip.active } : ip))
    );
  };

  const handleAddGeoBlock = (country: string, countryCode: string) => {
    const newRule: GeoBlockRule = {
      id: Date.now().toString(),
      country,
      countryCode,
      action: 'block',
      reason: 'User defined',
    };
    setGeoBlockRules((prev) => [newRule, ...prev]);
  };

  const handleRemoveGeoBlock = (id: string) => {
    setGeoBlockRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleString();
  };

  const formatRelativeTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const activeIPs = whitelistedIPs.filter((ip) => ip.active).length;
  const blockedAttempts = accessLogs.filter(
    (log) => log.action === 'blocked'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                IP Whitelist & Access Control
              </h1>
              <p className="text-slate-400">
                Manage IP restrictions and geo-blocking
              </p>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Current IP</span>
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold mb-1 font-mono">{currentIP}</div>
            <div className="text-xs text-slate-400">{currentCountry}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Whitelisted IPs</span>
              <Check className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">
              {activeIPs}/{whitelistedIPs.length}
            </div>
            <div className="text-xs text-slate-400">Active entries</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Blocked Attempts</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">
              {blockedAttempts}
            </div>
            <div className="text-xs text-slate-400">Last 24 hours</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Geo-Block Rules</span>
              <MapPin className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold">{geoBlockRules.length}</div>
            <div className="text-xs text-slate-400">Countries blocked</div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Security Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Whitelist Mode
              </label>
              <select
                value={whitelistMode}
                onChange={(e) => setWhitelistMode(e.target.value as any)}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="disabled">Disabled</option>
                <option value="enabled">Enabled (Allow all + whitelist)</option>
                <option value="strict">Strict (Whitelist only)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                VPN/Proxy Detection
              </label>
              <button
                onClick={() => setBlockVPNs(!blockVPNs)}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  blockVPNs
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {blockVPNs ? '✓ Block VPNs' : '✗ Allow VPNs'}
              </button>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Tor Network
              </label>
              <button
                onClick={() => setBlockTor(!blockTor)}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  blockTor
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {blockTor ? '✓ Block Tor' : '✗ Allow Tor'}
              </button>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Require Whitelist
              </label>
              <button
                onClick={() => setRequireWhitelist(!requireWhitelist)}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  requireWhitelist
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {requireWhitelist ? '✓ Required' : '✗ Optional'}
              </button>
            </div>
          </div>
        </div>

        {/* Whitelisted IPs */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Whitelisted IP Addresses</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setIsAddingIP(!isAddingIP)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add IP
              </button>
            </div>
          </div>

          {isAddingIP && (
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    IP Address
                  </label>
                  <input
                    type="text"
                    value={newIP}
                    onChange={(e) => setNewIP(e.target.value)}
                    placeholder="e.g., 192.168.1.100"
                    className="w-full px-4 py-2 bg-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Label
                  </label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g., Home Network"
                    className="w-full px-4 py-2 bg-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingIP(false)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddIP}
                  disabled={!newIP || !newLabel}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add IP
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {whitelistedIPs.map((ip) => (
              <div key={ip.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          ip.active ? 'bg-green-400' : 'bg-slate-500'
                        }`}
                      />
                      <span className="font-semibold">{ip.label}</span>
                      {ip.address === currentIP && (
                        <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400 ml-5">
                      <span className="font-mono">{ip.address}</span>
                      <span>{ip.country}</span>
                      <span>Added: {formatDate(ip.addedDate)}</span>
                      <span>
                        Last used:{' '}
                        {formatRelativeTime(ip.lastUsed || ip.addedDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleIPStatus(ip.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        ip.active
                          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                          : 'bg-slate-600 text-slate-400 hover:bg-slate-500'
                      }`}
                    >
                      {ip.active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleRemoveIP(ip.id)}
                      className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geo-Blocking Rules */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Geo-Blocking Rules</h2>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Country
            </button>
          </div>

          <div className="space-y-3">
            {geoBlockRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {rule.countryCode === 'KP'
                      ? '🇰🇵'
                      : rule.countryCode === 'IR'
                      ? '🇮🇷'
                      : '🇸🇾'}
                  </div>
                  <div>
                    <div className="font-semibold">{rule.country}</div>
                    <div className="text-sm text-slate-400">{rule.reason}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium">
                    Blocked
                  </span>
                  <button
                    onClick={() => handleRemoveGeoBlock(rule.id)}
                    className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Access Logs */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-6">Recent Access Attempts</h2>

          <div className="space-y-3">
            {accessLogs.map((log) => (
              <div key={log.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {log.action === 'allowed' ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )}
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold">
                          {log.ip}
                        </span>
                        <span className="text-slate-400">{log.country}</span>
                        {log.vpnDetected && (
                          <span className="px-2 py-0.5 bg-yellow-600/20 text-yellow-400 text-xs rounded-full">
                            VPN Detected
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        {log.reason} • {formatRelativeTime(log.timestamp)}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      log.action === 'allowed'
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-red-600/20 text-red-400'
                    }`}
                  >
                    {log.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
