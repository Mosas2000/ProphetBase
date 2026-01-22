'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface PriceAnalysis {
  currentPrice: number;
  fairValue: number;
  mispricing: number;
  confidence: number;
}

export function PriceDiscovery() {
  const analysis: PriceAnalysis = {
    currentPrice: 65,
    fairValue: 58,
    mispricing: 12,
    confidence: 78,
  };

  const isMispriced = Math.abs(analysis.mispricing) > 5;

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Price Discovery</h3>

          {/* Current vs Fair Value */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Current Price</p>
              <p className="text-3xl font-bold">{analysis.currentPrice}¢</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-500/30">
              <p className="text-sm text-gray-400 mb-1">Fair Value</p>
              <p className="text-3xl font-bold">{analysis.fairValue}¢</p>
            </div>
          </div>

          {/* Mispricing Alert */}
          {isMispriced && (
            <div className={`${analysis.mispricing > 0 ? 'bg-red-500/10 border-red-500' : 'bg-green-500/10 border-green-500'} border rounded-lg p-4 mb-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold mb-1">
                    {analysis.mispricing > 0 ? '⚠️ Overpriced' : '✓ Underpriced'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {Math.abs(analysis.mispricing)}% {analysis.mispricing > 0 ? 'above' : 'below'} fair value
                  </p>
                </div>
                <Badge variant={analysis.mispricing > 0 ? 'error' : 'success'}>
                  {analysis.mispricing > 0 ? 'Sell Signal' : 'Buy Signal'}
                </Badge>
              </div>
            </div>
          )}

          {/* Confidence Score */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Confidence in Fair Value</span>
              <span className="font-bold">{analysis.confidence}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: `${analysis.confidence}%` }}
              />
            </div>
          </div>

          {/* Price Components */}
          <div className="space-y-3">
            <h4 className="font-semibold">Fair Value Components</h4>
            {[
              { factor: 'Historical Data', weight: 35, value: 20 },
              { factor: 'Market Sentiment', weight: 25, value: 16 },
              { factor: 'Volume Analysis', weight: 20, value: 12 },
              { factor: 'Whale Activity', weight: 20, value: 10 },
            ].map((component, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">{component.factor}</span>
                  <span className="font-medium">{component.weight}% weight → {component.value}¢</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full"
                    style={{ width: `${component.weight}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Arbitrage Opportunities */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Arbitrage Opportunities</h4>
          
          <div className="space-y-3">
            {[
              { market: 'BTC $100k', spread: 8, profit: 240, risk: 'Low' },
              { market: 'ETH $5k', spread: 5, profit: 150, risk: 'Medium' },
            ].map((opp, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500 rounded-lg">
                <div>
                  <p className="font-medium mb-1">{opp.market}</p>
                  <p className="text-sm text-gray-400">Spread: {opp.spread}% • Risk: {opp.risk}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-400">+${opp.profit}</p>
                  <p className="text-xs text-gray-400">Est. profit</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Mispricing History */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Recent Mispricing Events</h4>
          
          <div className="space-y-3">
            {[
              { time: '2h ago', price: 68, fair: 58, resolved: true },
              { time: '1d ago', price: 45, fair: 52, resolved: true },
              { time: '3d ago', price: 72, fair: 65, resolved: false },
            ].map((event, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">{event.price}¢ vs {event.fair}¢ fair</p>
                  <p className="text-sm text-gray-400">{event.time}</p>
                </div>
                <Badge variant={event.resolved ? 'success' : 'warning'}>
                  {event.resolved ? 'Corrected' : 'Ongoing'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
