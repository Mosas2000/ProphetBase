'use client';

import React, { useState } from 'react';
import { Shield, AlertTriangle, Bot, Eye, Clock, TrendingDown, Ban, Users } from 'lucide-react';

interface FraudAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  description: string;
  timestamp: Date;
  userId: string;
  actionTaken: string;
  status: 'investigating' | 'resolved' | 'false-positive';
}

interface SuspiciousActivity {
  category: string;
  count: number;
  riskScore: number;
  trend: 'up' | 'down' | 'stable';
}

interface BehaviorPattern {
  pattern: string;
  frequency: number;
  riskLevel: 'low' | 'medium' | 'high';
  detected: Date;
  details: string;
}

export default function FraudDetection() {
  const [activeTab, setActiveTab] = useState<'alerts' | 'patterns' | 'stats'>('alerts');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const [fraudAlerts] = useState<FraudAlert[]>([
    {
      id: 'f1',
      severity: 'critical',
      type: 'Multiple Account Access',
      description: 'User accessed from 5 different IP addresses in different countries within 2 hours',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      userId: 'user_8x9k2',
      actionTaken: 'Account temporarily locked, 2FA required',
      status: 'investigating',
    },
    {
      id: 'f2',
      severity: 'high',
      type: 'Unusual Trading Pattern',
      description: 'Trading volume 15x above user average, pattern matches known bot behavior',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      userId: 'user_3m7n1',
      actionTaken: 'Rate limiting applied, behavior monitoring increased',
      status: 'investigating',
    },
    {
      id: 'f3',
      severity: 'high',
      type: 'Wash Trading Detected',
      description: 'User creating artificial volume through self-trading across multiple accounts',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      userId: 'user_5k2p9',
      actionTaken: 'Accounts flagged, transactions under review',
      status: 'investigating',
    },
    {
      id: 'f4',
      severity: 'medium',
      type: 'Rapid Withdrawal Attempt',
      description: 'Attempted to withdraw $5000 immediately after depositing from new payment method',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      userId: 'user_7q4r2',
      actionTaken: 'Withdrawal delayed for 24h cooling period',
      status: 'resolved',
    },
    {
      id: 'f5',
      severity: 'medium',
      type: 'Suspicious Login',
      description: 'Login from previously unseen device and location, failed 2FA twice',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      userId: 'user_2w8t5',
      actionTaken: 'Email verification sent to registered address',
      status: 'resolved',
    },
    {
      id: 'f6',
      severity: 'low',
      type: 'VPN Detection',
      description: 'User accessing platform through VPN/proxy service',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      userId: 'user_9b3x7',
      actionTaken: 'Logged for monitoring, no action required',
      status: 'false-positive',
    },
  ]);

  const [suspiciousActivities] = useState<SuspiciousActivity[]>([
    {
      category: 'Bot Trading',
      count: 23,
      riskScore: 78,
      trend: 'up',
    },
    {
      category: 'Multiple Accounts',
      count: 15,
      riskScore: 85,
      trend: 'up',
    },
    {
      category: 'Unusual Withdrawals',
      count: 8,
      riskScore: 62,
      trend: 'down',
    },
    {
      category: 'Location Anomalies',
      count: 31,
      riskScore: 45,
      trend: 'stable',
    },
    {
      category: 'Failed Auth Attempts',
      count: 42,
      riskScore: 58,
      trend: 'down',
    },
  ]);

  const [behaviorPatterns] = useState<BehaviorPattern[]>([
    {
      pattern: 'Coordinated Trading',
      frequency: 12,
      riskLevel: 'high',
      detected: new Date(Date.now() - 1000 * 60 * 60 * 2),
      details: 'Multiple accounts executing identical trades within seconds',
    },
    {
      pattern: 'Price Manipulation',
      frequency: 8,
      riskLevel: 'high',
      detected: new Date(Date.now() - 1000 * 60 * 60 * 4),
      details: 'Large orders placed and cancelled rapidly to influence market price',
    },
    {
      pattern: 'Account Farming',
      frequency: 15,
      riskLevel: 'medium',
      detected: new Date(Date.now() - 1000 * 60 * 60 * 6),
      details: 'Multiple new accounts created from same device/IP within short timeframe',
    },
    {
      pattern: 'Credential Stuffing',
      frequency: 23,
      riskLevel: 'medium',
      detected: new Date(Date.now() - 1000 * 60 * 60 * 8),
      details: 'Automated login attempts using lists of compromised credentials',
    },
    {
      pattern: 'Session Hijacking',
      frequency: 5,
      riskLevel: 'low',
      detected: new Date(Date.now() - 1000 * 60 * 60 * 12),
      details: 'Suspicious session token usage from different locations',
    },
  ]);

  const filteredAlerts = filterSeverity === 'all' 
    ? fraudAlerts 
    : fraudAlerts.filter(a => a.severity === filterSeverity);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'investigating':
        return 'text-orange-400 bg-orange-400/20';
      case 'resolved':
        return 'text-green-400 bg-green-400/20';
      case 'false-positive':
        return 'text-slate-400 bg-slate-400/20';
      default:
        return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-slate-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingDown className="w-4 h-4 text-red-400 rotate-180" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-400" />;
      case 'stable':
        return <span className="w-4 h-4 text-yellow-400">→</span>;
      default:
        return null;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

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
              <h1 className="text-3xl md:text-4xl font-bold">Fraud Detection</h1>
              <p className="text-slate-400">AI-powered suspicious activity monitoring</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Total Alerts</div>
            <div className="text-2xl font-bold text-blue-400">{fraudAlerts.length}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Critical</div>
            <div className="text-2xl font-bold text-red-400">
              {fraudAlerts.filter(a => a.severity === 'critical').length}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Investigating</div>
            <div className="text-2xl font-bold text-orange-400">
              {fraudAlerts.filter(a => a.status === 'investigating').length}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Resolved</div>
            <div className="text-2xl font-bold text-green-400">
              {fraudAlerts.filter(a => a.status === 'resolved').length}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Patterns</div>
            <div className="text-2xl font-bold text-purple-400">{behaviorPatterns.length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 mb-8">
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'alerts'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fraud Alerts
            </button>
            <button
              onClick={() => setActiveTab('patterns')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'patterns'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Behavior Patterns
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'stats'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Activity Stats
            </button>
          </div>

          {activeTab === 'alerts' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value as any)}
                  className="px-4 py-2 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical Only</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-3 bg-slate-600 rounded-lg">
                          <AlertTriangle className={`w-5 h-5 ${
                            alert.severity === 'critical' ? 'text-red-400' :
                            alert.severity === 'high' ? 'text-orange-400' :
                            alert.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{alert.type}</h3>
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getSeverityColor(alert.severity)}`}>
                              {alert.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{alert.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {alert.userId}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {getTimeAgo(alert.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(alert.status)}`}>
                        {alert.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-blue-400">Action Taken</span>
                      </div>
                      <p className="text-sm text-slate-300">{alert.actionTaken}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'patterns' && (
            <div className="p-6">
              <div className="space-y-4">
                {behaviorPatterns.map((pattern, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-3 bg-slate-600 rounded-lg">
                          <Bot className={`w-5 h-5 ${getRiskLevelColor(pattern.riskLevel)}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{pattern.pattern}</h3>
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getRiskLevelColor(pattern.riskLevel)}`}>
                              {pattern.riskLevel.toUpperCase()} RISK
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-3">{pattern.details}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Frequency: </span>
                              <span className="text-white font-semibold">{pattern.frequency} occurrences</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Detected: </span>
                              <span className="text-white font-semibold">{getTimeAgo(pattern.detected)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="p-6">
              <div className="space-y-4">
                {suspiciousActivities.map((activity, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-600 rounded-lg">
                          <Ban className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{activity.category}</h3>
                          <div className="text-sm text-slate-400">
                            {activity.count} incidents detected
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(activity.trend)}
                        <span className="text-sm text-slate-400 capitalize">{activity.trend}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Risk Score</span>
                        <span className={`text-lg font-bold ${
                          activity.riskScore >= 70 ? 'text-red-400' :
                          activity.riskScore >= 50 ? 'text-orange-400' :
                          activity.riskScore >= 30 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {activity.riskScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className={`h-full rounded-full ${
                            activity.riskScore >= 70 ? 'bg-red-500' :
                            activity.riskScore >= 50 ? 'bg-orange-500' :
                            activity.riskScore >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${activity.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-400 mb-1">Advanced Fraud Detection</div>
              <div className="text-sm text-slate-300">
                Our AI system continuously monitors for suspicious behavior patterns, bot activity, and potential fraud. 
                Automated actions are taken to protect user accounts and platform integrity while minimizing false positives.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
