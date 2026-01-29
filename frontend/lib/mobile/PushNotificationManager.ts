/**
 * PushNotificationManager - Utility for mobile push notification opt-in and management
 * Features:
 * - Request notification permission
 * - Subscribe/unsubscribe user to push
 * - Manage notification preferences (localStorage)
 */

export type NotificationPermissionStatus = 'default' | 'granted' | 'denied';

export class PushNotificationManager {
  static async requestPermission(): Promise<NotificationPermissionStatus> {
    if (!('Notification' in window)) return 'denied';
    const result = await Notification.requestPermission();
    return result;
  }

  static async subscribeUser(): Promise<PushSubscription | null> {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported in this browser');
        return null;
      }
      
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) return sub;
      
      // Replace with your VAPID public key
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        console.error('VAPID public key not set in environment variables');
        throw new Error('VAPID public key not set');
      }
      
      return reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  static async unsubscribeUser(): Promise<boolean> {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported in this browser');
        return false;
      }
      
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  static getPreferences(): Record<string, boolean> {
    try {
      const stored = localStorage.getItem('push_prefs');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse push preferences:', error);
      return {};
    }
  }

  static setPreference(key: string, value: boolean) {
    try {
      const prefs = PushNotificationManager.getPreferences();
      prefs[key] = value;
      localStorage.setItem('push_prefs', JSON.stringify(prefs));
    } catch (error) {
      console.error('Failed to save push preference:', error);
    }
  }
}

// Helper: Convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
