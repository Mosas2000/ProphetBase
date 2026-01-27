export interface SlippageSettings {
  tolerance: number;
  autoAdjust: boolean;
}

export interface ExecutionResult {
  success: boolean;
  executedPrice: number;
  requestedPrice: number;
  slippage: number;
  priceImpact: number;
  qualityScore: number;
  retryCount: number;
}

export class TradeExecutionService {
  private readonly DEFAULT_SLIPPAGE_TOLERANCE = 0.5;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  async executeTrade(
    symbol: string,
    quantity: number,
    side: 'buy' | 'sell',
    targetPrice: number,
    settings: SlippageSettings = { tolerance: this.DEFAULT_SLIPPAGE_TOLERANCE, autoAdjust: false }
  ): Promise<ExecutionResult> {
    let retryCount = 0;
    let lastError: string | null = null;

    while (retryCount <= this.MAX_RETRIES) {
      try {
        const currentPrice = await this.getCurrentPrice(symbol);
        const priceImpact = this.calculatePriceImpact(quantity, currentPrice);
        const slippage = Math.abs(((currentPrice - targetPrice) / targetPrice) * 100);

        if (slippage > settings.tolerance) {
          if (!settings.autoAdjust) {
            throw new Error(`Slippage ${slippage.toFixed(2)}% exceeds tolerance ${settings.tolerance}%`);
          }
        }

        if (priceImpact > 5) {
          console.warn(`High price impact detected: ${priceImpact.toFixed(2)}%`);
        }

        const executed = await this.submitOrder(symbol, quantity, side, currentPrice);

        const qualityScore = this.calculateExecutionQuality(
          targetPrice,
          executed.price,
          slippage,
          priceImpact
        );

        return {
          success: true,
          executedPrice: executed.price,
          requestedPrice: targetPrice,
          slippage,
          priceImpact,
          qualityScore,
          retryCount,
        };
      } catch (error: any) {
        lastError = error.message;
        retryCount++;

        if (retryCount <= this.MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY * retryCount));
        }
      }
    }

    throw new Error(`Trade execution failed after ${this.MAX_RETRIES} retries: ${lastError}`);
  }

  private async getCurrentPrice(symbol: string): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return 50000 + (Math.random() - 0.5) * 100;
  }

  private calculatePriceImpact(quantity: number, currentPrice: number): number {
    const orderValue = quantity * currentPrice;
    const liquidityFactor = 100000;
    return (orderValue / liquidityFactor) * 100;
  }

  private async submitOrder(
    symbol: string,
    quantity: number,
    side: string,
    price: number
  ): Promise<{ price: number; quantity: number }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (Math.random() > 0.9) {
      throw new Error('Order execution failed - network error');
    }

    const executedPrice = price + (Math.random() - 0.5) * 5;

    return {
      price: executedPrice,
      quantity,
    };
  }

  private calculateExecutionQuality(
    targetPrice: number,
    executedPrice: number,
    slippage: number,
    priceImpact: number
  ): number {
    const priceDiffPenalty = Math.abs((executedPrice - targetPrice) / targetPrice) * 40;
    const slippagePenalty = (slippage / 1) * 30;
    const impactPenalty = (priceImpact / 5) * 30;

    const totalPenalty = priceDiffPenalty + slippagePenalty + impactPenalty;
    return Math.max(0, Math.min(100, 100 - totalPenalty));
  }
}
