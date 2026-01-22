import { format } from 'date-fns';

/**
 * Formats a date using date-fns
 * @param date - Date to format (Date, timestamp, or bigint)
 * @param formatString - Format pattern (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export function formatDate(
    date: Date | number | bigint,
    formatString: string = 'MMM dd, yyyy'
): string {
    try {
        const dateObj = typeof date === 'bigint'
            ? new Date(Number(date) * 1000)
            : typeof date === 'number'
                ? new Date(date * 1000)
                : date;

        return format(dateObj, formatString);
    } catch (error) {
        return 'Invalid date';
    }
}
