/**
 * Truncates text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 50)
 * @param ellipsis - Ellipsis string (default: '...')
 * @returns Truncated text
 */
export function truncateText(
    text: string,
    maxLength: number = 50,
    ellipsis: string = '...'
): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Truncates text to fit within word boundaries
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text at word boundary
 */
export function truncateWords(text: string, maxLength: number = 50): string {
    if (!text || text.length <= maxLength) return text;

    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
        return truncated.slice(0, lastSpace) + '...';
    }

    return truncated + '...';
}
