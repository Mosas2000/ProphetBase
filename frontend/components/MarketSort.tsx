'use client'

import { useState } from 'react'

export type SortOption = 'recent' | 'ending' | 'volume'

interface MarketSortProps {
    currentSort: SortOption
    onSortChange: (sort: SortOption) => void
}

export default function MarketSort({ currentSort, onSortChange }: MarketSortProps) {
    const [isOpen, setIsOpen] = useState(false)

    const options: { value: SortOption; label: string }[] = [
        { value: 'recent', label: '✨ Most Recent' },
        { value: 'ending', label: '⏳ Ending Soon' },
        { value: 'volume', label: '🔥 Most Volume' },
    ]

    return (
        <div className="relative inline-block text-left z-10">
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Sort by:</span>
                <div className="relative">
                    <button
                        type="button"
                        className="btn-secondary py-2 pr-8 text-sm min-w-[160px] justify-between"
                        onClick={() => setIsOpen(!isOpen)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    >
                        <span>{options.find(o => o.value === currentSort)?.label}</span>
                        <svg
                            className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-full origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in">
                            <div className="py-1">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        className={`
                                            group flex w-full items-center px-4 py-2 text-sm
                                            ${currentSort === option.value
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }
                                        `}
                                        onClick={() => {
                                            onSortChange(option.value)
                                            setIsOpen(false)
                                        }}
                                    >
                                        {option.label}
                                        {currentSort === option.value && (
                                            <svg className="ml-auto w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
