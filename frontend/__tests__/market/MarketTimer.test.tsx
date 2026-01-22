import { render, screen } from '@testing-library/react';
import MarketTimer from '@/components/market/MarketTimer';

describe('MarketTimer', () => {
    it('renders time remaining for future end time', () => {
        const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
        render(<MarketTimer endTime={futureTime} />);
        expect(screen.getByText(/Ends/)).toBeInTheDocument();
    });

    it('renders "Ended" for past end time', () => {
        const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
        render(<MarketTimer endTime={pastTime} />);
        expect(screen.getByText(/Ended/)).toBeInTheDocument();
    });

    it('renders clock icon', () => {
        const futureTime = Math.floor(Date.now() / 1000) + 3600;
        const { container } = render(<MarketTimer endTime={futureTime} />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const futureTime = Math.floor(Date.now() / 1000) + 3600;
        const { container } = render(<MarketTimer endTime={futureTime} />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
