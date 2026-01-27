export interface CorrelationBreakdown {
  asset1: string;
  asset2: string;
  historicalCorrelation: number;
  currentCorrelation: number;
  breakdownDetected: boolean;
  severity: 'low' | 'medium' | 'high';
}

export class CorrelationRiskMonitor {
  private readonly BREAKDOWN_THRESHOLD = 0.3;

  calculateRollingCorrelation(
    returns1: number[],
    returns2: number[],
    window: number
  ): number[] {
    const correlations: number[] = [];

    for (let i = window; i <= returns1.length; i++) {
      const slice1 = returns1.slice(i - window, i);
      const slice2 = returns2.slice(i - window, i);
      correlations.push(this.calculateCorrelation(slice1, slice2));
    }

    return correlations;
  }

  calculateCorrelation(returns1: number[], returns2: number[]): number {
    const n = returns1.length;
    const mean1 = returns1.reduce((a, b) => a + b, 0) / n;
    const mean2 = returns2.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let sum1Sq = 0;
    let sum2Sq = 0;

    for (let i = 0; i < n; i++) {
      const diff1 = returns1[i] - mean1;
      const diff2 = returns2[i] - mean2;
      numerator += diff1 * diff2;
      sum1Sq += diff1 * diff1;
      sum2Sq += diff2 * diff2;
    }

    const denominator = Math.sqrt(sum1Sq * sum2Sq);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  detectBreakdowns(
    assetPairs: Array<{
      asset1: string;
      asset2: string;
      returns1: number[];
      returns2: number[];
    }>,
    historicalWindow: number = 60,
    recentWindow: number = 20
  ): CorrelationBreakdown[] {
    return assetPairs.map((pair) => {
      const historicalCorrelation = this.calculateCorrelation(
        pair.returns1.slice(0, historicalWindow),
        pair.returns2.slice(0, historicalWindow)
      );

      const currentCorrelation = this.calculateCorrelation(
        pair.returns1.slice(-recentWindow),
        pair.returns2.slice(-recentWindow)
      );

      const change = Math.abs(historicalCorrelation - currentCorrelation);
      const breakdownDetected = change > this.BREAKDOWN_THRESHOLD;

      let severity: 'low' | 'medium' | 'high' = 'low';
      if (change > 0.5) severity = 'high';
      else if (change > 0.3) severity = 'medium';

      return {
        asset1: pair.asset1,
        asset2: pair.asset2,
        historicalCorrelation,
        currentCorrelation,
        breakdownDetected,
        severity,
      };
    });
  }

  trackCorrelationEvolution(
    returns1: number[],
    returns2: number[],
    window: number = 30
  ): Array<{ period: number; correlation: number }> {
    const correlations = this.calculateRollingCorrelation(returns1, returns2, window);
    
    return correlations.map((corr, index) => ({
      period: index,
      correlation: corr,
    }));
  }

  identifyRegimeChange(
    correlationHistory: number[],
    threshold: number = 0.4
  ): boolean {
    if (correlationHistory.length < 2) return false;

    const recent = correlationHistory.slice(-10);
    const previous = correlationHistory.slice(-30, -10);

    if (recent.length === 0 || previous.length === 0) return false;

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;

    return Math.abs(recentAvg - previousAvg) > threshold;
  }
}
