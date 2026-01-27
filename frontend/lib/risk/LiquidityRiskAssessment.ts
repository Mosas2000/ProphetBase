export interface LiquidityMetrics {
  marketDepth: number;
  bidAskSpread: number;
  spreadPercent: number;
  liquidityScore: number;
  expectedSlippage: number;
}

export class LiquidityRiskAssessment {
  assessLiquidity(
    orderSize: number,
    bidVolume: number,
    askVolume: number,
    bidPrice: number,
    askPrice: number
  ): LiquidityMetrics {
    const marketDepth = bidVolume + askVolume;
    const bidAskSpread = askPrice - bidPrice;
    const midPrice = (bidPrice + askPrice) / 2;
    const spreadPercent = (bidAskSpread / midPrice) * 100;

    const liquidityScore = this.calculateLiquidityScore(
      marketDepth,
      spreadPercent,
      orderSize
    );

    const expectedSlippage = this.estimateSlippage(
      orderSize,
      bidVolume,
      askVolume,
      spreadPercent
    );

    return {
      marketDepth,
      bidAskSpread,
      spreadPercent,
      liquidityScore,
      expectedSlippage,
    };
  }

  private calculateLiquidityScore(
    depth: number,
    spreadPercent: number,
    orderSize: number
  ): number {
    const depthRatio = Math.min(depth / orderSize, 10) / 10;
    const spreadScore = Math.max(0, 1 - spreadPercent / 2);
    
    return (depthRatio * 0.6 + spreadScore * 0.4) * 100;
  }

  private estimateSlippage(
    orderSize: number,
    bidVolume: number,
    askVolume: number,
    spreadPercent: number
  ): number {
    const relevantVolume = orderSize > 0 ? askVolume : bidVolume;
    
    if (orderSize === 0) return 0;

    const volumeRatio = Math.abs(orderSize) / relevantVolume;
    const baseSlippage = spreadPercent / 2;
    const impactSlippage = volumeRatio * spreadPercent * 2;

    return baseSlippage + impactSlippage;
  }

  recommendOptimalExecutionTime(
    hourlyVolumes: Array<{ hour: number; volume: number }>,
    currentHour: number
  ): { optimalHour: number; reason: string } {
    const maxVolume = Math.max(...hourlyVolumes.map((h) => h.volume));
    const optimalHours = hourlyVolumes
      .filter((h) => h.volume > maxVolume * 0.8)
      .map((h) => h.hour);

    const nextOptimalHour = optimalHours.find((h) => h >= currentHour) || optimalHours[0];

    return {
      optimalHour: nextOptimalHour,
      reason: `High liquidity period with volume above ${(maxVolume * 0.8).toFixed(0)}`,
    };
  }

  calculateLiquidityRisk(
    positionSize: number,
    averageDailyVolume: number
  ): 'low' | 'medium' | 'high' {
    const ratio = positionSize / averageDailyVolume;

    if (ratio < 0.01) return 'low';
    if (ratio < 0.05) return 'medium';
    return 'high';
  }
}
