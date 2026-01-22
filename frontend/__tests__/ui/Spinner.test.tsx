import { render, screen } from '@testing-library/react';
import Spinner from '@/components/ui/Spinner';

describe('Spinner', () => {
    it('renders spinner svg', () => {
        const { container } = render(<Spinner />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('applies small size class', () => {
        const { container } = render(<Spinner size="sm" />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('h-4', 'w-4');
    });

    it('applies medium size class by default', () => {
        const { container } = render(<Spinner />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('h-8', 'w-8');
    });

    it('applies large size class', () => {
        const { container } = render(<Spinner size="lg" />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('h-12', 'w-12');
    });

    it('matches snapshot', () => {
        const { container } = render(<Spinner />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
