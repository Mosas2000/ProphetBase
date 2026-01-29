/**
 * StreakService - Gamification: streak tracking and daily rewards
 * Features:
 * - Track user activity streaks (login, trading)
 * - Award daily rewards for consecutive activity
 * - Reset streak on inactivity
 */

export type StreakInfo = {
  currentStreak: number;
  lastActive: number;
  lastReward: number;
};

const STREAK_KEY = 'user_streak';
const REWARD_XP = 25;

export class StreakService {
  static getStreak(): StreakInfo {
    try {
      return JSON.parse(localStorage.getItem(STREAK_KEY) || '{}');
    } catch {
      return { currentStreak: 0, lastActive: 0, lastReward: 0 };
    }
  }

  static updateStreak(): StreakInfo {
    const now = Date.now();
    const streak = StreakService.getStreak();
    const lastActiveDay = streak.lastActive ? new Date(streak.lastActive).toDateString() : '';
    const today = new Date(now).toDateString();
    let currentStreak = streak.currentStreak || 0;
    if (lastActiveDay === today) {
      // Already active today
      streak.lastActive = now;
    } else if (lastActiveDay && new Date(now - 86400000).toDateString() === lastActiveDay) {
      // Consecutive day
      currentStreak += 1;
      streak.lastActive = now;
    } else {
      // Missed a day
      currentStreak = 1;
      streak.lastActive = now;
    }
    const updated = { ...streak, currentStreak };
    localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
    return updated;
  }

  static awardDailyReward(): boolean {
    const streak = StreakService.getStreak();
    const now = Date.now();
    const today = new Date(now).toDateString();
    const lastRewardDay = streak.lastReward ? new Date(streak.lastReward).toDateString() : '';
    if (lastRewardDay === today) return false; // Already rewarded today
    streak.lastReward = now;
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    // Integrate with AchievementService to add XP
    // AchievementService.addXP(REWARD_XP);
    return true;
  }
}
