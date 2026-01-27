export interface StopLossRecommendation {
  atrBased: number;
  supportBased: number;
  percentageBased: number;
  recommended: number;
  riskAmount: number;
}

export class StopLossOptimizer {
  calculateATRStopLoss(
    currentPrice: number,
    atr: number,
    multiplier: number = 2,
    side: 'long' | 'short'
  ): number {
    if (side === 'long') {
      return currentPrice - atr * multiplier;
    } else {
      return currentPrice + atr * multiplier;
    }
  }

  findSupportResistanceLevels(
    priceHistory: number[],
    currentPrice: number,
    lookback: number = 20
  ): { support: number[]; resistance: number[] } {
    const recentPrices = priceHistory.slice(-lookback);
    const support: number[] = [];
    const resistance: number[] = [];

    for (let i = 1; i < recentPrices.length - 1; i++) {
      const prev = recentPrices[i - 1];
      const curr = recentPrices[i];
      const next = recentPrices[i + 1];

      if (curr < prev && curr < next && curr < currentPrice) {
        support.push(curr);
      }
      if (curr > prev && curr > next && curr > currentPrice) {
        resistance.push(curr);
      }
    }

    return {
      support: support.sort((a, b) => b - a),
      resistance: resistance.sort((a, b) => a - b),
    };
  }

  getOptimalStopLoss(
    entryPrice: number,
    currentPrice: number,
    atr: number,
    priceHistory: number[],
    side: 'long' | 'short',
    maxRiskPercent: number = 2
  ): StopLossRecommendation {
    const atrBased = this.calculateATRStopLoss(currentPrice, atr, 2, side);
    
    const levels = this.findSupportResistanceLevels(priceHistory, currentPrice);
    const supportBased = side === 'long' 
      ? (levels.support[0] || currentPrice * 0.95)
      : (levels.resistance[0] || currentPrice * 1.05);

    const percentageBased = side === 'long'
      ? currentPrice * (1 - maxRiskPercent / 100)
      : currentPrice * (1 + maxRiskPercent / 100);

    const candidates = [atrBased, supportBased, percentageBased];
    const recommended = side === 'long'
      ? Math.max(...candidates.filter(c => c < currentPrice))
      : Math.min(...candidates.filter(c => c > currentPrice));

    const riskAmount = Math.abs(currentPrice - recommended);

    return {
      atrBased,
      supportBased,
      percentageBased,
      recommended,
      riskAmount,
    };
  }

  calculateTrailingStop(
    entryPrice: number,
    currentPrice: number,
    highestPrice: number,
    lowestPrice: number,
    trailingPercent: number,
    side: 'long' | 'short'
  ): number {
    if (side === 'long') {
      return highestPrice * (1 - trailingPercent / 100);
    } else {
      return lowestPrice * (1 + trailingPercent / 100);
    }
  }

  evaluateStopLossPlacement(
    stopLoss: number,
    entryPrice: number,
    targetPrice: number,
    side: 'long' | 'short'
  ): {
    riskRewardRatio: number;
    isOptimal: boolean;
    recommendation: string;
  } {
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(targetPrice - entryPrice);
    const riskRewardRatio = reward / risk;

    const isOptimal = riskRewardRatio >= 2;
    
    let recommendation = '';
    if (riskRewardRatio < 1.5) {
      recommendation = 'Stop loss too wide - reduce risk or increase target';
    } else if (riskRewardRatio < 2) {
      recommendation = 'Acceptable but could be optimized';
    } else {
      recommendation = 'Good risk/reward ratio';
    }

    return {
      riskRewardRatio,
      isOptimal,
      recommendation,
    };
  }
}
