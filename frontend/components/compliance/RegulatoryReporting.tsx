'use client';

import { DollarSign, Download, FileSpreadsheet, FileText, Receipt, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface ComplianceReport {
  id: string;
  type: 'transaction' | 'tax' | 'audit' | 'aml';
  period: string;
  status: 'generated' | 'pending' | 'archived';
  generatedDate: Date;
  size: string;
}

interface TransactionSummary {
  period: string;
  totalVolume: number;
  totalTransactions: number;
  deposits: number;
  withdrawals: number;
  trades: number;
  fees: number;
}

interface TaxDocument {
  id: string;
  year: number;
  type: '1099-B' | '1099-MISC' | '1099-K' | '8949';
  status: 'available' | 'pending' | 'draft';
  generatedDate: Date;
}

export default function RegulatoryReporting() {
  const [reports, setReports] = useState<ComplianceReport[]>([
    {
      id: '1',
      type: 'transaction',
      period: 'Q4 2025',
      status: 'generated',
      generatedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      size: '2.4 MB',
    },
    {
      id: '2',
      type: 'tax',
      period: '2025',
      status: 'generated',
      generatedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      size: '1.8 MB',
    },
    {
      id: '3',
      type: 'audit',
      period: 'Annual 2025',
      status: 'generated',
      generatedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      size: '5.2 MB',
    },
    {
      id: '4',
      type: 'aml',
      period: 'Q3 2025',
      status: 'archived',
      generatedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
      size: '3.1 MB',
    },
  ]);

  const [transactionSummaries] = useState<TransactionSummary[]>([
    {
      period: 'Q4 2025',
      totalVolume: 485000,
      totalTransactions: 1247,
      deposits: 245000,
      withdrawals: 180000,
      trades: 60000,
      fees: 2450,
    },
    {
      period: 'Q3 2025',
      totalVolume: 392000,
      totalTransactions: 1053,
      deposits: 198000,
      withdrawals: 145000,
      trades: 49000,
      fees: 1960,
    },
    {
      period: 'Q2 2025',
      totalVolume: 356000,
      totalTransactions: 894,
      deposits: 182000,
      withdrawals: 128000,
      trades: 46000,
      fees: 1780,
    },
    {
      period: 'Q1 2025',
      totalVolume: 412000,
      totalTransactions: 1124,
      deposits: 215000,
      withdrawals: 152000,
      trades: 45000,
      fees: 2060,
    },
  ]);

  const [taxDocuments, setTaxDocuments] = useState<TaxDocument[]>([
    {
      id: '1',
      year: 2025,
      type: '1099-B',
      status: 'available',
      generatedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    },
    {
      id: '2',
      year: 2025,
      type: '8949',
      status: 'available',
      generatedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    },
    {
      id: '3',
      year: 2024,
      type: '1099-B',
      status: 'available',
      generatedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    },
    {
      id: '4',
      year: 2026,
      type: '1099-B',
      status: 'pending',
      generatedDate: new Date(),
    },
  ]);

  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedReportType, setSelectedReportType] = useState<'all' | 'transaction' | 'tax' | 'audit' | 'aml'>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async (type: string) => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newReport: ComplianceReport = {
      id: Date.now().toString(),
      type: type as any,
      period: `Q4 ${selectedYear}`,
      status: 'generated',
      generatedDate: new Date(),
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
    };
    
    setReports(prev => [newReport, ...prev]);
    setIsGenerating(false);
  };

  const handleDownload = (reportId: string) => {
    // Simulate download
    console.log('Downloading report:', reportId);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return <Receipt className="w-5 h-5 text-blue-400" />;
      case 'tax':
        return <FileSpreadsheet className="w-5 h-5 text-green-400" />;
      case 'audit':
        return <FileText className="w-5 h-5 text-purple-400" />;
      case 'aml':
        return <FileText className="w-5 h-5 text-orange-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'transaction':
        return 'Transaction Report';
      case 'tax':
        return 'Tax Report';
      case 'audit':
        return 'Audit Trail';
      case 'aml':
        return 'AML Report';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return 'text-green-400 bg-green-600/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-600/20';
      case 'archived':
        return 'text-slate-400 bg-slate-600/20';
      default:
        return 'text-slate-400 bg-slate-600/20';
    }
  };

  const filteredReports = reports.filter(report => 
    selectedReportType === 'all' || report.type === selectedReportType
  );

  const currentYearSummary = transactionSummaries[0];

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
              <h1 className="text-3xl md:text-4xl font-bold">Regulatory Reporting</h1>
              <p className="text-slate-400">Generate compliance reports and tax documents</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Volume</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold mb-1">
              {formatCurrency(currentYearSummary.totalVolume)}
            </div>
            <div className="text-xs text-slate-400">{currentYearSummary.period}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Transactions</span>
              <Receipt className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold mb-1">
              {currentYearSummary.totalTransactions.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">Total count</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Fees</span>
              <DollarSign className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold mb-1">
              {formatCurrency(currentYearSummary.fees)}
            </div>
            <div className="text-xs text-slate-400">Platform fees paid</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Reports</span>
              <FileText className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-bold mb-1">{reports.length}</div>
            <div className="text-xs text-slate-400">Available reports</div>
          </div>
        </div>

        {/* Generate Reports */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Generate New Report</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: 'transaction', label: 'Transaction Report', desc: 'Complete transaction history' },
              { type: 'tax', label: 'Tax Report', desc: 'Annual tax summary' },
              { type: 'audit', label: 'Audit Trail', desc: 'Detailed activity log' },
              { type: 'aml', label: 'AML Report', desc: 'Compliance screening' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => handleGenerateReport(item.type)}
                disabled={isGenerating}
                className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3 mb-2">
                  {getReportTypeIcon(item.type)}
                  <h3 className="font-semibold">{item.label}</h3>
                </div>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Summaries */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Transaction Summaries</h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Period</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Total Volume</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Transactions</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Deposits</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Withdrawals</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Trades</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Fees</th>
                </tr>
              </thead>
              <tbody>
                {transactionSummaries.map((summary, index) => (
                  <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-4 font-medium">{summary.period}</td>
                    <td className="py-4 px-4 text-right font-mono">{formatCurrency(summary.totalVolume)}</td>
                    <td className="py-4 px-4 text-right">{summary.totalTransactions.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right text-green-400">{formatCurrency(summary.deposits)}</td>
                    <td className="py-4 px-4 text-right text-red-400">{formatCurrency(summary.withdrawals)}</td>
                    <td className="py-4 px-4 text-right text-blue-400">{formatCurrency(summary.trades)}</td>
                    <td className="py-4 px-4 text-right text-purple-400">{formatCurrency(summary.fees)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax Documents */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Tax Documents</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taxDocuments.map((doc) => (
              <div key={doc.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-6 h-6 text-green-400" />
                    <div>
                      <h3 className="font-semibold">Form {doc.type}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>Tax Year {doc.year}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {doc.status === 'available' && (
                    <button
                      onClick={() => handleDownload(doc.id)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Reports */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold">Available Reports</h2>
            
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value as any)}
              className="px-4 py-2 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Reports</option>
              <option value="transaction">Transaction</option>
              <option value="tax">Tax</option>
              <option value="audit">Audit</option>
              <option value="aml">AML</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getReportTypeIcon(report.type)}
                    <div>
                      <h3 className="font-semibold">{getReportTypeLabel(report.type)}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                        <span>{report.period}</span>
                        <span>Generated: {formatDate(report.generatedDate)}</span>
                        <span>{report.size}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(report.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
