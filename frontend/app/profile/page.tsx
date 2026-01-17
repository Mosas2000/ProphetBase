'use client'

import { useAccount } from 'wagmi'
import { useState } from 'react'
import UserPositions from '@/components/UserPositions'
import TransactionHistory from '@/components/TransactionHistory'

export default function ProfilePage() {
    const { address, isConnected } = useAccount()
    const [mounted, setMounted] = useState(false)

    // Mock user stats (will be calculated from blockchain data)
    const userStats = {
        totalMarkets: 12,
        wins: 8,
        losses: 4,
        totalProfit: 1234.56,
        successRate: 66.7,
    }

    const achievements = [
        { id: 1, name: 'First Trade', icon: '🎯', description: 'Made your first prediction', unlocked: true },
        { id: 2, name: 'Winning Streak', icon: '🔥', description: 'Won 5 markets in a row', unlocked: true },
        { id: 3, name: 'Market Maker', icon: '💎', description: 'Participated in 10+ markets', unlocked: true },
        { id: 4, name: 'Prophet', icon: '🔮', description: 'Achieved 70%+ success rate', unlocked: false },
        { id: 5, name: 'Whale', icon: '🐋', description: 'Traded over $10,000', unlocked: false },
    ]

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-md">
                        <div className="mb-6 text-6xl">👤</div>
                        <h1 className="mb-4 text-3xl font-bold text-gray-900">Connect Your Wallet</h1>
                        <p className="mb-8 text-gray-600">
                            Please connect your wallet to view your profile and trading history.
                        </p>
                        <a
                            href="/"
                            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Go to Markets
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-4xl font-bold text-white">
                                {address?.slice(2, 4).toUpperCase()}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">Your Profile</h1>
                            <p className="mb-4 font-mono text-sm text-gray-600">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy Address
                                </button>
                                <a
                                    href={`https://basescan.org/address/${address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View on BaseScan
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <p className="mb-2 text-sm font-medium text-gray-500">Total Markets</p>
                        <p className="text-3xl font-bold text-gray-900">{userStats.totalMarkets}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <p className="mb-2 text-sm font-medium text-gray-500">Win/Loss</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {userStats.wins}/{userStats.losses}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <p className="mb-2 text-sm font-medium text-gray-500">Total Profit</p>
                        <p className={`text-3xl font-bold ${userStats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {userStats.totalProfit >= 0 ? '+' : ''}${userStats.totalProfit.toFixed(2)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <p className="mb-2 text-sm font-medium text-gray-500">Success Rate</p>
                        <p className="text-3xl font-bold text-blue-600">{userStats.successRate}%</p>
                    </div>
                </div>

                {/* Achievements */}
                <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">Achievements</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`rounded-lg border-2 p-4 ${achievement.unlocked
                                        ? 'border-blue-200 bg-blue-50'
                                        : 'border-gray-200 bg-gray-50 opacity-50'
                                    }`}
                            >
                                <div className="mb-2 text-3xl">{achievement.icon}</div>
                                <h3 className="mb-1 font-semibold text-gray-900">{achievement.name}</h3>
                                <p className="text-sm text-gray-600">{achievement.description}</p>
                                {achievement.unlocked && (
                                    <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Unlocked
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Positions */}
                <div className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Your Positions</h2>
                    <UserPositions />
                </div>

                {/* Transaction History */}
                <div>
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Transaction History</h2>
                    <TransactionHistory userAddress={address} />
                </div>
            </div>
        </div>
    )
}
