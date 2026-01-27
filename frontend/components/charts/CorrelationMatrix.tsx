'use client';

import { Filter, Grid3x3, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface CorrelationData {
  market1: string;
  market2: string;
  correlation: number;
  pValue: number;
  significance: 'high' | 'medium' | 'low';
}

export default function CorrelationMatrix() {
  const markets = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'MATIC', 'AVAX', 'LINK'];
  const [timeRange, setTimeRange] = useState('30d');
  const [minCorrelation, setMinCorrelation] = useState(0);
  const [hoveredCell, setHoveredCell] = useState<CorrelationData | null>(null);

  // Generate correlation matrix
  const [correlationMatrix] = useState<number[][]>(() => {
    return markets.map((m1, i) =>
      markets.map((m2, j) => {
        if (i === j) return 1;
        if (i > j) {
          // Use symmetric values
          return correlationMatrix?.[j]?.[i] ?? Math.random() * 2 - 1;
        }
        return Math.random() * 2 - 1;
      })
    );
  });

  // Calculate p-values and significance
  const getSignificance = (correlation: number): 'high' | 'medium' | 'low' => {
    const absCorr = Math.abs(correlation);
    if (absCorr > 0.7) return 'high';
    if (absCorr > 0.4) return 'medium';
    return 'low';
  };

  const getPValue = (correlation: number): number => {
    // Simplified p-value calculation
    return Math.max(0.001, (1 - Math.abs(correlation)) * 0.5);
  };

  const getColor = (correlation: number) => {
    if (correlation > 0) {
      const intensity = correlation;
      return `rgba(16, 185, 129, ${0.2 + intensity * 0.8})`;
    } else {
      const intensity = Math.abs(correlation);
      return `rgba(239, 68, 68, ${0.2 + intensity * 0.8})`;
    }
  };

  const cellSize = 70;
  const padding = 100;

  // Get strongest correlations
  const correlations: CorrelationData[] = [];
  markets.forEach((m1, i) => {
    markets.forEach((m2, j) => {
      if (i !== j) {
        const corr = correlationMatrix[i][j];
        if (Math.abs(corr) >= minCorrelation) {
          correlations.push({
            market1: m1,
            market2: m2,
            correlation: corr,
            pValue: getPValue(corr),
            significance: getSignificance(corr),
          });
        }
      }
    });
  });

  const strongPositive = correlations
    .filter((c) => c.correlation > 0.7)
    .sort((a, b) => b.correlation - a.correlation)
    .slice(0, 5);

  const strongNegative = correlations
    .filter((c) => c.correlation < -0.7)
    .sort((a, b) => a.correlation - b.correlation)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl">
              <Grid3x3 className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Correlation Matrix
              </h1>
              <p className="text-slate-400">
                Market correlations with statistical significance analysis
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-400">
                    Min Correlation:
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={minCorrelation}
                    onChange={(e) => setMinCorrelation(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-sm font-medium">
                    {minCorrelation.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {['7d', '30d', '90d', '1y'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1.5 rounded transition-colors text-sm ${
                        timeRange === range
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }}
                  />
                  <span>Positive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}
                  />
                  <span>Negative</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Correlation Matrix */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Market Correlation Matrix</h2>
            <p className="text-sm text-slate-400">
              Pearson correlation coefficients (range: -1 to +1)
            </p>
          </div>

          <div className="relative overflow-x-auto">
            <svg
              width={padding + markets.length * cellSize + 50}
              height={padding + markets.length * cellSize + 50}
              className="min-w-[700px]"
            >
              {/* Column labels */}
              {markets.map((market, idx) => (
                <text
                  key={`col-${idx}`}
                  x={padding + idx * cellSize + cellSize / 2}
                  y={padding - 20}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="14"
                  fontWeight="600"
                >
                  {market}
                </text>
              ))}

              {/* Row labels */}
              {markets.map((market, idx) => (
                <text
                  key={`row-${idx}`}
                  x={padding - 20}
                  y={padding + idx * cellSize + cellSize / 2 + 5}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="14"
                  fontWeight="600"
                >
                  {market}
                </text>
              ))}

              {/* Matrix cells */}
              {markets.map((m1, i) =>
                markets.map((m2, j) => {
                  const correlation = correlationMatrix[i][j];
                  const x = padding + j * cellSize;
                  const y = padding + i * cellSize;
                  const cellData: CorrelationData = {
                    market1: m1,
                    market2: m2,
                    correlation,
                    pValue: getPValue(correlation),
                    significance: getSignificance(correlation),
                  };

                  if (Math.abs(correlation) < minCorrelation && i !== j) {
                    return null;
                  }

                  return (
                    <g
                      key={`cell-${i}-${j}`}
                      onMouseEnter={() => setHoveredCell(cellData)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={x}
                        y={y}
                        width={cellSize - 2}
                        height={cellSize - 2}
                        fill={getColor(correlation)}
                        stroke={
                          hoveredCell === cellData ? '#a855f7' : '#1e293b'
                        }
                        strokeWidth={hoveredCell === cellData ? 3 : 1}
                        rx="4"
                      />
                      <text
                        x={x + cellSize / 2}
                        y={y + cellSize / 2 + 5}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="13"
                        fontWeight="600"
                      >
                        {correlation.toFixed(2)}
                      </text>
                      {cellData.significance === 'high' && i !== j && (
                        <text
                          x={x + cellSize - 10}
                          y={y + 15}
                          textAnchor="middle"
                          fill="#fbbf24"
                          fontSize="16"
                          fontWeight="bold"
                        >
                          *
                        </text>
                      )}
                    </g>
                  );
                })
              )}
            </svg>
          </div>

          {/* Hovered cell info */}
          {hoveredCell && (
            <div className="mt-4 bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Markets</div>
                  <div className="font-bold">
                    {hoveredCell.market1} vs {hoveredCell.market2}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Correlation</div>
                  <div
                    className={`font-bold text-lg ${
                      hoveredCell.correlation > 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {hoveredCell.correlation > 0 ? '+' : ''}
                    {hoveredCell.correlation.toFixed(3)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">P-Value</div>
                  <div className="font-bold">
                    {hoveredCell.pValue.toFixed(4)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">
                    Significance
                  </div>
                  <div
                    className={`font-bold capitalize ${
                      hoveredCell.significance === 'high'
                        ? 'text-amber-400'
                        : hoveredCell.significance === 'medium'
                        ? 'text-blue-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {hoveredCell.significance}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="font-bold">Strongest Positive Correlations</h3>
            </div>
            <div className="space-y-3">
              {strongPositive.map((corr, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{corr.market1}</span>
                    <span className="text-slate-400">↔</span>
                    <span className="font-medium">{corr.market2}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-green-400">
                        +{corr.correlation.toFixed(3)}
                      </div>
                      <div className="text-xs text-slate-400">
                        p = {corr.pValue.toFixed(4)}
                      </div>
                    </div>
                    {corr.significance === 'high' && (
                      <span className="text-amber-400 text-lg">*</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-red-400 rotate-180" />
              <h3 className="font-bold">Strongest Negative Correlations</h3>
            </div>
            <div className="space-y-3">
              {strongNegative.length > 0 ? (
                strongNegative.map((corr, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{corr.market1}</span>
                      <span className="text-slate-400">↔</span>
                      <span className="font-medium">{corr.market2}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-red-400">
                          {corr.correlation.toFixed(3)}
                        </div>
                        <div className="text-xs text-slate-400">
                          p = {corr.pValue.toFixed(4)}
                        </div>
                      </div>
                      {corr.significance === 'high' && (
                        <span className="text-amber-400 text-lg">*</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-8">
                  No strong negative correlations found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
          <div className="flex items-start gap-3">
            <span className="text-amber-400 text-xl">*</span>
            <div className="text-sm text-slate-300">
              <strong>Statistical Significance:</strong> Correlations marked
              with * have high statistical significance (|r| &gt; 0.7). P-values
              indicate the probability that the correlation is due to chance.
              Lower p-values (&lt; 0.05) suggest stronger evidence of
              correlation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
