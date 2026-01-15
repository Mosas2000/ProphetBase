'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'

/**
 * Market status enum
 */
export enum MarketStatus {
    Open = 0,
    Resolved = 1,
    Cancelled = 2,
}

/**
 * Props interface for MarketCard component
 */
export interface MarketCardProps {
    marketId: number
    question: string
    endTime: bigint
    yesToken: string
    noToken: string
    status: MarketStatus
    totalYesShares?: bigint
    totalNoShares?: bigint
    outcome?: boolean
    onBuyYes?: () => void
    onBuyNo?: () => void
}

/**
 * MarketCard - Interactive card for displaying individual prediction markets
 */
export default function MarketCard({
    marketId,
    question,
    endTime,
    yesToken,
    noToken,
    status,
    totalYesShares = BigInt(0),
    totalNoShares = BigInt(0),
    outcome,
    onBuyYes,
    onBuyNo,
}: MarketCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [timeLeft, setTimeLeft] = useState('')

    const endDate = new Date(Number(endTime) * 1000)
    const isExpired = endDate < new Date()

    // Calculate probabilities (50/50 for now, will be replaced with AMM pricing)
    const totalShares = Number(totalYesShares) + Number(totalNoShares)
    const yesProbability = totalShares > 0
        ? (Number(totalYesShares) / totalShares) * 100
        : 50
    const noProbability = totalShares > 0
        ? (Number(totalNoShares) / totalShares) * 100
        : 50

    // Countdown timer
    useEffect(() => {
        const updateTimer = () => {
            if (isExpired) {
                setTimeLeft('Ended')
                return
            }

            const now = new Date()
            const diff = endDate.getTime() - now.getTime()

            if (diff <= 0) {
                setTimeLeft('Ended')
                return
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h`)
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`)
            } else if (minutes > 0) {
                setTimeLeft(`${minutes}m ${seconds}s`)
            } else {
                setTimeLeft(`${seconds}s`)
            }
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)
        return () => clearInterval(interval)
    }, [endDate, isExpired])

    // Status badge configuration
    const statusConfig = {
        [MarketStatus.Open]: {
            label: isExpired ? 'Awaiting Resolution' : 'Live',
            color: isExpired ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700',
            dot: isExpired ? 'bg-yellow-500' : 'bg-green-500',
        },
        [MarketStatus.Resolved]: {
            label: 'Resolved',
            color: 'bg-blue-100 text-blue-700',
            dot: 'bg-blue-500',
        },
        [MarketStatus.Cancelled]: {
            label: 'Cancelled',
            color: 'bg-gray-100 text-gray-700',
            dot: 'bg-gray-500',
        },
    }

    const statusInfo = statusConfig[status]

    return (
        <div
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-300 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative p-6">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🔮</span>
                        <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusInfo.color}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot} animate-pulse`} />
                            {statusInfo.label}
                        </div>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">#{marketId}</span>
                </div>

                {/* Question */}
                <h3 className="mb-4 text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {question}
                </h3>

                {/* Countdown Timer */}
                {status === MarketStatus.Open && (
                    <div className="mb-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-3">
                        <div className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-600">
                                {isExpired ? 'Ended' : 'Ends in'}
                            </span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{timeLeft}</span>
                    </div>
                )}

                {/* Probability Visualization */}
                {status === MarketStatus.Open && !isExpired && (
                    <div className="mb-4 space-y-3">
                        {/* Probability Bars */}
                        <div className="flex gap-2 h-2 rounded-full overflow-hidden bg-gray-100">
                            <div
                                className="bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                style={{ width: `${yesProbability}%` }}
                            />
                            <div
                                className="bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                                style={{ width: `${noProbability}%` }}
                            />
                        </div>

                        {/* Probability Labels */}
                        <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-green-600">{yesProbability.toFixed(0)}%</span>
                                <span className="text-gray-500">YES</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-500">NO</span>
                                <span className="font-semibold text-red-600">{noProbability.toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Resolved Outcome */}
                {status === MarketStatus.Resolved && outcome !== undefined && (
                    <div className={`mb-4 rounded-xl p-4 text-center ${outcome ? 'bg-gradient-to-r from-green-50 to-green-100' : 'bg-gradient-to-r from-red-50 to-red-100'}`}>
                        <div className="text-sm font-medium text-gray-600 mb-1">Resolved Outcome</div>
                        <div className={`text-2xl font-bold ${outcome ? 'text-green-700' : 'text-red-700'}`}>
                            {outcome ? '✓ YES' : '✗ NO'}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {status === MarketStatus.Open && !isExpired && (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onBuyYes?.()
                            }}
                            className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                            <div className="relative flex items-center justify-center gap-2">
                                <span>Buy YES</span>
                                <span className="text-xs opacity-75">{yesProbability.toFixed(0)}%</span>
                            </div>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onBuyNo?.()
                            }}
                            className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                            <div className="relative flex items-center justify-center gap-2">
                                <span>Buy NO</span>
                                <span className="text-xs opacity-75">{noProbability.toFixed(0)}%</span>
                            </div>
                        </button>
                    </div>
                )}

                {/* Claim Winnings Button */}
                {status === MarketStatus.Resolved && (
                    <button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                        Claim Winnings
                    </button>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                    <div className="mt-4 space-y-3 border-t border-gray-200 pt-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="text-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Market ID:</span>
                                <span className="font-mono font-medium text-gray-900">#{marketId}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">End Date:</span>
                                <span className="font-medium text-gray-900">{endDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Total Volume:</span>
                                <span className="font-medium text-gray-900">{totalShares.toLocaleString()} shares</span>
                            </div>
                        </div>

                        {/* Token Addresses */}
                        <details className="text-xs">
                            <summary className="cursor-pointer text-gray-500 hover:text-gray-700 font-medium">
                                Token Addresses
                            </summary>
                            <div className="mt-2 space-y-1.5 rounded-lg bg-gray-50 p-3">
                                <div>
                                    <span className="font-semibold text-green-600">YES:</span>{' '}
                                    <span className="font-mono text-gray-600 break-all">{yesToken}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-red-600">NO:</span>{' '}
                                    <span className="font-mono text-gray-600 break-all">{noToken}</span>
                                </div>
                            </div>
                        </details>
                    </div>
                )}

                {/* Expand Indicator */}
                <div className="mt-3 flex justify-center">
                    <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}
