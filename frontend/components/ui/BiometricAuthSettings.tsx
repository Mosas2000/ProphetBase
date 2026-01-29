'use client';

import { useBiometrics } from '@/hooks/useBiometrics';
import { useState } from 'react';

export default function BiometricAuthSettings() {
  const { isSupported, isEnrolled, enroll, authenticate, disable } = useBiometrics();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!isSupported) return null;

  const handleEnroll = async () => {
    setStatus('loading');
    const success = await enroll('user@prophetbase.com'); // Mock user
    setStatus(success ? 'success' : 'error');
  };

  const handleTest = async () => {
    setStatus('loading');
    const success = await authenticate();
    setStatus(success ? 'success' : 'error');
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 21a10.003 10.003 0 008.384-4.51m-10.605-2.04A10.005 10.005 0 0112 15V11m0 0V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Biometric Login</h3>
            <p className="text-sm text-gray-500">Secure your account with Touch ID or Face ID.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {isEnrolled ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600 dark:text-green-400 font-medium">✓ Enrolled and Active</span>
              <button 
                onClick={disable}
                className="text-red-500 hover:underline"
              >
                Disable
              </button>
            </div>
            <button
               onClick={handleTest}
               disabled={status === 'loading'}
               className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-bold"
            >
              Test Authentication
            </button>
          </div>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={status === 'loading'}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
          >
            {status === 'loading' ? 'Processing...' : 'Setup Biometric Access'}
          </button>
        )}

        {status === 'error' && (
          <p className="text-xs text-red-500 text-center">Something went wrong. Please try again.</p>
        )}
      </div>
    </div>
  );
}
