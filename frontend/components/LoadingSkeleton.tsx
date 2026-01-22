'use client'

/**
 * Props interface for LoadingSkeleton component
 */
interface LoadingSkeletonProps {
    count?: number
}

/**
 * LoadingSkeleton - Animated skeleton loader matching MarketCard layout
 * Displays placeholder cards while market data is loading
 */
export default function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                    <div className="p-6 animate-pulse">
                        {/* Header Skeleton */}
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gray-200" />
                                <div className="h-6 w-16 rounded-full bg-gray-200" />
                            </div>
                            <div className="h-4 w-8 rounded bg-gray-200" />
                        </div>

                        {/* Title Skeleton - 2-3 lines */}
                        <div className="mb-4 space-y-2">
                            <div className="h-6 w-full rounded bg-gray-200" />
                            <div className="h-6 w-4/5 rounded bg-gray-200" />
                            <div className="h-6 w-2/3 rounded bg-gray-200" />
                        </div>

                        {/* Timer Skeleton */}
                        <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-100 p-3">
                            <div className="h-4 w-20 rounded bg-gray-200" />
                            <div className="h-4 w-16 rounded bg-gray-200" />
                        </div>

                        {/* Probability Bar Skeleton */}
                        <div className="mb-4 space-y-3">
                            <div className="h-2 w-full rounded-full bg-gray-200" />
                            <div className="flex justify-between">
                                <div className="h-4 w-16 rounded bg-gray-200" />
                                <div className="h-4 w-16 rounded bg-gray-200" />
                            </div>
                        </div>

                        {/* Button Skeleton */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="h-12 rounded-xl bg-gray-200" />
                            <div className="h-12 rounded-xl bg-gray-200" />
                        </div>

                        {/* Expand Indicator Skeleton */}
                        <div className="mt-3 flex justify-center">
                            <div className="h-5 w-5 rounded-full bg-gray-200" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
