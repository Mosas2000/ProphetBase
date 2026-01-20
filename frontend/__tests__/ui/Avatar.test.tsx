import { render, screen } from '@testing-library/react';
import Avatar from '@/components/ui/Avatar';

describe('Avatar', () => {
    it('renders fallback when no src provided', () => {
        render(<Avatar fallback="AB" />);
        expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('truncates fallback to 2 characters', () => {
        render(<Avatar fallback="ABCDEF" />);
        expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('renders image when src is provided', () => {
        render(<Avatar src="/test.jpg" alt="Test User" />);
        expect(screen.getByAltText('Test User')).toBeInTheDocument();
    });

    it('applies size classes correctly', () => {
        const { container } = render(<Avatar fallback="AB" size="lg" />);
        expect(container.firstChild).toHaveClass('h-12', 'w-12');
    });

    it('matches snapshot', () => {
        const { container } = render(<Avatar fallback="JD" />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
