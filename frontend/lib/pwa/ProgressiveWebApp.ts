export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation: 'any' | 'portrait' | 'landscape';
  scope: string;
  startUrl: string;
}

export interface CacheStrategy {
  cacheName: string;
  urls: string[];
  strategy: 'cache-first' | 'network-first' | 'cache-only' | 'network-only' | 'stale-while-revalidate';
}

export class ProgressiveWebAppService {
  private registration: ServiceWorkerRegistration | null = null;
  private cacheStrategies: CacheStrategy[] = [];
  private syncQueue: Array<{ action: string; data: any }> = [];

  async registerServiceWorker(scriptUrl: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('Service Workers not supported');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register(scriptUrl, {
        scope: '/',
      });

      console.log('Service Worker registered successfully');

      this.registration.addEventListener('updatefound', () => {
        this.handleUpdate();
      });

      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  private handleUpdate(): void {
    if (!this.registration || !this.registration.installing) return;

    const newWorker = this.registration.installing;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        this.notifyUpdate();
      }
    });
  }

  private notifyUpdate(): void {
    if (confirm('New version available! Update now?')) {
      window.location.reload();
    }
  }

  async enableOfflineSupport(): Promise<void> {
    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    const criticalUrls = [
      '/',
      '/offline.html',
      '/manifest.json',
      '/app.css',
      '/app.js',
    ];

    await this.cacheUrls(criticalUrls, 'critical-assets');
  }

  async cacheUrls(urls: string[], cacheName: string): Promise<void> {
    if (typeof caches === 'undefined') return;

    const cache = await caches.open(cacheName);
    await cache.addAll(urls);
  }

  configureCacheStrategy(strategy: CacheStrategy): void {
    this.cacheStrategies.push(strategy);
  }

  async requestPushPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      });

      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  async sendPushNotification(
    subscription: PushSubscription,
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.showNotification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        data,
        vibrate: [200, 100, 200],
        tag: 'notification-' + Date.now(),
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  async checkInstallPrompt(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    return new Promise((resolve) => {
      const handler = (e: Event) => {
        e.preventDefault();
        (window as any).deferredPrompt = e;
        resolve(true);
      };

      window.addEventListener('beforeinstallprompt', handler);

      setTimeout(() => {
        window.removeEventListener('beforeinstallprompt', handler);
        resolve(false);
      }, 1000);
    });
  }

  async showInstallPrompt(): Promise<boolean> {
    const deferredPrompt = (window as any).deferredPrompt;

    if (!deferredPrompt) {
      return false;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    (window as any).deferredPrompt = null;

    return outcome === 'accepted';
  }

  queueBackgroundSync(action: string, data: any): void {
    this.syncQueue.push({ action, data });

    if (this.registration && 'sync' in this.registration) {
      this.registration.sync.register('background-sync').catch((error) => {
        console.error('Background sync registration failed:', error);
      });
    }
  }

  async processSync Queue(): Promise<void> {
    const queue = [...this.syncQueue];
    this.syncQueue = [];

    for (const item of queue) {
      try {
        await this.processSyncItem(item);
      } catch (error) {
        this.syncQueue.push(item);
      }
    }
  }

  private async processSyncItem(item: { action: string; data: any }): Promise<void> {
  }

  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  listenToNetworkStatus(callback: (isOnline: boolean) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const onlineHandler = () => callback(true);
    const offlineHandler = () => callback(false);

    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);

    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }

  async clearCache(cacheName?: string): Promise<void> {
    if (typeof caches === 'undefined') return;

    if (cacheName) {
      await caches.delete(cacheName);
    } else {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }
  }

  async getCacheSize(): Promise<{ quota: number; usage: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota || 0,
        usage: estimate.usage || 0,
      };
    }

    return { quota: 0, usage: 0 };
  }

  generateManifest(config: PWAConfig): Record<string, any> {
    return {
      name: config.name,
      short_name: config.shortName,
      description: config.description,
      theme_color: config.themeColor,
      background_color: config.backgroundColor,
      display: config.display,
      orientation: config.orientation,
      scope: config.scope,
      start_url: config.startUrl,
      icons: [
        { src: '/icon-72.png', sizes: '72x72', type: 'image/png' },
        { src: '/icon-96.png', sizes: '96x96', type: 'image/png' },
        { src: '/icon-128.png', sizes: '128x128', type: 'image/png' },
        { src: '/icon-144.png', sizes: '144x144', type: 'image/png' },
        { src: '/icon-152.png', sizes: '152x152', type: 'image/png' },
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-384.png', sizes: '384x384', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    };
  }
}
