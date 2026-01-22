/**
 * Performance Analytics and Monitoring
 * Tracks performance metrics, errors, and user behavior
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
}

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initPerformanceObserver();
    this.initErrorTracking();
  }

  /**
   * Track custom event
   */
  track(name: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(event);
    this.sendToBackend(event);
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string): void {
    this.track('page_view', {
      path,
      title: title || document.title,
      referrer: document.referrer,
    });
  }

  /**
   * Track user action
   */
  action(action: string, category: string, label?: string, value?: number): void {
    this.track('user_action', {
      action,
      category,
      label,
      value,
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(metric: PerformanceMetric): void {
    this.track('performance', metric);
  }

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Track conversion
   */
  conversion(type: string, value?: number): void {
    this.track('conversion', {
      type,
      value,
    });
  }

  /**
   * Track trade
   */
  trackTrade(marketId: number, position: string, amount: number): void {
    this.track('trade', {
      marketId,
      position,
      amount,
    });
  }

  /**
   * Track market view
   */
  trackMarketView(marketId: number, duration: number): void {
    this.track('market_view', {
      marketId,
      duration,
    });
  }

  /**
   * Initialize performance observer
   */
  private initPerformanceObserver(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.trackPerformance({
              name: 'page_load',
              value: entry.duration,
              rating: entry.duration < 2000 ? 'good' : entry.duration < 4000 ? 'needs-improvement' : 'poor',
            });
          }
        }
      });

      observer.observe({ entryTypes: ['navigation', 'resource'] });
    } catch (error) {
      console.error('Failed to initialize performance observer:', error);
    }
  }

  /**
   * Initialize error tracking
   */
  private initErrorTracking(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.trackError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(event.reason), {
        type: 'unhandled_rejection',
      });
    });
  }

  /**
   * Send event to backend
   */
  private async sendToBackend(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          sessionId: this.sessionId,
          userId: this.userId,
        }),
      });
    } catch (error) {
      // Silently fail - don't block user experience
      console.error('Failed to send analytics:', error);
    }
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get session statistics
   */
  getStats() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      events: this.events.length,
      duration: Date.now() - parseInt(this.sessionId.split('-')[0]),
    };
  }

  /**
   * Clear events
   */
  clear(): void {
    this.events = [];
  }
}

// Export singleton
export const analytics = new Analytics();

// React hook for analytics
export function useAnalytics() {
  React.useEffect(() => {
    analytics.pageView(window.location.pathname);
  }, []);

  return {
    track: analytics.track.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackTrade: analytics.trackTrade.bind(analytics),
  };
}

// HOC for tracking component views
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  eventName: string
) {
  return function AnalyticsWrapper(props: P) {
    React.useEffect(() => {
      analytics.track(`${eventName}_view`);
    }, []);

    return <Component {...props} />;
  };
}

import React from 'react';
