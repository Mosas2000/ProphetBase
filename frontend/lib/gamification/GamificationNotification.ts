/**
 * GamificationNotification - Mobile notifications for achievements, streaks, rewards
 * Features:
 * - Send local notifications for achievements, streaks, rewards
 * - Integrate with PushNotificationManager for push notifications
 */

import { PushNotificationManager } from '../mobile';

export class GamificationNotification {
  static async notifyLocal(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }

  static async notifyPush(title: string, body: string) {
    // Integrate with PushNotificationManager (assumes subscription exists)
    // This is a placeholder for actual push logic
    await PushNotificationManager.requestPermission();
    // In production, send push via backend
    // e.g., fetch('/api/sendPush', { method: 'POST', body: JSON.stringify({ title, body }) })
  }

  static async notifyAchievement(name: string) {
    await GamificationNotification.notifyLocal('Achievement Unlocked!', name);
    await GamificationNotification.notifyPush('Achievement Unlocked!', name);
  }

  static async notifyStreak(streak: number) {
    await GamificationNotification.notifyLocal('Streak Update', `You are on a ${streak}-day streak!`);
    await GamificationNotification.notifyPush('Streak Update', `You are on a ${streak}-day streak!`);
  }

  static async notifyReward(amount: number) {
    await GamificationNotification.notifyLocal('Reward Earned', `You earned ${amount} coins!`);
    await GamificationNotification.notifyPush('Reward Earned', `You earned ${amount} coins!`);
  }
}
