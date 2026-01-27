export interface RiskMetrics {
  valueAtRisk: number;
  expectedShortfall: number;
  maxDrawdown: number;
  sharpeRatio: number;
  volatility: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
}

export class PortfolioRiskCalculator {
  private readonly CONFIDENCE_LEVEL = 0.95;
  private readonly RISK_FREE_RATE = 0.02;

  calculateVaR(
    positions: Position[],
    historicalReturns: number[],
    confidenceLevel: number = this.CONFIDENCE_LEVEL
  ): number {
    const portfolioValue = this.calculatePortfolioValue(positions);
    const sortedReturns = [...historicalReturns].sort((a, b) => a - b);
    const index = Math.floor((1 - confidenceLevel) * sortedReturns.length);
    const varReturn = sortedReturns[index];
    
    return portfolioValue * Math.abs(varReturn);
  }

  calculateExpectedShortfall(
    positions: Position[],
    historicalReturns: number[],
    confidenceLevel: number = this.CONFIDENCE_LEVEL
  ): number {
    const portfolioValue = this.calculatePortfolioValue(positions);
    const sortedReturns = [...historicalReturns].sort((a, b) => a - b);
    const cutoffIndex = Math.floor((1 - confidenceLevel) * sortedReturns.length);
    const tailReturns = sortedReturns.slice(0, cutoffIndex);
    const avgTailReturn = tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length;
    
    return portfolioValue * Math.abs(avgTailReturn);
  }

  calculateMaxDrawdown(equityCurve: number[]): number {
    let maxDrawdown = 0;
    let peak = equityCurve[0];

    for (const value of equityCurve) {
      if (value > peak) {
        peak = value;
      }
      const drawdown = (peak - value) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return maxDrawdown * 100;
  }

  calculateSharpeRatio(returns: number[]): number {
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev === 0) return 0;
    return (avgReturn - this.RISK_FREE_RATE) / stdDev;
  }

  calculateVolatility(returns: number[]): number {
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    return Math.sqrt(variance) * 100;
  }

  runMonteCarloSimulation(
    positions: Position[],
    meanReturn: number,
    volatility: number,
    daysToSimulate: number,
    numSimulations: number
  ): number[][] {
    const results: number[][] = [];
    const portfolioValue = this.calculatePortfolioValue(positions);

    for (let i = 0; i < numSimulations; i++) {
      const simulation: number[] = [portfolioValue];
      
      for (let day = 1; day < daysToSimulate; day++) {
        const randomReturn = this.generateNormalReturn(meanReturn, volatility);
        const newValue = simulation[day - 1] * (1 + randomReturn);
        simulation.push(newValue);
      }
      
      results.push(simulation);
    }

    return results;
  }

  analyzeStressScenarios(
    positions: Position[],
    scenarios: Array<{ name: string; returns: Record<string, number> }>
  ): Array<{ name: string; impact: number; newValue: number }> {
    const currentValue = this.calculatePortfolioValue(positions);
    
    return scenarios.map((scenario) => {
      let newValue = 0;
      
      positions.forEach((position) => {
        const scenarioReturn = scenario.returns[position.symbol] || 0;
        const positionValue = position.quantity * position.currentPrice;
        newValue += positionValue * (1 + scenarioReturn);
      });
      
      const impact = ((newValue - currentValue) / currentValue) * 100;
      
      return {
        name: scenario.name,
        impact,
        newValue,
      };
    });
  }

  calculateAllMetrics(
    positions: Position[],
    historicalReturns: number[],
    equityCurve: number[]
  ): RiskMetrics {
    return {
      valueAtRisk: this.calculateVaR(positions, historicalReturns),
      expectedShortfall: this.calculateExpectedShortfall(positions, historicalReturns),
      maxDrawdown: this.calculateMaxDrawdown(equityCurve),
      sharpeRatio: this.calculateSharpeRatio(historicalReturns),
      volatility: this.calculateVolatility(historicalReturns),
    };
  }

  private calculatePortfolioValue(positions: Position[]): number {
    return positions.reduce(
      (total, pos) => total + pos.quantity * pos.currentPrice,
      0
    );
  }

  private generateNormalReturn(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
  }
}
