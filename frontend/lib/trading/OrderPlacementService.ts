export type OrderType = 'market' | 'limit' | 'stop-loss' | 'stop-limit';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'pending' | 'filled' | 'canceled' | 'rejected';

export interface Order {
  id: string;
  type: OrderType;
  side: OrderSide;
  symbol: string;
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: OrderStatus;
  createdAt: number;
  filledAt?: number;
}

export interface OrderValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FeeCalculation {
  makerFee: number;
  takerFee: number;
  estimatedFee: number;
  feeAsset: string;
}

export interface OrderPreview {
  order: Partial<Order>;
  fees: FeeCalculation;
  estimatedTotal: number;
  priceImpact: number;
  slippage: number;
}

export class OrderPlacementService {
  private readonly makerFeeRate = 0.001;
  private readonly takerFeeRate = 0.002;

  validateOrder(order: Partial<Order>): OrderValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!order.symbol) {
      errors.push('Symbol is required');
    }

    if (!order.quantity || order.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }

    if (order.type === 'limit' || order.type === 'stop-limit') {
      if (!order.price || order.price <= 0) {
        errors.push('Price is required for limit orders');
      }
    }

    if (order.type === 'stop-loss' || order.type === 'stop-limit') {
      if (!order.stopPrice || order.stopPrice <= 0) {
        errors.push('Stop price is required for stop orders');
      }
    }

    if (order.type === 'stop-limit' && order.price && order.stopPrice) {
      if (order.side === 'buy' && order.price < order.stopPrice) {
        warnings.push('Limit price is below stop price for buy order');
      }
      if (order.side === 'sell' && order.price > order.stopPrice) {
        warnings.push('Limit price is above stop price for sell order');
      }
    }

    const minOrderSize = 10;
    if (order.quantity && order.price && order.quantity * order.price < minOrderSize) {
      warnings.push(`Order value is below minimum of $${minOrderSize}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  calculateFees(order: Partial<Order>, currentPrice: number): FeeCalculation {
    const isMakerOrder = order.type === 'limit';
    const feeRate = isMakerOrder ? this.makerFeeRate : this.takerFeeRate;
    const orderValue = (order.price || currentPrice) * (order.quantity || 0);
    const estimatedFee = orderValue * feeRate;

    return {
      makerFee: orderValue * this.makerFeeRate,
      takerFee: orderValue * this.takerFeeRate,
      estimatedFee,
      feeAsset: 'USD',
    };
  }

  generateOrderPreview(order: Partial<Order>, currentPrice: number): OrderPreview {
    const fees = this.calculateFees(order, currentPrice);
    const orderPrice = order.price || currentPrice;
    const orderValue = orderPrice * (order.quantity || 0);
    const estimatedTotal = orderValue + fees.estimatedFee;

    const priceImpact = ((orderPrice - currentPrice) / currentPrice) * 100;
    const slippage = Math.abs(priceImpact);

    return {
      order,
      fees,
      estimatedTotal,
      priceImpact,
      slippage,
    };
  }

  async placeOrder(order: Partial<Order>, twoFactorCode?: string): Promise<Order> {
    const validation = this.validateOrder(order);
    if (!validation.valid) {
      throw new Error(`Order validation failed: ${validation.errors.join(', ')}`);
    }

    if (order.quantity && order.quantity * (order.price || 0) > 10000) {
      if (!twoFactorCode) {
        throw new Error('2FA code required for large orders');
      }
      const isValid = await this.verify2FA(twoFactorCode);
      if (!isValid) {
        throw new Error('Invalid 2FA code');
      }
    }

    const newOrder: Order = {
      id: this.generateOrderId(),
      type: order.type || 'market',
      side: order.side || 'buy',
      symbol: order.symbol || '',
      quantity: order.quantity || 0,
      price: order.price,
      stopPrice: order.stopPrice,
      status: 'pending',
      createdAt: Date.now(),
    };

    return this.submitOrder(newOrder);
  }

  async cancelOrder(orderId: string): Promise<void> {
    console.log(`Canceling order ${orderId}`);
  }

  private async verify2FA(code: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return code.length === 6;
  }

  private generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async submitOrder(order: Order): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      ...order,
      status: 'filled',
      filledAt: Date.now(),
    };
  }
}
