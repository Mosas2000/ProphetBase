import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
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
 * Professional MarketCard with Base branding and smooth animations
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
    const [isHovered, setIsHovered] = useState(false)

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
            case MarketStatus.Open:
                return {
                    label: 'Open',
                    color: 'bg-green-50 text-green-700',
                    dot: 'bg-green-500'
                }
            case MarketStatus.Resolved:
                return {
                    label: 'Resolved',
                    color: 'bg-blue-50 text-blue-700',
                    dot: 'bg-blue-500'
                }
            case MarketStatus.Cancelled:
                return {
                    label: 'Cancelled',
                    color: 'bg-gray-50 text-gray-700',
                    dot: 'bg-gray-500'
                }
            default:
                return {
                    label: 'Unknown',
                    color: 'bg-gray-50 text-gray-700',
                    dot: 'bg-gray-500'
                }
        }
    }

    const statusInfo = getStatusInfo(status)

    return (
        <>
            <div
                className={`
                    group relative flex flex-col h-full bg-white rounded-xl border border-gray-200 
                    transition-all duration-300 ease-spring overflow-hidden cursor-pointer
                    hover:shadow-lg hover:-translate-y-1 hover:border-blue-200
                    ${isHovered ? 'shadow-glow' : ''}
                `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Main Content */}
                <div className="p-5 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusInfo.dot}`}></span>
                            {statusInfo.label}
                        </div>
                        <span className="text-xs text-gray-400 font-mono">#{marketId}</span>
                    </div>

                    {/* Question */}
                    <h3 className="text-lg font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {question}
                    </h3>

                    {/* Timer & Volume */}
                    {status === MarketStatus.Open && (
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-6 font-medium">
                            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {timeLeft}
                            </div>
                            <div className="flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                {totalShares.toLocaleString()} Vol
                            </div>
                        </div>
                    )}

                    {/* Probability Bars */}
                    {status === MarketStatus.Open && !isExpired && (
                        <div className="mt-auto space-y-3">
                            <div className="flex justify-between items-end text-sm font-medium">
                                <span className="text-green-600">YES {yesProbability.toFixed(0)}%</span>
                                <span className="text-red-500">NO {noProbability.toFixed(0)}%</span>
                            </div>

                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                                <div
                                    style={{ width: `${yesProbability}%` }}
                                    className="h-full bg-green-500 transition-all duration-500"
                                />
                                <div
                                    style={{ width: `${noProbability}%` }}
                                    className="h-full bg-red-500 transition-all duration-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Buttons (Visible on Open & Active) */}
                    {status === MarketStatus.Open && !isExpired && (
                        <div className="grid grid-cols-2 gap-3 mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-0 group-hover:h-auto overflow-hidden">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedShareType('YES')
                                    setIsBuyModalOpen(true)
                                }}
                                className="btn-success py-2 text-sm shadow-sm hover:shadow-md"
                            >
                                Buy YES
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedShareType('NO')
                                    setIsBuyModalOpen(true)
                                }}
                                className="btn-danger py-2 text-sm shadow-sm hover:shadow-md"
                            >
                                Buy NO
                            </button>
                        </div>
                    )}

                    {/* Resolved Outcome */}
                    {status === MarketStatus.Resolved && outcome !== undefined && (
                        <div className={`mt-4 rounded-lg p-3 text-center border ${outcome ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Winning Outcome</div>
                            <div className={`text-xl font-bold ${outcome ? 'text-green-700' : 'text-red-700'}`}>
                                {outcome ? 'YES' : 'NO'}
                            </div>
                        </div>
                    )}
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-100 pt-4 bg-gray-50/50 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                            <div>
                                <span className="block text-gray-500 mb-0.5">Start Date</span>
                                <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 mb-0.5">End Date</span>
                                <span className="font-medium text-gray-900">{endDate.toLocaleDateString()}</span>
                            </div>
                        </div>

                        <details className="text-xs group/details" onClick={(e) => e.stopPropagation()}>
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium flex items-center">
                                <span>Contract Details</span>
                                <svg className="w-3 h-3 ml-1 transition-transform group-open/details:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <div className="mt-2 space-y-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div>
                                    <span className="block text-gray-500 mb-0.5">YES Token</span>
                                    <code className="block bg-gray-50 px-2 py-1 rounded border border-gray-100 font-mono text-[10px] break-all text-gray-600">{yesToken}</code>
                                </div>
                                <div>
                                    <span className="block text-gray-500 mb-0.5">NO Token</span>
                                    <code className="block bg-gray-50 px-2 py-1 rounded border border-gray-100 font-mono text-[10px] break-all text-gray-600">{noToken}</code>
                                </div>
                            </div>
                        </details>
                    </div>
                )}
            </div>

            <BuySharesModal
                isOpen={isBuyModalOpen}
                onClose={() => setIsBuyModalOpen(false)}
                marketId={marketId}
                shareType={selectedShareType}
                question={question}
            />
        </>
    )
}
