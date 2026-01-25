'use client';

import { useEffect, useState } from 'react';
import { Activity, AlertCircle, TrendingUp, Zap } from 'lucide-react';

// Core Web Vitals
export interface WebVitals {
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  FCP: number; // First Contentful Paint
  TTFB: number; // Time to First Byte
}

// Custom metrics
export interface CustomMetrics {
  apiResponseTime: number;
  componentRenderTime: number;
  pageLoadTime: number;
  resourceLoadTime: number;
  errorCount: number;
}

// Performance monitor class
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private errorCount: number = 0;
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined') return;

    // Observe Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.recordMetric('LCP', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observation not supported');
    }

    // Observe First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID observation not supported');
    }

    // Observe Layout Shifts
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.recordMetric('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS observation not supported');
    }
  }

  recordMetric(name: string, value: number): void {
    const metrics = this.metrics.get(name) || [];
    metrics.push(value);
    this.metrics.set(name, metrics);

    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  recordError(): void {
    this.errorCount++;
  }

  getMetric(name: string): number | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return null;
    return metrics[metrics.length - 1];
  }

  getAverageMetric(name: string): number | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return null;
    return metrics.reduce((sum, val) => sum + val, 0) / metrics.length;
  }

  getWebVitals(): Partial<WebVitals> {
    return {
      LCP: this.getMetric('LCP') || undefined,
      FID: this.getMetric('FID') || undefined,
      CLS: this.getMetric('CLS') || undefined,
      FCP: this.getMetric('FCP') || undefined,
      TTFB: this.getMetric('TTFB') || undefined,
    };
  }

  getPerformanceScore(): number {
    const vitals = this.getWebVitals();
    let score = 100;

    // LCP scoring (target: < 2.5s)
    if (vitals.LCP) {
      if (vitals.LCP > 4000) score -= 25;
      else if (vitals.LCP > 2500) score -= 10;
    }

    // FID scoring (target: < 100ms)
    if (vitals.FID) {
      if (vitals.FID > 300) score -= 25;
      else if (vitals.FID > 100) score -= 10;
    }

    // CLS scoring (target: < 0.1)
    if (vitals.CLS) {
      if (vitals.CLS > 0.25) score -= 25;
      else if (vitals.CLS > 0.1) score -= 10;
    }

    return Math.max(0, score);
  }

  getAllMetrics() {
    const result: Record<string, any> = {};
    this.metrics.forEach((values, name) => {
      result[name] = {
        current: values[values.length - 1],
        average: values.reduce((sum, val) => sum + val, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });
    return result;
  }

  reset(): void {
    this.metrics.clear();
    this.errorCount = 0;
  }

  disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Real User Monitoring
export class RealUserMonitoring {
  private sessionId: string;
  private events: Array<{
    type: string;
    timestamp: number;
    data: any;
  }> = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupListeners();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupListeners(): void {
    if (typeof window === 'undefined') return;

    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('visibility', {
        visible: !document.hidden,
      });
    });

    // Track errors
    window.addEventListener('error', (event) => {
      this.trackEvent('error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('unhandledRejection', {
        reason: event.reason,
      });
    });
  }

  trackEvent(type: string, data: any): void {
    this.events.push({
      type,
      timestamp: Date.now(),
      data,
    });

    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events.shift();
    }
  }

  async sendToAnalytics(): Promise<void> {
    if (this.events.length === 0) return;

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          events: this.events,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        }),
      });

      this.events = [];
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }

  getEvents() {
    return this.events;
  }

  getSessionId() {
    return this.sessionId;
  }
}

// Performance budget
export interface PerformanceBudget {
  LCP: number;
  FID: number;
  CLS: number;
  totalSize: number;
  scriptSize: number;
  imageSize: number;
}

export class PerformanceBudgetMonitor {
  private budget: PerformanceBudget;
  private violations: string[] = [];

  constructor(budget: PerformanceBudget) {
    this.budget = budget;
  }

  checkBudget(metrics: Partial<WebVitals>, resourceSizes?: any): void {
    this.violations = [];

    if (metrics.LCP && metrics.LCP > this.budget.LCP) {
      this.violations.push(`LCP exceeded: ${metrics.LCP}ms > ${this.budget.LCP}ms`);
    }

    if (metrics.FID && metrics.FID > this.budget.FID) {
      this.violations.push(`FID exceeded: ${metrics.FID}ms > ${this.budget.FID}ms`);
    }

    if (metrics.CLS && metrics.CLS > this.budget.CLS) {
      this.violations.push(`CLS exceeded: ${metrics.CLS} > ${this.budget.CLS}`);
    }

    if (resourceSizes) {
      if (resourceSizes.totalSize > this.budget.totalSize) {
        this.violations.push(
          `Total size exceeded: ${resourceSizes.totalSize} > ${this.budget.totalSize}`
        );
      }
    }
  }

  hasViolations(): boolean {
    return this.violations.length > 0;
  }

  getViolations(): string[] {
    return this.violations;
  }

  getBudget(): PerformanceBudget {
    return this.budget;
  }
}

// Performance dashboard component
export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<Partial<WebVitals>>({});
  const [score, setScore] = useState(100);

  useEffect(() => {
    const monitor = new PerformanceMonitor();

    const interval = setInterval(() => {
      setMetrics(monitor.getWebVitals());
      setScore(monitor.getPerformanceScore());
    }, 1000);

    return () => {
      clearInterval(interval);
      monitor.disconnect();
    };
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-6 bg-slate-800 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold">Performance Monitor</h2>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">Performance Score</span>
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              score >= 90
                ? 'bg-green-500'
                : score >= 50
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard
          icon={<Zap className="w-5 h-5" />}
          label="LCP"
          value={metrics.LCP}
          unit="ms"
          target={2500}
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="FID"
          value={metrics.FID}
          unit="ms"
          target={100}
        />
        <MetricCard
          icon={<AlertCircle className="w-5 h-5" />}
          label="CLS"
          value={metrics.CLS}
          unit=""
          target={0.1}
        />
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  unit,
  target,
}: {
  icon: React.ReactNode;
  label: string;
  value?: number;
  unit: string;
  target: number;
}) {
  const isGood = value ? value <= target : false;

  return (
    <div className="p-4 bg-slate-700 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <div
        className={`text-2xl font-bold ${
          isGood ? 'text-green-400' : 'text-yellow-400'
        }`}
      >
        {value ? `${value.toFixed(0)}${unit}` : '-'}
      </div>
      <div className="text-xs text-slate-500">Target: {target}{unit}</div>
    </div>
  );
}

// Export singleton instances
export const performanceMonitor = new PerformanceMonitor();
export const rum = new RealUserMonitoring();
export const budgetMonitor = new PerformanceBudgetMonitor({
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  totalSize: 500000,
  scriptSize: 200000,
  imageSize: 200000,
});
