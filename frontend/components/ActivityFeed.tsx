'use client'

import { useState, useEffect } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { formatDistanceToNow } from 'date-fns'

interface ActivityEvent {
    id: number
    type: 'buy_yes' | 'buy_no' | 'resolution' | 'creation'
    marketQuestion: string
    user: string
    amount?: string
    timestamp: Date
}

// Mock Data
const MOCK_EVENTS: ActivityEvent[] = [
    {
        id: 1,
        type: 'buy_yes',
        marketQuestion: 'Will Bitcoin hit $100k?',
        user: '0x1234...5678',
        amount: '1,000 Yes',
        timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
        id: 2,
        type: 'buy_no',
        marketQuestion: 'Will ETH flip BTC?',
        user: '0x8765...4321',
        amount: '500 No',
        timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
        id: 3,
        type: 'creation',
        marketQuestion: 'Will Coinbase re-list XRP?',
        user: '0x9999...9999',
        timestamp: new Date(Date.now() - 1000 * 60 * 60)
    },
    {
        id: 4,
        type: 'resolution',
        marketQuestion: 'Spot ETH ETF Approved?',
        user: '0xAdmin...0000',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
    }
]

export default function ActivityFeed({ className = '' }: { className?: string }) {
    const [events, setEvents] = useState<ActivityEvent[]>([])

    useEffect(() => {
        setEvents(MOCK_EVENTS)
    }, [])

    const getEventIcon = (type: ActivityEvent['type']) => {
        switch (type) {
            case 'buy_yes':
                return <span className="text-green-500 bg-green-100 dark:bg-green-900/30 p-1 rounded text-xs">✅</span>
            case 'buy_no':
                return <span className="text-red-500 bg-red-100 dark:bg-red-900/30 p-1 rounded text-xs">❌</span>
            case 'creation':
                return <span className="text-blue-500 bg-blue-100 dark:bg-blue-900/30 p-1 rounded text-xs">✨</span>
            case 'resolution':
                return <span className="text-purple-500 bg-purple-100 dark:bg-purple-900/30 p-1 rounded text-xs">⚖️</span>
        }
    }

    const getEventText = (event: ActivityEvent) => {
        switch (event.type) {
            case 'buy_yes':
                return <span className="text-gray-600 dark:text-gray-300">bought <span className="font-semibold text-green-600">{event.amount}</span> in</span>
            case 'buy_no':
                return <span className="text-gray-600 dark:text-gray-300">bought <span className="font-semibold text-red-600">{event.amount}</span> in</span>
            case 'creation':
                return <span className="text-gray-600 dark:text-gray-300">created market</span>
            case 'resolution':
                return <span className="text-gray-600 dark:text-gray-300">resolved market</span>
        }
    }

    return (
        <div className={`card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Live Activity</h3>
                    <p className="text-xs text-secondary hidden sm:block">Real-time market updates</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="font-medium">Live</span>
                </div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[400px] overflow-y-auto scrollbar-hide">
                {events.map((event) => (
                    <div key={event.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors animate-fade-in group cursor-default">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 pt-1">
                                <Jazzicon diameter={32} seed={jsNumberForAddress(event.user)} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                                        {event.user}
                                    </p>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                        {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                                    </span>
                                </div>

                                <div className="text-sm mt-0.5 leading-snug">
                                    {getEventText(event)}
                                </div>
                                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 truncate">
                                    {event.marketQuestion}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
