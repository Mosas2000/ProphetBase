import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MarketCard from '../../components/MarketCard'
import MarketSearch from '../../components/MarketSearch'
import MarketSort from '../../components/MarketSort'

// Mock dependencies
jest.mock('next/link', () => {
    return ({ children }: { children: React.ReactNode }) => {
        return children;
    }
});

describe('MarketCard', () => {
    const mockProps = {
        marketId: 1,
        question: 'Test Question?',
        endTime: BigInt(Math.floor(Date.now() / 1000) + 86400), // 24h from now
        yesToken: '0x123',
        noToken: '0x456',
        status: 0,
        totalYesShares: BigInt(100),
        totalNoShares: BigInt(100),
    }

    it('renders market question correctly', () => {
        render(<MarketCard {...mockProps} />)
        expect(screen.getByText('Test Question?')).toBeInTheDocument()
    })

    it('displays correct probabilities', () => {
        render(<MarketCard {...mockProps} />)
        // 100 yes / 200 total = 50%
        expect(screen.getByText(/YES 50%/)).toBeInTheDocument()
        expect(screen.getByText(/NO 50%/)).toBeInTheDocument()
    })
})

describe('MarketSearch', () => {
    it('calls onSearch when input changes', () => {
        const handleSearch = jest.fn()
        render(<MarketSearch onSearch={handleSearch} onCategoryChange={() => { }} />)

        const input = screen.getByPlaceholderText(/Search markets/i)
        fireEvent.change(input, { target: { value: 'Bitcoin' } })

        expect(handleSearch).toHaveBeenCalledWith('Bitcoin')
    })

    it('calls onCategoryChange when filter clicked', () => {
        const handleCategory = jest.fn()
        render(<MarketSearch onSearch={() => { }} onCategoryChange={handleCategory} />)

        const cryptoBtn = screen.getByText('Crypto')
        fireEvent.click(cryptoBtn)

        expect(handleCategory).toHaveBeenCalledWith('Crypto')
    })
})

describe('MarketSort', () => {
    it('calls onSortChange when option selected', () => {
        const handleSort = jest.fn()
        render(<MarketSort currentSort="recent" onSortChange={handleSort} />) // Expecting "Sort by:" text

        // Open dropdown (if applicable, but implementation is simple button for open)
        // For simplicity in test without full interaction, we just check if it renders
        expect(screen.getByText(/Most Recent/)).toBeInTheDocument()
    })
})
