'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { useState } from 'react';

interface Market {
  id: number;
  question: string;
  category: string;
  status: 'ACTIVE' | 'PENDING' | 'RESOLVED' | 'PAUSED';
  volume: number;
  traders: number;
  liquidity: number;
  endDate: string;
  creator: string;
}

const mockMarkets: Market[] = [
  {
    id: 0,
    question: 'Will Bitcoin reach $100k by 2024?',
    category: 'Crypto',
    status: 'ACTIVE',
    volume: 125000,
    traders: 1234,
    liquidity: 5000,
    endDate: '2024-12-31',
    creator: '0x1234...5678',
  },
  {
    id: 1,
    question: 'Will ETH reach $5k by Q2?',
    category: 'Crypto',
    status: 'ACTIVE',
    volume: 98000,
    traders: 856,
    liquidity: 3500,
    endDate: '2024-06-30',
    creator: '0xabcd...efgh',
  },
  {
    id: 2,
    question: 'Will Lakers win the championship?',
    category: 'Sports',
    status: 'PENDING',
    volume: 0,
    traders: 0,
    liquidity: 1000,
    endDate: '2024-06-15',
    creator: '0x9876...5432',
  },
];

export function MarketManager() {
  const [markets, setMarkets] = useState<Market[]>(mockMarkets);
  const [selectedMarkets, setSelectedMarkets] = useState<Set<number>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMarkets = markets.filter(market => {
    const matchesStatus = filterStatus === 'ALL' || market.status === filterStatus;
    const matchesSearch = market.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         market.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const toggleMarketSelection = (id: number) => {
    const newSelected = new Set(selectedMarkets);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMarkets(newSelected);
  };

  const selectAll = () => {
    setSelectedMarkets(new Set(filteredMarkets.map(m => m.id)));
  };

  const deselectAll = () => {
    setSelectedMarkets(new Set());
  };

  const bulkPause = () => {
    setMarkets(markets.map(m => 
      selectedMarkets.has(m.id) ? { ...m, status: 'PAUSED' as const } : m
    ));
    setSelectedMarkets(new Set());
  };

  const bulkActivate = () => {
    setMarkets(markets.map(m => 
      selectedMarkets.has(m.id) ? { ...m, status: 'ACTIVE' as const } : m
    ));
    setSelectedMarkets(new Set());
  };

  const getStatusColor = (status: Market['status']) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warning';
      case 'RESOLVED': return 'default';
      case 'PAUSED': return 'error';
    }
  };

  const totalVolume = markets.reduce((sum, m) => sum + m.volume, 0);
  const totalTraders = new Set(markets.map(m => m.creator)).size;
  const activeMarkets = markets.filter(m => m.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Market Manager</h2>
              <p className="text-sm text-gray-400 mt-1">Admin dashboard for all markets</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-500/30">
              <p className="text-sm text-gray-400">Total Markets</p>
              <p className="text-3xl font-bold">{markets.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
              <p className="text-sm text-gray-400">Active Markets</p>
              <p className="text-3xl font-bold text-green-400">{activeMarkets}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Total Volume</p>
              <p className="text-3xl font-bold">${totalVolume.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Unique Creators</p>
              <p className="text-3xl font-bold">{totalTraders}</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search markets..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="PAUSED">Paused</option>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedMarkets.size > 0 && (
            <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {selectedMarkets.size} market{selectedMarkets.size > 1 ? 's' : ''} selected
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={bulkActivate}>
                    Activate
                  </Button>
                  <Button variant="error" size="sm" onClick={bulkPause}>
                    Pause
                  </Button>
                  <Button variant="secondary" size="sm" onClick={deselectAll}>
                    Deselect All
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Select All */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-400">
              Showing {filteredMarkets.length} of {markets.length} markets
            </p>
            <Button variant="secondary" size="sm" onClick={selectAll}>
              Select All
            </Button>
          </div>

          {/* Markets Table */}
          <div className="space-y-3">
            {filteredMarkets.map(market => (
              <Card key={market.id} className={selectedMarkets.has(market.id) ? 'border-blue-500' : ''}>
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedMarkets.has(market.id)}
                      onChange={() => toggleMarketSelection(market.id)}
                      className="mt-1 w-5 h-5"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">#{market.id} {market.question}</h4>
                            <Badge variant={getStatusColor(market.status)}>
                              {market.status}
                            </Badge>
                            <Badge variant="default">{market.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            Created by {market.creator} • Ends {new Date(market.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Volume</p>
                          <p className="font-medium">${market.volume.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Traders</p>
                          <p className="font-medium">{market.traders.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Liquidity</p>
                          <p className="font-medium">${market.liquidity.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredMarkets.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No markets found</p>
              <p className="text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </Card>

      {/* Analytics */}
      <Card>
        <div className="p-6">
          <h3 className="font-semibold mb-4">Market Analytics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Top Category</p>
              <p className="text-xl font-bold">Crypto</p>
              <p className="text-sm text-gray-400">{markets.filter(m => m.category === 'Crypto').length} markets</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Avg Volume per Market</p>
              <p className="text-xl font-bold">${(totalVolume / markets.length).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
