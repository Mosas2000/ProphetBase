'use client';

import { useEffect, useState } from 'react';

/**
 * A native-looking splash screen for PWA initial load
 */
export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after 1.5 seconds or when app is ready
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-opacity duration-500 ease-in-out">
      <div className="relative">
        {/* Logo Animation */}
        <div className="w-24 h-24 bg-blue-600 rounded-3xl shadow-2xl flex items-center justify-center animate-bounce">
          <span className="text-4xl font-extrabold text-white">P</span>
        </div>
        
        {/* Pulse effect */}
        <div className="absolute inset-0 w-24 h-24 bg-blue-600 rounded-3xl animate-ping opacity-20" />
      </div>

      <div className="mt-8 text-center">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          PROPHET<span className="text-blue-600">BASE</span>
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-400 animate-pulse">
          Initializing secure environment...
        </p>
      </div>

      {/* Loading Bar */}
      <div className="absolute bottom-12 w-48 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 animate-loading-bar" style={{ width: '100%' }} />
      </div>
      
      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
