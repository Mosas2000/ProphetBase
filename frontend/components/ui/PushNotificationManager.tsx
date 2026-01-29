'use client';

import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useState } from 'react';

export default function PushNotificationManager() {
  const { 
    permission, 
    subscription, 
    isSupported, 
    requestPermission, 
    subscribe, 
    unsubscribe 
  } = usePushNotifications();
  
  const [loading, setLoading] = useState(false);

  if (!isSupported) return null;

  const handleToggle = async () => {
    setLoading(true);
    if (subscription) {
      await unsubscribe();
    } else {
      const granted = await requestPermission();
      if (granted) {
        // Mock public key
        await subscribe('BEl62vp9IH1vg_v6_U_fXq_A8A0-OIn5P0-8_O-8-O-8-O-8');
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Push Notifications</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Get alerts for market resolutions and price movements.
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
            subscription ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              subscription ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {permission === 'denied' && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400">
          Notifications are blocked. Please reset permission in your browser settings to enable alerts.
        </div>
      )}

      {subscription && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 p-2 rounded-lg">
            <span>✓ Active Subscription</span>
          </div>
          <p className="text-[10px] text-gray-400 break-all font-mono">
            {subscription.endpoint}
          </p>
        </div>
      )}
    </div>
  );
}
