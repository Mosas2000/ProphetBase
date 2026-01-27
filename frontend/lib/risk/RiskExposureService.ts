export interface ExposureAnalysis {
  totalExposure: number;
  exposureByAsset: Record<string, number>;
  concentrationRisk: number;
  correlationAdjustedRisk: number;
  warnings: string[];
}

export class RiskExposureService {
  private readonly MAX_SINGLE_ASSET_EXPOSURE = 25;
  private readonly MAX_SECTOR_EXPOSURE = 40;

  analyzeExposure(
    positions: Array<{
      symbol: string;
      value: number;
      sector: string;
    }>,
    correlations: Record<string, Record<string, number>>
  ): ExposureAnalysis {
    const totalValue = positions.reduce((sum, p) => sum + p.value, 0);
    const exposureByAsset: Record<string, number> = {};
    const warnings: string[] = [];

    positions.forEach((pos) => {
      const exposurePercent = (pos.value / totalValue) * 100;
      exposureByAsset[pos.symbol] = exposurePercent;

      if (exposurePercent > this.MAX_SINGLE_ASSET_EXPOSURE) {
        warnings.push(
          `${pos.symbol} exposure (${exposurePercent.toFixed(1)}%) exceeds recommended ${this.MAX_SINGLE_ASSET_EXPOSURE}%`
        );
      }
    });

    const concentrationRisk = this.calculateConcentration(exposureByAsset);
    const correlationAdjustedRisk = this.adjustForCorrelation(
      exposureByAsset,
      correlations
    );

    const sectorExposure = this.calculateSectorExposure(positions, totalValue);
    Object.entries(sectorExposure).forEach(([sector, exposure]) => {
      if (exposure > this.MAX_SECTOR_EXPOSURE) {
        warnings.push(
          `${sector} sector exposure (${exposure.toFixed(1)}%) exceeds recommended ${this.MAX_SECTOR_EXPOSURE}%`
        );
      }
    });

    return {
      totalExposure: totalValue,
      exposureByAsset,
      concentrationRisk,
      correlationAdjustedRisk,
      warnings,
    };
  }

  private calculateConcentration(exposureByAsset: Record<string, number>): number {
    const exposures = Object.values(exposureByAsset);
    const sumOfSquares = exposures.reduce((sum, exp) => sum + exp * exp, 0);
    return Math.sqrt(sumOfSquares);
  }

  private adjustForCorrelation(
    exposureByAsset: Record<string, number>,
    correlations: Record<string, Record<string, number>>
  ): number {
    const symbols = Object.keys(exposureByAsset);
    let adjustedRisk = 0;

    for (let i = 0; i < symbols.length; i++) {
      for (let j = 0; j < symbols.length; j++) {
        const corr = i === j ? 1 : (correlations[symbols[i]]?.[symbols[j]] || 0);
        adjustedRisk += exposureByAsset[symbols[i]] * exposureByAsset[symbols[j]] * corr;
      }
    }

    return Math.sqrt(adjustedRisk);
  }

  private calculateSectorExposure(
    positions: Array<{ symbol: string; value: number; sector: string }>,
    totalValue: number
  ): Record<string, number> {
    const sectorExposure: Record<string, number> = {};

    positions.forEach((pos) => {
      if (!sectorExposure[pos.sector]) {
        sectorExposure[pos.sector] = 0;
      }
      sectorExposure[pos.sector] += (pos.value / totalValue) * 100;
    });

    return sectorExposure;
  }
}
