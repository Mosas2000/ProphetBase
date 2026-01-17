'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
    endTime: number // Unix timestamp in seconds
    className?: string
}

export default function CountdownTimer({ endTime, className = '' }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number
        hours: number
        minutes: number
        seconds: number
        total: number
    } | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        const calculateTimeLeft = () => {
            const now = Math.floor(Date.now() / 1000)
            const difference = endTime - now

            if (difference <= 0) {
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    total: 0,
                }
            }

            return {
                days: Math.floor(difference / (24 * 60 * 60)),
                hours: Math.floor((difference % (24 * 60 * 60)) / (60 * 60)),
                minutes: Math.floor((difference % (60 * 60)) / 60),
                seconds: difference % 60,
                total: difference,
            }
        }

        setTimeLeft(calculateTimeLeft())

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [endTime, mounted])

    if (!mounted || !timeLeft) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
            </div>
        )
    }

    // Determine urgency color
    const getUrgencyColor = () => {
        if (timeLeft.total === 0) return 'text-gray-500'
        if (timeLeft.total < 24 * 60 * 60) return 'text-red-600' // < 24 hours
        if (timeLeft.total < 7 * 24 * 60 * 60) return 'text-yellow-600' // < 7 days
        return 'text-green-600' // > 7 days
    }

    const getBgColor = () => {
        if (timeLeft.total === 0) return 'bg-gray-100'
        if (timeLeft.total < 24 * 60 * 60) return 'bg-red-50'
        if (timeLeft.total < 7 * 24 * 60 * 60) return 'bg-yellow-50'
        return 'bg-green-50'
    }

    const getBorderColor = () => {
        if (timeLeft.total === 0) return 'border-gray-200'
        if (timeLeft.total < 24 * 60 * 60) return 'border-red-200'
        if (timeLeft.total < 7 * 24 * 60 * 60) return 'border-yellow-200'
        return 'border-green-200'
    }

    if (timeLeft.total === 0) {
        return (
            <div className={`inline-flex items-center gap-2 rounded-lg border ${getBorderColor()} ${getBgColor()} px-3 py-2 ${className}`}>
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">Ended</span>
            </div>
        )
    }

    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
            {/* Clock Icon */}
            <div className={`rounded-lg border ${getBorderColor()} ${getBgColor()} p-2`}>
                <svg className={`h-5 w-5 ${getUrgencyColor()}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>

            {/* Time Display */}
            <div className="flex items-center gap-1">
                {timeLeft.days > 0 && (
                    <div className="flex flex-col items-center">
                        <span className={`text-lg font-bold ${getUrgencyColor()}`}>{timeLeft.days}</span>
                        <span className="text-xs text-gray-500">days</span>
                    </div>
                )}
                {(timeLeft.days > 0 || timeLeft.hours > 0) && (
                    <>
                        {timeLeft.days > 0 && <span className="text-gray-400">:</span>}
                        <div className="flex flex-col items-center">
                            <span className={`text-lg font-bold ${getUrgencyColor()}`}>{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="text-xs text-gray-500">hrs</span>
                        </div>
                    </>
                )}
                <span className="text-gray-400">:</span>
                <div className="flex flex-col items-center">
                    <span className={`text-lg font-bold ${getUrgencyColor()}`}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-xs text-gray-500">min</span>
                </div>
                <span className="text-gray-400">:</span>
                <div className="flex flex-col items-center">
                    <span className={`text-lg font-bold ${getUrgencyColor()}`}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-xs text-gray-500">sec</span>
                </div>
            </div>

            {/* Progress Ring (optional visual indicator) */}
            {timeLeft.total < 24 * 60 * 60 && timeLeft.total > 0 && (
                <div className="relative h-12 w-12">
                    <svg className="h-12 w-12 -rotate-90 transform">
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-gray-200"
                        />
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - timeLeft.total / (24 * 60 * 60))}`}
                            className={getUrgencyColor()}
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            )}
        </div>
    )
}
