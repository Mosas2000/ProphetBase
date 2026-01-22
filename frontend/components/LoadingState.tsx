import React from 'react';

/**
 * Base Blue Loading Spinner
 */
export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-2',
        lg: 'w-12 h-12 border-3',
        xl: 'w-16 h-16 border-4'
    };

    return (
        <div className={`spinner ${sizeClasses[size]} ${className}`} role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
}

/**
 * Market Card Skeleton Loader
 */
export function MarketCardSkeleton() {
    return (
        <div className="card h-full p-5 flex flex-col space-y-4">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
                <div className="skeleton h-6 w-20 rounded-full"></div>
                <div className="skeleton h-4 w-12 rounded"></div>
            </div>

            {/* Question Skeleton */}
            <div className="space-y-2">
                <div className="skeleton h-6 w-full rounded"></div>
                <div className="skeleton h-6 w-2/3 rounded"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="flex space-x-4 pt-2">
                <div className="skeleton h-5 w-24 rounded"></div>
                <div className="skeleton h-5 w-24 rounded"></div>
            </div>

            {/* Bars Skeleton */}
            <div className="mt-auto pt-4 space-y-2">
                <div className="flex justify-between">
                    <div className="skeleton h-4 w-16 rounded"></div>
                    <div className="skeleton h-4 w-16 rounded"></div>
                </div>
                <div className="skeleton h-2 w-full rounded-full"></div>
            </div>
        </div>
    );
}

/**
 * Stats Dashboard Skeleton
 */
export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-6 flex flex-col space-y-2">
                    <div className="skeleton h-4 w-24 rounded"></div>
                    <div className="skeleton h-8 w-32 rounded"></div>
                </div>
            ))}
        </div>
    );
}

/**
 * Full Page Loading State
 */
export function PageSkeleton() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <Spinner size="lg" />
            <p className="text-secondary text-sm font-medium animate-pulse">Loading ProphetBase...</p>
        </div>
    );
}
