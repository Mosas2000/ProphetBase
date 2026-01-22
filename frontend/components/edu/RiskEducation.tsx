'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function RiskEducation() {
  const riskLevels = [
    { level: 'Low', percentage: '1-5%', description: 'Conservative approach, minimal risk' },
    { level: 'Medium', percentage: '5-15%', description: 'Balanced risk-reward ratio' },
    { level: 'High', percentage: '15-30%', description: 'Aggressive trading, higher risk' },
  ];

  const commonMistakes = [
    {
      mistake: 'Overleveraging',
      description: 'Betting too much of your portfolio on a single market',
      solution: 'Never risk more than 5-10% on any single trade',
    },
    {
      mistake: 'FOMO Trading',
      description: 'Entering positions based on fear of missing out',
      solution: 'Stick to your strategy and don\'t chase pumps',
    },
    {
      mistake: 'No Stop Loss',
      description: 'Holding losing positions hoping they\'ll recover',
      solution: 'Set clear exit points before entering trades',
    },
    {
      mistake: 'Ignoring Diversification',
      description: 'Concentrating all funds in one market or category',
      solution: 'Spread risk across multiple uncorrelated markets',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Risk Management Guide</h3>
          <p className="text-gray-400">Learn to protect your capital and trade responsibly</p>
        </div>
      </Card>

      {/* Position Sizing */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Position Sizing</h4>
          
          <div className="space-y-3 mb-6">
            {riskLevels.map((level, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{level.level} Risk</span>
                    <Badge variant="default">{level.percentage}</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{level.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
            <p className="text-sm">
              <span className="font-semibold text-blue-400">Recommended:</span> Start with 2-5% per trade until you gain experience
            </p>
          </div>
        </div>
      </Card>

      {/* Diversification */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Diversification Strategy</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Crypto Markets</p>
              <p className="text-2xl font-bold">30%</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Sports</p>
              <p className="text-2xl font-bold">25%</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Politics</p>
              <p className="text-2xl font-bold">25%</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Other</p>
              <p className="text-2xl font-bold">20%</p>
            </div>
          </div>

          <p className="text-sm text-gray-400">
            Example portfolio allocation across different market categories
          </p>
        </div>
      </Card>

      {/* Common Mistakes */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Common Mistakes to Avoid</h4>
          
          <div className="space-y-4">
            {commonMistakes.map((item, idx) => (
              <div key={idx} className="border-l-4 border-red-500 pl-4 py-2">
                <h5 className="font-semibold text-red-400 mb-1">❌ {item.mistake}</h5>
                <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                <p className="text-sm">
                  <span className="text-green-400">✓ Solution:</span> {item.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Risk Calculator */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Risk Calculator</h4>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Portfolio Size</label>
              <input
                type="number"
                placeholder="$1,000"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Risk Per Trade (%)</label>
              <input
                type="number"
                placeholder="5"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Maximum Position Size</p>
              <p className="text-2xl font-bold">$50</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
