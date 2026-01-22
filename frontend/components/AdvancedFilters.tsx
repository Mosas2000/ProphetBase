'use client'

import { useState } from 'react'

export interface FilterOptions {
    dateRange: {
        start: string
        end: string
    }
    volumeRange: {
        min: number
        max: number
    }
    status: ('open' | 'resolved' | 'cancelled')[]
    category: number | null
    sortBy: 'volume' | 'recent' | 'ending_soon' | 'created'
}

interface AdvancedFiltersProps {
    onApplyFilters: (filters: FilterOptions) => void
    onClearFilters: () => void
    className?: string
}

const defaultFilters: FilterOptions = {
    dateRange: { start: '', end: '' },
    volumeRange: { min: 0, max: 10000 },
    status: [],
    category: null,
    sortBy: 'recent',
}

export default function AdvancedFilters({
    onApplyFilters,
    onClearFilters,
    className = '',
}: AdvancedFiltersProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState<FilterOptions>(defaultFilters)

    const activeFilterCount = [
        filters.dateRange.start || filters.dateRange.end,
        filters.volumeRange.min > 0 || filters.volumeRange.max < 10000,
        filters.status.length > 0,
        filters.category !== null,
        filters.sortBy !== 'recent',
    ].filter(Boolean).length

    const handleApply = () => {
        onApplyFilters(filters)
        setIsOpen(false)
    }

    const handleClear = () => {
        setFilters(defaultFilters)
        onClearFilters()
    }

    const toggleStatus = (status: 'open' | 'resolved' | 'cancelled') => {
        setFilters((prev) => ({
            ...prev,
            status: prev.status.includes(status)
                ? prev.status.filter((s) => s !== status)
                : [...prev.status, status],
        }))
    }

    return (
        <div className={`relative ${className}`}>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Advanced Filters
                {activeFilterCount > 0 && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                        {activeFilterCount}
                    </span>
                )}
            </button>

            {/* Filter Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/20"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Date Range */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Date Range
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs text-gray-500">Start Date</label>
                                        <input
                                            type="date"
                                            value={filters.dateRange.start}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    dateRange: { ...prev.dateRange, start: e.target.value },
                                                }))
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs text-gray-500">End Date</label>
                                        <input
                                            type="date"
                                            value={filters.dateRange.end}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    dateRange: { ...prev.dateRange, end: e.target.value },
                                                }))
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Volume Range */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Volume Range (USDC)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs text-gray-500">Min</label>
                                        <input
                                            type="number"
                                            value={filters.volumeRange.min}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    volumeRange: { ...prev.volumeRange, min: Number(e.target.value) },
                                                }))
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs text-gray-500">Max</label>
                                        <input
                                            type="number"
                                            value={filters.volumeRange.max}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    volumeRange: { ...prev.volumeRange, max: Number(e.target.value) },
                                                }))
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Market Status
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { value: 'open' as const, label: 'Open', color: 'green' },
                                        { value: 'resolved' as const, label: 'Resolved', color: 'blue' },
                                        { value: 'cancelled' as const, label: 'Cancelled', color: 'gray' },
                                    ].map((status) => (
                                        <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.status.includes(status.value)}
                                                onChange={() => toggleStatus(status.value)}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                            <span className="text-sm text-gray-700">{status.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    value={filters.category ?? ''}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            category: e.target.value ? Number(e.target.value) : null,
                                        }))
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="">All Categories</option>
                                    <option value="0">🏦 DeFi</option>
                                    <option value="1">₿ Crypto</option>
                                    <option value="2">🗳️ Politics</option>
                                    <option value="3">⚽ Sports</option>
                                    <option value="4">📌 Other</option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Sort By
                                </label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            sortBy: e.target.value as FilterOptions['sortBy'],
                                        }))
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="recent">Most Recent</option>
                                    <option value="volume">Highest Volume</option>
                                    <option value="ending_soon">Ending Soon</option>
                                    <option value="created">Newly Created</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleClear}
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
