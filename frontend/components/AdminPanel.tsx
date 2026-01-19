'use client'

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { PREDICTION_MARKET_ABI, PREDICTION_MARKET_ADDRESS } from '@/lib/contracts'
import MarketCreationForm from './MarketCreationForm'
import { useState, useEffect } from 'react'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'

export default function AdminPanel() {
    const { address } = useAccount()
    const [mounted, setMounted] = useState(false)

    // Check if user is owner
    const { data: ownerAddress } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'owner' as any,
    })

    const { data: totalFees } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'totalFeesCollected' as any,
    })

    const { data: isPaused } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'paused' as any,
    })

    const { data: marketCount } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'marketCount',
    })

    const { writeContract: withdrawFees, isPending: isWithdrawing } = useWriteContract()
    const { writeContract: pauseContract, isPending: isPausing } = useWriteContract()
    const { writeContract: unpauseContract, isPending: isUnpausing } = useWriteContract()
    const { writeContract: resolveMarket, isPending: isResolving } = useWriteContract()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Return null if not owner
    if (mounted && address?.toLowerCase() !== (ownerAddress as string)?.toLowerCase()) {
        return null
    }

    if (!mounted) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
            </div>
        )
    }

    const handleWithdrawFees = () => {
        const toastId = showLoading('Withdrawing fees...')
        try {
            withdrawFees({
                address: PREDICTION_MARKET_ADDRESS,
                abi: PREDICTION_MARKET_ABI,
                functionName: 'withdrawFees' as any,
                args: [] as any,
            })
            dismissToast(toastId)
            showSuccess('Fees withdrawn successfully!')
        } catch (err: any) {
            dismissToast(toastId)
            showError(err.message || 'Failed to withdraw fees')
        }
    }

    const handlePause = () => {
        const toastId = showLoading(isPaused ? 'Unpausing contract...' : 'Pausing contract...')
        try {
            if (isPaused) {
                unpauseContract({
                    address: PREDICTION_MARKET_ADDRESS,
                    abi: PREDICTION_MARKET_ABI,
                    functionName: 'unpause' as any,
                    args: [] as any,
                })
            } else {
                pauseContract({
                    address: PREDICTION_MARKET_ADDRESS,
                    abi: PREDICTION_MARKET_ABI,
                    functionName: 'pause' as any,
                    args: [] as any,
                })
            }
            dismissToast(toastId)
            showSuccess(isPaused ? 'Contract unpaused!' : 'Contract paused!')
        } catch (err: any) {
            dismissToast(toastId)
            showError(err.message || 'Failed to update pause state')
        }
    }

    const handleResolveMarket = (marketId: number, outcome: boolean) => {
        const toastId = showLoading('Resolving market...')
        try {
            resolveMarket({
                address: PREDICTION_MARKET_ADDRESS,
                abi: PREDICTION_MARKET_ABI,
                functionName: 'resolveMarket' as any,
                args: [BigInt(marketId), outcome],
            })
            dismissToast(toastId)
            showSuccess('Market resolved!')
        } catch (err: any) {
            dismissToast(toastId)
            showError(err.message || 'Failed to resolve market')
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-blue-100">Manage markets, fees, and contract settings</p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <p className="mb-2 text-sm font-medium text-gray-500">Total Markets</p>
                    <p className="text-3xl font-bold text-gray-900">{Number(marketCount || 0)}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <p className="mb-2 text-sm font-medium text-gray-500">Fees Collected</p>
                    <p className="text-3xl font-bold text-green-600">${Number(totalFees || 0) / 1e6}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <p className="mb-2 text-sm font-medium text-gray-500">Contract Status</p>
                    <p className={`text-2xl font-bold ${isPaused ? 'text-red-600' : 'text-green-600'}`}>
                        {isPaused ? 'Paused' : 'Active'}
                    </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <p className="mb-2 text-sm font-medium text-gray-500">Total Volume</p>
                    <p className="text-3xl font-bold text-blue-600">$0</p>
                </div>
            </div>

            {/* Market Creation */}
            <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Create New Market</h2>
                <MarketCreationForm />
            </div>

            {/* Fee Management */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Fee Management</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Available Fees</p>
                        <p className="text-2xl font-bold text-gray-900">${Number(totalFees || 0) / 1e6} USDC</p>
                    </div>
                    <button
                        onClick={handleWithdrawFees}
                        disabled={isWithdrawing || Number(totalFees || 0) === 0}
                        className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isWithdrawing ? 'Withdrawing...' : 'Withdraw Fees'}
                    </button>
                </div>
            </div>

            {/* Emergency Controls */}
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <h2 className="mb-4 text-xl font-semibold text-red-900">Emergency Controls</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-red-900">Contract Pause</p>
                        <p className="text-sm text-red-700">
                            {isPaused
                                ? 'Trading is currently paused. Click to resume.'
                                : 'Pause all trading activity in case of emergency.'}
                        </p>
                    </div>
                    <button
                        onClick={handlePause}
                        disabled={isPausing || isUnpausing}
                        className={`rounded-lg px-6 py-3 font-semibold text-white ${isPaused
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                            } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                        {isPausing || isUnpausing ? 'Processing...' : isPaused ? 'Unpause Contract' : 'Pause Contract'}
                    </button>
                </div>
            </div>

            {/* Market Management */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Market Management</h2>
                <p className="text-sm text-gray-500">
                    Market resolution interface will display active markets here. Use the main markets page to view and resolve individual markets.
                </p>
            </div>
        </div>
    )
}
