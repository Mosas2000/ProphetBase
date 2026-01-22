'use client';

import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, Globe, MapPin, Clock, X, AlertTriangle, Check } from 'lucide-react';

interface Session {
  id: string;
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    name: string;
    os: string;
    browser: string;
  };
  location: {
    ip: string;
    city: string;
    country: string;
    countryCode: string;
  };
  activity: {
    lastActive: Date;
    created: Date;
    requestCount: number;
  };
  security: {
    fingerprint: string;
    riskScore: number;
    isTrusted: boolean;
  };
  isCurrent: boolean;
}

export default function SessionManagement() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: {
        type: 'desktop',
        name: 'MacBook Pro',
        os: 'macOS 14.2',
        browser: 'Chrome 120',
      },
      location: {
        ip: '192.168.1.100',
        city: 'San Francisco',
        country: 'United States',
        countryCode: 'US',
      },
      activity: {
        lastActive: new Date(),
        created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        requestCount: 1847,
      },
      security: {
        fingerprint: 'a8f7d6e5c4b3a2',
        riskScore: 0,
        isTrusted: true,
      },
      isCurrent: true,
    },
    {
      id: '2',
      device: {
        type: 'mobile',
        name: 'iPhone 13 Pro',
        os: 'iOS 17.2',
        browser: 'Safari',
      },
      location: {
        ip: '192.168.1.105',
        city: 'San Francisco',
        country: 'United States',
        countryCode: 'US',
      },
      activity: {
        lastActive: new Date(Date.now() - 1000 * 60 * 30),
        created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
        requestCount: 623,
      },
      security: {
        fingerprint: 'b9e8c7d6f5a4b3',
        riskScore: 0,
        isTrusted: true,
      },
      isCurrent: false,
    },
    {
      id: '3',
      device: {
        type: 'tablet',
        name: 'iPad Air',
        os: 'iPadOS 17.1',
        browser: 'Safari',
      },
      location: {
        ip: '192.168.1.108',
        city: 'San Francisco',
        country: 'United States',
        countryCode: 'US',
      },
      activity: {
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 12),
        created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        requestCount: 142,
      },
      security: {
        fingerprint: 'c1d2e3f4a5b6c7',
        riskScore: 5,
        isTrusted: true,
      },
      isCurrent: false,
    },
    {
      id: '4',
      device: {
        type: 'desktop',
        name: 'Windows PC',
        os: 'Windows 11',
        browser: 'Edge 120',
      },
      location: {
        ip: '203.45.67.89',
        city: 'Los Angeles',
        country: 'United States',
        countryCode: 'US',
      },
      activity: {
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
        created: new Date(Date.now() - 1000 * 60 * 60 * 5),
        requestCount: 45,
      },
      security: {
        fingerprint: 'd8e9f1a2b3c4d5',
        riskScore: 35,
        isTrusted: false,
      },
      isCurrent: false,
    },
  ]);

  const [autoTimeout, setAutoTimeout] = useState(30);
  const [requireReauth, setRequireReauth] = useState(true);
  const [notifyNewSession, setNotifyNewSession] = useState(true);
  const [restrictLocation, setRestrictLocation] = useState(false);
  const [showTerminateAll, setShowTerminateAll] = useState(false);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop':
        return <Monitor className="w-5 h-5" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score === 0) return 'text-green-400';
    if (score < 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLabel = (score: number) => {
    if (score === 0) return 'Secure';
    if (score < 30) return 'Low Risk';
    return 'High Risk';
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleTerminateSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleTerminateAll = () => {
    setSessions(prev => prev.filter(s => s.isCurrent));
    setShowTerminateAll(false);
  };

  const activeSessions = sessions.length;
  const trustedSessions = sessions.filter(s => s.security.isTrusted).length;
  const highRiskSessions = sessions.filter(s => s.security.riskScore >= 30).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <Monitor className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Session Management</h1>
              <p className="text-slate-400">Monitor and control active sessions across all devices</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Active Sessions</span>
              <Monitor className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold">{activeSessions}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Trusted Devices</span>
              <Check className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">{trustedSessions}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">High Risk</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400">{highRiskSessions}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Auto Timeout</span>
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold">{autoTimeout}m</div>
          </div>
        </div>

        {/* Session Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Session Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Auto-logout Timeout (minutes)</label>
              <input
                type="number"
                value={autoTimeout}
                onChange={(e) => setAutoTimeout(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                min="5"
                max="120"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Session Security</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireReauth}
                    onChange={(e) => setRequireReauth(e.target.checked)}
                    className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span>Require re-authentication for sensitive actions</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyNewSession}
                    onChange={(e) => setNotifyNewSession(e.target.checked)}
                    className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span>Notify me of new session logins</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={restrictLocation}
                    onChange={(e) => setRestrictLocation(e.target.checked)}
                    className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span>Restrict access from unusual locations</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Active Sessions</h2>
            <button
              onClick={() => setShowTerminateAll(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              Terminate All Others
            </button>
          </div>

          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-6 rounded-xl border transition-all ${
                  session.isCurrent
                    ? 'bg-blue-600/10 border-blue-600/30'
                    : session.security.riskScore >= 30
                    ? 'bg-red-600/10 border-red-600/30'
                    : 'bg-slate-700/50 border-slate-600'
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Device Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${
                          session.isCurrent ? 'bg-blue-600/20' : 'bg-slate-600/50'
                        }`}>
                          {getDeviceIcon(session.device.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{session.device.name}</h3>
                            {session.isCurrent && (
                              <span className="px-2 py-0.5 bg-blue-600 text-xs rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-400">
                            {session.device.browser} • {session.device.os}
                          </div>
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <button
                          onClick={() => handleTerminateSession(session.id)}
                          className="p-2 bg-slate-600 hover:bg-red-600 rounded-lg transition-colors"
                          title="Terminate session"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Location */}
                      <div>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span>Location</span>
                        </div>
                        <div className="text-sm">
                          <div>{session.location.city}, {session.location.country}</div>
                          <div className="text-slate-400">{session.location.ip}</div>
                        </div>
                      </div>

                      {/* Activity */}
                      <div>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                          <Clock className="w-4 h-4" />
                          <span>Activity</span>
                        </div>
                        <div className="text-sm">
                          <div>Last active: {formatTimeAgo(session.activity.lastActive)}</div>
                          <div className="text-slate-400">{session.activity.requestCount} requests</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="lg:w-64 space-y-4">
                    <div>
                      <div className="text-sm text-slate-400 mb-2">Security Status</div>
                      <div className={`text-lg font-semibold ${getRiskColor(session.security.riskScore)}`}>
                        {getRiskLabel(session.security.riskScore)}
                      </div>
                      {session.security.riskScore > 0 && (
                        <div className="text-sm text-slate-400">
                          Risk Score: {session.security.riskScore}/100
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-sm text-slate-400 mb-2">Device Trust</div>
                      <div className="flex items-center gap-2">
                        {session.security.isTrusted ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400">Trusted Device</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-yellow-400">Untrusted Device</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-400 mb-1">Device Fingerprint</div>
                      <code className="text-xs text-slate-500 font-mono">
                        {session.security.fingerprint}
                      </code>
                    </div>

                    {session.security.riskScore >= 30 && (
                      <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-red-300">
                            Unusual activity detected. Review this session carefully.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-600 text-xs text-slate-400">
                  Session created: {session.activity.created.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terminate All Confirmation Modal */}
        {showTerminateAll && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Terminate All Other Sessions?</h3>
              <p className="text-slate-400 mb-6">
                This will log you out of all devices except your current one. You'll need to log in again on those devices.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTerminateAll(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTerminateAll}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                >
                  Terminate All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
