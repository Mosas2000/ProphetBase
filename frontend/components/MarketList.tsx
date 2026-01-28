'use client'

import { useState, useMemo, memo, useDeferredValue } from 'react'
import { useReadContract } from 'wagmi'
import { PREDICTION_MARKET_ADDRESS } from '@/lib/contracts'
import { PREDICTION_MARKET_ABI } from '@/lib/abi'
import MarketCard from './MarketCard'
import LoadingSkeleton from './LoadingSkeleton'

/**
 * Market status enum matching the contract
 */
export enum MarketStatus {
    Open = 0,
    Resolved = 1,
    Cancelled = 2,
}

/**
 * Market data structure from the contract
 */
export interface Market {
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
 * MarketList component - displays prediction markets with search and filters
 */
function MarketList() {
    const [searchQuery, setSearchQuery] = useState('')
    const deferredSearchQuery = useDeferredValue(searchQuery)
    const [statusFilter, setStatusFilter] = useState<'all' | MarketStatus>('all')

    // Read market count from contract
    const { data: marketCount, isLoading: isLoadingCount } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'marketCount',
    })

    // Hardcoded individual market queries (no hooks in loops!)
    const market0 = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'markets',
        args: [BigInt(0)],
    })

    const market1 = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'markets',
        args: [BigInt(1)],
    })

    const market2 = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'markets',
        args: [BigInt(2)],
    })

    // Transform raw contract data into Market objects
    const transformMarketData = (data: any): Market | undefined => {
        if (!data) return undefined
        // Contract returns: [question, endTime, resolutionTime, status, outcome, yesToken, noToken, totalYesShares, totalNoShares]
        return {
            question: data[0],
            endTime: data[1],
            resolutionTime: data[2],
            status: Number(data[3]),
            outcome: data[4],
            yesToken: data[5],
            noToken: data[6],
            totalYesShares: data[7],
            totalNoShares: data[8],
        }
    }

    // Collect all markets and filter out undefined
    const allMarkets = [
        transformMarketData(market0.data),
        transformMarketData(market1.data),
        transformMarketData(market2.data),
    ].filter((m): m is Market => m !== undefined)

    // Filter markets based on search query and status
    const filteredMarkets = useMemo(() => {
        return allMarkets.filter((market) => {
            // Filter by search query (deferred)
            const matchesSearch = market.question
                .toLowerCase()
                .includes(deferredSearchQuery.toLowerCase())

            // Filter by status
            const matchesStatus =
                statusFilter === 'all' || market.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [allMarkets, deferredSearchQuery, statusFilter])

    // Debug: Log market data
    console.log('📊 Market Data Debug:', {
        marketCount: marketCount ? Number(marketCount) : 0,
        allMarketsLength: allMarkets.length,
        filteredMarketsLength: filteredMarkets.length,
        searchQuery,
        statusFilter,
    })

    // Check if any query is loading
    const isLoading = isLoadingCount ||
        market0.isLoading ||
        market1.isLoading ||
        market2.isLoading

    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Active Markets</h2>
                    </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <LoadingSkeleton count={3} />
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

    const count = Number(marketCount)
    const showingLimited = count > 3

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Active Markets</h2>
                    <p className="text-gray-600">
                        {filteredMarkets.length} {filteredMarkets.length === 1 ? 'market' : 'markets'}
                        {searchQuery || statusFilter !== 'all' ? ' found' : ''}
                    </p>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search Input */}
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search markets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Status Filter Dropdown */}
                <div className="relative sm:w-48">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | MarketStatus)}
                        className="block w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value={MarketStatus.Open}>Open</option>
                        <option value={MarketStatus.Resolved}>Resolved</option>
                        <option value={MarketStatus.Cancelled}>Cancelled</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Warning if showing limited markets */}
            {showingLimited && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <p className="text-sm text-blue-800">
                        📌 Showing first 3 markets only. More markets available - pagination coming soon!
                    </p>
                </div>
            )}

            {/* No Results State */}
            {filteredMarkets.length === 0 && (
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
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">No markets found</h3>
                    <p className="text-gray-600 mb-4">
                        Try adjusting your search or filter criteria
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('')
                            setStatusFilter('all')
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* Market Grid */}
            {filteredMarkets.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredMarkets.map((market, index) => {
                        console.log(`🎯 Rendering MarketCard #${index}:`, {
                            question: market.question,
                            status: Number(market.status),
                            endTime: market.endTime,
                        })
                        return (
                            <MarketCard
                                key={index}
                                marketId={index}
                                question={market.question}
                                endTime={market.endTime}
                                yesToken={market.yesToken}
                                noToken={market.noToken}
                                status={Number(market.status)}
                                totalYesShares={market.totalYesShares}
                                totalNoShares={market.totalNoShares}
                                outcome={market.outcome}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )

}

export default memo(MarketList)
