import { render, screen } from '@testing-library/react';
import LoadingButton from '@/components/ui/LoadingButton';

describe('LoadingButton', () => {
    it('renders children when not loading', () => {
        render(<LoadingButton>Submit</LoadingButton>);
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('shows loading text when isLoading is true', () => {
        render(<LoadingButton isLoading loadingText="Submitting...">Submit</LoadingButton>);
        expect(screen.getByText('Submitting...')).toBeInTheDocument();
        expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    });

    it('shows spinner when loading', () => {
        const { container } = render(<LoadingButton isLoading>Submit</LoadingButton>);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('is disabled when loading', () => {
        render(<LoadingButton isLoading>Submit</LoadingButton>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies primary variant by default', () => {
        render(<LoadingButton>Submit</LoadingButton>);
        expect(screen.getByText('Submit')).toHaveClass('btn-primary');
    });

    it('applies secondary variant when specified', () => {
        render(<LoadingButton variant="secondary">Submit</LoadingButton>);
        expect(screen.getByText('Submit')).toHaveClass('btn-secondary');
    });

    it('matches snapshot', () => {
        const { container } = render(<LoadingButton>Snapshot</LoadingButton>);
        expect(container.firstChild).toMatchSnapshot();
    });
});
