import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInput from '@/components/forms/SearchInput';

describe('SearchInput', () => {
    it('renders search input', () => {
        render(<SearchInput placeholder="Search markets" />);
        expect(screen.getByPlaceholderText('Search markets')).toBeInTheDocument();
    });

    it('renders search icon', () => {
        const { container } = render(<SearchInput />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('handles user input', async () => {
        const user = userEvent.setup();
        render(<SearchInput />);

        const input = screen.getByRole('searchbox');
        await user.type(input, 'Bitcoin');

        expect(input).toHaveValue('Bitcoin');
    });

    it('applies rounded-full class', () => {
        render(<SearchInput />);
        expect(screen.getByRole('searchbox')).toHaveClass('rounded-full');
    });

    it('matches snapshot', () => {
        const { container } = render(<SearchInput placeholder="Search" />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
