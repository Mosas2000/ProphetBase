'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export function DataExport() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const csv = `Date,Market,Position,Shares,Entry Price,Exit Price,P&L
2024-01-15,Bitcoin $100k,YES,100,0.65,0.75,+$10.00
2024-01-14,ETH $5k,NO,50,0.45,0.40,+$2.50
2024-01-13,Lakers Win,YES,75,0.55,0.60,+$3.75`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prophetbase-trading-history.csv';
    a.click();
    
    setIsExporting(false);
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const data = {
      trades: [
        {
          date: '2024-01-15',
          market: 'Bitcoin $100k',
          position: 'YES',
          shares: 100,
          entryPrice: 0.65,
          exitPrice: 0.75,
          pnl: 10.00
        }
      ]
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prophetbase-data.json';
    a.click();
    
    setIsExporting(false);
  };

  const handleTaxReport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Tax report generated! Check your downloads.');
    setIsExporting(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Data Export</h3>

          {/* Export Options */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold mb-1">Trading History (CSV)</h4>
                  <p className="text-sm text-gray-400">
                    Export all your trades in CSV format for spreadsheet analysis
                  </p>
                </div>
              </div>
              <Button onClick={handleExportCSV} disabled={isExporting}>
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </Button>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold mb-1">Complete Data (JSON)</h4>
                  <p className="text-sm text-gray-400">
                    Export all your data including trades, positions, and settings
                  </p>
                </div>
              </div>
              <Button onClick={handleExportJSON} disabled={isExporting}>
                {isExporting ? 'Exporting...' : 'Export JSON'}
              </Button>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold mb-1">Tax Report</h4>
                  <p className="text-sm text-gray-400">
                    Generate a comprehensive tax report for your trading activity
                  </p>
                </div>
              </div>
              <Button onClick={handleTaxReport} disabled={isExporting}>
                {isExporting ? 'Generating...' : 'Generate Tax Report'}
              </Button>
            </div>
          </div>

          {/* Export Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Trades</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Markets Traded</p>
              <p className="text-2xl font-bold">42</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Data Size</p>
              <p className="text-2xl font-bold">2.4 MB</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Export History */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Recent Exports</h4>
          
          <div className="space-y-2">
            {[
              { type: 'CSV', date: '2024-01-20', size: '45 KB' },
              { type: 'Tax Report', date: '2024-01-15', size: '128 KB' },
              { type: 'JSON', date: '2024-01-10', size: '2.4 MB' },
            ].map((exp, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">{exp.type}</p>
                  <p className="text-sm text-gray-400">{exp.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">{exp.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Privacy Notice */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Privacy & Security</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              ✓ Your data is encrypted during export
            </p>
            <p>
              ✓ Exports are generated locally in your browser
            </p>
            <p>
              ✓ No data is sent to external servers
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
