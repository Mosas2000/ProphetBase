export interface CopyTradeConfig {
  traderId: string;
  followerId: string;
  copyPercent: number;
  maxPositionSize: number;
  allowedAssets: string[];
  stopLossMultiplier: number;
  takeProfitMultiplier: number;
  enabled: boolean;
}

export class CopyTradingService {
  private configurations: Map<string, CopyTradeConfig> = new Map();
  private traderStats: Map<string, { followers: number; aum: number; winRate: number }> = new Map();

  setupCopyTrading(config: CopyTradeConfig): string {
    const id = `COPY-${Date.now()}-${config.followerId}`;
    this.configurations.set(id, config);
    
    const stats = this.traderStats.get(config.traderId) || {
      followers: 0,
      aum: 0,
      winRate: 0,
    };
    stats.followers++;
    this.traderStats.set(config.traderId, stats);

    return id;
  }

  async replicateTrade(
    traderId: string,
    trade: {
      symbol: string;
      side: 'buy' | 'sell';
      quantity: number;
      price: number;
    }
  ): Promise<void> {
    const followers = Array.from(this.configurations.values()).filter(
      (config) => config.traderId === traderId && config.enabled
    );

    for (const config of followers) {
      if (!config.allowedAssets.includes(trade.symbol)) continue;

      const adjustedQuantity = trade.quantity * (config.copyPercent / 100);
      const cappedQuantity = Math.min(adjustedQuantity, config.maxPositionSize);

      console.log(`Replicating trade for ${config.followerId}: ${trade.symbol} ${cappedQuantity}`);
    }
  }

  getTraderStats(traderId: string) {
    return this.traderStats.get(traderId);
  }

  updateConfig(configId: string, updates: Partial<CopyTradeConfig>): void {
    const config = this.configurations.get(configId);
    if (config) {
      Object.assign(config, updates);
    }
  }

  stopCopyTrading(configId: string): void {
    const config = this.configurations.get(configId);
    if (config) {
      const stats = this.traderStats.get(config.traderId);
      if (stats) {
        stats.followers--;
      }
      this.configurations.delete(configId);
    }
  }
}
