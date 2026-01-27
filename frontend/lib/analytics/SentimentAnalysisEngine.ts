export interface SentimentScore {
  symbol: string;
  overall: number;
  news: number;
  social: number;
  onchain: number;
  timestamp: number;
  signals: Array<{ source: string; sentiment: number; weight: number }>;
}

export class SentimentAnalysisEngine {
  private readonly sources = [
    'news',
    'twitter',
    'reddit',
    'telegram',
    'onchain',
  ];

  async analyzeSentiment(symbol: string): Promise<SentimentScore> {
    const signals = await this.collectSignals(symbol);

    const weighted = this.calculateWeightedSentiment(signals);

    return {
      symbol,
      overall: weighted.overall,
      news: weighted.news,
      social: weighted.social,
      onchain: weighted.onchain,
      timestamp: Date.now(),
      signals,
    };
  }

  private async collectSignals(
    symbol: string
  ): Promise<Array<{ source: string; sentiment: number; weight: number }>> {
    return this.sources.map((source) => ({
      source,
      sentiment: -1 + Math.random() * 2,
      weight: Math.random() * 0.5 + 0.5,
    }));
  }

  private calculateWeightedSentiment(
    signals: Array<{ source: string; sentiment: number; weight: number }>
  ): { overall: number; news: number; social: number; onchain: number } {
    const totalWeight = signals.reduce((sum, s) => sum + s.weight, 0);
    const overall =
      signals.reduce((sum, s) => sum + s.sentiment * s.weight, 0) / totalWeight;

    return {
      overall,
      news: signals.find((s) => s.source === 'news')?.sentiment || 0,
      social:
        signals
          .filter((s) => ['twitter', 'reddit', 'telegram'].includes(s.source))
          .reduce((sum, s) => sum + s.sentiment, 0) / 3,
      onchain: signals.find((s) => s.source === 'onchain')?.sentiment || 0,
    };
  }

  generateTradeSignals(score: SentimentScore): Array<{
    type: 'buy' | 'sell' | 'neutral';
    strength: number;
    reason: string;
  }> {
    const signals: Array<{
      type: 'buy' | 'sell' | 'neutral';
      strength: number;
      reason: string;
    }> = [];

    if (score.overall > 0.5) {
      signals.push({
        type: 'buy',
        strength: score.overall,
        reason: 'Strong positive sentiment across sources',
      });
    } else if (score.overall < -0.5) {
      signals.push({
        type: 'sell',
        strength: Math.abs(score.overall),
        reason: 'Strong negative sentiment detected',
      });
    }

    return signals;
  }

  trackSentimentTrend(
    historical: SentimentScore[]
  ): 'improving' | 'declining' | 'stable' {
    if (historical.length < 2) return 'stable';

    const recent = historical.slice(-5);
    const trend = recent[recent.length - 1].overall - recent[0].overall;

    if (trend > 0.2) return 'improving';
    if (trend < -0.2) return 'declining';
    return 'stable';
  }
}
