'use client'

import AdminPanel from '@/components/AdminPanel'
import { useAccount, useReadContract } from 'wagmi'
import { PREDICTION_MARKET_ABI, PREDICTION_MARKET_ADDRESS } from '@/lib/contracts'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
    const { address, isConnected } = useAccount()
    const router = useRouter()

    const { data: ownerAddress } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'owner',
    })

    // Redirect if not owner
    useEffect(() => {
        if (isConnected && address && ownerAddress && address.toLowerCase() !== ownerAddress.toLowerCase()) {
            router.push('/')
        }
    }, [address, ownerAddress, isConnected, router])

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900">Admin Access Required</h1>
                    <p className="text-gray-600">Please connect your wallet to access the admin panel.</p>
                </div>
            </div>
        )
    }

    if (address?.toLowerCase() !== ownerAddress?.toLowerCase()) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900">Unauthorized</h1>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
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
