import { render, screen } from '@testing-library/react';
import Alert from '@/components/ui/Alert';

describe('Alert', () => {
    it('renders with children', () => {
        render(<Alert>Alert message</Alert>);
        expect(screen.getByText('Alert message')).toBeInTheDocument();
    });

    it('renders info variant by default', () => {
        const { container } = render(<Alert>Info</Alert>);
        expect(container.querySelector('.bg-blue-50')).toBeInTheDocument();
    });

    it('renders success variant', () => {
        const { container } = render(<Alert variant="success">Success</Alert>);
        expect(container.querySelector('.bg-green-50')).toBeInTheDocument();
    });

    it('renders warning variant', () => {
        const { container } = render(<Alert variant="warning">Warning</Alert>);
        expect(container.querySelector('.bg-yellow-50')).toBeInTheDocument();
    });

    it('renders error variant', () => {
        const { container } = render(<Alert variant="error">Error</Alert>);
        expect(container.querySelector('.bg-red-50')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
        render(<Alert title="Important">Message</Alert>);
        expect(screen.getByText('Important')).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { container } = render(<Alert variant="success" title="Success">Operation completed</Alert>);
        expect(container.firstChild).toMatchSnapshot();
    });
});
