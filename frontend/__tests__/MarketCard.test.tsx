import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MarketCard from '../MarketCard'

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

describe('MarketCard', () => {
    const mockMarket = {
        id: 0,
        question: 'Will ETH hit $5k by end of 2026?',
        endTime: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
        status: 0, // Open
        totalYesShares: 1000,
        totalNoShares: 500,
        category: 1, // Crypto
    }

    it('renders market question', () => {
        render(<MarketCard market={mockMarket} />)
        expect(screen.getByText('Will ETH hit $5k by end of 2026?')).toBeInTheDocument()
    })

    it('displays correct status badge for open market', () => {
        render(<MarketCard market={mockMarket} />)
        expect(screen.getByText('Open')).toBeInTheDocument()
    })

    it('displays correct status badge for resolved market', () => {
        const resolvedMarket = { ...mockMarket, status: 1 }
        render(<MarketCard market={resolvedMarket} />)
        expect(screen.getByText('Resolved')).toBeInTheDocument()
    })

    it('displays correct status badge for cancelled market', () => {
        const cancelledMarket = { ...mockMarket, status: 2 }
        render(<MarketCard market={cancelledMarket} />)
        expect(screen.getByText('Cancelled')).toBeInTheDocument()
    })

    it('calculates and displays YES percentage correctly', () => {
        render(<MarketCard market={mockMarket} />)
        // 1000 / (1000 + 500) = 66.7%
        expect(screen.getByText('66.7%')).toBeInTheDocument()
    })

    it('calculates and displays NO percentage correctly', () => {
        render(<MarketCard market={mockMarket} />)
        // 500 / (1000 + 500) = 33.3%
        expect(screen.getByText('33.3%')).toBeInTheDocument()
    })

    it('displays category badge', () => {
        render(<MarketCard market={mockMarket} />)
        expect(screen.getByText('Crypto')).toBeInTheDocument()
    })

    it('shows countdown timer for open markets', () => {
        render(<MarketCard market={mockMarket} />)
        // CountdownTimer should be rendered
        expect(screen.getByText(/days|hrs|min|sec/i)).toBeInTheDocument()
    })

    it('calls onBuyClick when buy button is clicked', () => {
        const onBuyClick = vi.fn()
        render(<MarketCard market={mockMarket} onBuyClick={onBuyClick} />)

        const buyButton = screen.getByText('Buy Shares')
        fireEvent.click(buyButton)

        expect(onBuyClick).toHaveBeenCalledWith(mockMarket.id)
    })

    it('does not show buy button for resolved markets', () => {
        const resolvedMarket = { ...mockMarket, status: 1 }
        render(<MarketCard market={resolvedMarket} />)

        expect(screen.queryByText('Buy Shares')).not.toBeInTheDocument()
    })

    it('displays total volume', () => {
        render(<MarketCard market={mockMarket} />)
        // 1000 + 500 = 1500
        expect(screen.getByText(/1,500/)).toBeInTheDocument()
    })

    it('matches snapshot for open market', () => {
        const { container } = render(<MarketCard market={mockMarket} />)
        expect(container).toMatchSnapshot()
    })

    it('matches snapshot for resolved market', () => {
        const resolvedMarket = { ...mockMarket, status: 1, outcome: true }
        const { container } = render(<MarketCard market={resolvedMarket} />)
        expect(container).toMatchSnapshot()
    })

    it('handles markets with zero shares gracefully', () => {
        const emptyMarket = { ...mockMarket, totalYesShares: 0, totalNoShares: 0 }
        render(<MarketCard market={emptyMarket} />)

        // Should default to 50/50
        expect(screen.getAllByText('50.0%')).toHaveLength(2)
    })

    it('displays ended state for past markets', () => {
        const pastMarket = { ...mockMarket, endTime: Math.floor(Date.now() / 1000) - 100 }
        render(<MarketCard market={pastMarket} />)

        expect(screen.getByText('Ended')).toBeInTheDocument()
    })
})
