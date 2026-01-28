'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { QuickTrade } from '@/components/mobile'
  // Example trade handler (replace with real logic)
  function handleQuickTrade(side: 'buy' | 'sell', amount: number) {
    alert(`Trade: ${side} ${amount} ETH-USD`)
    // TODO: Integrate with buy/sell logic
  }
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useReadContract } from 'wagmi'
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '@/lib/contracts'
import MarketList from '@/components/MarketList'
import UserPositions from '@/components/UserPositions'
import dynamic from 'next/dynamic'

const StatsDashboard = dynamic(() => import('@/components/StatsDashboard'), {
  loading: () => <div className="h-32 flex items-center justify-center text-gray-400">Loading stats...</div>,
  ssr: false,
})
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import Toaster from '@/components/Toaster'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'markets' | 'positions'>('markets')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch - only render dynamic content after mount
  if (!mounted) {
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
                  <p className="text-xs text-gray-500 hidden sm:block">Crypto-Native Prediction Markets on Base</p>
                </div>
              </div>
              <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
            </div>
          </div>
        </header>

        {/* Loading State */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="block">Decentralized</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Prediction Markets
              </span>
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
              Trade predictions on crypto events with ProphetBase. Buy YES or NO shares with USDC, and claim winnings when your predictions come true.
            </p>
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Toast Notifications */}
        <Toaster />

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">🔮</span>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">ProphetBase</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Crypto-Native Prediction Markets on Base</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4">
                <a
                  href="#markets"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Markets
                </a>
                <a
                  href="#positions"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Positions
                </a>
                <a
                  href="#faq"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  FAQ
                </a>
                <ConnectButton />
              </div>

              {/* Mobile Menu Button & Connect Button */}
              <div className="flex md:hidden items-center gap-2">
                <div className="scale-75 origin-right">
                  <ConnectButton />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {mobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top-2 duration-200">
                <nav className="flex flex-col gap-2">
                  <a
                    href="#markets"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Markets
                  </a>
                  <a
                    href="#positions"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Positions
                  </a>
                  <a
                    href="#faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    FAQ
                  </a>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 sm:py-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 text-sm font-medium text-blue-700">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              Live on Base Mainnet
            </div>

            <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              <span className="block">Decentralized</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Prediction Markets
              </span>
            </h2>

            <div className="flex flex-col items-center justify-center mb-8">
              <Image
                src="/globe.svg"
                alt="Prediction Market Globe"
                width={160}
                height={160}
                priority
                className="rounded-full shadow-lg border border-gray-200 bg-white"
              />
            </div>

            <p className="mx-auto mb-10 max-w-2xl text-base sm:text-lg text-gray-600 px-4">
              Trade predictions on crypto events with ProphetBase. Buy YES or NO shares with USDC, and claim winnings when your predictions come true.
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="mb-12 sm:mb-16">
            <StatsDashboard
              totalMarkets={3}
              activeMarkets={3}
              totalVolume="0"
              totalUsers={0}
            />
          </div>

          {/* Main Content - Markets and Positions */}
          <div className="space-y-12 sm:space-y-16 pb-16">
            {/* Desktop View - Both Sections Visible */}
            <div className="hidden md:block space-y-16">
              {/* Active Markets Section */}
              <section id="markets" className="scroll-mt-20">
                <MarketList />
              </section>

              {/* User Positions Section */}
              <section id="positions" className="scroll-mt-20">
                <UserPositions />
              </section>
            </div>

            {/* Mobile View - Tabbed Interface */}
            <div className="md:hidden">
              <div className="mb-6">
                {activeTab === 'markets' ? (
                  <section id="markets" className="scroll-mt-20">
                    <MarketList />
                  </section>
                ) : (
                  <section id="positions" className="scroll-mt-20">
                    <UserPositions />
                  </section>
                )}
              </div>
              {/* Mobile Trading Interface */}
              <QuickTrade symbol="ETH-USD" price={3200} onTrade={handleQuickTrade} />
            </div>

            {/* FAQ Section */}
            <section id="faq" className="scroll-mt-20 pb-8">
              <FAQ />
            </section>
          </div>

          {/* Features Section */}
          <div className="grid gap-6 sm:gap-8 pb-16 sm:pb-20 grid-cols-1 sm:grid-cols-3">
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

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm pb-safe">
          <div className="grid grid-cols-2 gap-1 p-2">
            <button
              onClick={() => {
                setActiveTab('markets')
                document.getElementById('markets')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-3 transition-colors ${activeTab === 'markets'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-xs font-medium">Markets</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('positions')
                document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-3 transition-colors ${activeTab === 'positions'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-xs font-medium">Positions</span>
            </button>
          </div>
        </div>

        {/* Footer - with bottom padding for mobile nav */}
        <div className="pb-20 md:pb-0">
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  )
}
