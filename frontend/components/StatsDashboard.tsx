'use client'

import { useEffect, useState } from 'react'

/**
 * Stat item interface
 */
interface StatItem {
    label: string
    value: string | number
    icon: string
    gradient: string
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
}

/**
 * Props interface for StatsDashboard component
 */
interface StatsDashboardProps {
    totalMarkets?: number
    activeMarkets?: number
    totalVolume?: string
    totalUsers?: number
}

/**
 * StatsDashboard - Display key metrics for ProphetBase
 * Shows total markets, active markets, volume, and users
 */
export default function StatsDashboard({
    totalMarkets = 0,
    activeMarkets = 0,
    totalVolume = '0',
    totalUsers = 0,
}: StatsDashboardProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const stats: StatItem[] = [
        {
            label: 'Total Markets',
            value: mounted ? totalMarkets.toLocaleString() : '0',
            icon: '📊',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            label: 'Active Markets',
            value: mounted ? activeMarkets.toLocaleString() : '0',
            icon: '🎯',
            gradient: 'from-green-500 to-emerald-500',
        },
        {
            label: 'Total Volume',
            value: mounted ? `$${totalVolume}` : '$0',
            icon: '💰',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            label: 'Total Users',
            value: mounted ? totalUsers.toLocaleString() : '0',
            icon: '👥',
            gradient: 'from-orange-500 to-red-500',
        },
    ]

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                    >
                        {/* Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                        <div className="relative p-6">
                            {/* Icon */}
                            <div className="mb-3 flex items-center justify-between">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-2xl shadow-lg`}>
                                    {stat.icon}
                                </div>
                                {stat.change && (
                                    <div
                                        className={`flex items-center gap-1 text-xs font-semibold ${stat.changeType === 'positive'
                                                ? 'text-green-600'
                                                : stat.changeType === 'negative'
                                                    ? 'text-red-600'
                                                    : 'text-gray-600'
                                            }`}
                                    >
                                        {stat.changeType === 'positive' && '↑'}
                                        {stat.changeType === 'negative' && '↓'}
                                        {stat.change}
                                    </div>
                                )}
                            </div>

                            {/* Value */}
                            <div className="mb-1">
                                <div className="text-3xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                                    {stat.value}
                                </div>
                            </div>

                            {/* Label */}
                            <div className="text-sm font-medium text-gray-600">
                                {stat.label}
                            </div>

                            {/* Decorative Element */}
                            <div className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-0 blur-2xl group-hover:opacity-20 transition-opacity`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
