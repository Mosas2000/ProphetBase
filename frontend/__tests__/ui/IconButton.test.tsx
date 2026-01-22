import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IconButton from '@/components/ui/IconButton';

describe('IconButton', () => {
    it('renders with icon children', () => {
        render(
            <IconButton label="Settings">
                <svg data-testid="icon" />
            </IconButton>
        );
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('has accessible label', () => {
        render(
            <IconButton label="Settings">
                <svg />
            </IconButton>
        );
        expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    });

    it('handles click events', async () => {
        const handleClick = jest.fn();
        const user = userEvent.setup();

        render(
            <IconButton onClick={handleClick} label="Click">
                <svg data-testid="icon" />
            </IconButton>
        );
        await user.click(screen.getByTestId('icon').parentElement!);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('matches snapshot', () => {
        const { container } = render(
            <IconButton label="Icon">
                <svg />
            </IconButton>
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});
