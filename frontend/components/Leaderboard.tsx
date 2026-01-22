'use client'

import { useState } from 'react'
import Jazzicon from 'react-jazzicon'

type TimePeriod = '24H' | '7D' | 'ALL'

interface LeaderboardEntry {
    rank: number
    address: string
    profit: number
    winRate: number
    totalTrades: number
}

// Mock data (will be calculated from real blockchain data)
const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', profit: 5420.50, winRate: 78.5, totalTrades: 45 },
    { rank: 2, address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', profit: 3890.25, winRate: 72.3, totalTrades: 38 },
    { rank: 3, address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', profit: 2156.80, winRate: 68.9, totalTrades: 29 },
    { rank: 4, address: '0x1234567890123456789012345678901234567890', profit: 1890.40, winRate: 65.2, totalTrades: 23 },
    { rank: 5, address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', profit: 1234.60, winRate: 61.5, totalTrades: 19 },
    { rank: 6, address: '0x9876543210987654321098765432109876543210', profit: 987.30, winRate: 58.7, totalTrades: 15 },
    { rank: 7, address: '0x5555555555555555555555555555555555555555', profit: 756.20, winRate: 55.3, totalTrades: 12 },
    { rank: 8, address: '0x6666666666666666666666666666666666666666', profit: 543.10, winRate: 52.1, totalTrades: 10 },
    { rank: 9, address: '0x7777777777777777777777777777777777777777', profit: 321.50, winRate: 48.9, totalTrades: 8 },
    { rank: 10, address: '0x8888888888888888888888888888888888888888', profit: 198.40, winRate: 45.2, totalTrades: 6 },
]

interface LeaderboardProps {
    currentUserAddress?: string
    className?: string
}

export default function Leaderboard({ currentUserAddress, className = '' }: LeaderboardProps) {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('ALL')

    const getRankBadge = (rank: number) => {
        if (rank === 1) {
            return <span className="text-2xl">🥇</span>
        } else if (rank === 2) {
            return <span className="text-2xl">🥈</span>
        } else if (rank === 3) {
            return <span className="text-2xl">🥉</span>
        }
        return <span className="text-sm font-semibold text-gray-500">#{rank}</span>
    }

    const getWinRateColor = (winRate: number) => {
        if (winRate >= 70) return 'text-green-600'
        if (winRate >= 50) return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <div className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}>
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">🏆 Leaderboard</h3>
                    <p className="text-sm text-gray-500">Top traders by profit</p>
                </div>

                {/* Time Period Selector */}
                <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
                    {(['24H', '7D', 'ALL'] as TimePeriod[]).map((period) => (
                        <button
                            key={period}
                            onClick={() => setTimePeriod(period)}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${timePeriod === period
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* Leaderboard Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="pb-3 pr-4">Rank</th>
                            <th className="pb-3 pr-4">Trader</th>
                            <th className="pb-3 pr-4 text-right">Profit</th>
                            <th className="pb-3 pr-4 text-right">Win Rate</th>
                            <th className="pb-3 text-right">Trades</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mockLeaderboard.map((entry) => {
                            const isCurrentUser = currentUserAddress?.toLowerCase() === entry.address.toLowerCase()

                            return (
                                <tr
                                    key={entry.address}
                                    className={`transition-colors ${isCurrentUser
                                        ? 'bg-blue-50 font-medium'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    {/* Rank */}
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-2">
                                            {getRankBadge(entry.rank)}
                                            {isCurrentUser && (
                                                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                                                    You
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Trader */}
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-3">
                                            <Jazzicon seed={parseInt(entry.address.slice(2, 10), 16)} diameter={32} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                                                </p>
                                                <button className="text-xs text-blue-600 hover:text-blue-700">
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Profit */}
                                    <td className="py-4 pr-4 text-right">
                                        <div>
                                            <p className={`text-sm font-semibold ${entry.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {entry.profit >= 0 ? '+' : ''}${entry.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-xs text-gray-500">USDC</p>
                                        </div>
                                    </td>

                                    {/* Win Rate */}
                                    <td className="py-4 pr-4 text-right">
                                        <div>
                                            <p className={`text-sm font-semibold ${getWinRateColor(entry.winRate)}`}>
                                                {entry.winRate.toFixed(1)}%
                                            </p>
                                            <div className="mt-1 h-1.5 w-16 ml-auto overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className={`h-full ${entry.winRate >= 70
                                                        ? 'bg-green-500'
                                                        : entry.winRate >= 50
                                                            ? 'bg-yellow-500'
                                                            : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${entry.winRate}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Total Trades */}
                                    <td className="py-4 text-right">
                                        <p className="text-sm font-medium text-gray-900">{entry.totalTrades}</p>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer Note */}
            <div className="mt-6 rounded-lg bg-blue-50 p-3">
                <p className="text-xs text-blue-700">
                    📊 <strong>Note:</strong> Leaderboard shows mock data. Real rankings will be calculated from on-chain activity.
                </p>
            </div>
        </div>
    )
}
