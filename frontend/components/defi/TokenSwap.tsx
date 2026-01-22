'use client';

import { useState } from 'react';

interface Token {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  logo: string;
}

interface SwapRoute {
  dex: string;
  outputAmount: number;
  priceImpact: number;
  gasEstimate: number;
}

export default function TokenSwap() {
  const [fromToken, setFromToken] = useState<Token>({
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 10000,
    price: 1.00,
    logo: '💵'
  });

  const [toToken, setToToken] = useState<Token>({
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 0.5,
    price: 3200,
    logo: '⟠'
  });

  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);

  const routes: SwapRoute[] = [
    { dex: 'Uniswap V3', outputAmount: 3.125, priceImpact: 0.12, gasEstimate: 180000 },
    { dex: 'BaseSwap', outputAmount: 3.122, priceImpact: 0.15, gasEstimate: 165000 },
    { dex: 'Aerodrome', outputAmount: 3.120, priceImpact: 0.18, gasEstimate: 170000 }
  ];

  const bestRoute = routes[0];
  const expectedOutput = fromAmount ? (parseFloat(fromAmount) / toToken.price).toFixed(6) : '0';
  const priceImpact = fromAmount && parseFloat(fromAmount) > 10000 ? 0.25 : 0.12;
  const minimumReceived = fromAmount ? (parseFloat(expectedOutput) * (1 - slippage / 100)).toFixed(6) : '0';

  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Token Swap</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ⚙️
        </button>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Settings</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slippage Tolerance
            </label>
            <div className="flex space-x-2">
              {[0.1, 0.5, 1.0, 3.0].map(value => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    slippage === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <input
                type="number"
                placeholder="Custom"
                className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                onChange={e => setSlippage(parseFloat(e.target.value) || 0.5)}
              />
            </div>
          </div>
        </div>
      )}

      {/* From Token */}
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>From</span>
          <span>Balance: {fromToken.balance.toLocaleString()} {fromToken.symbol}</span>
        </div>
        <div className="border-2 border-gray-200 rounded-lg p-4 focus-within:border-blue-500 transition-colors">
          <div className="flex items-center justify-between">
            <input
              type="number"
              value={fromAmount}
              onChange={e => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="text-2xl font-semibold text-gray-900 outline-none flex-1"
            />
            <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
              <span className="text-2xl">{fromToken.logo}</span>
              <span className="font-semibold text-gray-900">{fromToken.symbol}</span>
              <span>▼</span>
            </button>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            ${fromAmount ? (parseFloat(fromAmount) * fromToken.price).toLocaleString() : '0.00'}
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center my-3">
        <button
          onClick={swapTokens}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          ⇅
        </button>
      </div>

      {/* To Token */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>To</span>
          <span>Balance: {toToken.balance.toLocaleString()} {toToken.symbol}</span>
        </div>
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold text-gray-900">
              {expectedOutput}
            </div>
            <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
              <span className="text-2xl">{toToken.logo}</span>
              <span className="font-semibold text-gray-900">{toToken.symbol}</span>
              <span>▼</span>
            </button>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            ${fromAmount ? (parseFloat(expectedOutput) * toToken.price).toLocaleString() : '0.00'}
          </div>
        </div>
      </div>

      {/* Route Information */}
      {fromAmount && parseFloat(fromAmount) > 0 && (
        <div className="mb-6 space-y-3">
          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900">Best Route: {bestRoute.dex}</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                BEST PRICE
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-semibold text-gray-900">
                  1 {fromToken.symbol} = {(toToken.price / fromToken.price).toFixed(6)} {toToken.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price Impact:</span>
                <span className={`font-semibold ${priceImpact < 1 ? 'text-green-600' : priceImpact < 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {priceImpact.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum Received:</span>
                <span className="font-semibold text-gray-900">
                  {minimumReceived} {toToken.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gas Estimate:</span>
                <span className="font-semibold text-gray-900">
                  ~${(bestRoute.gasEstimate * 0.000001 * 3200).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Alternative Routes */}
          <details className="text-sm">
            <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
              View {routes.length - 1} alternative routes
            </summary>
            <div className="mt-3 space-y-2">
              {routes.slice(1).map((route, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{route.dex}</span>
                    <div className="text-right">
                      <div className="text-gray-900">{route.outputAmount.toFixed(6)} {toToken.symbol}</div>
                      <div className="text-xs text-gray-500">Gas: ${(route.gasEstimate * 0.000001 * 3200).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Swap Button */}
      <button
        disabled={!fromAmount || parseFloat(fromAmount) <= 0 || parseFloat(fromAmount) > fromToken.balance}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-colors"
      >
        {!fromAmount || parseFloat(fromAmount) <= 0
          ? 'Enter an amount'
          : parseFloat(fromAmount) > fromToken.balance
          ? 'Insufficient balance'
          : 'Swap'}
      </button>

      {/* Warning */}
      {priceImpact > 3 && fromAmount && parseFloat(fromAmount) > 0 && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="text-sm text-red-600">
            ⚠️ High price impact! Consider reducing your swap amount.
          </p>
        </div>
      )}
    </div>
  );
}
