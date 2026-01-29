/**
 * ReferralService - Gamification: referral tracking and rewards
 * Features:
 * - Generate and manage referral codes
 * - Track referred users
 * - Award referral bonuses
 */

export type ReferralInfo = {
  code: string;
  referredUsers: string[];
  bonusAwarded: boolean;
};

const REFERRAL_KEY = 'user_referral';

export class ReferralService {
  static generateCode(userId: string): string {
    // Simple code: userId + random
    return `${userId}-${Math.random().toString(36).slice(2, 8)}`;
  }

  static saveReferralInfo(info: ReferralInfo) {
    localStorage.setItem(REFERRAL_KEY, JSON.stringify(info));
  }

  static getReferralInfo(): ReferralInfo | null {
    try {
      return JSON.parse(localStorage.getItem(REFERRAL_KEY) || 'null');
    } catch {
      return null;
    }
  }

  static addReferredUser(userId: string) {
    const info = ReferralService.getReferralInfo() || {
      code: '',
      referredUsers: [],
      bonusAwarded: false,
    };
    if (!info.referredUsers.includes(userId)) {
      info.referredUsers.push(userId);
      ReferralService.saveReferralInfo(info);
    }
  }

  static awardBonus() {
    const info = ReferralService.getReferralInfo();
    if (info && !info.bonusAwarded && info.referredUsers.length > 0) {
      info.bonusAwarded = true;
      ReferralService.saveReferralInfo(info);
      // Integrate with AchievementService to add XP or rewards
      // AchievementService.addXP(100);
      return true;
    }
    return false;
  }
}
