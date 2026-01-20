'use client'

import { useState } from 'react'
import { CheckIcon, ShareIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ShareButtonProps {
    marketId: number
    question: string
}

export default function ShareButton({ marketId, question }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    // Fallback URL logic
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/market/${marketId}`
        : `https://prophetbase.vercel.app/market/${marketId}`

    const encodedText = encodeURIComponent(`Predict on this: "${question}" on ProphetBase! 🔮`)
    const encodedUrl = encodeURIComponent(shareUrl)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy!', err)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-secondary p-2 !rounded-full sm:px-4 sm:py-2 sm:!rounded-lg flex items-center gap-2 transition-transform hover:scale-105"
                title="Share Market"
            >
                <ShareIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    {/* Modal Content */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 relative animate-slide-up">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white text-center">Share Market</h3>

                        <div className="space-y-4">
                            {/* Twitter/X */}
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center w-full p-4 rounded-xl bg-black text-white hover:bg-gray-900 transition-colors shadow-md hover:translate-y-[-2px]"
                            >
                                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                <span className="font-semibold">Share on X</span>
                            </a>

                            {/* Telegram */}
                            <a
                                href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center w-full p-4 rounded-xl bg-[#0088cc] text-white hover:bg-[#0077b5] transition-colors shadow-md hover:translate-y-[-2px]"
                            >
                                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a1.208 1.208 0 0 1-.008 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                                <span className="font-semibold">Share on Telegram</span>
                            </a>

                            {/* Copy Link */}
                            <button
                                onClick={handleCopy}
                                className="flex items-center w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                {copied ? (
                                    <CheckIcon className="w-6 h-6 mr-3 text-green-500" />
                                ) : (
                                    <svg className="w-6 h-6 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                )}
                                <span className="font-semibold text-gray-700 dark:text-gray-200">
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
