'use client'

import { useReadContract } from 'wagmi'
import { PREDICTION_MARKET_ADDRESS } from '@/lib/contracts'
import { PREDICTION_MARKET_ABI } from '@/lib/abi'
import { formatDistanceToNow } from 'date-fns'

/**
 * Market status enum matching the contract
 */
enum MarketStatus {
    Open = 0,
    Resolved = 1,
    Cancelled = 2,
}

/**
 * Market data structure from the contract
 */
interface Market {
    question: string
    endTime: bigint
    resolutionTime: bigint
    status: MarketStatus
    outcome: boolean
    yesToken: string
    noToken: string
    totalYesShares: bigint
    totalNoShares: bigint
}

/**
 * MarketCard component for displaying individual market
 */
function MarketCard({ market, marketId }: { market: Market; marketId: number }) {
    const endDate = new Date(Number(market.endTime) * 1000)
    const isExpired = endDate < new Date()

    // Status badge configuration
    const statusConfig = {
        [MarketStatus.Open]: {
            label: isExpired ? 'Awaiting Resolution' : 'Open',
            color: isExpired ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-green-100 text-green-700 border-green-200',
            dot: isExpired ? 'bg-yellow-500' : 'bg-green-500',
        },
        [MarketStatus.Resolved]: {
            label: 'Resolved',
            color: 'bg-blue-100 text-blue-700 border-blue-200',
            dot: 'bg-blue-500',
        },
        [MarketStatus.Cancelled]: {
            label: 'Cancelled',
            color: 'bg-gray-100 text-gray-700 border-gray-200',
            dot: 'bg-gray-500',
        },
    }

    const status = statusConfig[market.status]

    return (
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
            {/* Status Badge */}
            <div className="mb-4 flex items-center justify-between">
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${status.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                </div>
                <span className="text-xs text-gray-500">Market #{marketId}</span>
            </div>

            {/* Question */}
            <h3 className="mb-4 text-lg font-semibold text-gray-900 line-clamp-2">
                {market.question}
            </h3>

            {/* Market Info */}
            <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">End Time:</span>
                    <span className="font-medium text-gray-900">
                        {isExpired ? 'Ended' : formatDistanceToNow(endDate, { addSuffix: true })}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Closes:</span>
                    <span className="text-gray-900">{endDate.toLocaleDateString()}</span>
                </div>
            </div>

            {/* YES/NO Shares */}
            {market.status === MarketStatus.Open && (
                <div className="mb-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-green-50 p-3 text-center">
                        <div className="text-xs text-green-600 font-medium">YES Shares</div>
                        <div className="text-sm font-semibold text-green-700 mt-1">
                            {market.totalYesShares.toString()}
                        </div>
                    </div>
                    <div className="rounded-lg bg-red-50 p-3 text-center">
                        <div className="text-xs text-red-600 font-medium">NO Shares</div>
                        <div className="text-sm font-semibold text-red-700 mt-1">
                            {market.totalNoShares.toString()}
                        </div>
                    </div>
                </div>
            )}

            {/* Resolved Outcome */}
            {market.status === MarketStatus.Resolved && (
                <div className={`mb-4 rounded-lg p-3 text-center ${market.outcome ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="text-xs font-medium text-gray-600">Outcome</div>
                    <div className={`text-lg font-bold mt-1 ${market.outcome ? 'text-green-700' : 'text-red-700'}`}>
                        {market.outcome ? 'YES' : 'NO'}
                    </div>
                </div>
            )}

            {/* Token Addresses (collapsed) */}
            <details className="mb-4 text-xs">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                    Token Addresses
                </summary>
                <div className="mt-2 space-y-1 rounded-lg bg-gray-50 p-2">
                    <div>
                        <span className="font-medium text-green-600">YES:</span>{' '}
                        <span className="font-mono text-gray-600">{market.yesToken.slice(0, 10)}...</span>
                    </div>
                    <div>
                        <span className="font-medium text-red-600">NO:</span>{' '}
                        <span className="font-mono text-gray-600">{market.noToken.slice(0, 10)}...</span>
                    </div>
                </div>
            </details>

            {/* Action Button */}
            {market.status === MarketStatus.Open && !isExpired && (
                <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 font-semibold text-white transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                    Trade
                </button>
            )}

            {market.status === MarketStatus.Resolved && (
                <button className="w-full rounded-lg border-2 border-blue-200 bg-blue-50 px-4 py-2.5 font-semibold text-blue-700 transition-all hover:bg-blue-100">
                    Claim Winnings
                </button>
            )}
        </div>
    )
}

/**
 * MarketList component - displays all prediction markets
 */
export default function MarketList() {
    // Read market count from contract
    const { data: marketCount, isLoading: isLoadingCount } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'marketCount',
    })

    // Generate array of market IDs to fetch
    const marketIds = marketCount ? Array.from({ length: Number(marketCount) }, (_, i) => i) : []

    // Fetch all markets
    const marketQueries = marketIds.map((id) =>
        useReadContract({
            address: PREDICTION_MARKET_ADDRESS,
            abi: PREDICTION_MARKET_ABI,
            functionName: 'markets',
            args: [BigInt(id)],
        })
    )

    const isLoading = isLoadingCount || marketQueries.some((q) => q.isLoading)
    const markets = marketQueries.map((q) => q.data as Market | undefined)

    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                        <p className="mt-4 text-gray-600">Loading markets...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Empty state
    if (!marketCount || marketCount === BigInt(0)) {
        return (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                    <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">No markets yet</h3>
                <p className="text-gray-600">
                    Be the first to create a prediction market on ProphetBase!
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Active Markets</h2>
                    <p className="text-gray-600">
                        {marketCount.toString()} {Number(marketCount) === 1 ? 'market' : 'markets'} available
                    </p>
                </div>
            </div>

            {/* Market Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {markets.map((market, index) => {
                    if (!market) return null
                    return <MarketCard key={index} market={market} marketId={index} />
                })}
            </div>
        </div>
    )
}
