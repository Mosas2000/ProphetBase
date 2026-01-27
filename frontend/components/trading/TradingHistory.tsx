'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, Filter, Search } from 'lucide-react';

interface Trade {
  id: string;
  timestamp: number;
  symbol: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  fee: number;
  status: 'filled' | 'canceled' | 'rejected';
  total: number;
}

export default function TradingHistory() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSide, setFilterSide] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 15;

  useEffect(() => {
    const mockTrades: Trade[] = Array.from({ length: 50 }, (_, i) => ({
      id: `TRD-${Date.now()}-${i}`,
      timestamp: Date.now() - i * 3600000,
      symbol: ['BTC/USD', 'ETH/USD', 'SOL/USD'][Math.floor(Math.random() * 3)],
      type: Math.random() > 0.5 ? 'market' : 'limit',
      side: Math.random() > 0.5 ? 'buy' : 'sell',
      quantity: Math.random() * 2,
      price: 50000 + Math.random() * 5000,
      fee: Math.random() * 10,
      status: ['filled', 'filled', 'filled', 'canceled'][Math.floor(Math.random() * 4)] as any,
      total: 0,
    })).map((trade) => ({
      ...trade,
      total: trade.quantity * trade.price + trade.fee,
    }));

    setTrades(mockTrades);
    setFilteredTrades(mockTrades);
  }, []);

  useEffect(() => {
    let filtered = trades;

    if (searchTerm) {
      filtered = filtered.filter((trade) =>
        trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((trade) => trade.status === filterStatus);
    }

    if (filterSide !== 'all') {
      filtered = filtered.filter((trade) => trade.side === filterSide);
    }

    setFilteredTrades(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterSide, trades]);

  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Symbol', 'Type', 'Side', 'Quantity', 'Price', 'Fee', 'Total', 'Status'];
    const rows = filteredTrades.map((trade) => [
      trade.id,
      new Date(trade.timestamp).toISOString(),
      trade.symbol,
      trade.type,
      trade.side,
      trade.quantity.toFixed(4),
      trade.price.toFixed(2),
      trade.fee.toFixed(2),
      trade.total.toFixed(2),
      trade.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-history-${Date.now()}.csv`;
    a.click();
  };

  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentTrades = filteredTrades.slice(indexOfFirstTrade, indexOfLastTrade);
  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Trading History</h1>
          <p className="text-slate-400">Complete record of all your trading activity</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by symbol or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-3 border border-slate-600"
                />
              </div>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600"
            >
              <option value="all">All Status</option>
              <option value="filled">Filled</option>
              <option value="canceled">Canceled</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={filterSide}
              onChange={(e) => setFilterSide(e.target.value)}
              className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600"
            >
              <option value="all">All Sides</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <button
            onClick={exportToCSV}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-3 text-slate-400 font-medium">Date</th>
                  <th className="text-left p-3 text-slate-400 font-medium">Symbol</th>
                  <th className="text-left p-3 text-slate-400 font-medium">Type</th>
                  <th className="text-left p-3 text-slate-400 font-medium">Side</th>
                  <th className="text-right p-3 text-slate-400 font-medium">Quantity</th>
                  <th className="text-right p-3 text-slate-400 font-medium">Price</th>
                  <th className="text-right p-3 text-slate-400 font-medium">Fee</th>
                  <th className="text-right p-3 text-slate-400 font-medium">Total</th>
                  <th className="text-center p-3 text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentTrades.map((trade) => (
                  <tr key={trade.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="p-3 text-sm">{new Date(trade.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-medium">{trade.symbol}</td>
                    <td className="p-3 capitalize text-sm">{trade.type}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {trade.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono">{trade.quantity.toFixed(4)}</td>
                    <td className="p-3 text-right font-mono">${trade.price.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono text-amber-400">${trade.fee.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-bold">${trade.total.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.status === 'filled'
                            ? 'bg-green-500/20 text-green-400'
                            : trade.status === 'canceled'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {trade.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-slate-400">
              Showing {indexOfFirstTrade + 1} to {Math.min(indexOfLastTrade, filteredTrades.length)} of{' '}
              {filteredTrades.length} trades
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-cyan-600 rounded-lg">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
