'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the profile content with no SSR
const ProfileContent = dynamic(
    () => import('@/components/ProfileContent'),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="h-8 w-48 animate-pulse rounded bg-gray-200 mb-8" />
                    <div className="grid gap-6 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
                                <div className="h-4 w-24 animate-pulse rounded bg-gray-200 mb-4" />
                                <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
    }
)

export default function ProfilePage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
                </div>
            </div>
        )
    }

    return <ProfileContent />
}
