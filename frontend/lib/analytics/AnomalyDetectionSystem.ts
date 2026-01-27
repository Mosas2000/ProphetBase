export interface Anomaly {
  type: 'price_spike' | 'volume_surge' | 'unusual_pattern' | 'correlation_break';
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
  description: string;
  metrics: Record<string, number>;
}

export class AnomalyDetectionSystem {
  private readonly Z_SCORE_THRESHOLD = 3;

  detectAnomalies(
    symbol: string,
    prices: number[],
    volumes: number[],
    historicalWindow: number = 100
  ): Anomaly[] {
    const anomalies: Anomaly[] = [];

    anomalies.push(...this.detectPriceSpikes(prices, historicalWindow));
    anomalies.push(...this.detectVolumeSurges(volumes, historicalWindow));
    anomalies.push(...this.detectUnusualPatterns(prices));

    return anomalies.sort((a, b) => b.timestamp - a.timestamp);
  }

  private detectPriceSpikes(prices: number[], window: number): Anomaly[] {
    const anomalies: Anomaly[] = [];
    
    for (let i = window; i < prices.length; i++) {
      const historicalPrices = prices.slice(i - window, i);
      const mean = historicalPrices.reduce((a, b) => a + b, 0) / window;
      const stdDev = Math.sqrt(
        historicalPrices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / window
      );

      const zScore = Math.abs((prices[i] - mean) / stdDev);
      
      if (zScore > this.Z_SCORE_THRESHOLD) {
        anomalies.push({
          type: 'price_spike',
          severity: zScore > 5 ? 'high' : 'medium',
          timestamp: i,
          description: `Price deviation ${zScore.toFixed(2)} standard deviations from mean`,
          metrics: { zScore, price: prices[i], mean, stdDev },
        });
      }
    }

    return anomalies;
  }

  private detectVolumeSurges(volumes: number[], window: number): Anomaly[] {
    const anomalies: Anomaly[] = [];
    
    for (let i = window; i < volumes.length; i++) {
      const avgVolume = volumes.slice(i - window, i).reduce((a, b) => a + b, 0) / window;
      const ratio = volumes[i] / avgVolume;

      if (ratio > 3) {
        anomalies.push({
          type: 'volume_surge',
          severity: ratio > 5 ? 'high' : 'medium',
          timestamp: i,
          description: `Volume ${ratio.toFixed(1)}x higher than average`,
          metrics: { ratio, volume: volumes[i], avgVolume },
        });
      }
    }

    return anomalies;
  }

  private detectUnusualPatterns(prices: number[]): Anomaly[] {
    return [];
  }

  classifyAnomaly(anomaly: Anomaly): {
    category: string;
    action: 'monitor' | 'alert' | 'investigate';
    priority: number;
  } {
    const severityMap = { low: 1, medium: 2, high: 3 };
    const priority = severityMap[anomaly.severity];

    let action: 'monitor' | 'alert' | 'investigate' = 'monitor';
    if (anomaly.severity === 'high') action = 'investigate';
    else if (anomaly.severity === 'medium') action = 'alert';

    return {
      category: anomaly.type,
      action,
      priority,
    };
  }

  generateAlert(anomaly: Anomaly): string {
    return `[${anomaly.severity.toUpperCase()}] ${anomaly.description}`;
  }
}
