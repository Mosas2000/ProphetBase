import { render, screen } from '@testing-library/react';
import StatCard from '@/components/stats/StatCard';

describe('StatCard', () => {
    it('renders children', () => {
        render(
            <StatCard>
                <div>Stat content</div>
            </StatCard>
        );
        expect(screen.getByText('Stat content')).toBeInTheDocument();
    });

    it('applies card class', () => {
        const { container } = render(<StatCard>Content</StatCard>);
        expect(container.firstChild).toHaveClass('card');
    });

    it('matches snapshot', () => {
        const { container } = render(<StatCard>Snapshot</StatCard>);
        expect(container.firstChild).toMatchSnapshot();
    });
});
