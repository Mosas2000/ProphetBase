export interface BacktestConfig {
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  commission: number;
  slippage: number;
  strategy: TradingStrategy;
}

export interface TradingStrategy {
  name: string;
  parameters: Record<string, number>;
  entry: (data: MarketData) => boolean;
  exit: (position: Position, data: MarketData) => boolean;
}

export interface MarketData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Position {
  symbol: string;
  entryPrice: number;
  size: number;
  entryTime: number;
}

export interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
  trades: Trade[];
}

export interface Trade {
  entryTime: number;
  exitTime: number;
  entryPrice: number;
  exitPrice: number;
  size: number;
  profit: number;
  return: number;
}

export class BacktestingEngine {
  private config: BacktestConfig;

  constructor(config: BacktestConfig) {
    this.config = config;
  }

  runBacktest(historicalData: MarketData[]): BacktestResult {
    let capital = this.config.initialCapital;
    let position: Position | null = null;
    const trades: Trade[] = [];
    const equityCurve: number[] = [capital];

    for (let i = 1; i < historicalData.length; i++) {
      const data = historicalData[i];

      if (!position && this.config.strategy.entry(data)) {
        const size = Math.floor((capital * 0.95) / data.close);
        const cost =
          size *
          data.close *
          (1 + this.config.commission + this.config.slippage);

        if (cost <= capital) {
          position = {
            symbol: 'BTC',
            entryPrice: data.close,
            size,
            entryTime: data.timestamp,
          };
          capital -= cost;
        }
      }

      if (position && this.config.strategy.exit(position, data)) {
        const proceeds =
          position.size *
          data.close *
          (1 - this.config.commission - this.config.slippage);
        capital += proceeds;

        const profit = proceeds - position.size * position.entryPrice;
        const returnPct =
          (data.close - position.entryPrice) / position.entryPrice;

        trades.push({
          entryTime: position.entryTime,
          exitTime: data.timestamp,
          entryPrice: position.entryPrice,
          exitPrice: data.close,
          size: position.size,
          profit,
          return: returnPct,
        });

        position = null;
      }

      const portfolioValue =
        capital + (position ? position.size * data.close : 0);
      equityCurve.push(portfolioValue);
    }

    return this.calculateMetrics(trades, equityCurve);
  }

  private calculateMetrics(
    trades: Trade[],
    equityCurve: number[]
  ): BacktestResult {
    const totalReturn =
      (equityCurve[equityCurve.length - 1] - this.config.initialCapital) /
      this.config.initialCapital;
    const winningTrades = trades.filter((t) => t.profit > 0);
    const losingTrades = trades.filter((t) => t.profit <= 0);

    const winRate =
      trades.length > 0 ? winningTrades.length / trades.length : 0;
    const avgWin =
      winningTrades.length > 0
        ? winningTrades.reduce((sum, t) => sum + t.profit, 0) /
          winningTrades.length
        : 0;
    const avgLoss =
      losingTrades.length > 0
        ? Math.abs(
            losingTrades.reduce((sum, t) => sum + t.profit, 0) /
              losingTrades.length
          )
        : 0;
    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

    const returns = equityCurve
      .slice(1)
      .map((val, i) => (val - equityCurve[i]) / equityCurve[i]);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) /
        returns.length
    );
    const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;

    let maxDrawdown = 0;
    let peak = equityCurve[0];
    for (const value of equityCurve) {
      if (value > peak) peak = value;
      const drawdown = (peak - value) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    return {
      totalReturn,
      sharpeRatio,
      maxDrawdown,
      winRate,
      totalTrades: trades.length,
      profitFactor,
      trades,
    };
  }

  walkForwardOptimization(
    historicalData: MarketData[],
    inSamplePeriod: number,
    outSamplePeriod: number,
    parameterRanges: Record<string, number[]>
  ): any {
    const results = [];

    for (
      let i = 0;
      i + inSamplePeriod + outSamplePeriod < historicalData.length;
      i += outSamplePeriod
    ) {
      const inSampleData = historicalData.slice(i, i + inSamplePeriod);
      const outSampleData = historicalData.slice(
        i + inSamplePeriod,
        i + inSamplePeriod + outSamplePeriod
      );

      const bestParams = this.optimizeParameters(inSampleData, parameterRanges);
      const outSampleResult = this.runBacktest(outSampleData);

      results.push({ bestParams, outSampleResult });
    }

    return results;
  }

  private optimizeParameters(
    data: MarketData[],
    ranges: Record<string, number[]>
  ): Record<string, number> {
    return {};
  }

  monteCarloSimulation(trades: Trade[], iterations: number = 1000): any {
    const simulations = [];

    for (let i = 0; i < iterations; i++) {
      const shuffled = [...trades].sort(() => Math.random() - 0.5);
      let capital = this.config.initialCapital;

      for (const trade of shuffled) {
        capital += trade.profit;
      }

      const finalReturn =
        (capital - this.config.initialCapital) / this.config.initialCapital;
      simulations.push(finalReturn);
    }

    simulations.sort((a, b) => a - b);

    return {
      mean: simulations.reduce((a, b) => a + b, 0) / simulations.length,
      median: simulations[Math.floor(simulations.length / 2)],
      percentile5: simulations[Math.floor(simulations.length * 0.05)],
      percentile95: simulations[Math.floor(simulations.length * 0.95)],
    };
  }
}
