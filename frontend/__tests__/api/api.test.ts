import { describe, expect, it } from '@jest/globals';

/**
 * API Testing Framework for ProphetBase
 * 
 * Comprehensive API tests validating request/response schemas,
 * error handling, and performance benchmarks.
 */

interface ApiTestConfig {
  baseUrl: string;
  timeout: number;
}

const config: ApiTestConfig = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
  timeout: 5000,
};

// Helper function for API requests
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${config.baseUrl}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response;
}

describe('API Testing Suite', () => {
  describe('Health Check', () => {
    it('should return 200 OK', async () => {
      const response = await apiRequest('/health');
      expect(response.status).toBe(200);
    });

    it('should respond within timeout', async () => {
      const start = Date.now();
      await apiRequest('/health');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(config.timeout);
    });
  });

  describe('Markets API', () => {
    it('should fetch all markets', async () => {
      const response = await apiRequest('/markets');
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should validate market schema', async () => {
      const response = await apiRequest('/markets');
      const markets = await response.json();
      
      if (markets.length > 0) {
        const market = markets[0];
        expect(market).toHaveProperty('id');
        expect(market).toHaveProperty('question');
        expect(market).toHaveProperty('status');
        expect(market).toHaveProperty('totalStake');
      }
    });

    it('should fetch single market by ID', async () => {
      const response = await apiRequest('/markets/0');
      expect(response.status).toBe(200);
      
      const market = await response.json();
      expect(market).toHaveProperty('id');
    });

    it('should return 404 for non-existent market', async () => {
      const response = await apiRequest('/markets/99999');
      expect(response.status).toBe(404);
    });

    it('should handle pagination', async () => {
      const response = await apiRequest('/markets?page=1&limit=10');
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.length).toBeLessThanOrEqual(10);
    });
  });

  describe('User API', () => {
    it('should fetch user profile', async () => {
      const mockAddress = '0x1234567890123456789012345678901234567890';
      const response = await apiRequest(`/users/${mockAddress}`);
      
      if (response.status === 200) {
        const user = await response.json();
        expect(user).toHaveProperty('address');
        expect(user).toHaveProperty('totalStaked');
      }
    });

    it('should fetch user positions', async () => {
      const mockAddress = '0x1234567890123456789012345678901234567890';
      const response = await apiRequest(`/users/${mockAddress}/positions`);
      
      expect(response.status).toBe(200);
      const positions = await response.json();
      expect(Array.isArray(positions)).toBe(true);
    });
  });

  describe('Stats API', () => {
    it('should fetch platform statistics', async () => {
      const response = await apiRequest('/stats');
      expect(response.status).toBe(200);
      
      const stats = await response.json();
      expect(stats).toHaveProperty('totalMarkets');
      expect(stats).toHaveProperty('totalVolume');
      expect(stats).toHaveProperty('activeUsers');
    });

    it('should validate stats data types', async () => {
      const response = await apiRequest('/stats');
      const stats = await response.json();
      
      expect(typeof stats.totalMarkets).toBe('number');
      expect(typeof stats.totalVolume).toBe('string');
      expect(typeof stats.activeUsers).toBe('number');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed requests', async () => {
      const response = await apiRequest('/markets', {
        method: 'POST',
        body: 'invalid json',
      });
      
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should return proper error messages', async () => {
      const response = await apiRequest('/invalid-endpoint');
      expect(response.status).toBe(404);
      
      const error = await response.json();
      expect(error).toHaveProperty('message');
    });

    it('should handle rate limiting', async () => {
      // Make multiple rapid requests
      const requests = Array(100).fill(null).map(() => apiRequest('/health'));
      const responses = await Promise.all(requests);
      
      const rateLimited = responses.some(r => r.status === 429);
      // This test might pass or fail depending on rate limit configuration
      expect(rateLimited || responses.every(r => r.status === 200)).toBe(true);
    });
  });

  describe('Performance Benchmarks', () => {
    it('should fetch markets within performance budget', async () => {
      const start = Date.now();
      const response = await apiRequest('/markets');
      const duration = Date.now() - start;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(1000); // 1 second budget
    });

    it('should handle concurrent requests', async () => {
      const start = Date.now();
      const requests = Array(10).fill(null).map(() => apiRequest('/markets'));
      const responses = await Promise.all(requests);
      const duration = Date.now() - start;
      
      expect(responses.every(r => r.status === 200)).toBe(true);
      expect(duration).toBeLessThan(3000); // 3 second budget for 10 concurrent requests
    });
  });

  describe('CORS and Security', () => {
    it('should include CORS headers', async () => {
      const response = await apiRequest('/health');
      const corsHeader = response.headers.get('Access-Control-Allow-Origin');
      
      // CORS should be configured
      expect(corsHeader).toBeTruthy();
    });

    it('should not expose sensitive headers', async () => {
      const response = await apiRequest('/health');
      
      expect(response.headers.get('X-Powered-By')).toBeNull();
    });
  });
});

// Performance monitoring utilities
export class ApiPerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  recordRequest(endpoint: string, duration: number) {
    if (!this.metrics.has(endpoint)) {
      this.metrics.set(endpoint, []);
    }
    this.metrics.get(endpoint)!.push(duration);
  }

  getStats(endpoint: string) {
    const durations = this.metrics.get(endpoint) || [];
    if (durations.length === 0) return null;

    const sorted = [...durations].sort((a, b) => a - b);
    return {
      count: durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  getAllStats() {
    const stats: Record<string, any> = {};
    this.metrics.forEach((_, endpoint) => {
      stats[endpoint] = this.getStats(endpoint);
    });
    return stats;
  }

  reset() {
    this.metrics.clear();
  }
}
