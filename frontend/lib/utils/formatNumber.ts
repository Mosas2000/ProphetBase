/**
 * Formats a number with thousand separators and optional decimals
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 0)
 * @param compact - Use compact notation for large numbers (default: false)
 * @returns Formatted number string (e.g., "1,234" or "1.2K")
 */
export function formatNumber(
    value: number | bigint | string,
    decimals: number = 0,
    compact: boolean = false
): string {
    const numValue = typeof value === 'bigint' ? Number(value) : Number(value);

    if (isNaN(numValue)) return '0';

    if (compact && numValue >= 1000) {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(numValue);
    }

    return numValue.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}
