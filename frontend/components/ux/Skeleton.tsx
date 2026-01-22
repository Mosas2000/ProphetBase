'use client';

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-700 rounded w-1/2" />
        </div>
        <div className="h-8 w-20 bg-gray-700 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-700 rounded w-5/6" />
      </div>
    </div>
  );
}

// Market Card Skeleton
export function MarketCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex gap-2 mb-3">
            <div className="h-6 w-16 bg-gray-700 rounded-full" />
            <div className="h-6 w-20 bg-gray-700 rounded-full" />
          </div>
          <div className="h-7 bg-gray-700 rounded w-full mb-2" />
          <div className="h-4 bg-gray-700 rounded w-2/3" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="h-3 bg-gray-700 rounded w-16 mb-2" />
          <div className="h-8 bg-gray-700 rounded w-20" />
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="h-3 bg-gray-700 rounded w-16 mb-2" />
          <div className="h-8 bg-gray-700 rounded w-20" />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="h-10 bg-gray-700 rounded flex-1" />
        <div className="h-10 bg-gray-700 rounded flex-1" />
      </div>
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-700 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg animate-pulse">
      <div className="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <div className="h-5 bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
      </div>
      <div className="h-8 w-24 bg-gray-700 rounded" />
    </div>
  );
}

// Chart Skeleton
export function ChartSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-1/4 mb-6" />
      <div className="flex items-end justify-between h-64 gap-2">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-700 rounded-t w-full"
            style={{ height: `${Math.random() * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gray-700 rounded-full" />
        <div className="flex-1">
          <div className="h-7 bg-gray-700 rounded w-48 mb-2" />
          <div className="h-4 bg-gray-700 rounded w-32" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-700/50 rounded-lg p-4">
            <div className="h-4 bg-gray-700 rounded w-16 mb-2" />
            <div className="h-8 bg-gray-700 rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Page Skeleton
export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-700 rounded w-1/3 mb-2" />
        <div className="h-5 bg-gray-700 rounded w-1/2" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <MarketCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Shimmer Effect Wrapper
export function ShimmerSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-800 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
    </div>
  );
}

// Add shimmer animation to global styles
export const shimmerStyles = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;
