'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { useState } from 'react';

interface MultiSigWallet {
  id: string;
  name: string;
  address: string;
  owners: string[];
  requiredSignatures: number;
  balance: number;
  pendingTransactions: number;
}

interface Transaction {
  id: string;
  walletId: string;
  type: 'TRADE' | 'WITHDRAW' | 'TRANSFER';
  description: string;
  amount: number;
  to?: string;
  marketId?: number;
  signatures: string[];
  requiredSignatures: number;
  status: 'PENDING' | 'EXECUTED' | 'REJECTED';
  createdAt: string;
  createdBy: string;
}

export function MultiSig() {
  const [wallets, setWallets] = useState<MultiSigWallet[]>([
    {
      id: '1',
      name: 'Team Trading Wallet',
      address: '0xMultiSig...1234',
      owners: ['0x1234...5678', '0xabcd...efgh', '0x9876...5432'],
      requiredSignatures: 2,
      balance: 5000,
      pendingTransactions: 2,
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      walletId: '1',
      type: 'TRADE',
      description: 'Buy YES shares in Bitcoin $100k market',
      amount: 500,
      marketId: 0,
      signatures: ['0x1234...5678'],
      requiredSignatures: 2,
      status: 'PENDING',
      createdAt: '2024-01-20',
      createdBy: '0x1234...5678',
    },
    {
      id: '2',
      walletId: '1',
      type: 'WITHDRAW',
      description: 'Withdraw profits to treasury',
      amount: 1000,
      to: '0xTreasury...abcd',
      signatures: ['0x1234...5678', '0xabcd...efgh'],
      requiredSignatures: 2,
      status: 'PENDING',
      createdAt: '2024-01-19',
      createdBy: '0xabcd...efgh',
    },
  ]);

  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isCreatingTx, setIsCreatingTx] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const [newWallet, setNewWallet] = useState({
    name: '',
    owners: [''],
    requiredSignatures: 2,
  });

  const [newTx, setNewTx] = useState({
    type: 'TRADE' as Transaction['type'],
    description: '',
    amount: 0,
    to: '',
    marketId: 0,
  });

  const currentUser = '0x1234...5678';

  const handleCreateWallet = () => {
    const wallet: MultiSigWallet = {
      id: (wallets.length + 1).toString(),
      name: newWallet.name,
      address: `0xMultiSig...${Math.random().toString(36).substring(2, 6)}`,
      owners: newWallet.owners.filter(o => o.trim() !== ''),
      requiredSignatures: newWallet.requiredSignatures,
      balance: 0,
      pendingTransactions: 0,
    };

    setWallets([...wallets, wallet]);
    setIsCreatingWallet(false);
    setNewWallet({ name: '', owners: [''], requiredSignatures: 2 });
  };

  const handleCreateTransaction = () => {
    if (!selectedWallet) return;

    const wallet = wallets.find(w => w.id === selectedWallet);
    if (!wallet) return;

    const tx: Transaction = {
      id: (transactions.length + 1).toString(),
      walletId: selectedWallet,
      type: newTx.type,
      description: newTx.description,
      amount: newTx.amount,
      to: newTx.to || undefined,
      marketId: newTx.marketId || undefined,
      signatures: [currentUser],
      requiredSignatures: wallet.requiredSignatures,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: currentUser,
    };

    setTransactions([tx, ...transactions]);
    setIsCreatingTx(false);
    setNewTx({ type: 'TRADE', description: '', amount: 0, to: '', marketId: 0 });
  };

  const signTransaction = (txId: string) => {
    setTransactions(transactions.map(tx => {
      if (tx.id === txId && !tx.signatures.includes(currentUser)) {
        const newSignatures = [...tx.signatures, currentUser];
        const status = newSignatures.length >= tx.requiredSignatures ? 'EXECUTED' : 'PENDING';
        return { ...tx, signatures: newSignatures, status };
      }
      return tx;
    }));
  };

  const rejectTransaction = (txId: string) => {
    setTransactions(transactions.map(tx => 
      tx.id === txId ? { ...tx, status: 'REJECTED' as const } : tx
    ));
  };

  const addOwner = () => {
    setNewWallet({ ...newWallet, owners: [...newWallet.owners, ''] });
  };

  const updateOwner = (index: number, value: string) => {
    const newOwners = [...newWallet.owners];
    newOwners[index] = value;
    setNewWallet({ ...newWallet, owners: newOwners });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'TRADE': return '📊';
      case 'WITHDRAW': return '💸';
      case 'TRANSFER': return '↔️';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Multi-Signature Wallets</h3>
              <p className="text-sm text-gray-400 mt-1">Shared positions and team trading</p>
            </div>
            <Button onClick={() => setIsCreatingWallet(true)} disabled={isCreatingWallet}>
              + New Wallet
            </Button>
          </div>

          {/* Create Wallet Form */}
          {isCreatingWallet && (
            <Card className="mb-6 border border-blue-500">
              <div className="p-4 space-y-4">
                <h4 className="font-semibold">Create Multi-Sig Wallet</h4>

                <Input
                  label="Wallet Name"
                  value={newWallet.name}
                  onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                  placeholder="e.g., Team Trading Fund"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Owners</label>
                  {newWallet.owners.map((owner, idx) => (
                    <div key={idx} className="mb-2">
                      <Input
                        value={owner}
                        onChange={(e) => updateOwner(idx, e.target.value)}
                        placeholder="0x..."
                      />
                    </div>
                  ))}
                  <Button variant="secondary" size="sm" onClick={addOwner}>
                    + Add Owner
                  </Button>
                </div>

                <Input
                  label="Required Signatures"
                  type="number"
                  value={newWallet.requiredSignatures}
                  onChange={(e) => setNewWallet({ ...newWallet, requiredSignatures: parseInt(e.target.value) })}
                  min={1}
                  max={newWallet.owners.length}
                />

                <div className="flex gap-2">
                  <Button onClick={handleCreateWallet} disabled={!newWallet.name || newWallet.owners.filter(o => o).length < 2}>
                    Create Wallet
                  </Button>
                  <Button variant="secondary" onClick={() => setIsCreatingWallet(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Wallets List */}
          <div className="space-y-4">
            {wallets.map(wallet => (
              <Card key={wallet.id} className={selectedWallet === wallet.id ? 'border-blue-500' : ''}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{wallet.name}</h4>
                      <code className="text-xs text-gray-400">{wallet.address}</code>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="default">
                          {wallet.requiredSignatures}/{wallet.owners.length} signatures
                        </Badge>
                        {wallet.pendingTransactions > 0 && (
                          <Badge variant="warning">
                            {wallet.pendingTransactions} pending
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${wallet.balance}</p>
                      <p className="text-xs text-gray-400">Balance</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Owners ({wallet.owners.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {wallet.owners.map((owner, idx) => (
                        <code key={idx} className="text-xs bg-gray-800 px-2 py-1 rounded">
                          {owner}
                        </code>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedWallet(wallet.id);
                      setIsCreatingTx(true);
                    }}
                  >
                    New Transaction
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Create Transaction Form */}
      {isCreatingTx && selectedWallet && (
        <Card className="border border-blue-500">
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Propose Transaction</h4>

            <div>
              <label className="block text-sm font-medium mb-2">Transaction Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['TRADE', 'WITHDRAW', 'TRANSFER'] as const).map(type => (
                  <label
                    key={type}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      newTx.type === type
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="txType"
                      checked={newTx.type === type}
                      onChange={() => setNewTx({ ...newTx, type })}
                      className="sr-only"
                    />
                    <span>{getTransactionIcon(type)} {type}</span>
                  </label>
                ))}
              </div>
            </div>

            <TextArea
              label="Description"
              value={newTx.description}
              onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
              placeholder="Describe the transaction..."
              rows={2}
            />

            <Input
              label="Amount ($)"
              type="number"
              value={newTx.amount}
              onChange={(e) => setNewTx({ ...newTx, amount: parseFloat(e.target.value) })}
            />

            {newTx.type === 'TRADE' && (
              <Input
                label="Market ID"
                type="number"
                value={newTx.marketId}
                onChange={(e) => setNewTx({ ...newTx, marketId: parseInt(e.target.value) })}
              />
            )}

            {(newTx.type === 'WITHDRAW' || newTx.type === 'TRANSFER') && (
              <Input
                label="Recipient Address"
                value={newTx.to}
                onChange={(e) => setNewTx({ ...newTx, to: e.target.value })}
                placeholder="0x..."
              />
            )}

            <div className="flex gap-2">
              <Button onClick={handleCreateTransaction} disabled={!newTx.description || !newTx.amount}>
                Propose & Sign
              </Button>
              <Button variant="secondary" onClick={() => setIsCreatingTx(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Pending Transactions */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Pending Transactions</h4>
          <div className="space-y-3">
            {transactions.filter(tx => tx.status === 'PENDING').length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No pending transactions</p>
              </div>
            ) : (
              transactions
                .filter(tx => tx.status === 'PENDING')
                .map(tx => {
                  const wallet = wallets.find(w => w.id === tx.walletId);
                  const hasSigned = tx.signatures.includes(currentUser);
                  const signaturesNeeded = tx.requiredSignatures - tx.signatures.length;

                  return (
                    <Card key={tx.id}>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl">{getTransactionIcon(tx.type)}</span>
                              <h5 className="font-medium">{tx.description}</h5>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">
                              Wallet: {wallet?.name} • Amount: ${tx.amount}
                            </p>
                            <p className="text-xs text-gray-500">
                              Proposed by {tx.createdBy} on {new Date(tx.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={signaturesNeeded === 0 ? 'success' : 'warning'}>
                              {tx.signatures.length}/{tx.requiredSignatures} signed
                            </Badge>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-xs text-gray-400 mb-1">Signatures</p>
                          <div className="flex flex-wrap gap-1">
                            {tx.signatures.map((sig, idx) => (
                              <code key={idx} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                {sig}
                              </code>
                            ))}
                          </div>
                        </div>

                        {!hasSigned && (
                          <div className="flex gap-2">
                            <Button variant="success" size="sm" onClick={() => signTransaction(tx.id)}>
                              Sign & Approve
                            </Button>
                            <Button variant="error" size="sm" onClick={() => rejectTransaction(tx.id)}>
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })
            )}
          </div>
        </div>
      </Card>

      {/* Transaction History */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Transaction History</h4>
          <div className="space-y-2">
            {transactions.filter(tx => tx.status !== 'PENDING').map(tx => (
              <Card key={tx.id}>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getTransactionIcon(tx.type)}</span>
                      <div>
                        <p className="font-medium text-sm">{tx.description}</p>
                        <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${tx.amount}</p>
                      <Badge variant={tx.status === 'EXECUTED' ? 'success' : 'error'} className="text-xs">
                        {tx.status}
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
