import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from '@/components/ui/Dropdown';

describe('Dropdown', () => {
    it('renders trigger element', () => {
        render(
            <Dropdown trigger={<button>Open Menu</button>}>
                <div>Menu content</div>
            </Dropdown>
        );
        expect(screen.getByText('Open Menu')).toBeInTheDocument();
    });

    it('shows menu when trigger is clicked', async () => {
        const user = userEvent.setup();

        render(
            <Dropdown trigger={<button>Open</button>}>
                <div>Menu item</div>
            </Dropdown>
        );

        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Menu item')).toBeInTheDocument();
    });

    it('hides menu initially', () => {
        render(
            <Dropdown trigger={<button>Open</button>}>
                <div>Menu item</div>
            </Dropdown>
        );

        expect(screen.queryByText('Menu item')).not.toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { container } = render(
            <Dropdown trigger={<button>Menu</button>}>
                <div>Item</div>
            </Dropdown>
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});
