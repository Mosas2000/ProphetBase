'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface FeeData {
  date: string;
  amount: number;
  source: string;
  marketId: number;
}

const mockFees: FeeData[] = [
  { date: '2024-01-20', amount: 125.50, source: 'Trading Fees', marketId: 0 },
  { date: '2024-01-20', amount: 89.30, source: 'Trading Fees', marketId: 1 },
  { date: '2024-01-19', amount: 234.80, source: 'Trading Fees', marketId: 0 },
  { date: '2024-01-19', amount: 156.20, source: 'Market Creation', marketId: 2 },
  { date: '2024-01-18', amount: 445.60, source: 'Trading Fees', marketId: 1 },
];

export function FeeCollector() {
  const [fees] = useState<FeeData[]>(mockFees);
  const [selectedPeriod, setSelectedPeriod] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'ALL'>('ALL');

  const totalCollected = fees.reduce((sum, f) => sum + f.amount, 0);
  const todayFees = fees.filter(f => f.date === new Date().toISOString().split('T')[0])
    .reduce((sum, f) => sum + f.amount, 0);
  
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const weekFees = fees.filter(f => new Date(f.date) >= weekStart)
    .reduce((sum, f) => sum + f.amount, 0);

  const monthStart = new Date();
  monthStart.setDate(monthStart.getDate() - 30);
  const monthFees = fees.filter(f => new Date(f.date) >= monthStart)
    .reduce((sum, f) => sum + f.amount, 0);

  const handleWithdraw = () => {
    if (confirm(`Withdraw $${totalCollected.toFixed(2)} to treasury?`)) {
      alert('Withdrawal initiated successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Fee Collector</h2>
              <p className="text-sm text-gray-400 mt-1">Platform fee management and distribution</p>
            </div>
            <Button onClick={handleWithdraw}>
              Withdraw Fees
            </Button>
          </div>

          {/* Total Collected */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-500/30 mb-6">
            <p className="text-sm text-gray-400 mb-2">Total Collected Fees</p>
            <p className="text-5xl font-bold text-green-400 mb-4">
              ${totalCollected.toFixed(2)}
            </p>
            <div className="flex gap-4 text-sm">
              <div>
                <p className="text-gray-400">Available for Withdrawal</p>
                <p className="font-medium">${totalCollected.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Period Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Today</p>
              <p className="text-2xl font-bold">${todayFees.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">This Week</p>
              <p className="text-2xl font-bold">${weekFees.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">This Month</p>
              <p className="text-2xl font-bold">${monthFees.toFixed(2)}</p>
            </div>
          </div>

          {/* Fee Breakdown by Source */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Fee Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(
                fees.reduce((acc, fee) => {
                  acc[fee.source] = (acc[fee.source] || 0) + fee.amount;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([source, amount]) => (
                <div key={source} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">{source}</p>
                    <p className="text-sm text-gray-400">
                      {fees.filter(f => f.source === source).length} transactions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">${amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">
                      {((amount / totalCollected) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Transactions</h3>
              <div className="flex gap-2">
                {(['TODAY', 'WEEK', 'MONTH', 'ALL'] as const).map(period => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      selectedPeriod === period
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {fees.map((fee, idx) => (
                <Card key={idx}>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-green-400">💰</span>
                        </div>
                        <div>
                          <p className="font-medium">{fee.source}</p>
                          <p className="text-sm text-gray-400">
                            Market #{fee.marketId} • {new Date(fee.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">+${fee.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Fee Distribution */}
      <Card>
        <div className="p-6">
          <h3 className="font-semibold mb-4">Fee Distribution Model</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
              <div>
                <p className="font-medium">Platform Treasury</p>
                <p className="text-sm text-gray-400">Development and operations</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-400">40%</p>
                <p className="text-sm text-gray-400">${(totalCollected * 0.4).toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500 rounded-lg">
              <div>
                <p className="font-medium">Liquidity Providers</p>
                <p className="text-sm text-gray-400">LP rewards and incentives</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-400">60%</p>
                <p className="text-sm text-gray-400">${(totalCollected * 0.6).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-3">Distribution Schedule</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Frequency:</span>
                <span className="font-medium">Weekly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Distribution:</span>
                <span className="font-medium">January 27, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Amount:</span>
                <span className="font-medium text-green-400">${weekFees.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Withdrawal History */}
      <Card>
        <div className="p-6">
          <h3 className="font-semibold mb-4">Withdrawal History</h3>
          
          <div className="space-y-2">
            {[
              { date: '2024-01-15', amount: 2450.80, status: 'Completed' },
              { date: '2024-01-08', amount: 1890.50, status: 'Completed' },
              { date: '2024-01-01', amount: 3120.30, status: 'Completed' },
            ].map((withdrawal, idx) => (
              <Card key={idx}>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Treasury Withdrawal</p>
                      <p className="text-sm text-gray-400">
                        {new Date(withdrawal.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${withdrawal.amount.toFixed(2)}</p>
                      <Badge variant="success" className="text-xs">
                        {withdrawal.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
