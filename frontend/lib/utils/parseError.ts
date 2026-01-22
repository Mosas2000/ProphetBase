/**
 * Parses error messages from various sources into user-friendly strings
 * @param error - Error object or string
 * @returns User-friendly error message
 */
export function parseError(error: unknown): string {
    if (!error) return 'An unknown error occurred';

    // String error
    if (typeof error === 'string') return error;

    // Error object
    if (error instanceof Error) {
        // Check for common Web3/wagmi errors
        if (error.message.includes('User rejected')) {
            return 'Transaction was rejected';
        }
        if (error.message.includes('insufficient funds')) {
            return 'Insufficient funds for transaction';
        }
        if (error.message.includes('execution reverted')) {
            return 'Transaction failed: Contract execution reverted';
        }

        return error.message;
    }

    // Object with message property
    if (typeof error === 'object' && error !== null && 'message' in error) {
        return parseError((error as { message: unknown }).message);
    }

    // Fallback
    return 'An unexpected error occurred';
}
