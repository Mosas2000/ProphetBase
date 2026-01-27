export interface PositionSizeRecommendation {
  kellySize: number;
  fractionalSize: number;
  recommendedSize: number;
  maxSize: number;
  riskRewardRatio: number;
}

export class PositionSizingCalculator {
  private readonly MAX_POSITION_SIZE_PERCENT = 20;
  private readonly KELLY_FRACTION = 0.5;

  calculateKellyCriterion(
    winRate: number,
    avgWin: number,
    avgLoss: number
  ): number {
    if (avgLoss === 0) return 0;
    const b = avgWin / avgLoss;
    const p = winRate;
    const q = 1 - winRate;
    
    const kelly = (p * b - q) / b;
    return Math.max(0, Math.min(kelly, 0.5));
  }

  calculateFixedFractional(
    accountBalance: number,
    riskPercent: number,
    stopLossDistance: number,
    entryPrice: number
  ): number {
    const riskAmount = accountBalance * (riskPercent / 100);
    const riskPerShare = stopLossDistance;
    
    if (riskPerShare === 0) return 0;
    return riskAmount / riskPerShare;
  }

  calculateRiskRewardRatio(
    entryPrice: number,
    targetPrice: number,
    stopLoss: number
  ): number {
    const potentialProfit = Math.abs(targetPrice - entryPrice);
    const potentialLoss = Math.abs(entryPrice - stopLoss);
    
    if (potentialLoss === 0) return 0;
    return potentialProfit / potentialLoss;
  }

  getPositionSizeRecommendation(
    accountBalance: number,
    entryPrice: number,
    stopLoss: number,
    targetPrice: number,
    winRate: number,
    avgWin: number,
    avgLoss: number,
    riskPercent: number = 2
  ): PositionSizeRecommendation {
    const riskRewardRatio = this.calculateRiskRewardRatio(
      entryPrice,
      targetPrice,
      stopLoss
    );

    const kellyFraction = this.calculateKellyCriterion(winRate, avgWin, avgLoss);
    const kellySize = accountBalance * kellyFraction * this.KELLY_FRACTION;

    const stopLossDistance = Math.abs(entryPrice - stopLoss);
    const fractionalSize = this.calculateFixedFractional(
      accountBalance,
      riskPercent,
      stopLossDistance,
      entryPrice
    );

    const maxSize = (accountBalance * (this.MAX_POSITION_SIZE_PERCENT / 100)) / entryPrice;

    const recommendedSize = Math.min(
      (kellySize + fractionalSize) / 2 / entryPrice,
      maxSize
    );

    return {
      kellySize: kellySize / entryPrice,
      fractionalSize,
      recommendedSize,
      maxSize,
      riskRewardRatio,
    };
  }

  calculatePositionRisk(
    quantity: number,
    entryPrice: number,
    stopLoss: number,
    accountBalance: number
  ): {
    dollarRisk: number;
    percentRisk: number;
    isAcceptable: boolean;
  } {
    const positionValue = quantity * entryPrice;
    const dollarRisk = quantity * Math.abs(entryPrice - stopLoss);
    const percentRisk = (dollarRisk / accountBalance) * 100;

    return {
      dollarRisk,
      percentRisk,
      isAcceptable: percentRisk <= 2,
    };
  }

  adjustSizeForCorrelation(
    baseSize: number,
    correlationFactor: number
  ): number {
    const adjustmentFactor = 1 - Math.abs(correlationFactor) * 0.5;
    return baseSize * adjustmentFactor;
  }

  calculateMaxLeverage(
    accountBalance: number,
    positionValue: number,
    riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  ): number {
    const maxLeverageMap = {
      conservative: 2,
      moderate: 5,
      aggressive: 10,
    };

    const theoreticalLeverage = positionValue / accountBalance;
    const maxAllowed = maxLeverageMap[riskTolerance];

    return Math.min(theoreticalLeverage, maxAllowed);
  }
}
