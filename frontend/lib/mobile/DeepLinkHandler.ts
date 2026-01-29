/**
 * DeepLinkHandler - Utility for mobile deep linking and universal link handling
 * Features:
 * - Parse app-specific deep links (e.g., prophetbase://market/123)
 * - Handle universal links (https://prophetbase.xyz/market/123)
 * - Route to market, portfolio, onboarding, etc.
 */

export type DeepLinkTarget =
  | { type: 'market'; marketId: string }
  | { type: 'portfolio' }
  | { type: 'onboarding' }
  | { type: 'unknown' };

export class DeepLinkHandler {
  static parse(url: string): DeepLinkTarget {
    try {
      const u = new URL(url);
      // App scheme: prophetbase://market/123
      if (u.protocol.startsWith('prophetbase')) {
        if (u.pathname.startsWith('/market/')) {
          const marketId = u.pathname.split('/')[2];
          return { type: 'market', marketId };
        }
        if (u.pathname === '/portfolio') return { type: 'portfolio' };
        if (u.pathname === '/onboarding') return { type: 'onboarding' };
      }
      // Universal link: https://prophetbase.xyz/market/123
      if (u.hostname.endsWith('prophetbase.xyz')) {
        if (u.pathname.startsWith('/market/')) {
          const marketId = u.pathname.split('/')[2];
          return { type: 'market', marketId };
        }
        if (u.pathname === '/portfolio') return { type: 'portfolio' };
        if (u.pathname === '/onboarding') return { type: 'onboarding' };
      }
      return { type: 'unknown' };
    } catch {
      return { type: 'unknown' };
    }
  }

  static handle(url: string, router: { push: (path: string) => void }) {
    const target = DeepLinkHandler.parse(url);
    switch (target.type) {
      case 'market':
        router.push(`/market/${target.marketId}`);
        break;
      case 'portfolio':
        router.push('/portfolio');
        break;
      case 'onboarding':
        router.push('/onboarding');
        break;
      default:
        // Optionally show error or fallback
        break;
    }
  }
}
