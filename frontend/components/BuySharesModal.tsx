'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { PREDICTION_MARKET_ABI, ERC20_ABI } from '@/lib/abi'

/**
 * Contract addresses on Base mainnet
 */
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const
const PREDICTION_MARKET_ADDRESS = '0x798e104BfAefC785bCDB63B58E0b620707773DAA' as const
const USDC_DECIMALS = 6

/**
 * Transaction states for the two-step flow
 */
type TransactionState = 'idle' | 'approving' | 'buying' | 'success' | 'error'

/**
 * Props interface for BuySharesModal
 */
export interface BuySharesModalProps {
    isOpen: boolean
    onClose: () => void
    marketId: number
    shareType: 'YES' | 'NO'
    question: string
}

/**
 * BuySharesModal - Modal component for purchasing YES or NO shares
 * Implements a two-step process: USDC approval → share purchase
 */
export default function BuySharesModal({
    isOpen,
    onClose,
    marketId,
    shareType,
    question,
}: BuySharesModalProps) {
    const [amount, setAmount] = useState('')
    const [txState, setTxState] = useState<TransactionState>('idle')
    const [errorMessage, setErrorMessage] = useState('')
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

    const { address } = useAccount()

    // Get USDC balance
    const { data: balanceData } = useBalance({
        address,
        token: USDC_ADDRESS,
    })

    // Check current USDC allowance
    const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: address ? [address, PREDICTION_MARKET_ADDRESS] : undefined,
    })

    // Approve USDC
    const {
        writeContract: approveWrite,
        data: approveHash,
        isPending: isApprovePending,
        error: approveError,
    } = useWriteContract()

    // Buy shares
    const {
        writeContract: buySharesWrite,
        data: buySharesHash,
        isPending: isBuySharesPending,
        error: buySharesError,
    } = useWriteContract()

    // Wait for approve transaction
    const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
        useWaitForTransactionReceipt({
            hash: approveHash,
        })

    // Wait for buy shares transaction
    const { isLoading: isBuySharesConfirming, isSuccess: isBuySharesSuccess } =
        useWaitForTransactionReceipt({
            hash: buySharesHash,
        })

    // Calculate values
    const amountInWei = useMemo(() => {
        try {
            return amount ? parseUnits(amount, USDC_DECIMALS) : BigInt(0)
        } catch {
            return BigInt(0)
        }
    }, [amount])

    const currentAllowance = (allowanceData as bigint) || BigInt(0)
    const needsApproval = amountInWei > currentAllowance
    const balance = balanceData?.value || BigInt(0)
    const hasInsufficientBalance = amountInWei > balance
    const isValidAmount = amountInWei > BigInt(0)

    // Theme colors based on share type
    const theme = shareType === 'YES'
        ? {
            gradient: 'from-green-500 to-green-600',
            bg: 'bg-green-50',
            text: 'text-green-700',
            border: 'border-green-200',
            hover: 'hover:from-green-600 hover:to-green-700',
        }
        : {
            gradient: 'from-red-500 to-red-600',
            bg: 'bg-red-50',
            text: 'text-red-700',
            border: 'border-red-200',
            hover: 'hover:from-red-600 hover:to-red-700',
        }

    // Handle approve transaction success
    useEffect(() => {
        if (isApproveSuccess) {
            refetchAllowance()
            setTxState('idle')
        }
    }, [isApproveSuccess, refetchAllowance])

    // Handle buy shares transaction success
    useEffect(() => {
        if (isBuySharesSuccess && buySharesHash) {
            setTxState('success')
            setTxHash(buySharesHash)
        }
    }, [isBuySharesSuccess, buySharesHash])

    // Handle errors
    useEffect(() => {
        if (approveError) {
            setTxState('error')
            setErrorMessage(approveError.message || 'Approval failed')
        }
        if (buySharesError) {
            setTxState('error')
            setErrorMessage(buySharesError.message || 'Purchase failed')
        }
    }, [approveError, buySharesError])

    // Update transaction state
    useEffect(() => {
        if (isApprovePending || isApproveConfirming) {
            setTxState('approving')
        } else if (isBuySharesPending || isBuySharesConfirming) {
            setTxState('buying')
        }
    }, [isApprovePending, isApproveConfirming, isBuySharesPending, isBuySharesConfirming])

    // Handle approve
    const handleApprove = () => {
        setErrorMessage('')
        approveWrite({
            address: USDC_ADDRESS,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [PREDICTION_MARKET_ADDRESS, amountInWei],
        })
    }

    // Handle buy shares
    const handleBuyShares = () => {
        setErrorMessage('')
        buySharesWrite({
            address: PREDICTION_MARKET_ADDRESS,
            abi: PREDICTION_MARKET_ABI,
            functionName: 'buyShares',
            args: [BigInt(marketId), shareType === 'YES', amountInWei],
        })
    }

    // Reset modal state on close
    const handleClose = () => {
        if (txState !== 'approving' && txState !== 'buying') {
            setAmount('')
            setTxState('idle')
            setErrorMessage('')
            setTxHash(undefined)
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={handleClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`rounded-t-2xl bg-gradient-to-r ${theme.gradient} p-6 text-white`}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">
                                Buy {shareType} Shares
                            </h2>
                            <p className="text-sm opacity-90 line-clamp-2">{question}</p>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={txState === 'approving' || txState === 'buying'}
                            className="ml-4 rounded-lg p-1 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Success State */}
                    {txState === 'success' && txHash && (
                        <div className="rounded-xl bg-green-50 border border-green-200 p-4 space-y-3">
                            <div className="flex items-center gap-2 text-green-700">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-semibold">Purchase Successful!</span>
                            </div>
                            <p className="text-sm text-green-600">
                                You successfully purchased {amount} {shareType} shares.
                            </p>
                            <a
                                href={`https://basescan.org/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800 underline"
                            >
                                View on Basescan
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                            <button
                                onClick={handleClose}
                                className="w-full mt-2 rounded-xl bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}

                    {/* Error State */}
                    {txState === 'error' && errorMessage && (
                        <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                            <div className="flex items-start gap-2 text-red-700">
                                <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="flex-1">
                                    <p className="font-semibold mb-1">Transaction Failed</p>
                                    <p className="text-sm">{errorMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    {txState !== 'success' && (
                        <>
                            {/* Balance Display */}
                            <div className={`rounded-xl ${theme.bg} border ${theme.border} p-4`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Your USDC Balance</span>
                                    <span className={`font-semibold ${theme.text}`}>
                                        {balanceData ? formatUnits(balance, USDC_DECIMALS) : '0.00'} USDC
                                    </span>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Amount to Spend
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        disabled={txState === 'approving' || txState === 'buying'}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-16 text-lg font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        step="0.000001"
                                        min="0"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                        USDC
                                    </span>
                                </div>
                                {hasInsufficientBalance && isValidAmount && (
                                    <p className="text-sm text-red-600">Insufficient balance</p>
                                )}
                            </div>

                            {/* Estimated Shares */}
                            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Estimated Shares</span>
                                    <span className="font-semibold text-gray-900">
                                        {amount || '0.00'} {shareType}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">1 USDC = 1 Share</p>
                            </div>

                            {/* Progress Indicators */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${needsApproval
                                            ? txState === 'approving'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                            : 'bg-green-500 text-white'
                                        }`}>
                                        {!needsApproval ? (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : txState === 'approving' ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        ) : (
                                            '1'
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {needsApproval ? 'Approve USDC' : 'USDC Approved'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${txState === 'buying'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {txState === 'buying' ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        ) : (
                                            '2'
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Buy Shares</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-2">
                                {needsApproval ? (
                                    <button
                                        onClick={handleApprove}
                                        disabled={!isValidAmount || hasInsufficientBalance || txState === 'approving' || !address}
                                        className={`w-full rounded-xl bg-gradient-to-r ${theme.gradient} ${theme.hover} px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md`}
                                    >
                                        {txState === 'approving' ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Approving...
                                            </span>
                                        ) : (
                                            'Approve USDC'
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleBuyShares}
                                        disabled={!isValidAmount || hasInsufficientBalance || txState === 'buying' || !address}
                                        className={`w-full rounded-xl bg-gradient-to-r ${theme.gradient} ${theme.hover} px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md`}
                                    >
                                        {txState === 'buying' ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Buying Shares...
                                            </span>
                                        ) : (
                                            `Buy ${shareType} Shares`
                                        )}
                                    </button>
                                )}

                                <button
                                    onClick={handleClose}
                                    disabled={txState === 'approving' || txState === 'buying'}
                                    className="w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
