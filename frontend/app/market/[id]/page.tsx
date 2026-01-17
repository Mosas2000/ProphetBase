'use client'

import { useParams } from 'next/navigation'
import { useReadContract } from 'wagmi'
import { PREDICTION_MARKET_ABI, PREDICTION_MARKET_ADDRESS } from '@/lib/contracts'
import CountdownTimer from '@/components/CountdownTimer'
import PriceChart from '@/components/PriceChart'
import BuySharesModal from '@/components/BuySharesModal'
import ActivityFeed from '@/components/ActivityFeed'
import ShareButton from '@/components/ShareButton'
import { CategoryBadge } from '@/components/MarketCategories'
import { useState } from 'react'

export default function MarketDetailPage() {
    const params = useParams()
    const marketId = Number(params.id)
    const [buyModalOpen, setBuyModalOpen] = useState(false)
    const [selectedOutcome, setSelectedOutcome] = useState<'YES' | 'NO'>('YES')

    // Fetch market data
    const { data: marketData, isLoading } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'markets',
        args: [BigInt(marketId)],
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
                    <div className="mt-8 h-64 animate-pulse rounded-xl bg-gray-200" />
                </div>
            </div>
        )
    }

    if (!marketData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">Market Not Found</h1>
                    <p className="mt-2 text-gray-600">This market doesn't exist or has been removed.</p>
                    <a href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
                        ← Back to Markets
                    </a>
                </div>
            </div>
        )
    }

    const [question, endTime, resolutionTime, status, outcome, yesToken, noToken, totalYesShares, totalNoShares, category] = marketData as any[]

    const totalShares = Number(totalYesShares) + Number(totalNoShares)
    const yesPercentage = totalShares > 0 ? (Number(totalYesShares) / totalShares) * 100 : 50
    const noPercentage = 100 - yesPercentage

    const getStatusBadge = () => {
        const statusMap = {
            0: { label: 'Open', color: 'bg-green-100 text-green-700 border-green-200' },
            1: { label: 'Resolved', color: 'bg-blue-100 text-blue-700 border-blue-200' },
            2: { label: 'Cancelled', color: 'bg-gray-100 text-gray-700 border-gray-200' },
        }
        const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap[0]
        return (
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusInfo.color}`}>
                {statusInfo.label}
            </span>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
            {/* Breadcrumb */}
            <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-sm">
                        <a href="/" className="text-gray-500 hover:text-gray-700">
                            Markets
                        </a>
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-medium text-gray-900">Market #{marketId}</span>
                    </nav>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                {getStatusBadge()}
                                <CategoryBadge categoryId={Number(category)} />
                            </div>
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{question}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                <span>Market #{marketId}</span>
                                <span>•</span>
                                <span>Created by Owner</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <ShareButton marketId={marketId} question={question} />
                        </div>
                    </div>

                    <div className="mt-6">
                        <CountdownTimer endTime={Number(endTime)} />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column - Charts & Info */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Probabilities */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Current Probabilities</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg bg-green-50 p-6 text-center">
                                    <p className="mb-2 text-sm font-medium text-green-700">YES</p>
                                    <p className="text-4xl font-bold text-green-600">{yesPercentage.toFixed(1)}%</p>
                                    <p className="mt-2 text-xs text-green-600">{Number(totalYesShares).toLocaleString()} shares</p>
                                </div>
                                <div className="rounded-lg bg-red-50 p-6 text-center">
                                    <p className="mb-2 text-sm font-medium text-red-700">NO</p>
                                    <p className="text-4xl font-bold text-red-600">{noPercentage.toFixed(1)}%</p>
                                    <p className="mt-2 text-xs text-red-600">{Number(totalNoShares).toLocaleString()} shares</p>
                                </div>
                            </div>
                        </div>

                        {/* Price Chart */}
                        <PriceChart marketId={marketId} />

                        {/* Activity Feed */}
                        <ActivityFeed />
                    </div>

                    {/* Right Column - Trading */}
                    <div className="space-y-6">
                        {/* Buy/Sell Interface */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Trade Shares</h3>

                            {status === 0 ? (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => {
                                            setSelectedOutcome('YES')
                                            setBuyModalOpen(true)
                                        }}
                                        className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 font-semibold text-white shadow-md transition-all hover:shadow-lg"
                                    >
                                        Buy YES Shares
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedOutcome('NO')
                                            setBuyModalOpen(true)
                                        }}
                                        className="w-full rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 font-semibold text-white shadow-md transition-all hover:shadow-lg"
                                    >
                                        Buy NO Shares
                                    </button>
                                </div>
                            ) : (
                                <div className="rounded-lg bg-gray-50 p-4 text-center">
                                    <p className="text-sm text-gray-600">
                                        {status === 1 ? 'Market has been resolved' : 'Market is cancelled'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Market Info */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Market Info</h3>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Total Volume</dt>
                                    <dd className="font-medium text-gray-900">${totalShares.toLocaleString()} USDC</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">End Time</dt>
                                    <dd className="font-medium text-gray-900">
                                        {new Date(Number(endTime) * 1000).toLocaleDateString()}
                                    </dd>
                                </div>
                                {status === 1 && (
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Outcome</dt>
                                        <dd className={`font-semibold ${outcome ? 'text-green-600' : 'text-red-600'}`}>
                                            {outcome ? 'YES' : 'NO'}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buy Modal */}
            <BuySharesModal
                isOpen={buyModalOpen}
                onClose={() => setBuyModalOpen(false)}
                marketId={marketId}
                shareType={selectedOutcome}
                question={question}
            />
        </div>
    )
}
