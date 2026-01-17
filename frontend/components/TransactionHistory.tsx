'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

type TransactionType = 'buy' | 'sell' | 'claim'

interface Transaction {
    id: string
    type: TransactionType
    marketId: number
    marketQuestion: string
    outcome?: boolean
    amount: string
    timestamp: number
    txHash: string
}

// Mock data (will be replaced with real blockchain data)
const mockTransactions: Transaction[] = [
    {
        id: '1',
        type: 'buy',
        marketId: 0,
        marketQuestion: 'Will ETH hit $5k by end of 2026?',
        outcome: true,
        amount: '100.00',
        timestamp: Date.now() - 3600000,
        txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    },
    {
        id: '2',
        type: 'buy',
        marketId: 1,
        marketQuestion: 'Will BTC reach $100k?',
        outcome: false,
        amount: '250.00',
        timestamp: Date.now() - 7200000,
        txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    },
    {
        id: '3',
        type: 'claim',
        marketId: 2,
        marketQuestion: 'Will Base TVL exceed $10B?',
        amount: '500.00',
        timestamp: Date.now() - 86400000,
        txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    },
]

interface TransactionHistoryProps {
    userAddress?: string
    className?: string
}

export default function TransactionHistory({ userAddress, className = '' }: TransactionHistoryProps) {
    const [filter, setFilter] = useState<TransactionType | 'all'>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredTransactions = mockTransactions.filter(
        (tx) => filter === 'all' || tx.type === filter
    )

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const getTypeIcon = (type: TransactionType) => {
        switch (type) {
            case 'buy':
                return (
                    <div className="rounded-full bg-blue-100 p-2">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                )
            case 'sell':
                return (
                    <div className="rounded-full bg-orange-100 p-2">
                        <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </div>
                )
            case 'claim':
                return (
                    <div className="rounded-full bg-green-100 p-2">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )
        }
    }

    const getTypeBadge = (type: TransactionType) => {
        const styles = {
            buy: 'bg-blue-100 text-blue-700 border-blue-200',
            sell: 'bg-orange-100 text-orange-700 border-orange-200',
            claim: 'bg-green-100 text-green-700 border-green-200',
        }

        return (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[type]}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
        )
    }

    const handleExportCSV = () => {
        // CSV export logic (UI only for now)
        alert('CSV export feature coming soon!')
    }

    return (
        <div className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}>
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                    <p className="text-sm text-gray-500">Your past trades and claims</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value as TransactionType | 'all')
                            setCurrentPage(1)
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="all">All Types</option>
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                        <option value="claim">Claim</option>
                    </select>

                    {/* Export Button */}
                    <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Transactions List */}
            {paginatedTransactions.length === 0 ? (
                <div className="py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-4 text-sm text-gray-500">No transactions found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {paginatedTransactions.map((tx) => (
                        <div
                            key={tx.id}
                            className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0">{getTypeIcon(tx.type)}</div>

                            {/* Content */}
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            {getTypeBadge(tx.type)}
                                            {tx.outcome !== undefined && (
                                                <span className={`text-xs font-semibold ${tx.outcome ? 'text-green-600' : 'text-red-600'}`}>
                                                    {tx.outcome ? 'YES' : 'NO'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 truncate text-sm font-medium text-gray-900">{tx.marketQuestion}</p>
                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                            <span>{formatDistanceToNow(tx.timestamp, { addSuffix: true })}</span>
                                            <span>•</span>
                                            <a
                                                href={`https://basescan.org/tx/${tx.txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                                            >
                                                {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">${tx.amount}</p>
                                        <p className="text-xs text-gray-500">USDC</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
