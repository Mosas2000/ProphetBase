import { render, screen } from '@testing-library/react';
import MarketProbability from '@/components/market/MarketProbability';

describe('MarketProbability', () => {
    it('renders YES and NO percentages', () => {
        render(<MarketProbability yesShares={BigInt(60)} noShares={BigInt(40)} />);
        expect(screen.getByText('60%')).toBeInTheDocument();
        expect(screen.getByText('40%')).toBeInTheDocument();
    });

    it('shows 50/50 when no shares', () => {
        render(<MarketProbability yesShares={BigInt(0)} noShares={BigInt(0)} />);
        expect(screen.getAllByText('50%')).toHaveLength(2);
    });

    it('renders YES and NO labels', () => {
        render(<MarketProbability yesShares={BigInt(70)} noShares={BigInt(30)} />);
        expect(screen.getByText('YES')).toBeInTheDocument();
        expect(screen.getByText('NO')).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { container } = render(<MarketProbability yesShares={BigInt(60)} noShares={BigInt(40)} />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
