'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import AdminPanel with no SSR
const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
    ssr: false,
    loading: () => (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200 mb-8" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200 mb-2" />
                        <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
                    </div>
                ))}
            </div>
        </div>
    ),
})

export default function AdminPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
                <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <nav className="flex items-center gap-2 text-sm">
                            <a href="/" className="text-gray-500 hover:text-gray-700">
                                Home
                            </a>
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-medium text-gray-900">Admin</span>
                        </nav>
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
            {/* Breadcrumb */}
            <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-sm">
                        <a href="/" className="text-gray-500 hover:text-gray-700">
                            Home
                        </a>
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-medium text-gray-900">Admin</span>
                    </nav>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <AdminPanel />
            </div>
        </div>
    )
}
