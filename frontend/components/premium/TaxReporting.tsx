'use client';

import { useState } from 'react';

interface Trade {
  date: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  fee: number;
}

export default function TaxReporting() {
  const [taxYear, setTaxYear] = useState('2026');
  const [trades] = useState<Trade[]>([
    { date: '2026-01-15', type: 'buy', amount: 100, price: 0.45, fee: 0.5 },
    { date: '2026-01-20', type: 'sell', amount: 100, price: 0.58, fee: 0.5 },
  ]);

  const totalGains = trades
    .filter((t) => t.type === 'sell')
    .reduce((sum, t) => sum + t.amount * t.price, 0);
  const totalCosts = trades
    .filter((t) => t.type === 'buy')
    .reduce((sum, t) => sum + t.amount * t.price, 0);
  const netGains = totalGains - totalCosts;
  const totalFees = trades.reduce((sum, t) => sum + t.fee, 0);

  const exportToCSV = () => {
    const csv = [
      ['Date', 'Type', 'Amount', 'Price', 'Fee', 'Total'].join(','),
      ...trades.map((t) =>
        [
          t.date,
          t.type.toUpperCase(),
          t.amount,
          t.price,
          t.fee,
          (t.amount * t.price + t.fee).toFixed(2),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prophetbase-tax-report-${taxYear}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tax Reporting</h1>
        <p className="text-gray-600">
          Generate tax reports and export trade history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Tax Year</h2>
              <select
                value={taxYear}
                onChange={(e) => setTaxYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">Total Gains</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalGains.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-gray-600">Total Costs</p>
                <p className="text-2xl font-bold text-red-600">
                  ${totalCosts.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Net P&L</p>
                <p
                  className={`text-2xl font-bold ${
                    netGains >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  ${netGains.toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600">Total Fees</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${totalFees.toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={exportToCSV}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Export to CSV
            </button>
          </div>

          {/* Trade History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Trade History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                      Fee
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-2 text-sm">{trade.date}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.type === 'buy'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {trade.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-right">
                        {trade.amount}
                      </td>
                      <td className="py-3 px-2 text-sm text-right">
                        ${trade.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-sm text-right">
                        ${trade.fee.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-sm text-right font-semibold">
                        ${(trade.amount * trade.price + trade.fee).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Forms & Guides */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Available Reports</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm">
                📄 Form 8949
              </button>
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm">
                📊 Schedule D
              </button>
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm">
                📋 P&L Statement
              </button>
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm">
                💼 Tax Summary
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-500">
            <h3 className="font-bold text-blue-900 mb-3">Tax Lot Tracking</h3>
            <p className="text-sm text-blue-800 mb-3">
              Track cost basis using FIFO, LIFO, or specific identification
            </p>
            <select className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white">
              <option>FIFO (First In, First Out)</option>
              <option>LIFO (Last In, First Out)</option>
              <option>Specific ID</option>
            </select>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-500">
            <h3 className="font-bold text-yellow-900 mb-3">⚠️ Disclaimer</h3>
            <p className="text-sm text-yellow-800">
              This tool provides general information. Consult a tax professional
              for advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
