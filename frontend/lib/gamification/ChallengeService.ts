/**
 * ChallengeService - Gamification: challenge system and quests
 * Features:
 * - Define challenges/quests (e.g., trade X times, win Y markets)
 * - Track user progress
 * - Award quest rewards
 */

export type Challenge = {
  id: string;
  title: string;
  description: string;
  goal: number;
  progress: number;
  completed: boolean;
  rewardXP: number;
};

const CHALLENGES: Challenge[] = [
  {
    id: 'trade_5',
    title: 'Trade 5 Times',
    description: 'Complete 5 trades in any market.',
    goal: 5,
    progress: 0,
    completed: false,
    rewardXP: 50,
  },
  {
    id: 'win_3',
    title: 'Win 3 Markets',
    description: 'Win 3 prediction markets.',
    goal: 3,
    progress: 0,
    completed: false,
    rewardXP: 100,
  },
  // Add more challenges as needed
];

const CHALLENGE_KEY = 'user_challenges';

export class ChallengeService {
  static getChallenges(): Challenge[] {
    try {
      const saved = JSON.parse(localStorage.getItem(CHALLENGE_KEY) || 'null');
      if (saved) return saved;
    } catch {}
    return CHALLENGES.map(c => ({ ...c }));
  }

  static updateProgress(id: string, amount: number = 1) {
    const challenges = ChallengeService.getChallenges();
    const idx = challenges.findIndex(c => c.id === id);
    if (idx !== -1 && !challenges[idx].completed) {
      challenges[idx].progress += amount;
      if (challenges[idx].progress >= challenges[idx].goal) {
        challenges[idx].completed = true;
        // Integrate with AchievementService to add XP
        // AchievementService.addXP(challenges[idx].rewardXP);
      }
      localStorage.setItem(CHALLENGE_KEY, JSON.stringify(challenges));
    }
  }

  static resetChallenges() {
    localStorage.setItem(CHALLENGE_KEY, JSON.stringify(CHALLENGES.map(c => ({ ...c }))));
  }
}
