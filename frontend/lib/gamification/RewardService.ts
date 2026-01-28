/**
 * RewardService - Gamification: in-app rewards and virtual currency
 * Features:
 * - Manage virtual currency balances
 * - Earn/spend logic
 * - Distribute rewards for achievements, streaks, referrals, quests
 */

export type RewardBalance = {
  coins: number;
};

const REWARD_KEY = 'user_rewards';

export class RewardService {
  static getBalance(): RewardBalance {
    try {
      return JSON.parse(localStorage.getItem(REWARD_KEY) || '{"coins":0}');
    } catch {
      return { coins: 0 };
    }
  }

  static earn(amount: number) {
    const balance = RewardService.getBalance();
    balance.coins += amount;
    localStorage.setItem(REWARD_KEY, JSON.stringify(balance));
  }

  static spend(amount: number): boolean {
    const balance = RewardService.getBalance();
    if (balance.coins >= amount) {
      balance.coins -= amount;
      localStorage.setItem(REWARD_KEY, JSON.stringify(balance));
      return true;
    }
    return false;
  }

  static reset() {
    localStorage.setItem(REWARD_KEY, JSON.stringify({ coins: 0 }));
  }
}
