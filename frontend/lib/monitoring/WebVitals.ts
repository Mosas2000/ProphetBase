/**
 * Core Web Vitals Tracking
 * Monitors LCP, FID, CLS and provides optimization suggestions
 */

interface WebVital {
  name: 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

interface WebVitalsReport {
  lcp?: WebVital;
  fid?: WebVital;
  cls?: WebVital;
  fcp?: WebVital;
  ttfb?: WebVital;
  score: number;
  suggestions: string[];
}

class WebVitals {
  private vitals: Map<string, WebVital> = new Map();
  private callbacks: Set<(vital: WebVital) => void> = new Set();

  constructor() {
    this.initObservers();
  }

  /**
   * Initialize performance observers
   */
  private initObservers(): void {
    if (typeof window === 'undefined') return;

    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();
  }

  /**
   * Observe Largest Contentful Paint
   */
  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;

        const vital: WebVital = {
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          rating: this.rateLCP(lastEntry.renderTime || lastEntry.loadTime),
          delta: lastEntry.renderTime || lastEntry.loadTime,
          id: this.generateId(),
        };

        this.vitals.set('LCP', vital);
        this.notifyCallbacks(vital);
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (error) {
      console.error('Failed to observe LCP:', error);
    }
  }

  /**
   * Observe First Input Delay
   */
  private observeFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstInput = entries[0] as any;

        const vital: WebVital = {
          name: 'FID',
          value: firstInput.processingStart - firstInput.startTime,
          rating: this.rateFID(firstInput.processingStart - firstInput.startTime),
          delta: firstInput.processingStart - firstInput.startTime,
          id: this.generateId(),
        };

        this.vitals.set('FID', vital);
        this.notifyCallbacks(vital);
      });

      observer.observe({ type: 'first-input', buffered: true });
    } catch (error) {
      console.error('Failed to observe FID:', error);
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  private observeCLS(): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }

        const vital: WebVital = {
          name: 'CLS',
          value: clsValue,
          rating: this.rateCLS(clsValue),
          delta: clsValue,
          id: this.generateId(),
        };

        this.vitals.set('CLS', vital);
        this.notifyCallbacks(vital);
      });

      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
      console.error('Failed to observe CLS:', error);
    }
  }

  /**
   * Observe First Contentful Paint
   */
  private observeFCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[0];

        const vital: WebVital = {
          name: 'FCP',
          value: fcp.startTime,
          rating: this.rateFCP(fcp.startTime),
          delta: fcp.startTime,
          id: this.generateId(),
        };

        this.vitals.set('FCP', vital);
        this.notifyCallbacks(vital);
      });

      observer.observe({ type: 'paint', buffered: true });
    } catch (error) {
      console.error('Failed to observe FCP:', error);
    }
  }

  /**
   * Observe Time to First Byte
   */
  private observeTTFB(): void {
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as any;
      if (navigation) {
        const vital: WebVital = {
          name: 'TTFB',
          value: navigation.responseStart,
          rating: this.rateTTFB(navigation.responseStart),
          delta: navigation.responseStart,
          id: this.generateId(),
        };

        this.vitals.set('TTFB', vital);
        this.notifyCallbacks(vital);
      }
    } catch (error) {
      console.error('Failed to observe TTFB:', error);
    }
  }

  /**
   * Rating functions
   */
  private rateLCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private rateFID(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private rateCLS(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  private rateFCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 1800) return 'good';
    if (value <= 3000) return 'needs-improvement';
    return 'poor';
  }

  private rateTTFB(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 800) return 'good';
    if (value <= 1800) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Subscribe to vital updates
   */
  onVital(callback: (vital: WebVital) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * Get report with suggestions
   */
  getReport(): WebVitalsReport {
    const lcp = this.vitals.get('LCP');
    const fid = this.vitals.get('FID');
    const cls = this.vitals.get('CLS');
    const fcp = this.vitals.get('FCP');
    const ttfb = this.vitals.get('TTFB');

    const score = this.calculateScore();
    const suggestions = this.generateSuggestions();

    return { lcp, fid, cls, fcp, ttfb, score, suggestions };
  }

  /**
   * Calculate overall performance score
   */
  private calculateScore(): number {
    let score = 100;
    const vitals = Array.from(this.vitals.values());

    vitals.forEach((vital) => {
      if (vital.rating === 'poor') score -= 20;
      else if (vital.rating === 'needs-improvement') score -= 10;
    });

    return Math.max(0, score);
  }

  /**
   * Generate optimization suggestions
   */
  private generateSuggestions(): string[] {
    const suggestions: string[] = [];
    const lcp = this.vitals.get('LCP');
    const fid = this.vitals.get('FID');
    const cls = this.vitals.get('CLS');

    if (lcp && lcp.rating !== 'good') {
      suggestions.push('Optimize images and use lazy loading');
      suggestions.push('Reduce server response time');
      suggestions.push('Eliminate render-blocking resources');
    }

    if (fid && fid.rating !== 'good') {
      suggestions.push('Break up long JavaScript tasks');
      suggestions.push('Optimize event handlers');
      suggestions.push('Use web workers for heavy computations');
    }

    if (cls && cls.rating !== 'good') {
      suggestions.push('Add size attributes to images and videos');
      suggestions.push('Avoid inserting content above existing content');
      suggestions.push('Use transform animations instead of layout changes');
    }

    return suggestions;
  }

  /**
   * Notify callbacks
   */
  private notifyCallbacks(vital: WebVital): void {
    this.callbacks.forEach((callback) => callback(vital));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton
export const webVitals = new WebVitals();

// React hook for web vitals
export function useWebVitals() {
  const [report, setReport] = React.useState<WebVitalsReport | null>(null);

  React.useEffect(() => {
    const unsubscribe = webVitals.onVital(() => {
      setReport(webVitals.getReport());
    });

    return unsubscribe;
  }, []);

  return report;
}

import React from 'react';
