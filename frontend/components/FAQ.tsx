'use client'

import { useState } from 'react'

/**
 * FAQ item interface
 */
interface FAQItem {
    question: string
    answer: string
    icon: string
}

/**
 * FAQ data
 */
const faqData: FAQItem[] = [
    {
        question: 'What is ProphetBase?',
        answer: 'ProphetBase is a decentralized prediction market platform built on Base. Users can create markets for crypto events, buy shares predicting outcomes, and earn rewards if their predictions are correct. All transactions are trustless and settled via smart contracts.',
        icon: '🔮',
    },
    {
        question: 'How do I use ProphetBase?',
        answer: 'Connect your wallet, browse available markets, and buy YES or NO shares based on your prediction. When a market resolves, winners can claim their rewards. Each share costs 1 USDC, and winners receive the total pool proportional to their shares.',
        icon: '📖',
    },
    {
        question: 'Why USDC?',
        answer: 'We use USDC (USD Coin) as the settlement currency for stability and predictability. Unlike volatile cryptocurrencies, USDC maintains a 1:1 peg with the US Dollar, making it easier to understand your potential returns.',
        icon: '💵',
    },
    {
        question: 'Are there any fees?',
        answer: 'ProphetBase charges no platform fees! You only pay standard Base network gas fees for transactions. This means more of your winnings stay in your pocket. Gas fees on Base are typically very low (less than $0.01 per transaction).',
        icon: '💰',
    },
    {
        question: 'Is ProphetBase safe?',
        answer: 'Yes! ProphetBase is built on audited smart contracts deployed on Base (Ethereum L2). All funds are held in smart contracts, not by any centralized entity. Markets are resolved transparently, and winners can claim their rewards at any time.',
        icon: '🔒',
    },
    {
        question: 'How are markets resolved?',
        answer: 'Markets are resolved by the market creator after the event concludes. The resolution is recorded on-chain and cannot be changed. In the future, we plan to implement decentralized oracle-based resolution for even greater trustlessness.',
        icon: '⚖️',
    },
]

/**
 * FAQ - Accordion-style FAQ component
 * Displays frequently asked questions with collapsible answers
 */
export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Frequently Asked Questions
                </h2>
                <p className="text-gray-600">
                    Everything you need to know about ProphetBase
                </p>
            </div>

            <div className="space-y-3">
                {faqData.map((faq, index) => (
                    <div
                        key={index}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <span className="text-2xl flex-shrink-0">{faq.icon}</span>
                                <span className="font-semibold text-gray-900 text-lg">
                                    {faq.question}
                                </span>
                            </div>
                            <div
                                className={`flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''
                                    }`}
                            >
                                <svg
                                    className="h-6 w-6 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </div>
                        </button>

                        {openIndex === index && (
                            <div className="px-6 pb-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="pl-11 pr-10 text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
