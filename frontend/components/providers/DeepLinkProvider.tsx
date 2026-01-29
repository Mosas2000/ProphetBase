'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/**
 * High-level provider for handling app deep links and routing logic
 */
export default function DeepLinkProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Handle Protocol-based Deep Links (if registered)
    const handleProtocolLaunch = (event: MessageEvent) => {
      if (event.data?.type === 'DEEP_LINK') {
        const url = new URL(event.data.url);
        handleDeepLink(url);
      }
    };

    window.addEventListener('message', handleProtocolLaunch);

    // 2. Handle URL-based actions (e.g., from social shares with specific query params)
    const action = searchParams.get('action');
    const target = searchParams.get('target');

    if (action === 'view_market' && target) {
      router.push(`/markets/${target}`);
    } else if (action === 'share_profile' && target) {
      router.push(`/profile/${target}`);
    }

    return () => window.removeEventListener('message', handleProtocolLaunch);
  }, [searchParams, router]);

  const handleDeepLink = (url: URL) => {
    // Custom logic to route internal paths
    // Example: prophetbase://markets/123 -> /markets/123
    const path = url.pathname;
    if (path) {
      router.push(path);
    }
  };

  return <>{children}</>;
}

/**
 * Hook to generate deep links for sharing
 */
export function useDeepLinks() {
  const generateLink = (type: 'market' | 'profile', id: string) => {
    const baseUrl = window.location.origin;
    const protocol = 'prophetbase://';
    
    return {
      web: `${baseUrl}/${type === 'market' ? 'markets' : 'profile'}/${id}`,
      app: `${protocol}${type === 'market' ? 'markets' : 'profile'}/${id}`,
      universal: `${baseUrl}?action=view_${type}&target=${id}`
    };
  };

  return { generateLink };
}
