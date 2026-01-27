'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

/**
 * Toaster - Wrapper component for react-hot-toast
 * Provides toast notifications with ProphetBase styling
 */
export default function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        bottom: 24,
        right: 24,
      }}
      toastOptions={{
        // Default options for all toasts
        className: '',
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          fontWeight: '600',
          borderRadius: '12px',
          padding: '16px',
          boxShadow:
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        // Success toast styling
        success: {
          duration: 4000,
          iconTheme: {
            primary: '#00D395',
            secondary: '#fff',
          },
          style: {
            background: '#10b981',
            color: '#fff',
            borderLeft: '4px solid #00D395',
          },
        },
        error: {
          iconTheme: {
            primary: '#FF4444',
            secondary: '#fff',
          },
          style: {
            borderLeft: '4px solid #FF4444',
          },
        },
        loading: {
          style: {
            borderLeft: '4px solid #0052FF',
          },
        },
      }}
    />
  );
}
