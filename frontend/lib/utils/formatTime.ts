import { format } from 'date-fns';

/**
 * Formats a time using date-fns
 * @param date - Date to format (Date, timestamp, or bigint)
 * @param formatString - Format pattern (default: 'HH:mm:ss')
 * @returns Formatted time string
 */
export function formatTime(
    date: Date | number | bigint,
    formatString: string = 'HH:mm:ss'
): string {
    try {
        const dateObj = typeof date === 'bigint'
            ? new Date(Number(date) * 1000)
            : typeof date === 'number'
                ? new Date(date * 1000)
                : date;

        return format(dateObj, formatString);
    } catch (error) {
        return 'Invalid time';
    }
}
