import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '@/components/ui/Modal';

describe('Modal', () => {
    it('renders when isOpen is true', () => {
        render(
            <Modal isOpen={true} onClose={jest.fn()}>
                <div>Modal content</div>
            </Modal>
        );
        expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
        render(
            <Modal isOpen={false} onClose={jest.fn()}>
                <div>Modal content</div>
            </Modal>
        );
        expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('calls onClose when clicking backdrop', async () => {
        const onClose = jest.fn();
        const user = userEvent.setup();

        render(
            <Modal isOpen={true} onClose={onClose}>
                <div>Content</div>
            </Modal>
        );

        // Click the backdrop (not the modal content)
        const backdrop = screen.getByText('Content').parentElement?.parentElement;
        if (backdrop) await user.click(backdrop);

        expect(onClose).toHaveBeenCalled();
    });

    it('applies size classes correctly', () => {
        const { container } = render(
            <Modal isOpen={true} onClose={jest.fn()} size="lg">
                <div>Content</div>
            </Modal>
        );
        expect(container.querySelector('.max-w-lg')).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { container } = render(
            <Modal isOpen={true} onClose={jest.fn()}>
                <div>Snapshot</div>
            </Modal>
        );
        expect(container).toMatchSnapshot();
    });
});
