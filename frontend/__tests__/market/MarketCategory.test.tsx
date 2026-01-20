import { render, screen } from '@testing-library/react';
import MarketCategory from '@/components/market/MarketCategory';

describe('MarketCategory', () => {
    it('renders category name', () => {
        render(<MarketCategory category="Crypto" />);
        expect(screen.getByText('Crypto')).toBeInTheDocument();
    });

    it('applies blue variant for Crypto', () => {
        render(<MarketCategory category="Crypto" />);
        expect(screen.getByText('Crypto')).toHaveClass('badge-blue');
    });

    it('applies red variant for Politics', () => {
        render(<MarketCategory category="Politics" />);
        expect(screen.getByText('Politics')).toHaveClass('badge-red');
    });

    it('applies green variant for Sports', () => {
        render(<MarketCategory category="Sports" />);
        expect(screen.getByText('Sports')).toHaveClass('badge-green');
    });

    it('applies gray variant for unknown category', () => {
        render(<MarketCategory category="Unknown" />);
        expect(screen.getByText('Unknown')).toHaveClass('badge-gray');
    });

    it('matches snapshot', () => {
        const { container } = render(<MarketCategory category="Crypto" />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
