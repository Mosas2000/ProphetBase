import { render, screen } from '@testing-library/react';
import StatValue from '@/components/stats/StatValue';

describe('StatValue', () => {
    it('renders value', () => {
        render(<StatValue>1,234</StatValue>);
        expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    it('applies text styling', () => {
        const { container } = render(<StatValue>100</StatValue>);
        expect(container.firstChild).toHaveClass('text-2xl', 'font-bold');
    });

    it('matches snapshot', () => {
        const { container } = render(<StatValue>$50,000</StatValue>);
        expect(container.firstChild).toMatchSnapshot();
    });
});
