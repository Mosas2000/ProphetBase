'use client';

import { Card } from '@/components/ui/Card';

interface CorrelationData {
  market1: string;
  market2: string;
  correlation: number;
}

export function CorrelationMatrix() {
  const markets = ['BTC $100k', 'ETH $5k', 'SOL $200', 'Lakers Win', 'GDP Growth'];
  
  const correlations: CorrelationData[] = [
    { market1: 'BTC $100k', market2: 'ETH $5k', correlation: 0.85 },
    { market1: 'BTC $100k', market2: 'SOL $200', correlation: 0.72 },
    { market1: 'ETH $5k', market2: 'SOL $200', correlation: 0.68 },
    { market1: 'BTC $100k', market2: 'Lakers Win', correlation: 0.12 },
    { market1: 'BTC $100k', market2: 'GDP Growth', correlation: 0.45 },
  ];

  const getCorrelation = (m1: string, m2: string) => {
    if (m1 === m2) return 1;
    const found = correlations.find(
      c => (c.market1 === m1 && c.market2 === m2) || (c.market1 === m2 && c.market2 === m1)
    );
    return found?.correlation || 0;
  };

  const getCorrelationColor = (value: number) => {
    if (value >= 0.7) return 'bg-green-500';
    if (value >= 0.4) return 'bg-yellow-500';
    if (value >= 0) return 'bg-gray-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Correlation Matrix</h3>

          {/* Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  {markets.map(market => (
                    <th key={market} className="p-2 text-xs text-gray-400 font-medium">
                      {market}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {markets.map(market1 => (
                  <tr key={market1}>
                    <td className="p-2 text-xs text-gray-400 font-medium">{market1}</td>
                    {markets.map(market2 => {
                      const corr = getCorrelation(market1, market2);
                      return (
                        <td key={market2} className="p-1">
                          <div
                            className={`${getCorrelationColor(corr)} rounded p-2 text-center text-sm font-bold text-white`}
                            style={{ opacity: Math.abs(corr) }}
                          >
                            {corr.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-gray-400">Strong (0.7+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span className="text-gray-400">Moderate (0.4-0.7)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded" />
              <span className="text-gray-400">Weak (0-0.4)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Related Markets */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Highly Correlated Markets</h4>
          
          <div className="space-y-3">
            {correlations
              .filter(c => c.correlation >= 0.6)
              .sort((a, b) => b.correlation - a.correlation)
              .map((corr, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium mb-1">{corr.market1} ↔ {corr.market2}</p>
                    <p className="text-sm text-gray-400">Strong positive correlation</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">{(corr.correlation * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Card>

      {/* Diversification Score */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Portfolio Diversification</h4>
          
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-blue-500/30 mb-4">
            <p className="text-sm text-gray-400 mb-2">Diversification Score</p>
            <p className="text-4xl font-bold mb-2">72/100</p>
            <p className="text-sm text-gray-400">Good diversification</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
            <p className="text-sm text-blue-400">
              💡 Your portfolio has good diversification. Consider adding uncorrelated markets to reduce risk.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
