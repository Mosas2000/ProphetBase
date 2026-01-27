import * as crypto from 'crypto';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  method?: string;
  endpoint?: string;
  statusCode?: number;
  ipAddress: string;
  userAgent: string;
  timestamp: number;
  metadata: Record<string, any>;
  checksum: string;
}

export interface AuditSearchQuery {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: number;
  endDate?: number;
  ipAddress?: string;
  limit?: number;
  offset?: number;
}

export interface AuditExport {
  logs: AuditLog[];
  exportedAt: number;
  exportedBy: string;
  format: 'json' | 'csv' | 'pdf';
  signature: string;
}

export class AuditLoggingSystem {
  private logs: AuditLog[] = [];
  private previousChecksum: string = '';

  logAction(
    userId: string,
    action: string,
    resource: string,
    metadata: Record<string, any> = {},
    request?: {
      method?: string;
      endpoint?: string;
      statusCode?: number;
      ipAddress?: string;
      userAgent?: string;
    }
  ): AuditLog {
    const log: AuditLog = {
      id: this.generateLogId(),
      userId,
      action,
      resource,
      resourceId: metadata.resourceId,
      method: request?.method,
      endpoint: request?.endpoint,
      statusCode: request?.statusCode,
      ipAddress: request?.ipAddress || 'unknown',
      userAgent: request?.userAgent || 'unknown',
      timestamp: Date.now(),
      metadata,
      checksum: '',
    };

    log.checksum = this.calculateChecksum(log);

    this.logs.push(log);
    this.previousChecksum = log.checksum;

    return log;
  }

  private generateLogId(): string {
    return 'log_' + crypto.randomBytes(16).toString('hex');
  }

  private calculateChecksum(log: AuditLog): string {
    const dataToHash = JSON.stringify({
      id: log.id,
      userId: log.userId,
      action: log.action,
      resource: log.resource,
      timestamp: log.timestamp,
      metadata: log.metadata,
      previousChecksum: this.previousChecksum,
    });

    return crypto.createHash('sha256').update(dataToHash).digest('hex');
  }

  verifyLogIntegrity(log: AuditLog): boolean {
    const tempChecksum = log.checksum;
    const originalPrevChecksum = this.previousChecksum;

    const calculatedChecksum = this.calculateChecksum({ ...log, checksum: '' });

    return calculatedChecksum === tempChecksum;
  }

  verifyChainIntegrity(): { valid: boolean; tamperedLogs: string[] } {
    const tamperedLogs: string[] = [];
    let prevChecksum = '';

    for (const log of this.logs) {
      const tempPrevChecksum = this.previousChecksum;
      this.previousChecksum = prevChecksum;

      if (!this.verifyLogIntegrity(log)) {
        tamperedLogs.push(log.id);
      }

      prevChecksum = log.checksum;
      this.previousChecksum = tempPrevChecksum;
    }

    return {
      valid: tamperedLogs.length === 0,
      tamperedLogs,
    };
  }

  searchLogs(query: AuditSearchQuery): AuditLog[] {
    let results = [...this.logs];

    if (query.userId) {
      results = results.filter((log) => log.userId === query.userId);
    }

    if (query.action) {
      results = results.filter((log) =>
        log.action.toLowerCase().includes(query.action!.toLowerCase())
      );
    }

    if (query.resource) {
      results = results.filter((log) =>
        log.resource.toLowerCase().includes(query.resource!.toLowerCase())
      );
    }

    if (query.startDate) {
      results = results.filter((log) => log.timestamp >= query.startDate!);
    }

    if (query.endDate) {
      results = results.filter((log) => log.timestamp <= query.endDate!);
    }

    if (query.ipAddress) {
      results = results.filter((log) => log.ipAddress === query.ipAddress);
    }

    results.sort((a, b) => b.timestamp - a.timestamp);

    const offset = query.offset || 0;
    const limit = query.limit || 100;

    return results.slice(offset, offset + limit);
  }

  exportLogs(
    query: AuditSearchQuery,
    format: 'json' | 'csv' | 'pdf',
    exportedBy: string
  ): AuditExport {
    const logs = this.searchLogs({ ...query, limit: 10000 });

    const exportData: AuditExport = {
      logs,
      exportedAt: Date.now(),
      exportedBy,
      format,
      signature: '',
    };

    exportData.signature = this.signExport(exportData);

    return exportData;
  }

  private signExport(exportData: Omit<AuditExport, 'signature'>): string {
    const dataToSign = JSON.stringify({
      logCount: exportData.logs.length,
      exportedAt: exportData.exportedAt,
      exportedBy: exportData.exportedBy,
    });

    return crypto.createHash('sha256').update(dataToSign).digest('hex');
  }

  formatAsCSV(logs: AuditLog[]): string {
    const headers = [
      'ID',
      'User ID',
      'Action',
      'Resource',
      'Resource ID',
      'Method',
      'Endpoint',
      'Status Code',
      'IP Address',
      'User Agent',
      'Timestamp',
      'Checksum',
    ];

    const rows = logs.map((log) => [
      log.id,
      log.userId,
      log.action,
      log.resource,
      log.resourceId || '',
      log.method || '',
      log.endpoint || '',
      log.statusCode?.toString() || '',
      log.ipAddress,
      log.userAgent,
      new Date(log.timestamp).toISOString(),
      log.checksum,
    ]);

    return [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');
  }

  getActivitySummary(
    userId: string,
    timeframe: number = 86400000
  ): {
    totalActions: number;
    uniqueResources: number;
    topActions: Array<{ action: string; count: number }>;
    activityByHour: number[];
  } {
    const cutoff = Date.now() - timeframe;
    const userLogs = this.logs.filter(
      (log) => log.userId === userId && log.timestamp >= cutoff
    );

    const totalActions = userLogs.length;
    const uniqueResources = new Set(userLogs.map((log) => log.resource)).size;

    const actionCounts = new Map<string, number>();
    userLogs.forEach((log) => {
      actionCounts.set(log.action, (actionCounts.get(log.action) || 0) + 1);
    });

    const topActions = Array.from(actionCounts.entries())
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const activityByHour = new Array(24).fill(0);
    userLogs.forEach((log) => {
      const hour = new Date(log.timestamp).getHours();
      activityByHour[hour]++;
    });

    return {
      totalActions,
      uniqueResources,
      topActions,
      activityByHour,
    };
  }

  getRecentLogs(userId: string, limit: number = 50): AuditLog[] {
    return this.logs
      .filter((log) => log.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  archiveLogs(olderThan: number): { archived: number; remaining: number } {
    const cutoff = Date.now() - olderThan;
    const toArchive = this.logs.filter((log) => log.timestamp < cutoff);
    this.logs = this.logs.filter((log) => log.timestamp >= cutoff);

    return {
      archived: toArchive.length,
      remaining: this.logs.length,
    };
  }

  getSecurityEvents(userId: string, timeframe: number = 86400000): AuditLog[] {
    const cutoff = Date.now() - timeframe;
    const securityActions = [
      'login',
      'logout',
      'password_change',
      'api_key_created',
      '2fa_enabled',
      'permission_change',
    ];

    return this.logs.filter(
      (log) =>
        log.userId === userId &&
        log.timestamp >= cutoff &&
        securityActions.includes(log.action)
    );
  }
}
