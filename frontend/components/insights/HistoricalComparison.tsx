'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface HistoricalMarket {
  question: string;
  outcome: 'YES' | 'NO';
  finalPrice: number;
  volume: number;
  similarity: number;
}

export function HistoricalComparison() {
  const similarMarkets: HistoricalMarket[] = [
    {
      question: 'Will Bitcoin reach $50k by end of 2023?',
      outcome: 'YES',
      finalPrice: 85,
      volume: 245000,
      similarity: 92,
    },
    {
      question: 'Will Bitcoin hit $75k in Q1 2024?',
      outcome: 'NO',
      finalPrice: 35,
      volume: 180000,
      similarity: 85,
    },
    {
      question: 'Will BTC surpass $60k by March 2024?',
      outcome: 'YES',
      finalPrice: 78,
      volume: 156000,
      similarity: 78,
    },
  ];

  const patterns = {
    bullRun: 65,
    correction: 20,
    sideways: 15,
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Historical Comparison</h3>

          {/* Similar Markets */}
          <div className="space-y-3 mb-6">
            {similarMarkets.map((market, idx) => (
              <Card key={idx}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={market.outcome === 'YES' ? 'success' : 'error'}>
                          {market.outcome}
                        </Badge>
                        <Badge variant="default">{market.similarity}% Similar</Badge>
                      </div>
                      <p className="font-medium mb-1">{market.question}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-400">Final Price</p>
                      <p className="font-medium">{market.finalPrice}¢</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-400">Volume</p>
                      <p className="font-medium">${(market.volume / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Pattern Recognition */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Pattern Recognition</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">📈 Bull Run Pattern</span>
                <span className="font-medium">{patterns.bullRun}% match</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${patterns.bullRun}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">📉 Correction Pattern</span>
                <span className="font-medium">{patterns.correction}% match</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{ width: `${patterns.correction}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">➡️ Sideways Pattern</span>
                <span className="font-medium">{patterns.sideways}% match</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gray-500 h-3 rounded-full"
                  style={{ width: `${patterns.sideways}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 bg-green-500/10 border border-green-500 rounded-lg p-4">
            <p className="text-sm text-green-400">
              💡 Strong bull run pattern detected. Similar markets had 78% success rate.
            </p>
          </div>
        </div>
      </Card>

      {/* Success Rate Analysis */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Success Rate Analysis</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
              <p className="text-sm text-gray-400 mb-1">YES Outcome</p>
              <p className="text-3xl font-bold text-green-400">78%</p>
              <p className="text-xs text-gray-400 mt-1">in similar markets</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Sample Size</p>
              <p className="text-3xl font-bold">23</p>
              <p className="text-xs text-gray-400 mt-1">comparable markets</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-gray-800 rounded">
              <span className="text-gray-400">Avg Final Price (YES)</span>
              <span className="font-medium">82¢</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-800 rounded">
              <span className="text-gray-400">Avg Final Price (NO)</span>
              <span className="font-medium">28¢</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-800 rounded">
              <span className="text-gray-400">Avg Time to Resolution</span>
              <span className="font-medium">45 days</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
