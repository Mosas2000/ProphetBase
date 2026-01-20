import { render, screen } from '@testing-library/react';
import MarketStatus from '@/components/market/MarketStatus';

describe('MarketStatus', () => {
    it('renders Active status for status 0', () => {
        render(<MarketStatus status={0} />);
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders Resolved status for status 1', () => {
        render(<MarketStatus status={1} />);
        expect(screen.getByText('Resolved')).toBeInTheDocument();
    });

    it('renders Cancelled status for status 2', () => {
        render(<MarketStatus status={2} />);
        expect(screen.getByText('Cancelled')).toBeInTheDocument();
    });

    it('shows ping animation for active status', () => {
        const { container } = render(<MarketStatus status={0} />);
        expect(container.querySelector('.animate-ping')).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { container } = render(<MarketStatus status={0} />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
