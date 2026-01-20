import { formatDistanceToNow, formatDistance } from 'date-fns';

/**
 * Formats a duration relative to now or between two dates
 * @param date - End date (Date, timestamp, or bigint)
 * @param baseDate - Start date (optional, defaults to now)
 * @param addSuffix - Add "ago" or "in" suffix (default: true)
 * @returns Formatted duration string (e.g., "2 hours ago")
 */
export function formatDuration(
    date: Date | number | bigint,
    baseDate?: Date | number | bigint,
    addSuffix: boolean = true
): string {
    try {
        const endDate = typeof date === 'bigint'
            ? new Date(Number(date) * 1000)
            : typeof date === 'number'
                ? new Date(date * 1000)
                : date;

        if (!baseDate) {
            return formatDistanceToNow(endDate, { addSuffix });
        }

        const startDate = typeof baseDate === 'bigint'
            ? new Date(Number(baseDate) * 1000)
            : typeof baseDate === 'number'
                ? new Date(baseDate * 1000)
                : baseDate;

        return formatDistance(startDate, endDate, { addSuffix });
    } catch (error) {
        return 'Invalid duration';
    }
}
