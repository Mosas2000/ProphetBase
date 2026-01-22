'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useState } from 'react';

interface BiometricAuthProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function BiometricAuth({ onSuccess, onCancel }: BiometricAuthProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(true);

  const authenticateWithBiometric = async () => {
    setIsAuthenticating(true);
    setError('');

    try {
      // Check if Web Authentication API is available
      if (!window.PublicKeyCredential) {
        setError('Biometric authentication not supported on this device');
        setBiometricAvailable(false);
        return;
      }

      // Check for platform authenticator (FaceID/TouchID/Fingerprint)
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      if (!available) {
        setError('No biometric authenticator found on this device');
        setBiometricAvailable(false);
        return;
      }

      // Simulate biometric authentication
      // In production, implement actual WebAuthn flow
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Haptic feedback on success
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
      }

      onSuccess();
    } catch (err) {
      setError('Authentication failed. Please try again.');
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Card>
      <div className="text-center">
        <div className="text-6xl mb-4">
          {isAuthenticating ? '⏳' : biometricAvailable ? '🔐' : '❌'}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          {isAuthenticating ? 'Authenticating...' : 'Biometric Authentication'}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {isAuthenticating
            ? 'Please verify your identity'
            : biometricAvailable
            ? 'Use your fingerprint or face to authenticate'
            : 'Biometric authentication not available'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {biometricAvailable && (
          <div className="space-y-3">
            <Button
              onClick={authenticateWithBiometric}
              disabled={isAuthenticating}
              fullWidth
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAuthenticating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Authenticating...
                </span>
              ) : (
                'Authenticate with Biometrics'
              )}
            </Button>

            {onCancel && (
              <Button
                onClick={onCancel}
                disabled={isAuthenticating}
                variant="secondary"
                fullWidth
              >
                Cancel
              </Button>
            )}
          </div>
        )}

        {!biometricAvailable && onCancel && (
          <Button onClick={onCancel} fullWidth>
            Go Back
          </Button>
        )}

        <p className="text-xs text-gray-500 mt-4">
          🔒 Your biometric data never leaves your device
        </p>
      </div>
    </Card>
  );
}
