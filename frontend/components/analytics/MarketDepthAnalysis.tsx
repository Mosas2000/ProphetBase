'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function MarketDepthAnalysis() {
  const orderBook = {
    bids: [
      { price: 0.65, size: 15000, total: 15000 },
      { price: 0.64, size: 12000, total: 27000 },
      { price: 0.63, size: 8000, total: 35000 },
    ],
    asks: [
      { price: 0.66, size: 10000, total: 10000 },
      { price: 0.67, size: 14000, total: 24000 },
      { price: 0.68, size: 9000, total: 33000 },
    ],
  };

  const liquidityZones = [
    { level: 0.70, type: 'Resistance', strength: 'Strong', volume: 45000 },
    { level: 0.60, type: 'Support', strength: 'Moderate', volume: 32000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Market Depth Analysis</h3>
          <p className="text-gray-400">Deep order book and liquidity analysis</p>
        </div>
      </Card>

      {/* Order Book */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Order Book</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Bids */}
            <div>
              <p className="text-sm text-gray-400 mb-2">Bids</p>
              <div className="space-y-1">
                {orderBook.bids.map((bid, idx) => (
                  <div key={idx} className="relative p-2 bg-gray-800 rounded">
                    <div
                      className="absolute inset-0 bg-green-500/20 rounded"
                      style={{ width: `${(bid.total / 35000) * 100}%` }}
                    />
                    <div className="relative flex justify-between text-sm">
                      <span className="text-green-400">{bid.price.toFixed(2)}</span>
                      <span>{bid.size.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Asks */}
            <div>
              <p className="text-sm text-gray-400 mb-2">Asks</p>
              <div className="space-y-1">
                {orderBook.asks.map((ask, idx) => (
                  <div key={idx} className="relative p-2 bg-gray-800 rounded">
                    <div
                      className="absolute inset-0 bg-red-500/20 rounded"
                      style={{ width: `${(ask.total / 33000) * 100}%` }}
                    />
                    <div className="relative flex justify-between text-sm">
                      <span className="text-red-400">{ask.price.toFixed(2)}</span>
                      <span>{ask.size.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Liquidity Zones */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Key Liquidity Zones</h4>
          
          <div className="space-y-3">
            {liquidityZones.map((zone, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{zone.type} @ {zone.level.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">{zone.volume.toLocaleString()} volume</p>
                  </div>
                  <Badge variant={zone.type === 'Support' ? 'success' : 'error'}>
                    {zone.strength}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Imbalance Detection */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Order Book Imbalance</h4>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-green-400">Bid Pressure</span>
              <span className="text-red-400">Ask Pressure</span>
            </div>
            <div className="flex h-8 rounded-lg overflow-hidden">
              <div className="bg-green-500 flex items-center justify-center text-sm font-bold" style={{ width: '58%' }}>
                58%
              </div>
              <div className="bg-red-500 flex items-center justify-center text-sm font-bold" style={{ width: '42%' }}>
                42%
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
            <p className="text-sm">
              <span className="font-semibold text-green-400">Bullish Imbalance:</span> More buying pressure detected
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
