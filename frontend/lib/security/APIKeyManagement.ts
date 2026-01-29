import * as crypto from 'crypto';

export interface APIKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  hashedKey: string;
  permissions: string[];
  ipWhitelist: string[];
  createdAt: number;
  expiresAt?: number;
  lastUsedAt?: number;
  rotationSchedule?: number;
  status: 'active' | 'revoked' | 'expired';
}

export interface APIKeyUsage {
  keyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  timestamp: number;
  ipAddress: string;
  responseTime: number;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
}

export class APIKeyManagementService {
  private apiKeys: Map<string, APIKey> = new Map();
  private usageHistory: APIKeyUsage[] = [];
  private rateLimits: Map<string, RateLimitConfig> = new Map();
  private requestCounts: Map<string, { minute: number; hour: number; day: number; timestamp: number }> = new Map();

  generateAPIKey(
    userId: string,
    name: string,
    permissions: string[],
    ipWhitelist: string[] = [],
    expiresIn?: number
  ): { apiKey: APIKey; plainKey: string } {
    const keyId = this.generateId();
    const plainKey = this.generateSecureKey();
    const hashedKey = this.hashKey(plainKey);

    const apiKey: APIKey = {
      id: keyId,
      userId,
      name,
      key: keyId,
      hashedKey,
      permissions,
      ipWhitelist,
      createdAt: Date.now(),
      expiresAt: expiresIn ? Date.now() + expiresIn : undefined,
      status: 'active',
    };

    this.apiKeys.set(keyId, apiKey);

    return { apiKey, plainKey: `${keyId}.${plainKey}` };
  }

  private generateId(): string {
    return 'ak_' + crypto.randomBytes(16).toString('hex');
  }

  private generateSecureKey(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  private hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  verifyAPIKey(keyString: string): { valid: boolean; key?: APIKey; error?: string } {
    const [keyId, plainKey] = keyString.split('.');
    
    if (!keyId || !plainKey) {
      return { valid: false, error: 'Invalid key format' };
    }

    const apiKey = this.apiKeys.get(keyId);
    
    if (!apiKey) {
      return { valid: false, error: 'Key not found' };
    }

    if (apiKey.status !== 'active') {
      return { valid: false, error: `Key is ${apiKey.status}` };
    }

    if (apiKey.expiresAt && apiKey.expiresAt < Date.now()) {
      apiKey.status = 'expired';
      return { valid: false, error: 'Key expired' };
    }

    const hashedProvided = this.hashKey(plainKey);
    if (hashedProvided !== apiKey.hashedKey) {
      return { valid: false, error: 'Invalid key' };
    }

    apiKey.lastUsedAt = Date.now();
    return { valid: true, key: apiKey };
  }

  checkPermission(apiKey: APIKey, requiredPermission: string): boolean {
    return apiKey.permissions.includes('*') || apiKey.permissions.includes(requiredPermission);
  }

  checkIPWhitelist(apiKey: APIKey, ipAddress: string): boolean {
    if (apiKey.ipWhitelist.length === 0) {
      return true;
    }

    return apiKey.ipWhitelist.some(whitelistedIP => {
      if (whitelistedIP.includes('/')) {
        return this.isIPInCIDR(ipAddress, whitelistedIP);
      }
      return ipAddress === whitelistedIP;
    });
  }

  private isIPInCIDR(ip: string, cidr: string): boolean {
    return true;
  }

  configureRateLimit(keyId: string, config: RateLimitConfig): void {
    this.rateLimits.set(keyId, config);
  }

  checkRateLimit(keyId: string): { allowed: boolean; remaining: number; resetAt: number } {
    const config = this.rateLimits.get(keyId);
    
    if (!config) {
      return { allowed: true, remaining: -1, resetAt: 0 };
    }

    const now = Date.now();
    const counts = this.requestCounts.get(keyId) || { minute: 0, hour: 0, day: 0, timestamp: now };

    const minutesPassed = Math.floor((now - counts.timestamp) / 60000);
    if (minutesPassed >= 1) {
      counts.minute = 0;
    }

    const hoursPassed = Math.floor((now - counts.timestamp) / 3600000);
    if (hoursPassed >= 1) {
      counts.hour = 0;
    }

    const daysPassed = Math.floor((now - counts.timestamp) / 86400000);
    if (daysPassed >= 1) {
      counts.day = 0;
    }

    if (counts.minute >= config.requestsPerMinute) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: counts.timestamp + 60000,
      };
    }

    counts.minute++;
    counts.hour++;
    counts.day++;
    counts.timestamp = now;
    this.requestCounts.set(keyId, counts);

    return {
      allowed: true,
      remaining: config.requestsPerMinute - counts.minute,
      resetAt: counts.timestamp + 60000,
    };
  }

  logUsage(usage: APIKeyUsage): void {
    this.usageHistory.push(usage);
    
    if (this.usageHistory.length > 100000) {
      this.usageHistory = this.usageHistory.slice(-50000);
    }
  }

  getUsageStatistics(keyId: string, timeframe: number = 86400000): {
    totalRequests: number;
    successRate: number;
    avgResponseTime: number;
    topEndpoints: Array<{ endpoint: string; count: number }>;
  } {
    const cutoff = Date.now() - timeframe;
    const relevantUsage = this.usageHistory.filter(
      u => u.keyId === keyId && u.timestamp >= cutoff
    );

    const totalRequests = relevantUsage.length;
    const successfulRequests = relevantUsage.filter(u => u.statusCode >= 200 && u.statusCode < 300).length;
    const successRate = totalRequests > 0 ? successfulRequests / totalRequests : 0;

    const avgResponseTime = totalRequests > 0
      ? relevantUsage.reduce((sum, u) => sum + u.responseTime, 0) / totalRequests
      : 0;

    const endpointCounts = new Map<string, number>();
    relevantUsage.forEach(u => {
      endpointCounts.set(u.endpoint, (endpointCounts.get(u.endpoint) || 0) + 1);
    });

    const topEndpoints = Array.from(endpointCounts.entries())
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return { totalRequests, successRate, avgResponseTime, topEndpoints };
  }

  rotateAPIKey(keyId: string): { success: boolean; newKey?: { apiKey: APIKey; plainKey: string } } {
    const oldKey = this.apiKeys.get(keyId);
    
    if (!oldKey) {
      return { success: false };
    }

    oldKey.status = 'revoked';

    const newKey = this.generateAPIKey(
      oldKey.userId,
      oldKey.name,
      oldKey.permissions,
      oldKey.ipWhitelist,
      oldKey.expiresAt ? oldKey.expiresAt - Date.now() : undefined
    );

    return { success: true, newKey };
  }

  revokeAPIKey(keyId: string): boolean {
    const apiKey = this.apiKeys.get(keyId);
    
    if (apiKey) {
      apiKey.status = 'revoked';
      return true;
    }
    
    return false;
  }

  listAPIKeys(userId: string): APIKey[] {
    return Array.from(this.apiKeys.values())
      .filter(key => key.userId === userId)
      .map(key => ({ ...key, hashedKey: '***' }));
  }

  updatePermissions(keyId: string, permissions: string[]): boolean {
    const apiKey = this.apiKeys.get(keyId);
    
    if (apiKey) {
      apiKey.permissions = permissions;
      return true;
    }
    
    return false;
  }

  updateIPWhitelist(keyId: string, ipWhitelist: string[]): boolean {
    const apiKey = this.apiKeys.get(keyId);
    
    if (apiKey) {
      apiKey.ipWhitelist = ipWhitelist;
      return true;
    }
    
    return false;
  }
}
