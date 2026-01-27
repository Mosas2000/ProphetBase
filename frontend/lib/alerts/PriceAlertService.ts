export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  enabled: boolean;
  notificationChannels: ('email' | 'push')[];
  cooldownMinutes: number;
  lastTriggered?: number;
  createdAt: number;
}

export class PriceAlertService {
  private alerts: Map<string, PriceAlert> = new Map();
  private priceSubscriptions: Map<string, Set<string>> = new Map();

  createAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>): PriceAlert {
    const newAlert: PriceAlert = {
      ...alert,
      id: `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };

    const duplicateExists = Array.from(this.alerts.values()).some(
      (existing) =>
        existing.symbol === newAlert.symbol &&
        existing.condition === newAlert.condition &&
        existing.targetPrice === newAlert.targetPrice &&
        existing.enabled
    );

    if (duplicateExists) {
      throw new Error('Duplicate alert already exists');
    }

    this.alerts.set(newAlert.id, newAlert);
    this.addSubscription(newAlert.symbol, newAlert.id);
    return newAlert;
  }

  updateAlert(id: string, updates: Partial<PriceAlert>): PriceAlert {
    const alert = this.alerts.get(id);
    if (!alert) {
      throw new Error('Alert not found');
    }

    const updated = { ...alert, ...updates };
    this.alerts.set(id, updated);
    return updated;
  }

  deleteAlert(id: string): void {
    const alert = this.alerts.get(id);
    if (alert) {
      this.removeSubscription(alert.symbol, id);
      this.alerts.delete(id);
    }
  }

  getAlerts(): PriceAlert[] {
    return Array.from(this.alerts.values());
  }

  checkPrice(symbol: string, newPrice: number): PriceAlert[] {
    const triggeredAlerts: PriceAlert[] = [];
    const alertIds = this.priceSubscriptions.get(symbol) || new Set();

    alertIds.forEach((alertId) => {
      const alert = this.alerts.get(alertId);
      if (!alert || !alert.enabled) return;

      if (alert.lastTriggered) {
        const cooldownExpired =
          Date.now() - alert.lastTriggered > alert.cooldownMinutes * 60000;
        if (!cooldownExpired) return;
      }

      const triggered =
        (alert.condition === 'above' && newPrice >= alert.targetPrice) ||
        (alert.condition === 'below' && newPrice <= alert.targetPrice);

      if (triggered) {
        alert.lastTriggered = Date.now();
        this.alerts.set(alertId, alert);
        triggeredAlerts.push(alert);
        this.notifyAlert(alert);
      }
    });

    return triggeredAlerts;
  }

  private addSubscription(symbol: string, alertId: string): void {
    if (!this.priceSubscriptions.has(symbol)) {
      this.priceSubscriptions.set(symbol, new Set());
    }
    this.priceSubscriptions.get(symbol)!.add(alertId);
  }

  private removeSubscription(symbol: string, alertId: string): void {
    const subs = this.priceSubscriptions.get(symbol);
    if (subs) {
      subs.delete(alertId);
      if (subs.size === 0) {
        this.priceSubscriptions.delete(symbol);
      }
    }
  }

  private notifyAlert(alert: PriceAlert): void {
    const message = `Price alert: ${alert.symbol} is ${alert.condition} $${alert.targetPrice}`;
    
    if (alert.notificationChannels.includes('email')) {
      console.log(`Sending email: ${message}`);
    }
    
    if (alert.notificationChannels.includes('push')) {
      console.log(`Sending push notification: ${message}`);
    }
  }
}
