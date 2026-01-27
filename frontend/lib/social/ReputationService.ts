export interface ReputationScore {
  userId: string;
  totalScore: number;
  tradingScore: number;
  communityScore: number;
  verificationScore: number;
  badges: string[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface ReputationEvent {
  type: 'trade_win' | 'helpful_post' | 'verified_prediction' | 'community_contribution';
  points: number;
  timestamp: number;
}

export class ReputationService {
  private scores: Map<string, ReputationScore> = new Map();
  private history: Map<string, ReputationEvent[]> = new Map();

  private readonly POINT_VALUES = {
    trade_win: 10,
    helpful_post: 5,
    verified_prediction: 20,
    community_contribution: 15,
  };

  private readonly TIER_THRESHOLDS = {
    bronze: 0,
    silver: 100,
    gold: 500,
    platinum: 1000,
  };

  getScore(userId: string): ReputationScore {
    return (
      this.scores.get(userId) || {
        userId,
        totalScore: 0,
        tradingScore: 0,
        communityScore: 0,
        verificationScore: 0,
        badges: [],
        tier: 'bronze',
      }
    );
  }

  addReputationEvent(userId: string, eventType: ReputationEvent['type']): void {
    const points = this.POINT_VALUES[eventType];
    const event: ReputationEvent = {
      type: eventType,
      points,
      timestamp: Date.now(),
    };

    const events = this.history.get(userId) || [];
    events.push(event);
    this.history.set(userId, events);

    this.updateScore(userId, eventType, points);
  }

  private updateScore(
    userId: string,
    eventType: ReputationEvent['type'],
    points: number
  ): void {
    const score = this.getScore(userId);
    score.totalScore += points;

    if (eventType === 'trade_win' || eventType === 'verified_prediction') {
      score.tradingScore += points;
    } else {
      score.communityScore += points;
    }

    score.tier = this.calculateTier(score.totalScore);
    this.scores.set(userId, score);
  }

  private calculateTier(totalScore: number): ReputationScore['tier'] {
    if (totalScore >= this.TIER_THRESHOLDS.platinum) return 'platinum';
    if (totalScore >= this.TIER_THRESHOLDS.gold) return 'gold';
    if (totalScore >= this.TIER_THRESHOLDS.silver) return 'silver';
    return 'bronze';
  }

  getLeaderboard(limit: number = 10): ReputationScore[] {
    return Array.from(this.scores.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);
  }

  getReputationHistory(userId: string): ReputationEvent[] {
    return this.history.get(userId) || [];
  }
}
