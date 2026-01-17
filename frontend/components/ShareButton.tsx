'use client'

import { useState } from 'react'
import { showSuccess, showError } from '@/lib/toast'

/**
 * Props interface for ShareButton component
 */
interface ShareButtonProps {
    marketId: number
    question: string
}

/**
 * ShareButton - Social sharing component for markets
 * Allows users to share markets on Twitter, Telegram, or copy link
 */
export default function ShareButton({ marketId, question }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Generate share URL
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/?market=${marketId}`
        : ''

    // Generate share text
    const shareText = `Check out this prediction market on ProphetBase: "${question}"`

    // Share on Twitter
    const shareOnTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        window.open(twitterUrl, '_blank', 'noopener,noreferrer')
        setIsOpen(false)
    }

    // Share on Telegram
    const shareOnTelegram = () => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        window.open(telegramUrl, '_blank', 'noopener,noreferrer')
        setIsOpen(false)
    }

    // Copy link to clipboard
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            showSuccess('Link copied to clipboard!')
            setIsOpen(false)
        } catch (error) {
            showError('Failed to copy link')
        }
    }

    return (
        <div className="relative">
            {/* Share Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
                aria-label="Share market"
            >
                <span className="text-base">📤</span>
                <span>Share</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsOpen(false)
                        }}
                    />

                    {/* Menu */}
                    <div
                        className="absolute right-0 top-full mt-2 z-20 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Twitter */}
                        <button
                            onClick={shareOnTwitter}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-blue-50"
                        >
                            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <div>
                                <div className="font-medium text-gray-900">Share on Twitter</div>
                                <div className="text-xs text-gray-500">Post to your timeline</div>
                            </div>
                        </button>

                        {/* Telegram */}
                        <button
                            onClick={shareOnTelegram}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-blue-50"
                        >
                            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                            </svg>
                            <div>
                                <div className="font-medium text-gray-900">Share on Telegram</div>
                                <div className="text-xs text-gray-500">Send to contacts</div>
                            </div>
                        </button>

                        {/* Copy Link */}
                        <button
                            onClick={copyLink}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 border-t border-gray-100"
                        >
                            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <div>
                                <div className="font-medium text-gray-900">Copy Link</div>
                                <div className="text-xs text-gray-500">Copy to clipboard</div>
                            </div>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
