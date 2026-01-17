'use client'

import { useState, useEffect } from 'react'
import Jazzicon from '@jazzicon/react'
import { formatDistanceToNow } from 'date-fns'

interface Activity {
    id: string
    type: 'market_created' | 'shares_purchased' | 'market_resolved' | 'winnings_claimed'
    user: string
    marketId: number
    marketQuestion: string
    amount?: string
    outcome?: boolean
    timestamp: number
}

// Mock data generator (will be replaced with real event data)
const generateMockActivities = (): Activity[] => {
    const activities: Activity[] = []
    const now = Date.now()

    const mockAddresses = [
        '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
        '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    ]

    const mockQuestions = [
        'Will ETH hit $5k by end of 2026?',
        'Will BTC reach $100k?',
        'Will Base TVL exceed $10B?',
    ]

    for (let i = 0; i < 10; i++) {
        const types: Activity['type'][] = ['market_created', 'shares_purchased', 'market_resolved', 'winnings_claimed']
        const type = types[Math.floor(Math.random() * types.length)]

        activities.push({
            id: `activity-${i}`,
            type,
            user: mockAddresses[Math.floor(Math.random() * mockAddresses.length)],
            marketId: Math.floor(Math.random() * 3),
            marketQuestion: mockQuestions[Math.floor(Math.random() * mockQuestions.length)],
            amount: type === 'shares_purchased' || type === 'winnings_claimed' ? `${(Math.random() * 1000).toFixed(2)}` : undefined,
            outcome: type === 'shares_purchased' ? Math.random() > 0.5 : type === 'market_resolved' ? Math.random() > 0.5 : undefined,
            timestamp: now - Math.random() * 3600000, // Random time within last hour
        })
    }

    return activities.sort((a, b) => b.timestamp - a.timestamp)
}

export default function ActivityFeed({ className = '' }: { className?: string }) {
    const [activities, setActivities] = useState<Activity[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setActivities(generateMockActivities())

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            setActivities(generateMockActivities())
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    const getActivityIcon = (type: Activity['type']) => {
        switch (type) {
            case 'market_created':
                return (
                    <div className="rounded-full bg-blue-100 p-2">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                )
            case 'shares_purchased':
                return (
                    <div className="rounded-full bg-green-100 p-2">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                )
            case 'market_resolved':
                return (
                    <div className="rounded-full bg-purple-100 p-2">
                        <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )
            case 'winnings_claimed':
                return (
                    <div className="rounded-full bg-yellow-100 p-2">
                        <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )
        }
    }

    const getActivityText = (activity: Activity) => {
        const shortAddress = `${activity.user.slice(0, 6)}...${activity.user.slice(-4)}`

        switch (activity.type) {
            case 'market_created':
                return (
                    <>
                        <span className="font-semibold text-gray-900">{shortAddress}</span> created a new market
                    </>
                )
            case 'shares_purchased':
                return (
                    <>
                        <span className="font-semibold text-gray-900">{shortAddress}</span> bought{' '}
                        <span className={`font-semibold ${activity.outcome ? 'text-green-600' : 'text-red-600'}`}>
                            {activity.outcome ? 'YES' : 'NO'}
                        </span>{' '}
                        shares for <span className="font-semibold text-gray-900">${activity.amount}</span>
                    </>
                )
            case 'market_resolved':
                return (
                    <>
                        Market resolved:{' '}
                        <span className={`font-semibold ${activity.outcome ? 'text-green-600' : 'text-red-600'}`}>
                            {activity.outcome ? 'YES' : 'NO'}
                        </span>{' '}
                        wins
                    </>
                )
            case 'winnings_claimed':
                return (
                    <>
                        <span className="font-semibold text-gray-900">{shortAddress}</span> claimed{' '}
                        <span className="font-semibold text-gray-900">${activity.amount}</span>
                    </>
                )
        }
    }

    if (!mounted) {
        return (
            <div className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}>
                <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <p className="text-sm text-gray-500">Live market updates</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <span>Live</span>
                </div>
            </div>

            {/* Activity List */}
            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <Jazzicon address={activity.user} size={40} />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                                {getActivityIcon(activity.type)}
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-700">{getActivityText(activity)}</p>
                                    <p className="mt-1 truncate text-xs text-gray-500">{activity.marketQuestion}</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Note */}
            <div className="mt-4 rounded-lg bg-blue-50 p-3">
                <p className="text-xs text-blue-700">
                    📡 <strong>Note:</strong> Activity feed shows mock data. Real-time updates will be implemented with event indexing.
                </p>
            </div>
        </div>
    )
}
