import { render, screen } from '@testing-library/react';
import Container from '@/components/layout/Container';

describe('Container', () => {
    it('renders children', () => {
        render(<Container>Container content</Container>);
        expect(screen.getByText('Container content')).toBeInTheDocument();
    });

    it('applies max-width constraint', () => {
        const { container } = render(<Container>Content</Container>);
        expect(container.firstChild).toHaveClass('max-w-7xl', 'mx-auto');
    });

    it('matches snapshot', () => {
        const { container } = render(<Container>Snapshot</Container>);
        expect(container.firstChild).toMatchSnapshot();
    });
});
