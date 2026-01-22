'use client';

import { useState } from 'react';

export default function CustomReports() {
  const [reportType, setReportType] = useState<
    'performance' | 'risk' | 'market' | 'custom'
  >('performance');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Custom Reports</h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="performance">Performance Summary</option>
            <option value="risk">Risk Analysis</option>
            <option value="market">Market Overview</option>
            <option value="custom">Custom Report</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Generate Report
        </button>
        <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
          Export CSV
        </button>
        <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
          Export PDF
        </button>
      </div>

      <div className="mt-6 p-8 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">
          Select options and click "Generate Report" to create your custom
          report
        </p>
      </div>
    </div>
  );
}
