import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/ui/Button';

describe('Button', () => {
    it('renders with children', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles click events', async () => {
        const handleClick = jest.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Click me</Button>);
        await user.click(screen.getByText('Click me'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies fullWidth class when prop is true', () => {
        render(<Button fullWidth>Full Width</Button>);
        const button = screen.getByText('Full Width');
        expect(button).toHaveClass('w-full');
    });

    it('can be disabled', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByText('Disabled')).toBeDisabled();
    });

    it('matches snapshot', () => {
        const { container } = render(<Button>Snapshot</Button>);
        expect(container.firstChild).toMatchSnapshot();
    });
});
