'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PriceChartProps {
    marketId: number
    className?: string
}

type TimeRange = '1H' | '24H' | '7D' | 'ALL'

// Mock data generator (will be replaced with real data later)
const generateMockData = (range: TimeRange) => {
    const now = Date.now()
    let dataPoints: number
    let interval: number

    switch (range) {
        case '1H':
            dataPoints = 12
            interval = 5 * 60 * 1000 // 5 minutes
            break
        case '24H':
            dataPoints = 24
            interval = 60 * 60 * 1000 // 1 hour
            break
        case '7D':
            dataPoints = 7
            interval = 24 * 60 * 60 * 1000 // 1 day
            break
        case 'ALL':
            dataPoints = 30
            interval = 24 * 60 * 60 * 1000 // 1 day
            break
    }

    const data = []
    let yesPrice = 0.5
    let noPrice = 0.5

    for (let i = dataPoints - 1; i >= 0; i--) {
        const timestamp = now - i * interval

        // Random walk
        const change = (Math.random() - 0.5) * 0.1
        yesPrice = Math.max(0.1, Math.min(0.9, yesPrice + change))
        noPrice = 1 - yesPrice

        data.push({
            timestamp,
            time: new Date(timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                ...(range === '7D' || range === 'ALL' ? { month: 'short', day: 'numeric' } : {}),
            }),
            yesPrice: Number(yesPrice.toFixed(3)),
            noPrice: Number(noPrice.toFixed(3)),
        })
    }

    return data
}

export default function PriceChart({ marketId, className = '' }: PriceChartProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('24H')
    const data = generateMockData(timeRange)

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                    <p className="mb-2 text-sm font-medium text-gray-900">{payload[0].payload.time}</p>
                    <div className="space-y-1">
                        <p className="flex items-center gap-2 text-sm">
                            <span className="h-3 w-3 rounded-full bg-green-500" />
                            <span className="text-gray-600">YES:</span>
                            <span className="font-semibold text-green-600">${payload[0].value.toFixed(3)}</span>
                        </p>
                        <p className="flex items-center gap-2 text-sm">
                            <span className="h-3 w-3 rounded-full bg-red-500" />
                            <span className="text-gray-600">NO:</span>
                            <span className="font-semibold text-red-600">${payload[1].value.toFixed(3)}</span>
                        </p>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <div className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Price History</h3>
                    <p className="text-sm text-gray-500">YES/NO share prices over time</p>
                </div>

                {/* Time Range Selector */}
                <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
                    {(['1H', '24H', '7D', 'ALL'] as TimeRange[]).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${timeRange === range
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="time"
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                            tick={{ fill: '#6b7280' }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                            tick={{ fill: '#6b7280' }}
                            domain={[0, 1]}
                            ticks={[0, 0.25, 0.5, 0.75, 1]}
                            tickFormatter={(value) => `$${value.toFixed(2)}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="circle"
                            formatter={(value) => (
                                <span className="text-sm font-medium text-gray-700">{value}</span>
                            )}
                        />
                        <Line
                            type="monotone"
                            dataKey="yesPrice"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={false}
                            name="YES Price"
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="noPrice"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={false}
                            name="NO Price"
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Info */}
            <div className="mt-4 rounded-lg bg-blue-50 p-3">
                <p className="text-xs text-blue-700">
                    📊 <strong>Note:</strong> This chart shows mock data for demonstration. Real-time price tracking will be implemented with on-chain event indexing.
                </p>
            </div>
        </div>
    )
}
