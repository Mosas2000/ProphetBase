// Service Worker for ProphetBase PWA
const CACHE_NAME = 'prophetbase-v1.1';
const STATIC_CACHE = 'prophetbase-static-v1';
const DATA_CACHE = 'prophetbase-data-v1';

const URLS_TO_CACHE = [
  '/',
  '/markets',
  '/portfolio',
  '/leaderboard',
  '/globals.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/offline.html'
];

// Helper for structured logging
const logger = {
  info: (msg, ...args) => console.log(`%c[SW] ${msg}`, 'color: #3b82f6', ...args),
  warn: (msg, ...args) => console.warn(`%c[SW] ${msg}`, 'color: #f59e0b', ...args),
  error: (msg, ...args) => console.error(`%c[SW] ${msg}`, 'color: #ef4444', ...args),
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  logger.info('Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      logger.info('Pre-caching static assets');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  logger.info('Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![STATIC_CACHE, DATA_CACHE].includes(cacheName)) {
            logger.info('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event with strategy-based routing
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests unless they are assets we explicitly want to cache
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // API Requests: Network First, Fallback to Cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static Assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
        }
        return networkResponse;
      });

      return cachedResponse || networkFetch;
    }).catch(() => {
      // Offline fallback for navigation requests
      if (request.mode === 'navigate') {
        return caches.match('/offline.html');
      }
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-trades') {
    logger.info('Detected online! Syncing pending trades...');
    event.waitUntil(syncTrades());
  }
});

async function syncTrades() {
  try {
    const db = await openDB();
    const trades = await db.getAll('pendingTrades');
    
    if (trades.length === 0) return;

    for (const trade of trades) {
      try {
        const response = await fetch('/api/trades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trade)
        });
        
        if (response.ok) {
          await db.delete('pendingTrades', trade.id);
          logger.info(`Successfully synced trade: ${trade.id}`);
        }
      } catch (error) {
        logger.error(`Failed to sync trade ${trade.id}:`, error);
      }
    }
  } catch (error) {
    logger.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data?.json() ?? {};
  } catch (e) {
    data = { title: 'ProphetBase', body: event.data?.text() };
  }

  const title = data.title || 'ProphetBase Notification';
  const options = {
    body: data.body || 'You have a new update.',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'view', title: 'View Details' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const url = event.notification.data.url;
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Database Helper
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('prophetbase-pwa-db', 2);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingTrades')) {
        db.createObjectStore('pendingTrades', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}
