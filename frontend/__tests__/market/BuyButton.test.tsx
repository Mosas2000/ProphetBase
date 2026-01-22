import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuyButton from '@/components/market/BuyButton';

describe('BuyButton', () => {
    it('renders YES button with percentage', () => {
        const onClick = jest.fn();
        render(<BuyButton isYes={true} percent={60} onClick={onClick} />);
        expect(screen.getByText('Buy YES 60¢')).toBeInTheDocument();
    });

    it('renders NO button with percentage', () => {
        const onClick = jest.fn();
        render(<BuyButton isYes={false} percent={40} onClick={onClick} />);
        expect(screen.getByText('Buy NO 40¢')).toBeInTheDocument();
    });

    it('handles click events', async () => {
        const onClick = jest.fn();
        const user = userEvent.setup();

        render(<BuyButton isYes={true} percent={50} onClick={onClick} />);
        await user.click(screen.getByText('Buy YES 50¢'));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('applies green styling for YES', () => {
        const onClick = jest.fn();
        render(<BuyButton isYes={true} percent={50} onClick={onClick} />);
        expect(screen.getByText('Buy YES 50¢')).toHaveClass('bg-green-600');
    });

    it('applies red styling for NO', () => {
        const onClick = jest.fn();
        render(<BuyButton isYes={false} percent={50} onClick={onClick} />);
        expect(screen.getByText('Buy NO 50¢')).toHaveClass('bg-red-600');
    });

    it('matches snapshot', () => {
        const onClick = jest.fn();
        const { container } = render(<BuyButton isYes={true} percent={60} onClick={onClick} />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
