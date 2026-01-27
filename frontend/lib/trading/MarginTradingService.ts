export interface MarginPosition {
  symbol: string;
  leverage: number;
  collateral: number;
  borrowed: number;
  positionValue: number;
  liquidationPrice: number;
  maintenanceMargin: number;
  marginRatio: number;
}

export interface LeverageSettings {
  min: number;
  max: number;
  step: number;
}

export class MarginTradingService {
  private readonly DEFAULT_MAINTENANCE_MARGIN = 0.05;
  private readonly LEVERAGE_SETTINGS: LeverageSettings = {
    min: 1,
    max: 125,
    step: 1,
  };

  calculateMarginRequirements(
    positionValue: number,
    leverage: number
  ): { initial: number; maintenance: number } {
    const initialMargin = positionValue / leverage;
    const maintenanceMargin = positionValue * this.DEFAULT_MAINTENANCE_MARGIN;

    return {
      initial: initialMargin,
      maintenance: maintenanceMargin,
    };
  }

  calculateLiquidationPrice(
    entryPrice: number,
    leverage: number,
    side: 'long' | 'short',
    maintenanceMarginRate: number = this.DEFAULT_MAINTENANCE_MARGIN
  ): number {
    if (side === 'long') {
      return entryPrice * (1 - (1 / leverage) + maintenanceMarginRate);
    } else {
      return entryPrice * (1 + (1 / leverage) - maintenanceMarginRate);
    }
  }

  calculateMaxPositionSize(
    accountBalance: number,
    leverage: number,
    entryPrice: number
  ): number {
    const maxPositionValue = accountBalance * leverage;
    return maxPositionValue / entryPrice;
  }

  assessRiskLevel(
    currentPrice: number,
    liquidationPrice: number,
    side: 'long' | 'short'
  ): { level: 'low' | 'medium' | 'high' | 'critical'; distance: number } {
    const distance = Math.abs((currentPrice - liquidationPrice) / currentPrice) * 100;

    let level: 'low' | 'medium' | 'high' | 'critical';
    if (distance > 20) {
      level = 'low';
    } else if (distance > 10) {
      level = 'medium';
    } else if (distance > 5) {
      level = 'high';
    } else {
      level = 'critical';
    }

    return { level, distance };
  }

  getInterestRate(leverage: number): number {
    if (leverage <= 5) return 0.0001;
    if (leverage <= 10) return 0.0003;
    if (leverage <= 25) return 0.0005;
    if (leverage <= 50) return 0.0008;
    return 0.001;
  }

  calculateBorrowingCost(
    borrowedAmount: number,
    leverage: number,
    durationHours: number
  ): number {
    const hourlyRate = this.getInterestRate(leverage);
    return borrowedAmount * hourlyRate * durationHours;
  }

  validateLeverage(leverage: number): boolean {
    return (
      leverage >= this.LEVERAGE_SETTINGS.min &&
      leverage <= this.LEVERAGE_SETTINGS.max &&
      leverage % this.LEVERAGE_SETTINGS.step === 0
    );
  }

  getLeverageSettings(): LeverageSettings {
    return { ...this.LEVERAGE_SETTINGS };
  }

  estimatePnL(
    entryPrice: number,
    currentPrice: number,
    quantity: number,
    leverage: number,
    side: 'long' | 'short'
  ): { pnl: number; roi: number } {
    const priceDiff = currentPrice - entryPrice;
    const multiplier = side === 'long' ? 1 : -1;
    const pnl = priceDiff * quantity * multiplier;
    const initialMargin = (entryPrice * quantity) / leverage;
    const roi = (pnl / initialMargin) * 100;

    return { pnl, roi };
  }
}
