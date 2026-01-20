/**
 * Opens Twitter share dialog with pre-filled text and URL
 * @param text - Text to share
 * @param url - URL to share
 * @param hashtags - Optional hashtags (comma-separated)
 */
export function shareToTwitter(
    text: string,
    url: string,
    hashtags?: string
): void {
    const params = new URLSearchParams({
        text,
        url,
        ...(hashtags && { hashtags }),
    });

    const shareUrl = `https://twitter.com/intent/tweet?${params.toString()}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
}
