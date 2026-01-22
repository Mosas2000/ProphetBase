import { render } from '@testing-library/react';
import BaseIcon from '@/components/icons/BaseIcon';

describe('BaseIcon', () => {
    it('renders svg element', () => {
        const { container } = render(<BaseIcon />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('applies default size class', () => {
        const { container } = render(<BaseIcon />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('w-6', 'h-6');
    });

    it('applies custom className', () => {
        const { container } = render(<BaseIcon className="w-10 h-10" />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('w-10', 'h-10');
    });

    it('matches snapshot', () => {
        const { container } = render(<BaseIcon />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
