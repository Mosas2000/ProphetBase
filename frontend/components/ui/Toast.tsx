'use client';

// Note: This is an internal component for custom styled toasts
// Actual toast management is via react-hot-toast in Toaster.tsx

import { ReactNode } from 'react';

interface ToastProps {
    children: ReactNode;
    type?: 'success' | 'error' | 'loading' | 'default';
    visible?: boolean;
}

export default function Toast({ children, type = 'default' }: ToastProps) {
    const borderColors = {
        success: 'border-l-green-500',
        error: 'border-l-red-500',
        loading: 'border-l-blue-500',
        default: 'border-l-gray-300',
    };

    return (
        <div className={`
            min-w-[300px] bg-white dark:bg-gray-800 
            rounded-lg shadow-lg border border-gray-100 dark:border-gray-700
            border-l-4 ${borderColors[type]}
            p-4 flex items-center gap-3 animate-slide-up
        `}>
            {children}
        </div>
    );
}
