'use client';

import { useState } from 'react';

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  category: 'kyc' | 'aml' | 'data' | 'security';
  status: 'passing' | 'failing' | 'warning';
  lastCheck: Date;
}

export default function Compliance() {
  const [selectedRule, setSelectedRule] = useState<ComplianceRule | null>(null);

  const rules: ComplianceRule[] = [
    {
      id: '1',
      name: 'KYC Verification',
      description:
        'Users must complete identity verification before trading above $1000',
      category: 'kyc',
      status: 'passing',
      lastCheck: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      name: 'AML Transaction Monitoring',
      description:
        'Monitor transactions for suspicious patterns and amounts above $10,000',
      category: 'aml',
      status: 'passing',
      lastCheck: new Date(Date.now() - 7200000),
    },
    {
      id: '3',
      name: 'GDPR Data Protection',
      description:
        'User data must be encrypted and deletable within 30 days upon request',
      category: 'data',
      status: 'passing',
      lastCheck: new Date(Date.now() - 86400000),
    },
    {
      id: '4',
      name: 'API Key Rotation',
      description: 'API keys must be rotated every 90 days',
      category: 'security',
      status: 'warning',
      lastCheck: new Date(Date.now() - 1800000),
    },
    {
      id: '5',
      name: 'PII Data Handling',
      description:
        'Personally Identifiable Information must be properly masked in logs',
      category: 'data',
      status: 'passing',
      lastCheck: new Date(Date.now() - 3600000),
    },
    {
      id: '6',
      name: 'Sanctions Screening',
      description:
        'Screen users against OFAC and international sanctions lists',
      category: 'aml',
      status: 'failing',
      lastCheck: new Date(Date.now() - 900000),
    },
    {
      id: '7',
      name: 'SSL/TLS Encryption',
      description: 'All API endpoints must use TLS 1.2 or higher',
      category: 'security',
      status: 'passing',
      lastCheck: new Date(Date.now() - 600000),
    },
    {
      id: '8',
      name: 'Audit Logging',
      description:
        'All financial transactions must be logged and retained for 7 years',
      category: 'security',
      status: 'passing',
      lastCheck: new Date(Date.now() - 1200000),
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'kyc':
        return 'bg-blue-100 text-blue-700';
      case 'aml':
        return 'bg-purple-100 text-purple-700';
      case 'data':
        return 'bg-green-100 text-green-700';
      case 'security':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passing':
        return '✅';
      case 'failing':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return '⚪';
    }
  };

  const stats = {
    passing: rules.filter((r) => r.status === 'passing').length,
    failing: rules.filter((r) => r.status === 'failing').length,
    warning: rules.filter((r) => r.status === 'warning').length,
    total: rules.length,
  };

  const complianceScore = Math.round(
    ((stats.passing + stats.warning * 0.5) / stats.total) * 100
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Compliance Dashboard
          </h2>
          <p className="text-sm text-gray-600">
            Monitor regulatory compliance and security standards
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Compliance Score</div>
          <div
            className={`text-3xl font-bold ${
              complianceScore >= 90
                ? 'text-green-600'
                : complianceScore >= 70
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {complianceScore}%
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-3xl font-bold text-green-700">
            {stats.passing}
          </div>
          <div className="text-sm text-green-600">✅ Passing</div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
          <div className="text-3xl font-bold text-red-700">{stats.failing}</div>
          <div className="text-sm text-red-600">❌ Failing</div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
          <div className="text-3xl font-bold text-yellow-700">
            {stats.warning}
          </div>
          <div className="text-sm text-yellow-600">⚠️ Warning</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-3xl font-bold text-blue-700">{stats.total}</div>
          <div className="text-sm text-blue-600">Total Rules</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Rules List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {rules.map((rule) => (
            <div
              key={rule.id}
              onClick={() => setSelectedRule(rule)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRule?.id === rule.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getStatusIcon(rule.status)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded font-semibold uppercase ${getCategoryColor(
                        rule.category
                      )}`}
                    >
                      {rule.category}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
              <p className="text-xs text-gray-500">
                Last checked: {rule.lastCheck.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Rule Details */}
        <div>
          {selectedRule ? (
            <div className="border-2 border-gray-200 rounded-lg p-6 sticky top-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedRule.name}
                </h3>
                <button
                  onClick={() => setSelectedRule(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-3xl">
                      {getStatusIcon(selectedRule.status)}
                    </span>
                    <span
                      className={`text-xl font-bold capitalize ${
                        selectedRule.status === 'passing'
                          ? 'text-green-600'
                          : selectedRule.status === 'failing'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {selectedRule.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Category
                  </label>
                  <div className="mt-1">
                    <span
                      className={`px-3 py-1 rounded font-semibold uppercase ${getCategoryColor(
                        selectedRule.category
                      )}`}
                    >
                      {selectedRule.category}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Description
                  </label>
                  <p className="mt-1 text-gray-900">
                    {selectedRule.description}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Last Check
                  </label>
                  <p className="mt-1 text-gray-900">
                    {selectedRule.lastCheck.toLocaleString()}
                  </p>
                </div>

                {selectedRule.status === 'failing' && (
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h4 className="font-semibold text-red-700 mb-2">
                      ⚠️ Action Required
                    </h4>
                    <p className="text-sm text-red-600 mb-3">
                      This rule is currently failing and requires immediate
                      attention to maintain compliance.
                    </p>
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold">
                      View Remediation Steps
                    </button>
                  </div>
                )}

                {selectedRule.status === 'warning' && (
                  <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <h4 className="font-semibold text-yellow-700 mb-2">
                      ⚠️ Warning
                    </h4>
                    <p className="text-sm text-yellow-600">
                      This rule requires attention soon to prevent compliance
                      issues.
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold">
                    Run Check Now
                  </button>
                  <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded font-semibold">
                    View History
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
              Select a compliance rule to view details
            </div>
          )}
        </div>
      </div>

      {/* Regulations Reference */}
      <div className="mt-6 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">
          📋 Applicable Regulations
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">United States</h4>
            <ul className="text-gray-700 space-y-1">
              <li>• FinCEN - Bank Secrecy Act (BSA)</li>
              <li>• SEC - Securities Regulations</li>
              <li>• CFTC - Commodity Exchange Act</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">European Union</h4>
            <ul className="text-gray-700 space-y-1">
              <li>• GDPR - Data Protection</li>
              <li>• MiCA - Markets in Crypto-Assets</li>
              <li>• 5AMLD - Anti-Money Laundering</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Export & Reports */}
      <div className="mt-6 flex space-x-3">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
          📄 Generate Compliance Report
        </button>
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
          📊 Export Audit Trail
        </button>
        <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold">
          🔔 Configure Alerts
        </button>
      </div>
    </div>
  );
}
