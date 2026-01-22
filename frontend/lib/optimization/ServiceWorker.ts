/**
 * Service Worker for Advanced Caching and Offline Functionality
 * Implements caching strategies and background sync
 */

const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  static: `static-${CACHE_VERSION}`,
  dynamic: `dynamic-${CACHE_VERSION}`,
  images: `images-${CACHE_VERSION}`,
  api: `api-${CACHE_VERSION}`,
};

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
];

// Install event - cache static assets
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAMES.static).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  (self as any).skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !Object.values(CACHE_NAMES).includes(name))
          .map((name) => caches.delete(name))
      );
    })
  );
  (self as any).clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event: any) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests - Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, CACHE_NAMES.api));
    return;
  }

  // Images - Cache first, network fallback
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAMES.images));
    return;
  }

  // Static assets - Cache first
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAMES.static));
    return;
  }

  // Everything else - Stale while revalidate
  event.respondWith(staleWhileRevalidate(request, CACHE_NAMES.dynamic));
});

// Background sync for failed requests
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-trades') {
    event.waitUntil(syncTrades());
  }
});

// Push notifications
self.addEventListener('push', (event: any) => {
  const data = event.data?.json() || {};
  const options = {
    body: data.body || 'New update available',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    data: data.url,
  };

  event.waitUntil(
    (self as any).registration.showNotification(data.title || 'ProphetBase', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event: any) => {
  event.notification.close();
  event.waitUntil(
    (self as any).clients.openWindow(event.notification.data || '/')
  );
});

// Caching Strategies

async function networkFirstStrategy(request: Request, cacheName: string): Promise<Response> {
  try {
    const response = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirstStrategy(request: Request, cacheName: string): Promise<Response> {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  const cache = await caches.open(cacheName);
  cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request: Request, cacheName: string): Promise<Response> {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request).then((response) => {
    const cache = caches.open(cacheName);
    cache.then((c) => c.put(request, response.clone()));
    return response;
  });

  return cached || fetchPromise;
}

async function syncTrades(): Promise<void> {
  // Implement background sync for pending trades
  const pendingTrades = await getPendingTrades();
  
  for (const trade of pendingTrades) {
    try {
      await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trade),
      });
      await removePendingTrade(trade.id);
    } catch (error) {
      console.error('Failed to sync trade:', error);
    }
  }
}

async function getPendingTrades(): Promise<any[]> {
  // Get pending trades from IndexedDB
  return [];
}

async function removePendingTrade(id: string): Promise<void> {
  // Remove synced trade from IndexedDB
}

export { };

