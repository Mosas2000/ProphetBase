import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '@/components/ui/Input';

describe('Input', () => {
    it('renders with label', () => {
        render(<Input label="Email" name="email" />);
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('handles user input', async () => {
        const user = userEvent.setup();
        render(<Input name="test" />);

        const input = screen.getByRole('textbox');
        await user.type(input, 'Hello');

        expect(input).toHaveValue('Hello');
    });

    it('displays error message', () => {
        render(<Input label="Email" error="Invalid email" />);
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('displays helper text', () => {
        render(<Input label="Email" helperText="Enter your email" />);
        expect(screen.getByText('Enter your email')).toBeInTheDocument();
    });

    it('applies error styling when error is present', () => {
        render(<Input error="Error" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-red-500');
    });

    it('matches snapshot', () => {
        const { container } = render(<Input label="Test" />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
