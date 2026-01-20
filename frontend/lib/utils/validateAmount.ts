/**
 * Validates a numeric amount for transactions
 * @param amount - Amount to validate
 * @param min - Minimum allowed value (default: 0)
 * @param max - Maximum allowed value (optional)
 * @returns Object with isValid and error message
 */
export function validateAmount(
    amount: string | number,
    min: number = 0,
    max?: number
): { isValid: boolean; error?: string } {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) {
        return { isValid: false, error: 'Invalid number' };
    }

    if (numAmount < min) {
        return { isValid: false, error: `Amount must be at least ${min}` };
    }

    if (max !== undefined && numAmount > max) {
        return { isValid: false, error: `Amount cannot exceed ${max}` };
    }

    if (numAmount <= 0) {
        return { isValid: false, error: 'Amount must be greater than 0' };
    }

    return { isValid: true };
}
