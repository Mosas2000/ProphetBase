export interface CorrelationBreakdown {
  asset1: string;
  asset2: string;
  historicalCorrelation: number;
  currentCorrelation: number;
  breakdownMagnitude: number;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
}

export class CorrelationBreakdownMonitor {
  private readonly CORRELATION_WINDOW = 30;
  private readonly BREAKDOWN_THRESHOLD = 0.3;

  monitorCorrelations(
    assets: string[],
    priceData: Map<string, number[]>
  ): CorrelationBreakdown[] {
    const breakdowns: CorrelationBreakdown[] = [];

    for (let i = 0; i < assets.length; i++) {
      for (let j = i + 1; j < assets.length; j++) {
        const asset1 = assets[i];
        const asset2 = assets[j];

        const prices1 = priceData.get(asset1);
        const prices2 = priceData.get(asset2);

        if (!prices1 || !prices2) continue;

        const historicalCorr = this.calculateCorrelation(
          prices1.slice(0, -this.CORRELATION_WINDOW),
          prices2.slice(0, -this.CORRELATION_WINDOW)
        );

        const currentCorr = this.calculateCorrelation(
          prices1.slice(-this.CORRELATION_WINDOW),
          prices2.slice(-this.CORRELATION_WINDOW)
        );

        const breakdownMagnitude = Math.abs(historicalCorr - currentCorr);

        if (breakdownMagnitude > this.BREAKDOWN_THRESHOLD) {
          breakdowns.push({
            asset1,
            asset2,
            historicalCorrelation: historicalCorr,
            currentCorrelation: currentCorr,
            breakdownMagnitude,
            timestamp: Date.now(),
            severity: this.classifySeverity(breakdownMagnitude),
          });
        }
      }
    }

    return breakdowns.sort((a, b) => b.breakdownMagnitude - a.breakdownMagnitude);
  }

  private calculateCorrelation(data1: number[], data2: number[]): number {
    if (data1.length !== data2.length || data1.length < 2) return 0;

    const mean1 = data1.reduce((a, b) => a + b, 0) / data1.length;
    const mean2 = data2.reduce((a, b) => a + b, 0) / data2.length;

    let numerator = 0;
    let sumSq1 = 0;
    let sumSq2 = 0;

    for (let i = 0; i < data1.length; i++) {
      const diff1 = data1[i] - mean1;
      const diff2 = data2[i] - mean2;
      numerator += diff1 * diff2;
      sumSq1 += diff1 * diff1;
      sumSq2 += diff2 * diff2;
    }

    const denominator = Math.sqrt(sumSq1 * sumSq2);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private classifySeverity(magnitude: number): 'low' | 'medium' | 'high' {
    if (magnitude > 0.6) return 'high';
    if (magnitude > 0.4) return 'medium';
    return 'low';
  }

  generateAlert(breakdown: CorrelationBreakdown): {
    message: string;
    action: string;
    priority: number;
  } {
    const direction = breakdown.currentCorrelation > breakdown.historicalCorrelation 
      ? 'increased' 
      : 'decreased';

    return {
      message: `Correlation between ${breakdown.asset1} and ${breakdown.asset2} has ${direction} from ${breakdown.historicalCorrelation.toFixed(2)} to ${breakdown.currentCorrelation.toFixed(2)}`,
      action: 'Review portfolio diversification and hedging strategies',
      priority: breakdown.severity === 'high' ? 3 : breakdown.severity === 'medium' ? 2 : 1,
    };
  }

  calculateRollingCorrelation(
    prices1: number[],
    prices2: number[],
    windowSize: number = 30
  ): number[] {
    const correlations: number[] = [];

    for (let i = windowSize; i <= prices1.length; i++) {
      const window1 = prices1.slice(i - windowSize, i);
      const window2 = prices2.slice(i - windowSize, i);
      correlations.push(this.calculateCorrelation(window1, window2));
    }

    return correlations;
  }

  detectRegimeChange(correlations: number[]): boolean {
    if (correlations.length < 10) return false;

    const recent = correlations.slice(-5);
    const previous = correlations.slice(-10, -5);

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;

    return Math.abs(recentAvg - previousAvg) > this.BREAKDOWN_THRESHOLD;
  }
}
