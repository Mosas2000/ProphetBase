/**
 * Formats a number as currency with proper separators and decimals
 * @param value - The numeric value to format
 * @param currency - Currency symbol (default: '$')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(
    value: number | bigint | string,
    currency: string = '$',
    decimals: number = 2
): string {
    const numValue = typeof value === 'bigint' ? Number(value) : Number(value);

    if (isNaN(numValue)) return `${currency}0.00`;

    return `${currency}${numValue.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}`;
}
