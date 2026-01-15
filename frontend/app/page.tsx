'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import MarketList from '@/components/MarketList'
import UserPositions from '@/components/UserPositions'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔮</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ProphetBase</h1>
                <p className="text-xs text-gray-500">Crypto-Native Prediction Markets on Base</p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 text-sm font-medium text-blue-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            Live on Base Mainnet
          </div>

          <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            <span className="block">Decentralized</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prediction Markets
            </span>
          </h2>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
            Trade predictions on crypto events with ProphetBase. Buy YES or NO shares with USDC, and claim winnings when your predictions come true.
          </p>

          {!isConnected && (
            <div className="mx-auto max-w-md rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8">
              <p className="mb-4 text-gray-600">Connect your wallet to get started</p>
              <ConnectButton />
            </div>
          )}
        </div>

        {/* Main Content - Markets and Positions */}
        {isConnected && (
          <div className="space-y-12 pb-16">
            {/* Active Markets Section */}
            <section id="markets" className="scroll-mt-20">
              <MarketList />
            </section>

            {/* User Positions Section */}
            <section id="positions" className="scroll-mt-20">
              <UserPositions />
            </section>
          </div>
        )}

        {/* Features Section */}
        <div className="grid gap-8 pb-20 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Trade Predictions</h3>
            <p className="text-gray-600">Buy YES or NO shares on crypto market predictions with USDC</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Earn Rewards</h3>
            <p className="text-gray-600">Claim winnings when your predictions are correct</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Secure & Transparent</h3>
            <p className="text-gray-600">Built on Base with verified smart contracts</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                © 2026 ProphetBase
              </p>
              <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1">
                <svg className="h-4 w-4 text-blue-600" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" fill="#0052FF" />
                </svg>
                <span className="text-xs font-medium text-blue-700">Built on Base</span>
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <a
                href="https://basescan.org/address/0x798e104BfAefC785bCDB63B58E0b620707773DAA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contract
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="https://docs.base.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Docs
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
