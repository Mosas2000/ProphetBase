import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AmountInput from '@/components/forms/AmountInput';

describe('AmountInput', () => {
    it('renders with currency symbol', () => {
        render(<AmountInput currency="USDC" />);
        expect(screen.getByText('USDC')).toBeInTheDocument();
    });

    it('renders with default USDC currency', () => {
        render(<AmountInput />);
        expect(screen.getByText('USDC')).toBeInTheDocument();
    });

    it('handles numeric input', async () => {
        const user = userEvent.setup();
        render(<AmountInput />);

        const input = screen.getByRole('spinbutton');
        await user.type(input, '100.50');

        expect(input).toHaveValue(100.5);
    });

    it('applies number input type', () => {
        render(<AmountInput />);
        expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
    });

    it('matches snapshot', () => {
        const { container } = render(<AmountInput currency="ETH" />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
