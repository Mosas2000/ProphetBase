/**
 * LeaderboardService - Gamification: leaderboard and ranking system
 * Features:
 * - Calculate user rankings based on XP, streaks, achievements
 * - Return sorted leaderboard data
 */

export type LeaderboardEntry = {
  userId: string;
  username: string;
  xp: number;
  streak: number;
  level: number;
  badges: string[];
};

export class LeaderboardService {
  static getLeaderboard(users: LeaderboardEntry[]): LeaderboardEntry[] {
    // Sort by XP, then streak, then level
    return [...users].sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp;
      if (b.streak !== a.streak) return b.streak - a.streak;
      if (b.level !== a.level) return b.level - a.level;
      return a.username.localeCompare(b.username);
    });
  }

  static getUserRank(users: LeaderboardEntry[], userId: string): number {
    const leaderboard = LeaderboardService.getLeaderboard(users);
    return leaderboard.findIndex((u) => u.userId === userId) + 1;
  }
}
