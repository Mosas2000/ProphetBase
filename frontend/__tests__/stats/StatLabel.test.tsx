import { render, screen } from '@testing-library/react';
import StatLabel from '@/components/stats/StatLabel';

describe('StatLabel', () => {
    it('renders label text', () => {
        render(<StatLabel>Total Markets</StatLabel>);
        expect(screen.getByText('Total Markets')).toBeInTheDocument();
    });

    it('applies text styling', () => {
        const { container } = render(<StatLabel>Label</StatLabel>);
        expect(container.firstChild).toHaveClass('text-sm', 'font-medium');
    });

    it('matches snapshot', () => {
        const { container } = render(<StatLabel>Active Users</StatLabel>);
        expect(container.firstChild).toMatchSnapshot();
    });
});
