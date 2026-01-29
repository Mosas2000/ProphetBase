'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

/**
 * Mobile-specific performance monitoring component
 */
export default function MobileVitals() {
  useEffect(() => {
    // Only track if on a mobile device and in production
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      const logMetric = ({ name, value, id, delta }: any) => {
        const metric = {
          event: 'mobile_performance',
          metric_name: name,
          metric_value: value,
          metric_id: id,
          metric_delta: delta,
          device: 'mobile',
          connection: (navigator as any).connection?.effectiveType || 'unknown',
          timestamp: new Date().toISOString()
        };

        // In a real app, send to analytics endpoint
        console.log(`[MobileVitals] ${name}:`, metric);
        
        // Example: analytics.track('Web Vitals', metric);
      };

      onCLS(logMetric);
      onFID(logMetric);
      onLCP(logMetric);
      onFCP(logMetric);
      onTTFB(logMetric);

      // Track Battery Status if available
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          console.log('[MobileVitals] Battery:', {
            level: battery.level,
            charging: battery.charging
          });
        });
      }
    }
  }, []);

  return null; // Headless component
}
