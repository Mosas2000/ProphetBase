import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BuySharesModal from '../components/BuySharesModal'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

// Mock wagmi hooks
vi.mock('wagmi', () => ({
    useAccount: vi.fn(),
    useWriteContract: vi.fn(),
    useWaitForTransactionReceipt: vi.fn(),
    useReadContract: vi.fn(),
}))

// Mock toast
vi.mock('../lib/toast', () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showLoading: vi.fn(),
    dismissToast: vi.fn(),
}))

describe('BuySharesModal', () => {
    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        marketId: 0,
        shareType: 'YES' as const,
        question: 'Will ETH hit $5k?',
    }

    beforeEach(() => {
        vi.clearAllMocks()

            // Default mock implementations
            ; (useAccount as any).mockReturnValue({
                address: '0x1234567890123456789012345678901234567890',
                isConnected: true,
            })

            ; (useWriteContract as any).mockReturnValue({
                writeContract: vi.fn(),
                data: null,
                isPending: false,
                error: null,
            })

            ; (useWaitForTransactionReceipt as any).mockReturnValue({
                isLoading: false,
                isSuccess: false,
            })
    })

    it('renders modal when open', () => {
        render(<BuySharesModal {...mockProps} />)
        expect(screen.getByText('Will ETH hit $5k?')).toBeInTheDocument()
    })

    it('does not render when closed', () => {
        render(<BuySharesModal {...mockProps} isOpen={false} />)
        expect(screen.queryByText('Will ETH hit $5k?')).not.toBeInTheDocument()
    })

    it('displays correct share type in title', () => {
        render(<BuySharesModal {...mockProps} shareType="YES" />)
        expect(screen.getByText(/Buy YES Shares/i)).toBeInTheDocument()
    })

    it('displays NO share type when specified', () => {
        render(<BuySharesModal {...mockProps} shareType="NO" />)
        expect(screen.getByText(/Buy NO Shares/i)).toBeInTheDocument()
    })

    it('calls onClose when close button is clicked', () => {
        render(<BuySharesModal {...mockProps} />)

        const closeButton = screen.getByRole('button', { name: /close/i })
        fireEvent.click(closeButton)

        expect(mockProps.onClose).toHaveBeenCalled()
    })

    it('allows amount input', () => {
        render(<BuySharesModal {...mockProps} />)

        const input = screen.getByPlaceholderText(/enter amount/i)
        fireEvent.change(input, { target: { value: '100' } })

        expect(input).toHaveValue(100)
    })

    it('validates minimum amount', () => {
        render(<BuySharesModal {...mockProps} />)

        const input = screen.getByPlaceholderText(/enter amount/i)
        fireEvent.change(input, { target: { value: '0' } })

        const buyButton = screen.getByText(/Buy Shares/i)
        expect(buyButton).toBeDisabled()
    })

    it('shows approval step first', () => {
        render(<BuySharesModal {...mockProps} />)
        expect(screen.getByText(/Approve USDC/i)).toBeInTheDocument()
    })

    it('calls approve function when approve button clicked', async () => {
        const mockWriteContract = vi.fn()
            ; (useWriteContract as any).mockReturnValue({
                writeContract: mockWriteContract,
                data: null,
                isPending: false,
                error: null,
            })

        render(<BuySharesModal {...mockProps} />)

        const input = screen.getByPlaceholderText(/enter amount/i)
        fireEvent.change(input, { target: { value: '100' } })

        const approveButton = screen.getByText(/Approve USDC/i)
        fireEvent.click(approveButton)

        await waitFor(() => {
            expect(mockWriteContract).toHaveBeenCalled()
        })
    })

    it('shows buy step after approval', () => {
        ; (useWaitForTransactionReceipt as any).mockReturnValue({
            isLoading: false,
            isSuccess: true, // Approval successful
        })

        render(<BuySharesModal {...mockProps} />)
        expect(screen.getByText(/Buy Shares/i)).toBeInTheDocument()
    })

    it('displays loading state during approval', () => {
        ; (useWriteContract as any).mockReturnValue({
            writeContract: vi.fn(),
            data: '0xhash',
            isPending: true,
            error: null,
        })

        render(<BuySharesModal {...mockProps} />)
        expect(screen.getByText(/Approving.../i)).toBeInTheDocument()
    })

    it('displays loading state during buy', () => {
        ; (useWriteContract as any).mockReturnValue({
            writeContract: vi.fn(),
            data: '0xhash',
            isPending: true,
            error: null,
        })

        render(<BuySharesModal {...mockProps} />)
        expect(screen.getByText(/Buying.../i)).toBeInTheDocument()
    })

    it('shows success state after purchase', () => {
        ; (useWaitForTransactionReceipt as any).mockReturnValue({
            isLoading: false,
            isSuccess: true,
        })

        render(<BuySharesModal {...mockProps} />)
        expect(screen.getByText(/Success!/i)).toBeInTheDocument()
    })

    it('displays transaction hash link', () => {
        ; (useWriteContract as any).mockReturnValue({
            writeContract: vi.fn(),
            data: '0x1234567890abcdef',
            isPending: false,
            error: null,
        })

        render(<BuySharesModal {...mockProps} />)
        const link = screen.getByText(/0x1234...cdef/i)
        expect(link).toHaveAttribute('href', expect.stringContaining('basescan.org'))
    })

    it('shows error message on failure', () => {
        ; (useWriteContract as any).mockReturnValue({
            writeContract: vi.fn(),
            data: null,
            isPending: false,
            error: new Error('Transaction failed'),
        })

        render(<BuySharesModal {...mockProps} />)
        expect(screen.getByText(/error/i)).toBeInTheDocument()
    })

    it('calculates fee correctly', () => {
        render(<BuySharesModal {...mockProps} />)

        const input = screen.getByPlaceholderText(/enter amount/i)
        fireEvent.change(input, { target: { value: '100' } })

        // 2% fee = $2
        expect(screen.getByText(/\$2\.00/)).toBeInTheDocument()
    })

    it('displays net shares received', () => {
        render(<BuySharesModal {...mockProps} />)

        const input = screen.getByPlaceholderText(/enter amount/i)
        fireEvent.change(input, { target: { value: '100' } })

        // 100 - 2% = 98 shares
        expect(screen.getByText(/98/)).toBeInTheDocument()
    })

    it('requires wallet connection', () => {
        ; (useAccount as any).mockReturnValue({
            address: null,
            isConnected: false,
        })

        render(<BuySharesModal {...mockProps} />)
        expect(screen.getByText(/Connect wallet/i)).toBeInTheDocument()
    })
})
