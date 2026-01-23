'use client';

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  FileSignature,
  Shield,
  Usb,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface Transaction {
  id: string;
  type: 'transfer' | 'swap' | 'stake' | 'withdraw';
  from: string;
  to: string;
  amount: string;
  token: string;
  value: number;
  gasEstimate: number;
  nonce: number;
  data?: string;
}

interface Signer {
  address: string;
  name: string;
  signed: boolean;
  signedAt?: Date;
  device?: string;
}

export default function TransactionSigning() {
  const [currentTransaction, setCurrentTransaction] = useState<Transaction>({
    id: '0x1a2b3c4d',
    type: 'transfer',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    to: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    amount: '100',
    token: 'USDC',
    value: 100,
    gasEstimate: 21000,
    nonce: 45,
  });

  const [signingMethod, setSigningMethod] = useState<
    'metamask' | 'ledger' | 'trezor' | 'walletconnect'
  >('metamask');
  const [requiredSignatures, setRequiredSignatures] = useState(2);
  const [signers, setSigners] = useState<Signer[]>([
    {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      name: 'Primary Wallet',
      signed: true,
      signedAt: new Date(),
      device: 'MetaMask',
    },
    {
      address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      name: 'Security Wallet',
      signed: false,
    },
    {
      address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
      name: 'Recovery Wallet',
      signed: false,
    },
  ]);

  const [showRawData, setShowRawData] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signatureVerified, setSignatureVerified] = useState(false);

  const rawTransactionData = `{
  "from": "${currentTransaction.from}",
  "to": "${currentTransaction.to}",
  "value": "${currentTransaction.amount}",
  "gas": ${currentTransaction.gasEstimate},
  "nonce": ${currentTransaction.nonce},
  "chainId": 8453,
  "data": "0x"
}`;

  const handleSign = async () => {
    setIsSigning(true);
    // Simulate signing process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update first unsigned signer
    const firstUnsigned = signers.findIndex((s) => !s.signed);
    if (firstUnsigned !== -1) {
      setSigners((prev) =>
        prev.map((s, i) =>
          i === firstUnsigned
            ? {
                ...s,
                signed: true,
                signedAt: new Date(),
                device:
                  signingMethod === 'metamask'
                    ? 'MetaMask'
                    : signingMethod === 'ledger'
                    ? 'Ledger Nano X'
                    : 'Hardware Wallet',
              }
            : s
        )
      );
    }

    setIsSigning(false);
  };

  const handleVerifySignature = async () => {
    setIsSigning(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSignatureVerified(true);
    setIsSigning(false);
  };

  const signedCount = signers.filter((s) => s.signed).length;
  const canExecute = signedCount >= requiredSignatures;

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'transfer':
        return 'text-blue-400';
      case 'swap':
        return 'text-purple-400';
      case 'stake':
        return 'text-green-400';
      case 'withdraw':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getSigningMethodIcon = (method: string) => {
    switch (method) {
      case 'ledger':
      case 'trezor':
        return <Usb className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <FileSignature className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Transaction Signing
              </h1>
              <p className="text-slate-400">
                Secure multi-signature transaction approval
              </p>
            </div>
          </div>
        </div>

        {/* Signature Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Signature Progress</h2>
              <p className="text-slate-400">
                {signedCount} of {requiredSignatures} required signatures
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-lg font-semibold ${
                canExecute
                  ? 'bg-green-600/20 text-green-400'
                  : 'bg-yellow-600/20 text-yellow-400'
              }`}
            >
              {canExecute ? '✓ Ready to Execute' : '⏳ Awaiting Signatures'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  canExecute ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{
                  width: `${(signedCount / requiredSignatures) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Signers */}
          <div className="space-y-3">
            {signers.slice(0, requiredSignatures).map((signer, index) => (
              <div
                key={signer.address}
                className={`p-4 rounded-lg border ${
                  signer.signed
                    ? 'bg-green-600/10 border-green-600/30'
                    : 'bg-slate-700/50 border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        signer.signed ? 'bg-green-600' : 'bg-slate-600'
                      }`}
                    >
                      {signer.signed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{signer.name}</div>
                      <div className="text-sm text-slate-400 font-mono">
                        {signer.address.slice(0, 6)}...
                        {signer.address.slice(-4)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {signer.signed ? (
                      <>
                        <div className="text-sm text-green-400 font-semibold">
                          Signed
                        </div>
                        <div className="text-xs text-slate-400">
                          {signer.signedAt?.toLocaleTimeString()} via{' '}
                          {signer.device}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-slate-400">Pending</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Preview */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Transaction Preview</h2>
            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getTransactionTypeColor(
                currentTransaction.type
              )}`}
            >
              {currentTransaction.type}
            </div>
          </div>

          <div className="space-y-4">
            {/* From/To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-400 mb-2">From</div>
                <div className="p-3 bg-slate-700 rounded-lg font-mono text-sm">
                  {currentTransaction.from.slice(0, 10)}...
                  {currentTransaction.from.slice(-8)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-2">To</div>
                <div className="p-3 bg-slate-700 rounded-lg font-mono text-sm">
                  {currentTransaction.to.slice(0, 10)}...
                  {currentTransaction.to.slice(-8)}
                </div>
              </div>
            </div>

            {/* Amount & Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-400 mb-2">Amount</div>
                <div className="p-3 bg-slate-700 rounded-lg">
                  <span className="text-2xl font-bold">
                    {currentTransaction.amount}
                  </span>
                  <span className="text-slate-400 ml-2">
                    {currentTransaction.token}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-2">Value (USD)</div>
                <div className="p-3 bg-slate-700 rounded-lg">
                  <span className="text-2xl font-bold">
                    ${currentTransaction.value.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-slate-400 mb-2">Network</div>
                <div className="p-3 bg-slate-700 rounded-lg">
                  <div className="font-semibold">Base</div>
                  <div className="text-xs text-slate-400">Chain ID: 8453</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-2">Gas Estimate</div>
                <div className="p-3 bg-slate-700 rounded-lg">
                  <div className="font-semibold">
                    {currentTransaction.gasEstimate.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">~$0.15</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-2">Nonce</div>
                <div className="p-3 bg-slate-700 rounded-lg">
                  <div className="font-semibold">
                    #{currentTransaction.nonce}
                  </div>
                  <div className="text-xs text-slate-400">
                    Transaction count
                  </div>
                </div>
              </div>
            </div>

            {/* Raw Transaction Data */}
            <div>
              <button
                onClick={() => setShowRawData(!showRawData)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-2"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">
                  {showRawData ? 'Hide' : 'View'} Raw Transaction Data
                </span>
              </button>
              {showRawData && (
                <pre className="p-4 bg-slate-900 rounded-lg text-xs font-mono overflow-x-auto border border-slate-700">
                  {rawTransactionData}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Signing Method */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-4">Signing Method</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['metamask', 'ledger', 'trezor', 'walletconnect'] as const).map(
              (method) => (
                <button
                  key={method}
                  onClick={() => setSigningMethod(method)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    signingMethod === method
                      ? 'border-blue-600 bg-blue-600/20'
                      : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {getSigningMethodIcon(method)}
                    <span className="text-sm font-medium capitalize">
                      {method}
                    </span>
                  </div>
                </button>
              )
            )}
          </div>

          {(signingMethod === 'ledger' || signingMethod === 'trezor') && (
            <div className="mt-4 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
              <div className="flex items-start gap-2">
                <Usb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold text-blue-400 mb-1">
                    Hardware Wallet Connected
                  </div>
                  <div className="text-slate-300">
                    Please review the transaction on your{' '}
                    {signingMethod === 'ledger' ? 'Ledger' : 'Trezor'} device
                    and confirm to sign.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Multi-sig Configuration */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold">Multi-Signature Configuration</h2>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-slate-400">Required Signatures:</label>
            <select
              value={requiredSignatures}
              onChange={(e) => setRequiredSignatures(Number(e.target.value))}
              className="px-4 py-2 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value={1}>1 of {signers.length}</option>
              <option value={2}>2 of {signers.length}</option>
              <option value={3}>3 of {signers.length}</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSign}
            disabled={isSigning || canExecute}
            className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSigning ? 'Signing...' : 'Sign Transaction'}
          </button>

          {canExecute && (
            <>
              <button
                onClick={handleVerifySignature}
                disabled={isSigning || signatureVerified}
                className="flex-1 px-6 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {signatureVerified ? '✓ Verified' : 'Verify Signatures'}
              </button>

              <button
                disabled={!signatureVerified}
                className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Execute Transaction
              </button>
            </>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <strong className="text-yellow-400">Security Notice:</strong>{' '}
              Always verify transaction details carefully before signing. Once
              executed, transactions cannot be reversed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
