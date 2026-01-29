/**
 * Metadata utilities for OpenGraph and Social Sharing
 */

export interface MarketMetadata {
  title: string;
  description: string;
  image?: string;
  marketId: string;
}

export function generateMarketMetadata(market: MarketMetadata) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://prophetbase.app';
  const shareUrl = `${baseUrl}/markets/${market.marketId}`;
  const imageUrl = market.image || `${baseUrl}/api/og?id=${market.marketId}`;

  return {
    title: market.title,
    description: market.description,
    openGraph: {
      title: market.title,
      description: market.description,
      url: shareUrl,
      siteName: 'ProphetBase',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: market.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: market.title,
      description: market.description,
      images: [imageUrl],
      creator: '@prophetbase',
    },
  };
}

/**
 * Helper to build the OG Image URL for a specific market
 */
export function getMarketOGImageUrl(marketId: string, options: { theme?: 'dark' | 'light', price?: string } = {}) {
  const params = new URLSearchParams({ id: marketId });
  if (options.theme) params.append('theme', options.theme);
  if (options.price) params.append('price', options.price);
  
  return `/api/og/market?${params.toString()}`;
}
