export interface Scenario {
  name: string;
  description: string;
  assetReturns: Record<string, number>;
  probability?: number;
}

export interface ScenarioResult {
  scenario: string;
  portfolioReturn: number;
  portfolioValue: number;
  impact: number;
}

export class ScenarioAnalyzer {
  private historicalScenarios: Scenario[] = [
    {
      name: 'Market Crash 2008',
      description: 'Global financial crisis scenario',
      assetReturns: { BTC: -0.8, ETH: -0.85, stocks: -0.45, bonds: 0.05 },
      probability: 0.02,
    },
    {
      name: 'Bull Market',
      description: 'Strong upward market movement',
      assetReturns: { BTC: 1.5, ETH: 2.0, stocks: 0.25, bonds: 0.03 },
      probability: 0.15,
    },
    {
      name: 'High Inflation',
      description: 'Elevated inflation environment',
      assetReturns: { BTC: 0.5, ETH: 0.3, stocks: -0.1, bonds: -0.15 },
      probability: 0.2,
    },
  ];

  analyzeScenario(
    portfolio: Record<string, number>,
    scenario: Scenario,
    currentValue: number
  ): ScenarioResult {
    let newValue = 0;

    Object.entries(portfolio).forEach(([asset, allocation]) => {
      const assetValue = currentValue * allocation;
      const returnRate = scenario.assetReturns[asset] || 0;
      newValue += assetValue * (1 + returnRate);
    });

    const portfolioReturn = ((newValue - currentValue) / currentValue) * 100;

    return {
      scenario: scenario.name,
      portfolioReturn,
      portfolioValue: newValue,
      impact: portfolioReturn,
    };
  }

  runMultipleScenarios(
    portfolio: Record<string, number>,
    scenarios: Scenario[],
    currentValue: number
  ): ScenarioResult[] {
    return scenarios.map((scenario) =>
      this.analyzeScenario(portfolio, scenario, currentValue)
    );
  }

  getHistoricalScenarios(): Scenario[] {
    return [...this.historicalScenarios];
  }

  createCustomScenario(
    name: string,
    description: string,
    assetReturns: Record<string, number>
  ): Scenario {
    return {
      name,
      description,
      assetReturns,
    };
  }

  calculateExpectedValue(
    results: ScenarioResult[],
    scenarios: Scenario[]
  ): number {
    return results.reduce((sum, result, index) => {
      const probability = scenarios[index].probability || 1 / scenarios.length;
      return sum + result.portfolioReturn * probability;
    }, 0);
  }

  identifyWorstCase(results: ScenarioResult[]): ScenarioResult {
    return results.reduce((worst, current) =>
      current.portfolioReturn < worst.portfolioReturn ? current : worst
    );
  }

  identifyBestCase(results: ScenarioResult[]): ScenarioResult {
    return results.reduce((best, current) =>
      current.portfolioReturn > best.portfolioReturn ? current : best
    );
  }
}
