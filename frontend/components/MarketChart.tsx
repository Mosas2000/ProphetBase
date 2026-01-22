'use client'

import { useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts'

interface PricePoint {
    time: string
    yes: number
    no: number
}

// Mock Data Generator
const generateData = (range: '24H' | '7D' | 'ALL'): PricePoint[] => {
    const points = range === '24H' ? 24 : range === '7D' ? 7 : 30
    const data: PricePoint[] = []
    let currentYes = 50

    for (let i = 0; i < points; i++) {
        // Random walk
        const change = (Math.random() - 0.5) * 10
        currentYes = Math.max(1, Math.min(99, currentYes + change))

        data.push({
            time: range === '24H'
                ? `${i}:00`
                : `Day ${i + 1}`,
            yes: Number(currentYes.toFixed(1)),
            no: Number((100 - currentYes).toFixed(1))
        })
    }
    return data
}

export default function MarketChart() {
    const [range, setRange] = useState<'24H' | '7D' | 'ALL'>('24H')
    const [data, setData] = useState<PricePoint[]>(generateData('24H'))

    const handleRangeChange = (newRange: '24H' | '7D' | 'ALL') => {
        setRange(newRange)
        setData(generateData(newRange))
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-sm">
                    <p className="text-gray-500 mb-1">{label}</p>
                    <p className="font-bold text-[#00D395]">YES: {payload[0].value}¢</p>
                    <p className="font-bold text-[#FF4444]">NO: {payload[1].value}¢</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
            {/* Header / Controls */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Price History</h3>
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    {['24H', '7D', 'ALL'].map((r) => (
                        <button
                            key={r}
                            onClick={() => handleRangeChange(r as any)}
                            className={`
                                px-3 py-1 text-xs font-semibold rounded-md transition-all
                                ${range === r
                                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }
                            `}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00D395" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#00D395" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorNo" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF4444" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#FF4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9CA3AF' }}
                            minTickGap={30}
                        />
                        <YAxis
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9CA3AF' }}
                            unit="¢"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="yes"
                            stroke="#00D395"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorYes)"
                        />
                        <Area
                            type="monotone"
                            dataKey="no"
                            stroke="#FF4444"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorNo)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
