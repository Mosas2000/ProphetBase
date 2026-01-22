import { render, screen } from '@testing-library/react';
import Badge from '@/components/ui/Badge';

describe('Badge', () => {
    it('renders with children', () => {
        render(<Badge>New</Badge>);
        expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('applies default variant', () => {
        render(<Badge>Default</Badge>);
        expect(screen.getByText('Default')).toHaveClass('badge');
    });

    it('applies blue variant', () => {
        render(<Badge variant="blue">Blue</Badge>);
        expect(screen.getByText('Blue')).toHaveClass('badge-blue');
    });

    it('applies green variant', () => {
        render(<Badge variant="green">Green</Badge>);
        expect(screen.getByText('Green')).toHaveClass('badge-green');
    });

    it('matches snapshot', () => {
        const { container } = render(<Badge variant="red">Snapshot</Badge>);
        expect(container.firstChild).toMatchSnapshot();
    });
});
