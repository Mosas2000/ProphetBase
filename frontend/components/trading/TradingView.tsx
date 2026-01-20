'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { useState } from 'react';
import OrderBook from './OrderBook';
import PriceImpact from './PriceImpact';
import QuickTrade from './QuickTrade';

interface TradingViewProps {
  marketId: number;
  marketName: string;
  yesPrice: number;
  noPrice: number;
}

export default function TradingView({ marketId, marketName, yesPrice, noPrice }: TradingViewProps) {
  const [activeTab, setActiveTab] = useState<'trade' | 'orderbook' | 'analysis'>('trade');
  const [tradeAmount, setTradeAmount] = useState(100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Trading Panel */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{marketName}</h2>
            <div className="flex gap-2">
              <Badge variant="green">YES {yesPrice}¢</Badge>
              <Badge variant="red">NO {noPrice}¢</Badge>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 mb-4">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="font-medium">Price Chart</p>
              <p className="text-sm">Historical probability over time</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('trade')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'trade'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Trade
            </button>
            <button
              onClick={() => setActiveTab('orderbook')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'orderbook'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Order Book
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'analysis'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Analysis
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'trade' && (
              <QuickTrade
                marketId={marketId}
                marketName={marketName}
                yesPrice={yesPrice}
                noPrice={noPrice}
              />
            )}
            {activeTab === 'orderbook' && (
              <OrderBook marketId={marketId} />
            )}
            {activeTab === 'analysis' && (
              <PriceImpact
                tradeAmount={tradeAmount}
                currentPrice={yesPrice}
                totalLiquidity={10000}
                outcome="YES"
              />
            )}
          </div>
        </Card>

        {/* Market Stats */}
        <Card>
          <h3 className="font-semibold mb-4">Market Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-500">24h Volume</div>
              <div className="text-lg font-bold">$12,345</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Total Traders</div>
              <div className="text-lg font-bold">1,234</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Liquidity</div>
              <div className="text-lg font-bold">$50,000</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Time Left</div>
              <div className="text-lg font-bold">5d 12h</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <h3 className="font-semibold mb-4">Market Info</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-gray-500">Category</div>
              <Badge variant="blue">Crypto</Badge>
            </div>
            <div>
              <div className="text-gray-500">Created</div>
              <div className="font-medium">2 days ago</div>
            </div>
            <div>
              <div className="text-gray-500">Resolution Date</div>
              <div className="font-medium">Dec 31, 2024</div>
            </div>
            <div>
              <div className="text-gray-500">Creator</div>
              <div className="font-medium font-mono text-xs">0x1234...5678</div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Your Position</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">YES Shares</span>
              <span className="font-medium">100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">NO Shares</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-500">Total Value</span>
              <span className="font-bold">$70.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">P&L</span>
              <span className="font-bold text-green-600">+$5.00</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
