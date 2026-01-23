'use client';

import React, { useState } from 'react';
import { Shield, AlertTriangle, TrendingUp, Activity, Download, Filter, Search, AlertOctagon } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'transfer';
  amount: number;
  currency: string;
  counterparty: string;
  timestamp: Date;
  riskScore: number;
  flags: string[];
  status: 'clear' | 'suspicious' | 'flagged' | 'blocked';
}

interface RiskIndicator {
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  description: string;
}

interface ComplianceAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  resolved: boolean;
}

export default function AMLScreening() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'withdrawal',
      amount: 15000,
      currency: 'USDC',
      counterparty: '0x742d...a8f3',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      riskScore: 85,
      flags: ['High value', 'New counterparty', 'Rapid succession'],
      status: 'suspicious',
    },
    {
      id: '2',
      type: 'deposit',
      amount: 5000,
      currency: 'ETH',
      counterparty: '0x123a...bc45',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      riskScore: 35,
      flags: ['Known counterparty'],
      status: 'clear',
    },
    {
      id: '3',
      type: 'trade',
      amount: 25000,
      currency: 'USDC',
      counterparty: 'Uniswap V3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      riskScore: 95,
      flags: ['Unusual pattern', 'High frequency', 'Large amount'],
      status: 'flagged',
    },
    {
      id: '4',
      type: 'transfer',
      amount: 500,
      currency: 'USDC',
      counterparty: '0x9876...def1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      riskScore: 15,
      flags: [],
      status: 'clear',
    },
  ]);

  const [riskIndicators] = useState<RiskIndicator[]>([
    {
      name: 'Structuring',
      severity: 'high',
      count: 3,
      description: 'Multiple transactions just below reporting threshold',
    },
    {
      name: 'Rapid Movement',
      severity: 'medium',
      count: 5,
      description: 'Quick succession of deposits and withdrawals',
    },
    {
      name: 'High Risk Jurisdictions',
      severity: 'critical',
      count: 1,
      description: 'Transactions from sanctioned countries',
    },
    {
      name: 'Round Amount',
      severity: 'low',
      count: 12,
      description: 'Transactions in suspiciously round numbers',
    },
  ]);

  const [alerts, setAlerts] = useState<ComplianceAlert[]>([
    {
      id: '1',
      type: 'Suspicious Activity',
      severity: 'high',
      description: 'Multiple large withdrawals to new addresses detected',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      resolved: false,
    },
    {
      id: '2',
      type: 'PEP Match',
      severity: 'critical',
      description: 'Potential Politically Exposed Person match requires review',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      resolved: false,
    },
    {
      id: '3',
      type: 'Sanctions Screening',
      severity: 'critical',
      description: 'Transaction to address on OFAC sanctions list blocked',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      resolved: true,
    },
  ]);

  const [overallRiskScore, setOverallRiskScore] = useState(62);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'clear' | 'suspicious' | 'flagged' | 'blocked'>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('24h');

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400 bg-red-600/20';
    if (score >= 60) return 'text-orange-400 bg-orange-600/20';
    if (score >= 40) return 'text-yellow-400 bg-yellow-600/20';
    return 'text-green-400 bg-green-600/20';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-600/20';
      case 'high':
        return 'text-orange-400 bg-orange-600/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-600/20';
      case 'low':
        return 'text-blue-400 bg-blue-600/20';
      default:
        return 'text-slate-400 bg-slate-600/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clear':
        return 'text-green-400 bg-green-600/20';
      case 'suspicious':
        return 'text-yellow-400 bg-yellow-600/20';
      case 'flagged':
        return 'text-orange-400 bg-orange-600/20';
      case 'blocked':
        return 'text-red-400 bg-red-600/20';
      default:
        return 'text-slate-400 bg-slate-600/20';
    }
  };

  const formatDate = (date: Date) => {
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

  const filteredTransactions = transactions.filter(tx => {
    if (filterStatus !== 'all' && tx.status !== filterStatus) return false;
    if (searchTerm && !tx.counterparty.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const unresolvedAlerts = alerts.filter(a => !a.resolved).length;
  const highRiskTransactions = transactions.filter(tx => tx.riskScore >= 80).length;

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
              <h1 className="text-3xl md:text-4xl font-bold">AML Screening</h1>
              <p className="text-slate-400">Real-time transaction monitoring and risk assessment</p>
            </div>
          </div>
        </div>

        {/* Risk Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Overall Risk Score</span>
              <Activity className="w-4 h-4 text-orange-400" />
            </div>
            <div className={`text-3xl font-bold mb-1 ${getRiskColor(overallRiskScore)}`}>
              {overallRiskScore}
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  overallRiskScore >= 80
                    ? 'bg-red-500'
                    : overallRiskScore >= 60
                    ? 'bg-orange-500'
                    : overallRiskScore >= 40
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${overallRiskScore}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Active Alerts</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400 mb-1">{unresolvedAlerts}</div>
            <div className="text-xs text-slate-400">Require attention</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">High Risk Transactions</span>
              <AlertOctagon className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-orange-400 mb-1">{highRiskTransactions}</div>
            <div className="text-xs text-slate-400">Score ≥ 80</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Monitored</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{transactions.length}</div>
            <div className="text-xs text-slate-400">Last 24 hours</div>
          </div>
        </div>

        {/* Compliance Alerts */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Compliance Alerts</h2>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`bg-slate-700/50 rounded-lg p-4 border-l-4 ${
                  alert.severity === 'critical'
                    ? 'border-red-500'
                    : alert.severity === 'high'
                    ? 'border-orange-500'
                    : alert.severity === 'medium'
                    ? 'border-yellow-500'
                    : 'border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="font-semibold">{alert.type}</span>
                      {alert.resolved && (
                        <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{alert.description}</p>
                    <p className="text-xs text-slate-400">{formatDate(alert.timestamp)}</p>
                  </div>
                  {!alert.resolved && (
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                      Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Indicators */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Risk Indicators</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskIndicators.map((indicator, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{indicator.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(indicator.severity)}`}>
                    {indicator.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{indicator.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Occurrences</span>
                  <span className="text-lg font-bold">{indicator.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Monitoring */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold">Transaction Monitoring</h2>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search counterparty..."
                  className="pl-10 pr-4 py-2 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="all">All Status</option>
                <option value="clear">Clear</option>
                <option value="suspicious">Suspicious</option>
                <option value="flagged">Flagged</option>
                <option value="blocked">Blocked</option>
              </select>

              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="px-4 py-2 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="24h">Last 24h</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="all">All time</option>
              </select>

              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Counterparty</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Risk Score</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Flags</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-4 text-sm">{formatRelativeTime(tx.timestamp)}</td>
                    <td className="py-4 px-4">
                      <span className="capitalize text-sm">{tx.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-mono text-sm">
                        {tx.amount.toLocaleString()} {tx.currency}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm">{tx.counterparty}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(tx.riskScore)}`}>
                        {tx.riskScore}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {tx.flags.slice(0, 2).map((flag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-yellow-600/20 text-yellow-400 rounded text-xs">
                            {flag}
                          </span>
                        ))}
                        {tx.flags.length > 2 && (
                          <span className="px-2 py-0.5 bg-slate-600 text-slate-400 rounded text-xs">
                            +{tx.flags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
