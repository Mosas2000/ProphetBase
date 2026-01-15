'use client'

/**
 * LoadingSkeleton - Reusable loading skeleton component
 */
interface LoadingSkeletonProps {
    className?: string
    count?: number
}

export function LoadingSkeleton({ className = '', count = 1 }: LoadingSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={`skeleton h-4 w-full rounded ${className}`}
                    role="status"
                    aria-label="Loading..."
                />
            ))}
        </>
    )
}

/**
 * MarketCardSkeleton - Loading skeleton for market cards
 */
export function MarketCardSkeleton() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <div className="skeleton h-6 w-20 rounded-full" />
                <div className="skeleton h-4 w-12 rounded" />
            </div>
            <div className="skeleton mb-4 h-6 w-full rounded" />
            <div className="skeleton mb-2 h-6 w-3/4 rounded" />
            <div className="mb-4 space-y-2">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-full rounded" />
            </div>
            <div className="skeleton h-2 w-full rounded-full" />
            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="skeleton h-10 w-full rounded-xl" />
                <div className="skeleton h-10 w-full rounded-xl" />
            </div>
        </div>
    )
}

/**
 * PositionCardSkeleton - Loading skeleton for position cards
 */
export function PositionCardSkeleton() {
    return (
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div className="skeleton h-6 w-20 rounded-full" />
                <div className="skeleton h-4 w-8 rounded" />
            </div>
            <div className="skeleton mb-4 h-6 w-full rounded" />
            <div className="skeleton mb-2 h-6 w-2/3 rounded" />
            <div className="mb-4 space-y-2">
                <div className="skeleton h-16 w-full rounded-lg" />
                <div className="skeleton h-16 w-full rounded-lg" />
            </div>
            <div className="skeleton h-12 w-full rounded-lg" />
        </div>
    )
}

/**
 * LoadingSpinner - Animated loading spinner
 */
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    }

    return (
        <div
            className={`animate-spin rounded-full border-gray-200 border-t-blue-600 ${sizeClasses[size]} ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    )
}
