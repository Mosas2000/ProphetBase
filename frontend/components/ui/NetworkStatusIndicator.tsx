'use client';

import React from 'react';

/**
 * Visual indicator for network status (Online/Offline)
 */
export default function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white text-[10px] font-bold py-1 px-4 text-center z-[100] animate-in slide-in-from-top">
      OFFLINE MODE • DATA MAY BE STALE
    </div>
  );
}
