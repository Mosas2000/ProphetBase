'use client';

import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  QrCode,
  Shield,
  Smartphone,
} from 'lucide-react';
import { useState } from 'react';

interface BackupCode {
  code: string;
  used: boolean;
}

export default function TwoFactorAuth() {
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>([
    { code: 'ABCD-1234-EFGH', used: false },
    { code: 'IJKL-5678-MNOP', used: false },
    { code: 'QRST-9012-UVWX', used: false },
    { code: 'YZAB-3456-CDEF', used: false },
    { code: 'GHIJ-7890-KLMN', used: false },
    { code: 'OPQR-1234-STUV', used: false },
    { code: 'WXYZ-5678-ABCD', used: false },
    { code: 'EFGH-9012-IJKL', used: false },
  ]);
  const [secretKey, setSecretKey] = useState('JBSWY3DPEHPK3PXP');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [downloadedBackup, setDownloadedBackup] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('user@example.com');
  const [recoveryPhone, setRecoveryPhone] = useState('+1 (555) 123-4567');

  const handleCopySecret = async () => {
    await navigator.clipboard.writeText(secretKey);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopyBackupCodes = async () => {
    const codes = backupCodes.map((bc) => bc.code).join('\n');
    await navigator.clipboard.writeText(codes);
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  const handleDownloadBackupCodes = () => {
    const codes = backupCodes.map((bc) => bc.code).join('\n');
    const blob = new Blob([codes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prophetbase-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadedBackup(true);
  };

  const handleVerify = () => {
    // Simulate verification
    if (verificationCode.length === 6) {
      setStep('complete');
      setIs2FAEnabled(true);
    }
  };

  const handleDisable2FA = () => {
    setIs2FAEnabled(false);
    setStep('setup');
    setVerificationCode('');
  };

  const handleRegenerateBackupCodes = () => {
    // Simulate generating new backup codes
    const newCodes: BackupCode[] = Array.from({ length: 8 }, () => ({
      code: `${Math.random()
        .toString(36)
        .substr(2, 4)
        .toUpperCase()}-${Math.random()
        .toString(36)
        .substr(2, 4)
        .toUpperCase()}-${Math.random()
        .toString(36)
        .substr(2, 4)
        .toUpperCase()}`,
      used: false,
    }));
    setBackupCodes(newCodes);
    setDownloadedBackup(false);
    setCopiedBackup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Two-Factor Authentication
              </h1>
              <p className="text-slate-400">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className={`mb-8 p-4 rounded-xl border ${
            is2FAEnabled
              ? 'bg-green-600/10 border-green-600/30'
              : 'bg-yellow-600/10 border-yellow-600/30'
          }`}
        >
          <div className="flex items-center gap-3">
            {is2FAEnabled ? (
              <>
                <Check className="w-6 h-6 text-green-400" />
                <div className="flex-1">
                  <div className="font-semibold text-green-400">
                    2FA Enabled
                  </div>
                  <div className="text-sm text-slate-300">
                    Your account is protected with two-factor authentication
                  </div>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <div className="flex-1">
                  <div className="font-semibold text-yellow-400">
                    2FA Not Enabled
                  </div>
                  <div className="text-sm text-slate-300">
                    Enable 2FA to secure your account
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {!is2FAEnabled ? (
          <>
            {/* Setup Steps */}
            {step === 'setup' && (
              <div className="space-y-6">
                {/* Step 1: Download Authenticator */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                      1
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-3">
                        Download an Authenticator App
                      </h2>
                      <p className="text-slate-400 mb-4">
                        Install one of these authenticator apps on your mobile
                        device:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-4 bg-slate-700/50 rounded-lg">
                          <Smartphone className="w-6 h-6 text-blue-400 mb-2" />
                          <div className="font-semibold">
                            Google Authenticator
                          </div>
                          <div className="text-sm text-slate-400">
                            iOS & Android
                          </div>
                        </div>
                        <div className="p-4 bg-slate-700/50 rounded-lg">
                          <Smartphone className="w-6 h-6 text-blue-400 mb-2" />
                          <div className="font-semibold">Authy</div>
                          <div className="text-sm text-slate-400">
                            iOS & Android
                          </div>
                        </div>
                        <div className="p-4 bg-slate-700/50 rounded-lg">
                          <Smartphone className="w-6 h-6 text-blue-400 mb-2" />
                          <div className="font-semibold">
                            Microsoft Authenticator
                          </div>
                          <div className="text-sm text-slate-400">
                            iOS & Android
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Scan QR Code */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                      2
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-3">Scan QR Code</h2>
                      <p className="text-slate-400 mb-4">
                        Open your authenticator app and scan this QR code:
                      </p>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-48 h-48 bg-white rounded-xl p-4 flex items-center justify-center">
                            <QrCode className="w-full h-full text-slate-800" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-slate-400 mb-2">
                            Can't scan the QR code? Enter this key manually:
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 p-3 bg-slate-700 rounded-lg font-mono text-sm">
                              {secretKey}
                            </code>
                            <button
                              onClick={handleCopySecret}
                              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                              title="Copy secret key"
                            >
                              {copiedSecret ? (
                                <Check className="w-5 h-5 text-green-400" />
                              ) : (
                                <Copy className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          <div className="mt-4 p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                              <div className="text-sm text-slate-300">
                                <strong>Important:</strong> Keep this secret key
                                safe. You'll need it to restore 2FA if you lose
                                access to your device.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Verify */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                      3
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-3">Verify Setup</h2>
                      <p className="text-slate-400 mb-4">
                        Enter the 6-digit code from your authenticator app to
                        complete setup:
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) =>
                            setVerificationCode(
                              e.target.value.replace(/\D/g, '').slice(0, 6)
                            )
                          }
                          placeholder="000000"
                          className="flex-1 px-4 py-3 bg-slate-700 rounded-lg text-center text-2xl font-mono tracking-wider focus:ring-2 focus:ring-blue-500 outline-none"
                          maxLength={6}
                        />
                        <button
                          onClick={() => setStep('verify')}
                          disabled={verificationCode.length !== 6}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Verify & Enable
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Step */}
            {step === 'verify' && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold mb-4">Save Backup Codes</h2>
                <p className="text-slate-400 mb-6">
                  Save these backup codes in a secure location. You can use them
                  to access your account if you lose access to your
                  authenticator app.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {backupCodes.map((bc, index) => (
                    <div
                      key={index}
                      className="p-3 bg-slate-700 rounded-lg font-mono text-center"
                    >
                      {bc.code}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={handleCopyBackupCodes}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                  >
                    {copiedBackup ? (
                      <>
                        <Check className="w-5 h-5 text-green-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span>Copy Codes</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadBackupCodes}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                  >
                    {downloadedBackup ? (
                      <>
                        <Check className="w-5 h-5 text-green-400" />
                        <span>Downloaded!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download Codes</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg mb-6">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-300">
                      <strong>Warning:</strong> Each backup code can only be
                      used once. Store them securely and don't share them with
                      anyone.
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleVerify}
                  disabled={!copiedBackup && !downloadedBackup}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Complete Setup
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* 2FA Enabled View */}
            <div className="space-y-6">
              {/* Backup Codes */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Backup Codes</h2>
                  <button
                    onClick={handleRegenerateBackupCodes}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    Regenerate Codes
                  </button>
                </div>
                <p className="text-slate-400 mb-4">
                  {backupCodes.filter((bc) => !bc.used).length} unused backup
                  codes remaining
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {backupCodes.map((bc, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg font-mono text-center ${
                        bc.used
                          ? 'bg-slate-700/30 text-slate-500 line-through'
                          : 'bg-slate-700'
                      }`}
                    >
                      {bc.code}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCopyBackupCodes}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={handleDownloadBackupCodes}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Recovery Options */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Recovery Options</h2>
                  <button
                    onClick={() => setShowRecovery(!showRecovery)}
                    className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                  >
                    {showRecovery ? 'Hide' : 'Show'}
                  </button>
                </div>
                {showRecovery && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">
                        Recovery Email
                      </label>
                      <input
                        type="email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">
                        Recovery Phone
                      </label>
                      <input
                        type="tel"
                        value={recoveryPhone}
                        onChange={(e) => setRecoveryPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                      Update Recovery Options
                    </button>
                  </div>
                )}
              </div>

              {/* Authenticator Devices */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold mb-4">
                  Authenticator Devices
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="font-medium">iPhone 13 Pro</div>
                        <div className="text-sm text-slate-400">
                          Added on Jan 15, 2026
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 text-sm rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Disable 2FA */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-red-600/30">
                <h2 className="text-xl font-bold mb-2 text-red-400">
                  Disable Two-Factor Authentication
                </h2>
                <p className="text-slate-400 mb-4">
                  This will reduce your account security. Make sure you
                  understand the risks before proceeding.
                </p>
                <button
                  onClick={handleDisable2FA}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                >
                  Disable 2FA
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
