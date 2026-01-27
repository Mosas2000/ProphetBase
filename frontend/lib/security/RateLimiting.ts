export interface RateLimitRule {
  identifier: string;
  windowMs: number;
  maxRequests: number;
  tier: 'basic' | 'premium' | 'enterprise';
  reputationModifier: number;
}

export interface RateLimitRecord {
  identifier: string;
  requests: number[];
  blocked: number;
  lastReset: number;
  reputation: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

export class RateLimitingService {
  private records: Map<string, RateLimitRecord> = new Map();
  private rules: Map<string, RateLimitRule> = new Map();
  private readonly CLEANUP_INTERVAL = 60000;

  constructor() {
    this.initializeDefaultRules();
    this.startCleanupProcess();
  }

  private initializeDefaultRules(): void {
    this.rules.set('api:basic', {
      identifier: 'api:basic',
      windowMs: 60000,
      maxRequests: 60,
      tier: 'basic',
      reputationModifier: 1.0,
    });

    this.rules.set('api:premium', {
      identifier: 'api:premium',
      windowMs: 60000,
      maxRequests: 300,
      tier: 'premium',
      reputationModifier: 1.2,
    });

    this.rules.set('api:enterprise', {
      identifier: 'api:enterprise',
      windowMs: 60000,
      maxRequests: 1000,
      tier: 'enterprise',
      reputationModifier: 1.5,
    });

    this.rules.set('login', {
      identifier: 'login',
      windowMs: 900000,
      maxRequests: 5,
      tier: 'basic',
      reputationModifier: 1.0,
    });

    this.rules.set('password_reset', {
      identifier: 'password_reset',
      windowMs: 3600000,
      maxRequests: 3,
      tier: 'basic',
      reputationModifier: 1.0,
    });
  }

  checkRateLimit(
    identifier: string,
    ruleId: string,
    reputation: number = 0.5
  ): RateLimitResult {
    const rule = this.rules.get(ruleId);
    
    if (!rule) {
      return {
        allowed: true,
        remaining: -1,
        resetAt: Date.now(),
      };
    }

    const recordKey = `${identifier}:${ruleId}`;
    let record = this.records.get(recordKey);

    if (!record) {
      record = {
        identifier: recordKey,
        requests: [],
        blocked: 0,
        lastReset: Date.now(),
        reputation,
      };
      this.records.set(recordKey, record);
    }

    const now = Date.now();
    const windowStart = now - rule.windowMs;

    record.requests = record.requests.filter(timestamp => timestamp > windowStart);

    const adjustedLimit = this.calculateAdjustedLimit(rule, reputation);

    if (record.requests.length >= adjustedLimit) {
      record.blocked++;
      
      const oldestRequest = record.requests[0];
      const retryAfter = Math.ceil((oldestRequest + rule.windowMs - now) / 1000);

      return {
        allowed: false,
        remaining: 0,
        resetAt: oldestRequest + rule.windowMs,
        retryAfter,
      };
    }

    record.requests.push(now);
    record.reputation = reputation;

    return {
      allowed: true,
      remaining: adjustedLimit - record.requests.length,
      resetAt: record.requests[0] + rule.windowMs,
    };
  }

  private calculateAdjustedLimit(rule: RateLimitRule, reputation: number): number {
    const reputationBonus = reputation > 0.7 ? Math.floor(rule.maxRequests * 0.2) : 0;
    const reputationPenalty = reputation < 0.3 ? Math.floor(rule.maxRequests * 0.3) : 0;

    const adjustedLimit = Math.floor(
      rule.maxRequests * rule.reputationModifier + reputationBonus - reputationPenalty
    );

    return Math.max(1, adjustedLimit);
  }

  configureTier(identifier: string, tier: 'basic' | 'premium' | 'enterprise'): void {
    const ruleId = `api:${tier}`;
    const rule = this.rules.get(ruleId);
    
    if (rule) {
    }
  }

  updateReputation(identifier: string, ruleId: string, newReputation: number): void {
    const recordKey = `${identifier}:${ruleId}`;
    const record = this.records.get(recordKey);

    if (record) {
      record.reputation = Math.max(0, Math.min(1, newReputation));
    }
  }

  addCustomRule(rule: RateLimitRule): void {
    this.rules.set(rule.identifier, rule);
  }

  removeCustomRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  getRecordStatistics(identifier: string, ruleId: string): {
    totalRequests: number;
    blockedRequests: number;
    currentReputation: number;
    averageRequestsPerWindow: number;
  } | null {
    const recordKey = `${identifier}:${ruleId}`;
    const record = this.records.get(recordKey);

    if (!record) {
      return null;
    }

    return {
      totalRequests: record.requests.length,
      blockedRequests: record.blocked,
      currentReputation: record.reputation,
      averageRequestsPerWindow: record.requests.length,
    };
  }

  resetLimit(identifier: string, ruleId: string): boolean {
    const recordKey = `${identifier}:${ruleId}`;
    const record = this.records.get(recordKey);

    if (record) {
      record.requests = [];
      record.blocked = 0;
      record.lastReset = Date.now();
      return true;
    }

    return false;
  }

  detectBruteForce(identifier: string): {
    detected: boolean;
    severity: 'low' | 'medium' | 'high';
    details: string;
  } {
    const loginKey = `${identifier}:login`;
    const record = this.records.get(loginKey);

    if (!record) {
      return { detected: false, severity: 'low', details: 'No login activity' };
    }

    if (record.blocked > 10) {
      return {
        detected: true,
        severity: 'high',
        details: `${record.blocked} blocked login attempts`,
      };
    }

    if (record.blocked > 5) {
      return {
        detected: true,
        severity: 'medium',
        details: `${record.blocked} blocked login attempts`,
      };
    }

    if (record.requests.length > 20) {
      return {
        detected: true,
        severity: 'low',
        details: `${record.requests.length} login attempts in window`,
      };
    }

    return { detected: false, severity: 'low', details: 'Normal activity' };
  }

  private startCleanupProcess(): void {
    if (typeof setInterval !== 'undefined') {
      setInterval(() => {
        this.cleanupOldRecords();
      }, this.CLEANUP_INTERVAL);
    }
  }

  private cleanupOldRecords(): void {
    const now = Date.now();
    const maxAge = 3600000;

    for (const [key, record] of this.records.entries()) {
      if (record.requests.length === 0 && now - record.lastReset > maxAge) {
        this.records.delete(key);
      }
    }
  }

  getRuleDetails(ruleId: string): RateLimitRule | null {
    return this.rules.get(ruleId) || null;
  }

  getAllRules(): RateLimitRule[] {
    return Array.from(this.rules.values());
  }

  getActiveRecords(): RateLimitRecord[] {
    const now = Date.now();
    return Array.from(this.records.values()).filter(
      record => record.requests.some(timestamp => now - timestamp < 900000)
    );
  }

  adjustLimitDynamically(
    ruleId: string,
    systemLoad: number,
    errorRate: number
  ): void {
    const rule = this.rules.get(ruleId);
    if (!rule) return;

    if (systemLoad > 0.8 || errorRate > 0.1) {
      rule.maxRequests = Math.floor(rule.maxRequests * 0.7);
    } else if (systemLoad < 0.3 && errorRate < 0.01) {
      rule.maxRequests = Math.floor(rule.maxRequests * 1.2);
    }
  }
}
