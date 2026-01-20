import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SecondaryButton from '@/components/ui/SecondaryButton';

describe('SecondaryButton', () => {
    it('renders with children', () => {
        render(<SecondaryButton>Click me</SecondaryButton>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles click events', async () => {
        const handleClick = jest.fn();
        const user = userEvent.setup();

        render(<SecondaryButton onClick={handleClick}>Click me</SecondaryButton>);
        await user.click(screen.getByText('Click me'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies fullWidth class when prop is true', () => {
        render(<SecondaryButton fullWidth>Full Width</SecondaryButton>);
        const button = screen.getByText('Full Width');
        expect(button).toHaveClass('w-full');
    });

    it('applies btn-secondary class', () => {
        render(<SecondaryButton>Secondary</SecondaryButton>);
        expect(screen.getByText('Secondary')).toHaveClass('btn-secondary');
    });

    it('matches snapshot', () => {
        const { container } = render(<SecondaryButton>Snapshot</SecondaryButton>);
        expect(container.firstChild).toMatchSnapshot();
    });
});
