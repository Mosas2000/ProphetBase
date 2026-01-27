export interface MarketRegime {
  regime: 'bull' | 'bear' | 'ranging' | 'volatile' | 'quiet';
  confidence: number;
  startTime: number;
  characteristics: {
    trend: number;
    volatility: number;
    momentum: number;
  };
}

export interface RegimeTransition {
  fromRegime: string;
  toRegime: string;
  timestamp: number;
  probability: number;
}

export class MarketRegimeDetector {
  private readonly WINDOW_SIZE = 50;
  private regimeHistory: MarketRegime[] = [];

  detectRegime(prices: number[], volumes: number[]): MarketRegime {
    const trend = this.calculateTrend(prices);
    const volatility = this.calculateVolatility(prices);
    const momentum = this.calculateMomentum(prices);

    let regime: MarketRegime['regime'] = 'ranging';
    let confidence = 0;

    if (trend > 0.02 && momentum > 0) {
      regime = 'bull';
      confidence = Math.min(trend * 50, 0.95);
    } else if (trend < -0.02 && momentum < 0) {
      regime = 'bear';
      confidence = Math.min(Math.abs(trend) * 50, 0.95);
    } else if (volatility > 0.03) {
      regime = 'volatile';
      confidence = Math.min(volatility * 20, 0.9);
    } else if (volatility < 0.01) {
      regime = 'quiet';
      confidence = Math.min((0.01 - volatility) * 100, 0.85);
    } else {
      regime = 'ranging';
      confidence = 0.7;
    }

    const detectedRegime: MarketRegime = {
      regime,
      confidence,
      startTime: Date.now(),
      characteristics: { trend, volatility, momentum },
    };

    this.regimeHistory.push(detectedRegime);
    return detectedRegime;
  }

  private calculateTrend(prices: number[]): number {
    if (prices.length < 2) return 0;

    const recentPrices = prices.slice(-this.WINDOW_SIZE);
    const returns = recentPrices
      .slice(1)
      .map((p, i) => (p - recentPrices[i]) / recentPrices[i]);

    return returns.reduce((a, b) => a + b, 0) / returns.length;
  }

  private calculateVolatility(prices: number[]): number {
    const recentPrices = prices.slice(-this.WINDOW_SIZE);
    const returns = recentPrices
      .slice(1)
      .map((p, i) => (p - recentPrices[i]) / recentPrices[i]);
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;

    return Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
        returns.length
    );
  }

  private calculateMomentum(prices: number[]): number {
    if (prices.length < 20) return 0;

    const currentPrice = prices[prices.length - 1];
    const pastPrice = prices[prices.length - 20];

    return (currentPrice - pastPrice) / pastPrice;
  }

  predictRegimeTransition(currentRegime: MarketRegime): RegimeTransition[] {
    const transitionMatrix = {
      bull: {
        bull: 0.7,
        ranging: 0.2,
        volatile: 0.05,
        bear: 0.03,
        quiet: 0.02,
      },
      bear: {
        bear: 0.7,
        ranging: 0.15,
        volatile: 0.08,
        bull: 0.05,
        quiet: 0.02,
      },
      ranging: {
        ranging: 0.5,
        bull: 0.2,
        bear: 0.15,
        quiet: 0.1,
        volatile: 0.05,
      },
      volatile: {
        volatile: 0.4,
        ranging: 0.3,
        bull: 0.15,
        bear: 0.1,
        quiet: 0.05,
      },
      quiet: {
        quiet: 0.5,
        ranging: 0.25,
        bull: 0.1,
        bear: 0.1,
        volatile: 0.05,
      },
    };

    const probabilities = transitionMatrix[currentRegime.regime];
    const transitions: RegimeTransition[] = [];

    for (const [toRegime, probability] of Object.entries(probabilities)) {
      if (toRegime !== currentRegime.regime) {
        transitions.push({
          fromRegime: currentRegime.regime,
          toRegime,
          timestamp: Date.now(),
          probability,
        });
      }
    }

    return transitions.sort((a, b) => b.probability - a.probability);
  }

  getRegimeStatistics(): {
    regimeDistribution: Record<string, number>;
    averageDuration: Record<string, number>;
    transitionFrequency: Record<string, number>;
  } {
    const distribution: Record<string, number> = {};
    const durations: Record<string, number[]> = {};
    const transitions: Record<string, number> = {};

    for (let i = 0; i < this.regimeHistory.length; i++) {
      const regime = this.regimeHistory[i].regime;
      distribution[regime] = (distribution[regime] || 0) + 1;

      if (i > 0 && this.regimeHistory[i - 1].regime !== regime) {
        const transitionKey = `${this.regimeHistory[i - 1].regime}->${regime}`;
        transitions[transitionKey] = (transitions[transitionKey] || 0) + 1;
      }
    }

    const total = this.regimeHistory.length;
    for (const key in distribution) {
      distribution[key] = distribution[key] / total;
    }

    const averageDuration: Record<string, number> = {};
    for (const key in durations) {
      const durationList = durations[key];
      averageDuration[key] =
        durationList.reduce((a, b) => a + b, 0) / durationList.length;
    }

    return {
      regimeDistribution: distribution,
      averageDuration,
      transitionFrequency: transitions,
    };
  }

  classifyMarketByRegime(regime: MarketRegime): {
    recommendedStrategy: string;
    riskLevel: 'low' | 'medium' | 'high';
    suitableInstruments: string[];
  } {
    const strategies: Record<MarketRegime['regime'], any> = {
      bull: {
        recommendedStrategy: 'Trend Following',
        riskLevel: 'medium',
        suitableInstruments: [
          'Long positions',
          'Call options',
          'Leveraged ETFs',
        ],
      },
      bear: {
        recommendedStrategy: 'Short Selling',
        riskLevel: 'high',
        suitableInstruments: ['Short positions', 'Put options', 'Inverse ETFs'],
      },
      ranging: {
        recommendedStrategy: 'Mean Reversion',
        riskLevel: 'low',
        suitableInstruments: [
          'Range trading',
          'Iron condors',
          'Market neutral',
        ],
      },
      volatile: {
        recommendedStrategy: 'Volatility Trading',
        riskLevel: 'high',
        suitableInstruments: ['Straddles', 'Strangles', 'VIX products'],
      },
      quiet: {
        recommendedStrategy: 'Covered Calls',
        riskLevel: 'low',
        suitableInstruments: [
          'Income strategies',
          'Theta decay',
          'Credit spreads',
        ],
      },
    };

    return strategies[regime.regime];
  }
}
