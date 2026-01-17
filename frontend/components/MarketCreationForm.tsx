'use client'

import { useState } from 'use'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { PREDICTION_MARKET_ABI, PREDICTION_MARKET_ADDRESS } from '@/lib/contracts'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'

interface MarketCreationFormProps {
    onSuccess?: (marketId: number) => void
    className?: string
}

export default function MarketCreationForm({ onSuccess, className = '' }: MarketCreationFormProps) {
    const { address } = useAccount()
    const [showPreview, setShowPreview] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [createdMarketId, setCreatedMarketId] = useState<number | null>(null)

    const [formData, setFormData] = useState({
        question: '',
        duration: '7',
        durationUnit: 'days',
        category: '0',
        description: '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const { writeContract, data: hash, isPending, error } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    const categories = [
        { id: 0, name: 'DeFi', icon: '🏦' },
        { id: 1, name: 'Crypto', icon: '₿' },
        { id: 2, name: 'Politics', icon: '🗳️' },
        { id: 3, name: 'Sports', icon: '⚽' },
        { id: 4, name: 'Other', icon: '📌' },
    ]

    const durationPresets = [
        { value: '1', unit: 'days', label: '1 Day' },
        { value: '3', unit: 'days', label: '3 Days' },
        { value: '7', unit: 'days', label: '1 Week' },
        { value: '14', unit: 'days', label: '2 Weeks' },
        { value: '30', unit: 'days', label: '1 Month' },
        { value: 'custom', unit: 'days', label: 'Custom' },
    ]

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.question.trim()) {
            newErrors.question = 'Question is required'
        } else if (formData.question.length > 200) {
            newErrors.question = 'Question must be 200 characters or less'
        }

        const durationValue = parseInt(formData.duration)
        if (!durationValue || durationValue <= 0) {
            newErrors.duration = 'Duration must be greater than 0'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const calculateDurationInSeconds = () => {
        const value = parseInt(formData.duration)
        const multipliers = {
            hours: 60 * 60,
            days: 24 * 60 * 60,
            weeks: 7 * 24 * 60 * 60,
        }
        return value * multipliers[formData.durationUnit as keyof typeof multipliers]
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        const toastId = showLoading('Creating market...')

        try {
            const durationInSeconds = calculateDurationInSeconds()

            writeContract({
                address: PREDICTION_MARKET_ADDRESS,
                abi: PREDICTION_MARKET_ABI,
                functionName: 'createMarket',
                args: [formData.question, BigInt(durationInSeconds), Number(formData.category)],
            })
        } catch (err: any) {
            dismissToast(toastId)
            showError(err.message || 'Failed to create market')
        }
    }

    // Handle transaction success
    if (isSuccess && !showSuccessModal) {
        setShowSuccessModal(true)
        setCreatedMarketId(0) // In real implementation, get from event logs
        showSuccess('Market created successfully!')
        if (onSuccess) onSuccess(0)
    }

    const resetForm = () => {
        setFormData({
            question: '',
            duration: '7',
            durationUnit: 'days',
            category: '0',
            description: '',
        })
        setErrors({})
        setShowPreview(false)
        setShowSuccessModal(false)
    }

    return (
        <>
            <div className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Create New Market</h3>
                    <p className="text-sm text-gray-500">Define a prediction market for users to trade on</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Question */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Market Question <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            placeholder="e.g., Will ETH hit $5k by end of 2026?"
                            className={`w-full rounded-lg border ${errors.question ? 'border-red-300' : 'border-gray-300'
                                } px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                            maxLength={200}
                        />
                        <div className="mt-1 flex items-center justify-between">
                            {errors.question ? (
                                <p className="text-sm text-red-600">{errors.question}</p>
                            ) : (
                                <p className="text-xs text-gray-500">Clear, specific yes/no question</p>
                            )}
                            <p className="text-xs text-gray-400">{formData.question.length}/200</p>
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Market Duration <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {durationPresets.map((preset) => (
                                <button
                                    key={preset.label}
                                    type="button"
                                    onClick={() => {
                                        if (preset.value !== 'custom') {
                                            setFormData({ ...formData, duration: preset.value, durationUnit: preset.unit })
                                        }
                                    }}
                                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${formData.duration === preset.value && preset.value !== 'custom'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="Duration"
                                min="1"
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            <select
                                value={formData.durationUnit}
                                onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                            </select>
                        </div>
                        {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: String(cat.id) })}
                                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-colors ${formData.category === String(cat.id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="text-2xl">{cat.icon}</span>
                                    <span className="text-xs font-medium">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Description <span className="text-gray-400">(Optional)</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Additional context or resolution criteria..."
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
                        >
                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || isConfirming || !address}
                            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending || isConfirming ? 'Creating...' : 'Create Market'}
                        </button>
                    </div>
                </form>

                {/* Preview */}
                {showPreview && formData.question && (
                    <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
                        <p className="mb-4 text-sm font-medium text-gray-500">Preview:</p>
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900">{formData.question}</h4>
                                    {formData.description && (
                                        <p className="mt-2 text-sm text-gray-600">{formData.description}</p>
                                    )}
                                </div>
                                <span className="ml-4 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                    Open
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{categories.find((c) => c.id === Number(formData.category))?.icon}</span>
                                <span>{categories.find((c) => c.id === Number(formData.category))?.name}</span>
                                <span>•</span>
                                <span>Ends in {formData.duration} {formData.durationUnit}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-2xl font-bold text-gray-900">Market Created!</h3>
                        <p className="mb-6 text-gray-600">Your prediction market is now live and ready for trading.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={resetForm}
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Create Another
                            </button>
                            <a
                                href={`/market/${createdMarketId}`}
                                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                            >
                                View Market
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
