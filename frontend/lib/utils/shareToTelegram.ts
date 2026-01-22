/**
 * Opens Telegram share dialog with pre-filled text and URL
 * @param text - Text to share
 * @param url - URL to share
 */
export function shareToTelegram(text: string, url: string): void {
    const params = new URLSearchParams({
        url,
        text,
    });

    const shareUrl = `https://t.me/share/url?${params.toString()}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
}
