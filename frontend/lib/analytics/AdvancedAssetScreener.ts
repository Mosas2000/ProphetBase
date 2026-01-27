export interface ScreenerCriteria {
  priceMin?: number;
  priceMax?: number;
  volumeMin?: number;
  marketCapMin?: number;
  marketCapMax?: number;
  changePercent24hMin?: number;
  changePercent24hMax?: number;
  volatilityMin?: number;
  volatilityMax?: number;
  technicals?: {
    rsi?: { min?: number; max?: number };
    macdSignal?: 'bullish' | 'bearish';
    movingAverageCross?: 'golden' | 'death';
  };
  fundamentals?: {
    peRatioMax?: number;
    dividendYieldMin?: number;
  };
}

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  volume: number;
  marketCap: number;
  changePercent24h: number;
  volatility: number;
  rsi?: number;
  macdSignal?: 'bullish' | 'bearish';
}

export class AdvancedAssetScreener {
  private assets: Map<string, Asset> = new Map();
  private scanInterval?: NodeJS.Timeout;

  addAsset(asset: Asset): void {
    this.assets.set(asset.symbol, asset);
  }

  screenAssets(criteria: ScreenerCriteria): Asset[] {
    let results = Array.from(this.assets.values());

    if (criteria.priceMin !== undefined) {
      results = results.filter(a => a.price >= criteria.priceMin!);
    }
    if (criteria.priceMax !== undefined) {
      results = results.filter(a => a.price <= criteria.priceMax!);
    }
    if (criteria.volumeMin !== undefined) {
      results = results.filter(a => a.volume >= criteria.volumeMin!);
    }
    if (criteria.marketCapMin !== undefined) {
      results = results.filter(a => a.marketCap >= criteria.marketCapMin!);
    }
    if (criteria.marketCapMax !== undefined) {
      results = results.filter(a => a.marketCap <= criteria.marketCapMax!);
    }
    if (criteria.changePercent24hMin !== undefined) {
      results = results.filter(a => a.changePercent24h >= criteria.changePercent24hMin!);
    }
    if (criteria.changePercent24hMax !== undefined) {
      results = results.filter(a => a.changePercent24h <= criteria.changePercent24hMax!);
    }
    if (criteria.volatilityMin !== undefined) {
      results = results.filter(a => a.volatility >= criteria.volatilityMin!);
    }
    if (criteria.volatilityMax !== undefined) {
      results = results.filter(a => a.volatility <= criteria.volatilityMax!);
    }

    if (criteria.technicals) {
      if (criteria.technicals.rsi) {
        results = results.filter(a => {
          if (!a.rsi) return false;
          if (criteria.technicals!.rsi!.min !== undefined && a.rsi < criteria.technicals!.rsi!.min) return false;
          if (criteria.technicals!.rsi!.max !== undefined && a.rsi > criteria.technicals!.rsi!.max) return false;
          return true;
        });
      }
      if (criteria.technicals.macdSignal) {
        results = results.filter(a => a.macdSignal === criteria.technicals!.macdSignal);
      }
    }

    return results;
  }

  startRealTimeScan(
    criteria: ScreenerCriteria,
    callback: (matches: Asset[]) => void,
    intervalMs: number = 5000
  ): void {
    this.stopRealTimeScan();

    this.scanInterval = setInterval(() => {
      const matches = this.screenAssets(criteria);
      if (matches.length > 0) {
        callback(matches);
      }
    }, intervalMs);
  }

  stopRealTimeScan(): void {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = undefined;
    }
  }

  rankAssets(assets: Asset[], strategy: 'momentum' | 'value' | 'quality'): Asset[] {
    return [...assets].sort((a, b) => {
      switch (strategy) {
        case 'momentum':
          return b.changePercent24h - a.changePercent24h;
        case 'value':
          return a.price - b.price;
        case 'quality':
          return b.volume - a.volume;
        default:
          return 0;
      }
    });
  }

  createPresetScreener(preset: 'breakout' | 'oversold' | 'high-volume' | 'momentum'): ScreenerCriteria {
    const presets: Record<string, ScreenerCriteria> = {
      breakout: {
        changePercent24hMin: 10,
        volumeMin: 1000000,
        technicals: { rsi: { min: 60 } },
      },
      oversold: {
        changePercent24hMax: -5,
        technicals: { rsi: { max: 30 } },
      },
      'high-volume': {
        volumeMin: 5000000,
        volatilityMin: 0.02,
      },
      momentum: {
        changePercent24hMin: 5,
        technicals: { rsi: { min: 50, max: 70 } },
      },
    };

    return presets[preset];
  }

  exportResults(assets: Asset[], format: 'json' | 'csv'): string {
    if (format === 'json') {
      return JSON.stringify(assets, null, 2);
    } else {
      const headers = ['Symbol', 'Name', 'Price', 'Volume', 'Market Cap', '24h Change %', 'Volatility'];
      const rows = assets.map(a => [
        a.symbol,
        a.name,
        a.price.toString(),
        a.volume.toString(),
        a.marketCap.toString(),
        a.changePercent24h.toFixed(2),
        a.volatility.toFixed(4),
      ]);

      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }
  }

  compareAssets(symbol1: string, symbol2: string): {
    asset1: Asset | undefined;
    asset2: Asset | undefined;
    comparison: {
      priceDiff: number;
      volumeDiff: number;
      performanceDiff: number;
      recommendation: string;
    };
  } {
    const asset1 = this.assets.get(symbol1);
    const asset2 = this.assets.get(symbol2);

    if (!asset1 || !asset2) {
      return {
        asset1,
        asset2,
        comparison: {
          priceDiff: 0,
          volumeDiff: 0,
          performanceDiff: 0,
          recommendation: 'Assets not found',
        },
      };
    }

    const priceDiff = ((asset1.price - asset2.price) / asset2.price) * 100;
    const volumeDiff = ((asset1.volume - asset2.volume) / asset2.volume) * 100;
    const performanceDiff = asset1.changePercent24h - asset2.changePercent24h;

    let recommendation = '';
    if (performanceDiff > 5) {
      recommendation = `${asset1.symbol} outperforming ${asset2.symbol}`;
    } else if (performanceDiff < -5) {
      recommendation = `${asset2.symbol} outperforming ${asset1.symbol}`;
    } else {
      recommendation = 'Similar performance';
    }

    return {
      asset1,
      asset2,
      comparison: { priceDiff, volumeDiff, performanceDiff, recommendation },
    };
  }
}
