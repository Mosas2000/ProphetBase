'use client';

import { useState } from 'react';

export default function PerformanceAttribution() {
  const [attribution] = useState({
    totalReturn: 18750,
    factors: [
      { name: 'Market Selection', contribution: 45, amount: 8438 },
      { name: 'Entry Timing', contribution: 30, amount: 5625 },
      { name: 'Position Sizing', contribution: 15, amount: 2813 },
      { name: 'Exit Timing', contribution: 10, amount: 1875 },
    ],
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Performance Attribution
      </h2>
      <div className="text-center p-6 bg-green-50 rounded-lg mb-6">
        <div className="text-4xl font-bold text-green-600">
          ${attribution.totalReturn.toLocaleString()}
        </div>
        <p className="text-gray-600">Total Returns</p>
      </div>
      <div className="space-y-3">
        {attribution.factors.map((factor, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-900">{factor.name}</span>
              <span className="text-green-600 font-bold">
                ${factor.amount.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full"
                style={{ width: `${factor.contribution}%` }}
              />
            </div>
            <div className="text-right text-sm text-gray-600 mt-1">
              {factor.contribution}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
