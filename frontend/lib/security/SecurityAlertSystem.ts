export interface SecurityAlert {
  id: string;
  userId: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: number;
  resolved: boolean;
  resolvedAt?: number;
  resolvedBy?: string;
  metadata: Record<string, any>;
  channels: ('email' | 'sms' | 'push' | 'in-app')[];
}

export interface IncidentResponse {
  alertId: string;
  action: string;
  performedBy: string;
  timestamp: number;
  outcome: string;
  notes?: string;
}

export class SecurityAlertSystem {
  private alerts: Map<string, SecurityAlert> = new Map();
  private responses: IncidentResponse[] = [];
  private alertThresholds: Map<string, number> = new Map();

  constructor() {
    this.initializeThresholds();
  }

  private initializeThresholds(): void {
    this.alertThresholds.set('failed_login_attempts', 3);
    this.alertThresholds.set('api_rate_limit_exceeded', 5);
    this.alertThresholds.set('unusual_location', 1);
    this.alertThresholds.set('large_withdrawal', 1);
    this.alertThresholds.set('suspicious_device', 1);
  }

  createAlert(
    userId: string,
    alertType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    title: string,
    description: string,
    metadata: Record<string, any> = {}
  ): SecurityAlert {
    const alert: SecurityAlert = {
      id: this.generateAlertId(),
      userId,
      alertType,
      severity,
      title,
      description,
      timestamp: Date.now(),
      resolved: false,
      metadata,
      channels: this.determineChannels(severity),
    };

    this.alerts.set(alert.id, alert);
    this.deliverAlert(alert);

    return alert;
  }

  private generateAlertId(): string {
    return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private determineChannels(severity: 'low' | 'medium' | 'high' | 'critical'): ('email' | 'sms' | 'push' | 'in-app')[] {
    switch (severity) {
      case 'critical':
        return ['email', 'sms', 'push', 'in-app'];
      case 'high':
        return ['email', 'push', 'in-app'];
      case 'medium':
        return ['push', 'in-app'];
      case 'low':
        return ['in-app'];
    }
  }

  private deliverAlert(alert: SecurityAlert): void {
    alert.channels.forEach(channel => {
      this.sendToChannel(channel, alert);
    });
  }

  private sendToChannel(channel: string, alert: SecurityAlert): void {
  }

  detectAnomalies(userId: string, activity: any): SecurityAlert[] {
    const alerts: SecurityAlert[] = [];

    if (activity.type === 'login' && activity.location !== activity.expectedLocation) {
      alerts.push(this.createAlert(
        userId,
        'unusual_location',
        'medium',
        'Login from unusual location',
        `Login detected from ${activity.location}, which differs from your usual locations`,
        { location: activity.location, expectedLocation: activity.expectedLocation }
      ));
    }

    if (activity.type === 'failed_login' && activity.attempts >= 3) {
      alerts.push(this.createAlert(
        userId,
        'failed_login_attempts',
        'high',
        'Multiple failed login attempts',
        `${activity.attempts} failed login attempts detected`,
        { attempts: activity.attempts, ipAddress: activity.ipAddress }
      ));
    }

    if (activity.type === 'withdrawal' && activity.amount > 10000) {
      alerts.push(this.createAlert(
        userId,
        'large_withdrawal',
        'high',
        'Large withdrawal request',
        `Withdrawal of ${activity.amount} ${activity.currency} requested`,
        { amount: activity.amount, currency: activity.currency, destination: activity.destination }
      ));
    }

    if (activity.type === 'device' && activity.trustScore < 0.3) {
      alerts.push(this.createAlert(
        userId,
        'suspicious_device',
        'medium',
        'Suspicious device detected',
        `Login from a device with low trust score (${activity.trustScore})`,
        { deviceId: activity.deviceId, trustScore: activity.trustScore }
      ));
    }

    return alerts;
  }

  resolveAlert(alertId: string, resolvedBy: string, notes?: string): boolean {
    const alert = this.alerts.get(alertId);

    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = Date.now();
      alert.resolvedBy = resolvedBy;

      this.responses.push({
        alertId,
        action: 'resolved',
        performedBy: resolvedBy,
        timestamp: Date.now(),
        outcome: 'Alert resolved',
        notes,
      });

      return true;
    }

    return false;
  }

  initiateIncidentResponse(
    alertId: string,
    action: string,
    performedBy: string,
    outcome: string,
    notes?: string
  ): IncidentResponse {
    const response: IncidentResponse = {
      alertId,
      action,
      performedBy,
      timestamp: Date.now(),
      outcome,
      notes,
    };

    this.responses.push(response);
    return response;
  }

  getAlerts(userId: string, filters?: {
    severity?: string;
    alertType?: string;
    resolved?: boolean;
    startDate?: number;
    endDate?: number;
  }): SecurityAlert[] {
    let alerts = Array.from(this.alerts.values()).filter(a => a.userId === userId);

    if (filters) {
      if (filters.severity) {
        alerts = alerts.filter(a => a.severity === filters.severity);
      }
      if (filters.alertType) {
        alerts = alerts.filter(a => a.alertType === filters.alertType);
      }
      if (filters.resolved !== undefined) {
        alerts = alerts.filter(a => a.resolved === filters.resolved);
      }
      if (filters.startDate) {
        alerts = alerts.filter(a => a.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        alerts = alerts.filter(a => a.timestamp <= filters.endDate!);
      }
    }

    return alerts.sort((a, b) => b.timestamp - a.timestamp);
  }

  getUnresolvedAlerts(userId: string): SecurityAlert[] {
    return this.getAlerts(userId, { resolved: false });
  }

  getCriticalAlerts(userId: string): SecurityAlert[] {
    return this.getAlerts(userId, { severity: 'critical', resolved: false });
  }

  getAlertStatistics(userId: string, timeframe: number = 2592000000): {
    totalAlerts: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    resolvedCount: number;
    averageResolutionTime: number;
  } {
    const cutoff = Date.now() - timeframe;
    const alerts = this.getAlerts(userId).filter(a => a.timestamp >= cutoff);

    const bySeverity: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let totalResolutionTime = 0;
    let resolvedCount = 0;

    alerts.forEach(alert => {
      bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
      byType[alert.alertType] = (byType[alert.alertType] || 0) + 1;

      if (alert.resolved && alert.resolvedAt) {
        resolvedCount++;
        totalResolutionTime += alert.resolvedAt - alert.timestamp;
      }
    });

    return {
      totalAlerts: alerts.length,
      bySeverity,
      byType,
      resolvedCount,
      averageResolutionTime: resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0,
    };
  }

  getIncidentResponses(alertId: string): IncidentResponse[] {
    return this.responses.filter(r => r.alertId === alertId);
  }

  configureAlertThreshold(alertType: string, threshold: number): void {
    this.alertThresholds.set(alertType, threshold);
  }

  getAlertThreshold(alertType: string): number {
    return this.alertThresholds.get(alertType) || 1;
  }

  bulkResolveAlerts(alertIds: string[], resolvedBy: string): number {
    let resolved = 0;

    alertIds.forEach(id => {
      if (this.resolveAlert(id, resolvedBy)) {
        resolved++;
      }
    });

    return resolved;
  }

  escalateAlert(alertId: string, newSeverity: 'high' | 'critical'): boolean {
    const alert = this.alerts.get(alertId);

    if (alert && !alert.resolved) {
      alert.severity = newSeverity;
      alert.channels = this.determineChannels(newSeverity);
      this.deliverAlert(alert);
      return true;
    }

    return false;
  }

  getAlertTrends(userId: string, days: number = 30): {
    dailyAlerts: Array<{ date: string; count: number }>;
    trendDirection: 'increasing' | 'decreasing' | 'stable';
  } {
    const cutoff = Date.now() - days * 86400000;
    const alerts = this.getAlerts(userId).filter(a => a.timestamp >= cutoff);

    const dailyCounts = new Map<string, number>();

    alerts.forEach(alert => {
      const date = new Date(alert.timestamp).toISOString().split('T')[0];
      dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
    });

    const dailyAlerts = Array.from(dailyCounts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    let trendDirection: 'increasing' | 'decreasing' | 'stable' = 'stable';

    if (dailyAlerts.length >= 7) {
      const firstWeek = dailyAlerts.slice(0, 7).reduce((sum, d) => sum + d.count, 0);
      const lastWeek = dailyAlerts.slice(-7).reduce((sum, d) => sum + d.count, 0);

      if (lastWeek > firstWeek * 1.2) {
        trendDirection = 'increasing';
      } else if (lastWeek < firstWeek * 0.8) {
        trendDirection = 'decreasing';
      }
    }

    return { dailyAlerts, trendDirection };
  }
}
