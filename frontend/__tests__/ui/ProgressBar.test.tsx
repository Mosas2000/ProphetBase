import { render, screen } from '@testing-library/react';
import ProgressBar from '@/components/ui/ProgressBar';

describe('ProgressBar', () => {
    it('renders with correct width', () => {
        const { container } = render(<ProgressBar value={50} />);
        const bar = container.querySelector('.bg-blue-600');
        expect(bar).toHaveStyle({ width: '50%' });
    });

    it('handles 0% value', () => {
        const { container } = render(<ProgressBar value={0} />);
        const bar = container.querySelector('.bg-blue-600');
        expect(bar).toHaveStyle({ width: '0%' });
    });

    it('handles 100% value', () => {
        const { container } = render(<ProgressBar value={100} />);
        const bar = container.querySelector('.bg-blue-600');
        expect(bar).toHaveStyle({ width: '100%' });
    });

    it('caps value at 100%', () => {
        const { container } = render(<ProgressBar value={150} />);
        const bar = container.querySelector('.bg-blue-600');
        expect(bar).toHaveStyle({ width: '100%' });
    });

    it('matches snapshot', () => {
        const { container } = render(<ProgressBar value={75} />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
