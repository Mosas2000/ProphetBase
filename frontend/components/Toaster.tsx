'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

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
            containerStyle={{}}
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
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
                // Success toast styling
                success: {
                    duration: 4000,
                    style: {
                        background: '#10b981',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#10b981',
                    },
                },
                // Error toast styling
                error: {
                    duration: 5000,
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#ef4444',
                    },
                },
                // Loading toast styling
                loading: {
                    style: {
                        background: '#3b82f6',
                        color: '#fff',
                    },
                },
            }}
        />
    )
}
