'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import Link from 'next/link'

// --- Context & Hook ---

interface WatchlistContextType {
    watchlist: number[]
    addToWatchlist: (marketId: number) => void
    removeFromWatchlist: (marketId: number) => void
    isInWatchlist: (marketId: number) => boolean
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

export function WatchlistProvider({ children }: { children: ReactNode }) {
    const [watchlist, setWatchlist] = useState<number[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem('prophetbase_watchlist')
        if (saved) {
            try {
                setWatchlist(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to parse watchlist', e)
            }
        }
    }, [])

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('prophetbase_watchlist', JSON.stringify(watchlist))
        }
    }, [watchlist, mounted])

    const addToWatchlist = (marketId: number) => {
        setWatchlist(prev => {
            if (prev.includes(marketId)) return prev
            return [...prev, marketId]
        })
    }

    const removeFromWatchlist = (marketId: number) => {
        setWatchlist(prev => prev.filter(id => id !== marketId))
    }

    const isInWatchlist = (marketId: number) => watchlist.includes(marketId)

    return (
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    )
}

export function useWatchlist() {
    const context = useContext(WatchlistContext)
    if (context === undefined) {
        throw new Error('useWatchlist must be used within a WatchlistProvider')
    }
    return context
}

// --- Components ---

export function WatchlistButton({ marketId, className = '' }: { marketId: number; className?: string }) {
    const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
    const isWatched = isInWatchlist(marketId)

    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                isWatched ? removeFromWatchlist(marketId) : addToWatchlist(marketId)
            }}
            className={`p-2 rounded-full transition-all duration-200 ${isWatched
                    ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20'
                    : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${className}`}
            title={isWatched ? "Remove from Watchlist" : "Add to Watchlist"}
        >
            {isWatched ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ) : (
                <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            )}
        </button>
    )
}

export function WatchlistWidget() {
    const { watchlist } = useWatchlist()

    if (watchlist.length === 0) return null

    return (
        <div className="fixed bottom-4 right-4 z-40 hidden md:block">
            <Link href="/watchlist">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-full px-4 py-2 flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{watchlist.length} Watched</span>
                </div>
            </Link>
        </div>
    )
}
