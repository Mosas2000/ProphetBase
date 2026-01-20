'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface MarketSearchProps {
    onSearch: (query: string) => void
    onCategoryChange: (category: string) => void
    categories?: string[]
}

const DEFAULT_CATEGORIES = ['All', 'Crypto', 'Politics', 'Sports', 'Pop Culture', 'Business']

export default function MarketSearch({
    onSearch,
    onCategoryChange,
    categories = DEFAULT_CATEGORIES
}: MarketSearchProps) {
    const [query, setQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQuery(value)
        onSearch(value)
    }

    const clearSearch = () => {
        setQuery('')
        onSearch('')
    }

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category)
        onCategoryChange(category)
    }

    return (
        <div className="space-y-6 mb-8 animate-fade-in">
            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    className="input-base pl-10 pr-10 shadow-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 border-gray-200 dark:border-gray-700"
                    placeholder="Search markets (e.g., 'Bitcoin', 'Election', 'Super Bowl')..."
                    value={query}
                    onChange={handleSearch}
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`
                            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                            ${selectedCategory === category
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 transform scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    )
}
