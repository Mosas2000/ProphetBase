'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import BuySharesModal from './BuySharesModal'

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
}

/**
 * Professional MarketCard with Base brand colors
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
}: MarketCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [timeLeft, setTimeLeft] = useState('')
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
    const [selectedShareType, setSelectedShareType] = useState<'YES' | 'NO'>('YES')

    const endDate = new Date(Number(endTime) * 1000)
    const isExpired = endDate < new Date()

    // Calculate probabilities
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

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h`)
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`)
            } else {
                setTimeLeft(`${minutes}m`)
            }
        }

        updateTimer()
        const interval = setInterval(updateTimer, 60000) // Update every minute
        return () => clearInterval(interval)
    }, [endDate, isExpired])

    // Status badge configuration
    const getStatusInfo = (status: number) => {
        switch (status) {
            case 0: // Open
                return {
                    label: 'Open',
                    color: 'bg-green-100 text-green-700',
                    dot: 'bg-green-500'
                }
            case 1: // Resolved  
                return {
                    label: 'Resolved',
                    color: 'bg-blue-100 text-blue-700',
                    dot: 'bg-blue-500'
                }
            case 2: // Cancelled
                return {
                    label: 'Cancelled',
                    color: 'bg-gray-100 text-gray-700',
                    dot: 'bg-gray-500'
                }
            default:
                return {
                    label: 'Unknown',
                    color: 'bg-gray-100 text-gray-700',
                    dot: 'bg-gray-500'
                }
        }
    }

    const statusInfo = getStatusInfo(status)

    return (
        <div
            className="group relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:border-[#0052FF]/20 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="relative p-6">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                        {statusInfo.label}
                    </div>
                    <span className="text-xs text-[#6B7280] font-mono">#{marketId}</span>
                </div>

                {/* Question */}
                <h3 className="mb-4 text-lg font-bold text-[#1A1B1F] leading-tight line-clamp-2 group-hover:text-[#0052FF] transition-colors">
                    {question}
                </h3>

                {/* Countdown Timer */}
                {status === MarketStatus.Open && (
                    <div className="mb-4 flex items-center justify-between rounded-lg bg-[#FAFBFC] border border-[#E5E7EB] p-3">
                        <div className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-[#6B7280]">
                                {isExpired ? 'Ended' : 'Ends in'}
                            </span>
                        </div>
                        <span className="text-sm font-semibold text-[#1A1B1F]">{timeLeft}</span>
                    </div>
                )}

                {/* Probability Visualization */}
                {status === MarketStatus.Open && !isExpired && (
                    <div className="mb-4 space-y-3">
                        {/* Probability Bars */}
                        <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-[#F3F4F6]">
                            <div
                                className="bg-[#00D395] transition-all duration-500"
                                style={{ width: `${yesProbability}%` }}
                            />
                            <div
                                className="bg-[#FF4444] transition-all duration-500"
                                style={{ width: `${noProbability}%` }}
                            />
                        </div>

                        {/* Probability Labels */}
                        <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-[#00D395]">{yesProbability.toFixed(0)}%</span>
                                <span className="text-[#6B7280]">YES</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[#6B7280]">NO</span>
                                <span className="font-semibold text-[#FF4444]">{noProbability.toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Resolved Outcome */}
                {status === MarketStatus.Resolved && outcome !== undefined && (
                    <div className={`mb-4 rounded-lg p-4 text-center ${outcome ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <div className="text-sm font-medium text-[#6B7280] mb-1">Resolved Outcome</div>
                        <div className={`text-2xl font-bold ${outcome ? 'text-green-700' : 'text-red-700'}`}>
                            {outcome ? 'YES' : 'NO'}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {status === MarketStatus.Open && !isExpired && (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelectedShareType('YES')
                                setIsBuyModalOpen(true)
                            }}
                            className="rounded-lg bg-[#0052FF] px-4 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#0033CC] hover:shadow-md active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>Buy YES</span>
                                <span className="text-xs opacity-75">{yesProbability.toFixed(0)}%</span>
                            </div>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelectedShareType('NO')
                                setIsBuyModalOpen(true)
                            }}
                            className="rounded-lg bg-[#FF4444] px-4 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#DD2222] hover:shadow-md active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>Buy NO</span>
                                <span className="text-xs opacity-75">{noProbability.toFixed(0)}%</span>
                            </div>
                        </button>
                    </div>
                )}

                {/* Claim Winnings Button */}
                {status === MarketStatus.Resolved && (
                    <button className="w-full rounded-lg bg-[#0052FF] px-4 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#0033CC] hover:shadow-md active:scale-[0.98]">
                        Claim Winnings
                    </button>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                    <div className="mt-4 space-y-3 border-t border-[#E5E7EB] pt-4 fade-in">
                        <div className="text-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-[#6B7280]">Market ID:</span>
                                <span className="font-mono font-medium text-[#1A1B1F]">#{marketId}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-[#6B7280]">End Date:</span>
                                <span className="font-medium text-[#1A1B1F]">{endDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-[#6B7280]">Total Volume:</span>
                                <span className="font-medium text-[#1A1B1F]">{totalShares.toLocaleString()} shares</span>
                            </div>
                        </div>

                        {/* Token Addresses */}
                        <details className="text-xs" onClick={(e) => e.stopPropagation()}>
                            <summary className="cursor-pointer text-[#6B7280] hover:text-[#0052FF] font-medium">
                                Token Addresses
                            </summary>
                            <div className="mt-2 space-y-1.5 rounded-lg bg-[#FAFBFC] border border-[#E5E7EB] p-3">
                                <div>
                                    <span className="font-semibold text-[#00D395]">YES:</span>{' '}
                                    <span className="font-mono text-[#6B7280] break-all">{yesToken}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-[#FF4444]">NO:</span>{' '}
                                    <span className="font-mono text-[#6B7280] break-all">{noToken}</span>
                                </div>
                            </div>
                        </details>
                    </div>
                )}

                {/* Expand Indicator */}
                <div className="mt-3 flex justify-center">
                    <div className={`text-[#6B7280] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Buy Shares Modal */}
            <BuySharesModal
                isOpen={isBuyModalOpen}
                onClose={() => setIsBuyModalOpen(false)}
                marketId={marketId}
                shareType={selectedShareType}
                question={question}
            />
        </div>
    )
}
