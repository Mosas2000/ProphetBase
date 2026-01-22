'use client';

import { useState } from 'react';

export default function VolatilityAnalyzer() {
  const [volatility] = useState({
    current: 18.5,
    average: 15.2,
    historical: [12, 14, 18, 22, 19, 16, 18.5]
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Volatility Analyzer</h2>
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <div className="text-5xl font-bold text-orange-600 mb-2">{volatility.current}%</div>
        <p className="text-gray-600">Current Volatility</p>
        <p className="text-sm text-gray-500 mt-2">Average: {volatility.average}%</p>
      </div>
    </div>
  );
}
