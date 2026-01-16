'use client'

import { useReadContract } from 'wagmi'
import { PREDICTION_MARKET_ADDRESS } from '@/lib/contracts'
import { PREDICTION_MARKET_ABI } from '@/lib/abi'
import MarketCard from './MarketCard'

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
 * MarketList component - displays prediction markets
 * Simplified to show first 5 markets only (temporary solution)
 */
export default function MarketList() {
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

    const market3 = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'markets',
        args: [BigInt(3)],
    })

    const market4 = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'markets',
        args: [BigInt(4)],
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
        transformMarketData(market3.data),
        transformMarketData(market4.data),
    ].filter((m): m is Market => m !== undefined)

    // Debug: Log market data
    console.log('📊 Market Data Debug:', {
        marketCount: marketCount ? Number(marketCount) : 0,
        allMarketsLength: allMarkets.length,
        markets: allMarkets.map((m, i) => ({
            id: i,
            question: m.question,
            status: Number(m.status),
            endTime: Number(m.endTime),
            yesToken: m.yesToken,
            noToken: m.noToken,
        }))
    })

    // Check if any query is loading
    const isLoading = isLoadingCount ||
        market0.isLoading ||
        market1.isLoading ||
        market2.isLoading ||
        market3.isLoading ||
        market4.isLoading

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

    const count = Number(marketCount)
    const showingLimited = count > 5

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Active Markets</h2>
                    <p className="text-gray-600">
                        {showingLimited ? `Showing 5 of ${count}` : count} {count === 1 ? 'market' : 'markets'}
                    </p>
                </div>
            </div>

            {/* Warning if showing limited markets */}
            {showingLimited && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <p className="text-sm text-blue-800">
                        📌 Showing first 5 markets only. More markets available - pagination coming soon!
                    </p>
                </div>
            )}

            {/* Market Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {allMarkets.map((market, index) => {
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
        </div>
    )
}
