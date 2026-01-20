import { render, screen } from '@testing-library/react';
import Card from '@/components/ui/Card';

describe('Card', () => {
    it('renders with children', () => {
        render(<Card>Card content</Card>);
        expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies card class', () => {
        const { container } = render(<Card>Content</Card>);
        expect(container.firstChild).toHaveClass('card');
    });

    it('applies hover class when hover prop is true', () => {
        const { container } = render(<Card hover>Hover</Card>);
        expect(container.firstChild).toHaveClass('card-hover');
    });

    it('matches snapshot', () => {
        const { container } = render(<Card>Snapshot</Card>);
        expect(container.firstChild).toMatchSnapshot();
    });
});
