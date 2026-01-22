'use client';

import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isInStandaloneMode);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if prompt was dismissed
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS prompt after delay
    if (iOS && !isInStandaloneMode) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_install_dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 animate-slide-up">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>

        <div className="flex items-start gap-4">
          <div className="text-4xl">📱</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Install ProphetBase</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Add to your home screen for quick access and offline support
            </p>

            {isIOS ? (
              <div className="space-y-3 text-sm">
                <p className="font-medium">To install:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Tap the Share button <span className="inline-block">⎋</span></li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" to confirm</li>
                </ol>
                <Button onClick={handleDismiss} variant="secondary" fullWidth className="mt-4">
                  Got it
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleInstall} fullWidth>
                  Install
                </Button>
                <Button onClick={handleDismiss} variant="secondary" fullWidth>
                  Later
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>✓</span>
            <span>Works offline</span>
            <span>•</span>
            <span>✓</span>
            <span>Faster loading</span>
            <span>•</span>
            <span>✓</span>
            <span>Push notifications</span>
          </div>
        </div>
      </div>
    </div>
  );
}
