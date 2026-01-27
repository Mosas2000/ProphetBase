export interface RiskParityAllocation {
  allocations: Record<string, number>;
  riskContributions: Record<string, number>;
  totalRisk: number;
}

export class RiskParityOptimizer {
  calculateRiskParity(
    assets: string[],
    volatilities: Record<string, number>,
    correlations: Record<string, Record<string, number>>,
    targetRisk: number = 10
  ): RiskParityAllocation {
    const n = assets.length;
    let allocations = assets.reduce((acc, asset) => {
      acc[asset] = 1 / n;
      return acc;
    }, {} as Record<string, number>);

    for (let iter = 0; iter < 100; iter++) {
      const riskContributions = this.calculateRiskContributions(
        allocations,
        volatilities,
        correlations
      );

      const avgRiskContrib = Object.values(riskContributions).reduce((a, b) => a + b, 0) / n;
      
      let converged = true;
      assets.forEach((asset) => {
        const adjustment = avgRiskContrib / riskContributions[asset];
        const newAlloc = allocations[asset] * adjustment;
        
        if (Math.abs(newAlloc - allocations[asset]) > 0.0001) {
          converged = false;
        }
        
        allocations[asset] = newAlloc;
      });

      const totalAlloc = Object.values(allocations).reduce((a, b) => a + b, 0);
      Object.keys(allocations).forEach((asset) => {
        allocations[asset] /= totalAlloc;
      });

      if (converged) break;
    }

    const finalRiskContributions = this.calculateRiskContributions(
      allocations,
      volatilities,
      correlations
    );

    const totalRisk = Math.sqrt(
      this.calculatePortfolioVariance(allocations, volatilities, correlations)
    );

    return {
      allocations,
      riskContributions: finalRiskContributions,
      totalRisk,
    };
  }

  private calculateRiskContributions(
    allocations: Record<string, number>,
    volatilities: Record<string, number>,
    correlations: Record<string, Record<string, number>>
  ): Record<string, number> {
    const assets = Object.keys(allocations);
    const portfolioVariance = this.calculatePortfolioVariance(
      allocations,
      volatilities,
      correlations
    );
    const portfolioVol = Math.sqrt(portfolioVariance);

    const riskContributions: Record<string, number> = {};

    assets.forEach((asset) => {
      let marginalContribution = 0;
      
      assets.forEach((otherAsset) => {
        const corr = asset === otherAsset ? 1 : correlations[asset]?.[otherAsset] || 0;
        marginalContribution +=
          allocations[otherAsset] * volatilities[asset] * volatilities[otherAsset] * corr;
      });

      riskContributions[asset] = (allocations[asset] * marginalContribution) / portfolioVol;
    });

    return riskContributions;
  }

  private calculatePortfolioVariance(
    allocations: Record<string, number>,
    volatilities: Record<string, number>,
    correlations: Record<string, Record<string, number>>
  ): number {
    const assets = Object.keys(allocations);
    let variance = 0;

    assets.forEach((asset1) => {
      assets.forEach((asset2) => {
        const corr = asset1 === asset2 ? 1 : correlations[asset1]?.[asset2] || 0;
        variance +=
          allocations[asset1] *
          allocations[asset2] *
          volatilities[asset1] *
          volatilities[asset2] *
          corr;
      });
    });

    return variance;
  }
}
