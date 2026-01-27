export interface PortfolioOptimization {
  targetReturn?: number;
  maxVolatility?: number;
  constraints?: {
    maxPositionSize?: number;
    minPositionSize?: number;
    allowShort?: boolean;
  };
}

export interface OptimizedPortfolio {
  weights: Map<string, number>;
  expectedReturn: number;
  expectedVolatility: number;
  sharpeRatio: number;
  diversificationRatio: number;
}

export class PortfolioOptimizer {
  optimizePortfolio(
    assets: string[],
    returns: Map<string, number[]>,
    config: PortfolioOptimization
  ): OptimizedPortfolio {
    const weights = this.calculateEqualWeights(assets);

    const expectedReturn = this.calculateExpectedReturn(weights, returns);
    const expectedVolatility = this.calculateExpectedVolatility(
      weights,
      returns
    );
    const sharpeRatio =
      expectedVolatility > 0 ? expectedReturn / expectedVolatility : 0;
    const diversificationRatio = this.calculateDiversificationRatio(
      weights,
      returns
    );

    return {
      weights,
      expectedReturn,
      expectedVolatility,
      sharpeRatio,
      diversificationRatio,
    };
  }

  private calculateEqualWeights(assets: string[]): Map<string, number> {
    const weight = 1 / assets.length;
    const weights = new Map<string, number>();
    assets.forEach((asset) => weights.set(asset, weight));
    return weights;
  }

  private calculateExpectedReturn(
    weights: Map<string, number>,
    returns: Map<string, number[]>
  ): number {
    let expectedReturn = 0;

    for (const [asset, weight] of weights.entries()) {
      const assetReturns = returns.get(asset);
      if (assetReturns && assetReturns.length > 0) {
        const avgReturn =
          assetReturns.reduce((a, b) => a + b, 0) / assetReturns.length;
        expectedReturn += weight * avgReturn;
      }
    }

    return expectedReturn;
  }

  private calculateExpectedVolatility(
    weights: Map<string, number>,
    returns: Map<string, number[]>
  ): number {
    const assets = Array.from(weights.keys());
    const covarianceMatrix = this.calculateCovarianceMatrix(assets, returns);

    let variance = 0;

    for (let i = 0; i < assets.length; i++) {
      for (let j = 0; j < assets.length; j++) {
        const weight_i = weights.get(assets[i]) || 0;
        const weight_j = weights.get(assets[j]) || 0;
        variance += weight_i * weight_j * covarianceMatrix[i][j];
      }
    }

    return Math.sqrt(Math.max(0, variance));
  }

  private calculateCovarianceMatrix(
    assets: string[],
    returns: Map<string, number[]>
  ): number[][] {
    const n = assets.length;
    const matrix: number[][] = Array(n)
      .fill(0)
      .map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const returns_i = returns.get(assets[i]) || [];
        const returns_j = returns.get(assets[j]) || [];
        matrix[i][j] = this.calculateCovariance(returns_i, returns_j);
      }
    }

    return matrix;
  }

  private calculateCovariance(data1: number[], data2: number[]): number {
    if (data1.length !== data2.length || data1.length < 2) return 0;

    const mean1 = data1.reduce((a, b) => a + b, 0) / data1.length;
    const mean2 = data2.reduce((a, b) => a + b, 0) / data2.length;

    let covariance = 0;
    for (let i = 0; i < data1.length; i++) {
      covariance += (data1[i] - mean1) * (data2[i] - mean2);
    }

    return covariance / (data1.length - 1);
  }

  private calculateDiversificationRatio(
    weights: Map<string, number>,
    returns: Map<string, number[]>
  ): number {
    let weightedVolatilitySum = 0;

    for (const [asset, weight] of weights.entries()) {
      const assetReturns = returns.get(asset) || [];
      const volatility = this.calculateStandardDeviation(assetReturns);
      weightedVolatilitySum += weight * volatility;
    }

    const portfolioVolatility = this.calculateExpectedVolatility(
      weights,
      returns
    );

    return portfolioVolatility > 0
      ? weightedVolatilitySum / portfolioVolatility
      : 1;
  }

  private calculateStandardDeviation(data: number[]): number {
    if (data.length < 2) return 0;
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance =
      data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  calculateEfficientFrontier(
    assets: string[],
    returns: Map<string, number[]>,
    points: number = 20
  ): OptimizedPortfolio[] {
    const frontier: OptimizedPortfolio[] = [];

    for (let i = 0; i < points; i++) {
      const targetReturn = (i / (points - 1)) * 0.2;
      const portfolio = this.optimizePortfolio(assets, returns, {
        targetReturn,
      });
      frontier.push(portfolio);
    }

    return frontier;
  }
}
