'use client';

/**
 * Utility for triggering the native OS Share Sheet
 */
export async function shareMarket(market: { title: string; id: string; url?: string }) {
  const shareData = {
    title: `Check out this market on ProphetBase!`,
    text: `Will this happen? ${market.title}`,
    url: market.url || `${window.location.origin}/markets/${market.id}`,
  };

  if (navigator.share && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return { success: false, error };
    }
  } else {
    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareData.url);
      return { success: true, method: 'clipboard' };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
