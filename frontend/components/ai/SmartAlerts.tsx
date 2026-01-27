'use client';

import {
  Activity,
  AlertTriangle,
  Bell,
  MessageSquare,
  Settings,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface Alert {
  id: string;
  type: 'price' | 'volume' | 'pattern' | 'sentiment' | 'risk' | 'opportunity';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  marketTitle: string;
  timestamp: Date;
  actionable: boolean;
  suggestedAction?: string;
  isRead: boolean;
}

interface AlertRule {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  condition: string;
  threshold: number;
}

export default function SmartAlerts() {
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules'>('alerts');
  const [filterPriority, setFilterPriority] = useState<
    'all' | 'critical' | 'high' | 'medium' | 'low'
  >('all');
  const [showSettings, setShowSettings] = useState(false);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'a1',
      type: 'price',
      priority: 'critical',
      title: 'Significant Price Movement Detected',
      message:
        'Bitcoin market price increased by 12% in the last hour - highly unusual pattern detected',
      marketTitle: 'Will Bitcoin reach $100k by Q2 2026?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      actionable: true,
      suggestedAction: 'Consider taking profits or adjusting stop losses',
      isRead: false,
    },
    {
      id: 'a2',
      type: 'opportunity',
      priority: 'high',
      title: 'Trading Opportunity Identified',
      message:
        'AI models show 85% confidence for upward movement in next 24 hours',
      marketTitle: 'Will Bitcoin reach $100k by Q2 2026?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      actionable: true,
      suggestedAction: 'Consider increasing position before anticipated rally',
      isRead: false,
    },
    {
      id: 'a3',
      type: 'pattern',
      priority: 'high',
      title: 'Bullish Pattern Confirmed',
      message:
        'Cup and Handle pattern completed with 82% historical success rate',
      marketTitle: 'Will Bitcoin reach $100k by Q2 2026?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      actionable: true,
      suggestedAction: 'Entry point confirmed - target price $0.85',
      isRead: false,
    },
    {
      id: 'a4',
      type: 'risk',
      priority: 'medium',
      title: 'Risk Level Increased',
      message: 'Market volatility increased by 25% - risk score now at 68/100',
      marketTitle: 'Will inflation exceed 3% in 2026?',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      actionable: false,
      isRead: true,
    },
    {
      id: 'a5',
      type: 'sentiment',
      priority: 'medium',
      title: 'Sentiment Shift Detected',
      message:
        'Social sentiment turned bearish with -15% change in last 6 hours',
      marketTitle: 'Will inflation exceed 3% in 2026?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      actionable: false,
      isRead: true,
    },
    {
      id: 'a6',
      type: 'volume',
      priority: 'low',
      title: 'Volume Spike',
      message: 'Trading volume increased by 45% compared to 24h average',
      marketTitle: 'Will Bitcoin reach $100k by Q2 2026?',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      actionable: false,
      isRead: true,
    },
  ]);

  const [alertRules] = useState<AlertRule[]>([
    {
      id: 'r1',
      name: 'Price Change Alert',
      type: 'price',
      enabled: true,
      condition: 'Price changes by more than',
      threshold: 10,
    },
    {
      id: 'r2',
      name: 'Volume Spike',
      type: 'volume',
      enabled: true,
      condition: 'Volume exceeds average by',
      threshold: 50,
    },
    {
      id: 'r3',
      name: 'Pattern Detection',
      type: 'pattern',
      enabled: true,
      condition: 'Pattern confidence above',
      threshold: 80,
    },
    {
      id: 'r4',
      name: 'Sentiment Alert',
      type: 'sentiment',
      enabled: true,
      condition: 'Sentiment changes by more than',
      threshold: 15,
    },
    {
      id: 'r5',
      name: 'Risk Warning',
      type: 'risk',
      enabled: true,
      condition: 'Risk score exceeds',
      threshold: 70,
    },
    {
      id: 'r6',
      name: 'Opportunity Alert',
      type: 'opportunity',
      enabled: true,
      condition: 'AI confidence above',
      threshold: 80,
    },
  ]);

  const filteredAlerts =
    filterPriority === 'all'
      ? alerts
      : alerts.filter((a) => a.priority === filterPriority);

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'price':
        return <TrendingUp className="w-5 h-5" />;
      case 'volume':
        return <Activity className="w-5 h-5" />;
      case 'pattern':
        return <Target className="w-5 h-5" />;
      case 'sentiment':
        return <MessageSquare className="w-5 h-5" />;
      case 'risk':
        return <AlertTriangle className="w-5 h-5" />;
      case 'opportunity':
        return <Zap className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'price':
        return 'text-blue-400';
      case 'volume':
        return 'text-purple-400';
      case 'pattern':
        return 'text-green-400';
      case 'sentiment':
        return 'text-yellow-400';
      case 'risk':
        return 'text-red-400';
      case 'opportunity':
        return 'text-emerald-400';
      default:
        return 'text-slate-400';
    }
  };

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, isRead: true })));
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/20 rounded-xl relative">
                <Bell className="w-8 h-8 text-blue-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Smart Alerts</h1>
                <p className="text-slate-400">
                  AI-powered intelligent notifications
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Total Alerts</div>
            <div className="text-2xl font-bold text-blue-400">
              {alerts.length}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Unread</div>
            <div className="text-2xl font-bold text-orange-400">
              {unreadCount}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Critical</div>
            <div className="text-2xl font-bold text-red-400">
              {alerts.filter((a) => a.priority === 'critical').length}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Actionable</div>
            <div className="text-2xl font-bold text-green-400">
              {alerts.filter((a) => a.actionable).length}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Active Rules</div>
            <div className="text-2xl font-bold text-purple-400">
              {alertRules.filter((r) => r.enabled).length}
            </div>
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
              Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'rules'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Alert Rules ({alertRules.length})
            </button>
          </div>

          {activeTab === 'alerts' && (
            <div className="p-6">
              {/* Filter and Actions */}
              <div className="flex items-center justify-between mb-6">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="px-4 py-2 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical Only</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Mark All as Read
                  </button>
                )}
              </div>

              {/* Alert List */}
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`bg-slate-700/50 rounded-lg p-4 border transition-all ${
                      alert.isRead
                        ? 'border-slate-600 opacity-70'
                        : 'border-blue-500/30 hover:border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${getTypeColor(
                          alert.type
                        )} bg-slate-600`}
                      >
                        {getTypeIcon(alert.type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {alert.title}
                            </h3>
                            <div className="text-sm text-slate-400">
                              {alert.marketTitle}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(
                                alert.priority
                              )}`}
                            >
                              {alert.priority.toUpperCase()}
                            </span>
                            {!alert.isRead && (
                              <button
                                onClick={() => markAsRead(alert.id)}
                                className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                                title="Mark as read"
                              >
                                ✓
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-slate-300 mb-3">{alert.message}</p>

                        {alert.actionable && alert.suggestedAction && (
                          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Zap className="w-4 h-4 text-blue-400" />
                              <span className="text-sm font-semibold text-blue-400">
                                Suggested Action
                              </span>
                            </div>
                            <p className="text-sm text-slate-300">
                              {alert.suggestedAction}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <span>{getTimeAgo(alert.timestamp)}</span>
                          <span className="capitalize">{alert.type} Alert</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="p-6">
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${getTypeColor(
                            rule.type
                          )} bg-slate-600`}
                        >
                          {getTypeIcon(rule.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{rule.name}</h3>
                          <div className="text-sm text-slate-400 capitalize">
                            {rule.type} Alert
                          </div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          readOnly
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="bg-slate-600/50 rounded-lg p-3">
                      <div className="text-sm text-slate-300">
                        <span className="text-slate-400">{rule.condition}</span>
                        <span className="font-semibold text-blue-400 ml-2">
                          {rule.threshold}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
