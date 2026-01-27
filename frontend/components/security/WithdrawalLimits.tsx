'use client';

import { AlertTriangle, CheckCircle, Clock, DollarSign, Lock, Plus, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface WithdrawalLimit {
  type: 'daily' | 'weekly' | 'monthly';
  amount: number;
  used: number;
  resetTime: Date;
}

interface WhitelistedAddress {
  id: string;
  address: string;
  label: string;
  addedDate: Date;
  lastUsed: Date | null;
  totalWithdrawn: number;
  active: boolean;
}

interface CoolingPeriod {
  enabled: boolean;
  duration: number; // hours
  minAmount: number;
}

interface WithdrawalHistory {
  id: string;
  amount: number;
  currency: string;
  address: string;
  status: 'pending' | 'cooling' | 'completed' | 'cancelled';
  timestamp: Date;
  completionTime: Date | null;
}

export default function WithdrawalLimits() {
  const [limits, setLimits] = useState<WithdrawalLimit[]>([
    {
      type: 'daily',
      amount: 10000,
      used: 3500,
      resetTime: new Date(Date.now() + 1000 * 60 * 60 * 8),
    },
    {
      type: 'weekly',
      amount: 50000,
      used: 12000,
      resetTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
    },
    {
      type: 'monthly',
      amount: 200000,
      used: 35000,
      resetTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18),
    },
  ]);

  const [whitelistedAddresses, setWhitelistedAddresses] = useState<WhitelistedAddress[]>([
    {
      id: '1',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f8a8f3',
      label: 'Personal Hardware Wallet',
      addedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      totalWithdrawn: 45000,
      active: true,
    },
    {
      id: '2',
      address: '0x123abc456def789ghi012jkl345mno678pqr901st',
      label: 'Binance Account',
      addedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      totalWithdrawn: 28000,
      active: true,
    },
    {
      id: '3',
      address: '0x9876zyxwvu5432tsrqpo1098nmlkji7654hgfedc',
      label: 'Coinbase Wallet',
      addedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
      lastUsed: null,
      totalWithdrawn: 0,
      active: false,
    },
  ]);

  const [coolingPeriod, setCoolingPeriod] = useState<CoolingPeriod>({
    enabled: true,
    duration: 24,
    minAmount: 5000,
  });

  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistory[]>([
    {
      id: '1',
      amount: 2500,
      currency: 'USDC',
      address: '0x742d...a8f3',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      completionTime: new Date(Date.now() - 1000 * 60 * 60 * 11),
    },
    {
      id: '2',
      amount: 8000,
      currency: 'ETH',
      address: '0x123a...901st',
      status: 'cooling',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      completionTime: new Date(Date.now() + 1000 * 60 * 60 * 18),
    },
    {
      id: '3',
      amount: 1000,
      currency: 'USDC',
      address: '0x742d...a8f3',
      status: 'pending',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      completionTime: null,
    },
  ]);

  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [emergencyMode, setEmergencyMode] = useState(false);
  const [whitelistOnly, setWhitelistOnly] = useState(true);

  const handleAddAddress = () => {
    if (!newAddress || !newLabel) return;

    const newWhitelistedAddress: WhitelistedAddress = {
      id: Date.now().toString(),
      address: newAddress,
      label: newLabel,
      addedDate: new Date(),
      lastUsed: null,
      totalWithdrawn: 0,
      active: true,
    };

    setWhitelistedAddresses(prev => [newWhitelistedAddress, ...prev]);
    setNewAddress('');
    setNewLabel('');
    setIsAddingAddress(false);
  };

  const handleRemoveAddress = (id: string) => {
    setWhitelistedAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const toggleAddressStatus = (id: string) => {
    setWhitelistedAddresses(prev =>
      prev.map(addr => (addr.id === id ? { ...addr, active: !addr.active } : addr))
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatTimeRemaining = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h`;
    return 'Less than 1h';
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleDateString();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cooling':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-600/20';
      case 'cooling':
        return 'text-yellow-400 bg-yellow-600/20';
      case 'pending':
        return 'text-blue-400 bg-blue-600/20';
      case 'cancelled':
        return 'text-red-400 bg-red-600/20';
      default:
        return 'text-slate-400 bg-slate-600/20';
    }
  };

  const activeAddresses = whitelistedAddresses.filter(addr => addr.active).length;
  const coolingWithdrawals = withdrawalHistory.filter(w => w.status === 'cooling').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Withdrawal Limits</h1>
              <p className="text-slate-400">Manage withdrawal limits and whitelisted addresses</p>
            </div>
          </div>
        </div>

        {/* Emergency Mode Banner */}
        {emergencyMode && (
          <div className="bg-red-600/20 border border-red-600/50 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="font-semibold text-red-400">Emergency Mode Active</h3>
                <p className="text-sm text-slate-300">All withdrawals are temporarily suspended for security reasons.</p>
              </div>
              <button
                onClick={() => setEmergencyMode(false)}
                className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Daily Limit</span>
              <DollarSign className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold mb-1">
              {formatCurrency(limits[0].used)} / {formatCurrency(limits[0].amount)}
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${(limits[0].used / limits[0].amount) * 100}%` }}
              />
            </div>
            <div className="text-xs text-slate-400">
              Resets in {formatTimeRemaining(limits[0].resetTime)}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Whitelisted</span>
              <Shield className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">
              {activeAddresses} / {whitelistedAddresses.length}
            </div>
            <div className="text-xs text-slate-400">Active addresses</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Cooling Period</span>
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">{coolingWithdrawals}</div>
            <div className="text-xs text-slate-400">Withdrawals pending</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Weekly Limit</span>
              <DollarSign className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold">
              {formatCurrency(limits[1].used)} / {formatCurrency(limits[1].amount)}
            </div>
            <div className="text-xs text-slate-400">
              {((limits[1].used / limits[1].amount) * 100).toFixed(1)}% used
            </div>
          </div>
        </div>

        {/* Withdrawal Limits */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Withdrawal Limits</h2>
          
          <div className="space-y-4">
            {limits.map((limit) => (
              <div key={limit.type} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold capitalize">{limit.type} Limit</h3>
                    <p className="text-sm text-slate-400">
                      Resets in {formatTimeRemaining(limit.resetTime)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {formatCurrency(limit.amount - limit.used)}
                    </div>
                    <div className="text-xs text-slate-400">Available</div>
                  </div>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      (limit.used / limit.amount) * 100 > 90
                        ? 'bg-red-500'
                        : (limit.used / limit.amount) * 100 > 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(limit.used / limit.amount) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-slate-400 mt-2">
                  <span>{formatCurrency(limit.used)} used</span>
                  <span>{((limit.used / limit.amount) * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6">Security Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Whitelist Only Mode</label>
              <button
                onClick={() => setWhitelistOnly(!whitelistOnly)}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  whitelistOnly
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {whitelistOnly ? '✓ Enabled' : '✗ Disabled'}
              </button>
              <p className="text-xs text-slate-400 mt-2">
                Only allow withdrawals to whitelisted addresses
              </p>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Emergency Mode</label>
              <button
                onClick={() => setEmergencyMode(!emergencyMode)}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  emergencyMode
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {emergencyMode ? '⚠ Active' : 'Inactive'}
              </button>
              <p className="text-xs text-slate-400 mt-2">
                Temporarily suspend all withdrawals
              </p>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Cooling Period</label>
              <button
                onClick={() => setCoolingPeriod(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  coolingPeriod.enabled
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {coolingPeriod.enabled ? '✓ Enabled' : '✗ Disabled'}
              </button>
              <p className="text-xs text-slate-400 mt-2">
                {coolingPeriod.duration}h wait for withdrawals ≥ {formatCurrency(coolingPeriod.minAmount)}
              </p>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Cooling Duration (hours)</label>
              <input
                type="number"
                value={coolingPeriod.duration}
                onChange={(e) => setCoolingPeriod(prev => ({ ...prev, duration: Number(e.target.value) }))}
                className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Whitelisted Addresses */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Whitelisted Addresses</h2>
            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </button>
          </div>

          {isAddingAddress && (
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Address</label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-2 bg-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Label</label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g., Personal Wallet"
                    className="w-full px-4 py-2 bg-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingAddress(false)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAddress}
                  disabled={!newAddress || !newLabel}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Address
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {whitelistedAddresses.map((addr) => (
              <div key={addr.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`w-2 h-2 rounded-full ${addr.active ? 'bg-green-400' : 'bg-slate-500'}`} />
                      <span className="font-semibold">{addr.label}</span>
                    </div>
                    <div className="text-sm text-slate-400 ml-5 space-y-1">
                      <div className="font-mono">{addr.address}</div>
                      <div className="flex items-center gap-4">
                        <span>Added: {formatDate(addr.addedDate)}</span>
                        <span>Last used: {formatRelativeTime(addr.lastUsed || addr.addedDate)}</span>
                        <span>Total: {formatCurrency(addr.totalWithdrawn)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAddressStatus(addr.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        addr.active
                          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                          : 'bg-slate-600 text-slate-400 hover:bg-slate-500'
                      }`}
                    >
                      {addr.active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleRemoveAddress(addr.id)}
                      className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-6">Recent Withdrawals</h2>
          
          <div className="space-y-3">
            {withdrawalHistory.map((withdrawal) => (
              <div key={withdrawal.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(withdrawal.status)}
                    <div>
                      <div className="font-semibold">
                        {withdrawal.amount.toLocaleString()} {withdrawal.currency}
                      </div>
                      <div className="text-sm text-slate-400">
                        To: <span className="font-mono">{withdrawal.address}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {formatRelativeTime(withdrawal.timestamp)}
                        {withdrawal.status === 'cooling' && withdrawal.completionTime && (
                          <span className="ml-2">
                            • Completes in {formatTimeRemaining(withdrawal.completionTime)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${getStatusColor(withdrawal.status)}`}>
                    {withdrawal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
