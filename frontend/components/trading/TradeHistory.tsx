'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { formatDate } from '@/lib/utils/formatDate';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

interface Trade {
  id: string;
  marketId: number;
  marketName: string;
  type: 'BUY' | 'SELL';
  outcome: 'YES' | 'NO';
  shares: number;
  price: number;
  total: number;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
}

export default function TradeHistory() {
  const { address } = useAccount();
  const [filter, setFilter] = useState<'all' | 'BUY' | 'SELL'>('all');

  // Mock trade data
  const trades: Trade[] = [
    {
      id: '1',
      marketId: 1,
      marketName: 'Will Bitcoin reach $100k by EOY?',
      type: 'BUY',
      outcome: 'YES',
      shares: 100,
      price: 65,
      total: 65,
      timestamp: Date.now() - 86400000,
      status: 'completed',
    },
    {
      id: '2',
      marketId: 2,
      marketName: 'Will ETH reach $5k by March?',
      type: 'SELL',
      outcome: 'NO',
      shares: 50,
      price: 45,
      total: 22.5,
      timestamp: Date.now() - 172800000,
      status: 'completed',
    },
    {
      id: '3',
      marketId: 1,
      marketName: 'Will Bitcoin reach $100k by EOY?',
      type: 'BUY',
      outcome: 'NO',
      shares: 75,
      price: 35,
      total: 26.25,
      timestamp: Date.now() - 259200000,
      status: 'completed',
    },
  ];

  const filteredTrades = useMemo(() => {
    if (filter === 'all') return trades;
    return trades.filter(t => t.type === filter);
  }, [trades, filter]);

  const totalProfit = useMemo(() => {
    return trades.reduce((sum, trade) => {
      const profit = trade.type === 'SELL' ? trade.total : -trade.total;
      return sum + profit;
    }, 0);
  }, [trades]);

  const exportToCSV = () => {
    const headers = ['Date', 'Market', 'Type', 'Outcome', 'Shares', 'Price', 'Total'];
    const rows = trades.map(t => [
      formatDate(t.timestamp),
      t.marketName,
      t.type,
      t.outcome,
      t.shares,
      t.price,
      t.total,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(r => r.join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trade-history-${Date.now()}.csv`;
    a.click();
  };

  if (!address) {
    return (
      <Card>
        <p className="text-center text-gray-500">Connect wallet to view trade history</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Trade History</h3>
          <Button onClick={exportToCSV} variant="secondary" className="text-sm">
            Export CSV
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'primary' : 'secondary'}
            className="text-sm"
          >
            All
          </Button>
          <Button
            onClick={() => setFilter('BUY')}
            variant={filter === 'BUY' ? 'primary' : 'secondary'}
            className="text-sm"
          >
            Buys
          </Button>
          <Button
            onClick={() => setFilter('SELL')}
            variant={filter === 'SELL' ? 'primary' : 'secondary'}
            className="text-sm"
          >
            Sells
          </Button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total P&L</span>
            <span className={`text-lg font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTrades.map((trade) => (
            <div
              key={trade.id}
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{trade.marketName}</h4>
                  <p className="text-xs text-gray-500">{formatDate(trade.timestamp)}</p>
                </div>
                <Badge variant={trade.type === 'BUY' ? 'green' : 'red'}>
                  {trade.type}
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 block text-xs">Outcome</span>
                  <span className="font-medium">{trade.outcome}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Shares</span>
                  <span className="font-medium">{trade.shares}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Price</span>
                  <span className="font-medium">{trade.price}¢</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Total</span>
                  <span className="font-medium">${trade.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTrades.length === 0 && (
          <p className="text-center text-gray-500 py-8">No trades found</p>
        )}
      </Card>
    </div>
  );
}
