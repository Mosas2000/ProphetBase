'use client';

import { useState } from 'react';

interface Greek {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export default function OptionsTrading() {
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [strikePrice, setStrikePrice] = useState('');
  const [premium, setPremium] = useState('');
  const [greeks, setGreeks] = useState<Greek>({
    delta: 0,
    gamma: 0,
    theta: 0,
    vega: 0,
  });

  const calculateGreeks = () => {
    // Simplified Greeks calculation
    setGreeks({
      delta: optionType === 'call' ? 0.65 : -0.35,
      gamma: 0.045,
      theta: -0.028,
      vega: 0.18,
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Options Trading
        </h1>
        <p className="text-gray-600">
          Trade options on prediction market outcomes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Options Builder */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Options Builder
            </h2>

            {/* Option Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Option Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setOptionType('call')}
                  className={`flex-1 py-2 rounded-lg font-medium ${
                    optionType === 'call'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  CALL
                </button>
                <button
                  onClick={() => setOptionType('put')}
                  className={`flex-1 py-2 rounded-lg font-medium ${
                    optionType === 'put'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  PUT
                </button>
              </div>
            </div>

            {/* Strike Price */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strike Price
              </label>
              <input
                type="number"
                value={strikePrice}
                onChange={(e) => setStrikePrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            {/* Premium */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Premium
              </label>
              <input
                type="number"
                value={premium}
                onChange={(e) => setPremium(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <button
              onClick={calculateGreeks}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-4"
            >
              Calculate Greeks
            </button>

            {/* Greeks Display */}
            {greeks.delta !== 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">Delta</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {greeks.delta.toFixed(3)}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600">Gamma</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {greeks.gamma.toFixed(3)}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-600">Theta</p>
                  <p className="text-2xl font-bold text-red-600">
                    {greeks.theta.toFixed(3)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Vega</p>
                  <p className="text-2xl font-bold text-green-600">
                    {greeks.vega.toFixed(3)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Options Chain */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Options Chain</h3>
            <div className="space-y-2">
              {[
                { strike: 0.45, premium: 0.08 },
                { strike: 0.5, premium: 0.12 },
                { strike: 0.55, premium: 0.16 },
              ].map((opt, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                >
                  <span className="text-sm font-medium">${opt.strike}</span>
                  <span className="text-sm text-gray-600">${opt.premium}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-500">
            <h3 className="font-bold text-blue-900 mb-3">Strategy Builder</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Covered Call</li>
              <li>• Protective Put</li>
              <li>• Straddle</li>
              <li>• Iron Condor</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
