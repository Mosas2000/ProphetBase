/**
 * AchievementService - Gamification: achievement badges and user levels
 * Features:
 * - Track user achievements (actions, milestones)
 * - Assign badges based on criteria
 * - Calculate user level from XP
 */

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
};

export type UserAchievements = {
  badges: Achievement[];
  xp: number;
  level: number;
};

const BADGES: Achievement[] = [
  {
    id: 'first_trade',
    name: 'First Trade',
    description: 'Completed your first trade',
    icon: '🎉',
    xp: 100,
  },
  {
    id: 'volume_1k',
    name: 'Volume 1K',
    description: 'Traded over $1,000',
    icon: '💰',
    xp: 200,
  },
  {
    id: 'markets_10',
    name: 'Market Explorer',
    description: 'Participated in 10 markets',
    icon: '🧭',
    xp: 300,
  },
  // Add more badges as needed
];

export class AchievementService {
  static getBadges(): Achievement[] {
    return BADGES;
  }

  static calculateLevel(xp: number): number {
    // Example: Level up every 500 XP
    return Math.floor(xp / 500) + 1;
  }

  static getUserAchievements(userStats: {
    trades: number;
    volume: number;
    markets: number;
  }): UserAchievements {
    const badges: Achievement[] = [];
    let xp = 0;
    const firstTradeBadge = BADGES.find((b) => b.id === 'first_trade');
    if (userStats.trades >= 1 && firstTradeBadge) {
      badges.push(firstTradeBadge);
      xp += firstTradeBadge.xp;
    }
    const volumeBadge = BADGES.find((b) => b.id === 'volume_1k');
    if (userStats.volume >= 1000 && volumeBadge) {
      badges.push(volumeBadge);
      xp += volumeBadge.xp;
    }
    const marketsBadge = BADGES.find((b) => b.id === 'markets_10');
    if (userStats.markets >= 10 && marketsBadge) {
      badges.push(marketsBadge);
      xp += marketsBadge.xp;
    }
    // Add more achievement checks as needed
    return {
      badges,
      xp,
      level: AchievementService.calculateLevel(xp),
    };
  }
}
