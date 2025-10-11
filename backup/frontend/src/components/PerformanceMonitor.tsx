import React, { useEffect, useState, useCallback } from 'react';
// import { getCacheStats } from '../services/api.ts';

interface PerformanceMetrics {
  renderTime: number;
  apiRequests: number;
  cacheHitRate: number;
  bundleSize: number;
  memoryUsage: number;
  networkSpeed: number;
}

interface Props {
  enabled?: boolean;
  showInProduction?: boolean;
}

const PerformanceMonitor: React.FC<Props> = ({ 
  enabled = process.env.NODE_ENV === 'development',
  showInProduction = false 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    apiRequests: 0,
    cacheHitRate: 0,
    bundleSize: 0,
    memoryUsage: 0,
    networkSpeed: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  const shouldShow = enabled || (process.env.NODE_ENV === 'production' && showInProduction);

  const measurePerformance = useCallback(() => {
    if (!shouldShow) return;

    // Get API cache stats from real API
    const cacheStats = {
      requests: 0,
      size: 0,
      avgResponseTime: 0
    };
    
    // Get memory usage (if available)
    const memoryInfo = (performance as { memory?: { usedJSHeapSize: number } }).memory;
    const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0;

    // Get network information (if available)
    const connection = (navigator as { connection?: { downlink: number } }).connection;
    const networkSpeed = connection ? connection.downlink || 0 : 0;

    // Calculate render time (approximate)
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const renderTime = navigationTiming ? navigationTiming.loadEventEnd - (navigationTiming as unknown as { navigationStart: number }).navigationStart : 0;

    setMetrics({
      renderTime: Math.round(renderTime),
      apiRequests: cacheStats.requests,
      cacheHitRate: cacheStats.size > 0 ? Math.round((cacheStats.size / cacheStats.requests) * 100) : 0,
      bundleSize: 0, // This would need to be calculated at build time
      memoryUsage: Math.round(memoryUsage),
      networkSpeed: Math.round(networkSpeed),
    });
  }, [shouldShow]);

  useEffect(() => {
    if (!shouldShow) return;

    measurePerformance();
    const interval = setInterval(measurePerformance, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [measurePerformance, shouldShow]);

  // Performance monitoring for Core Web Vitals
  useEffect(() => {
    if (!shouldShow) return;

    // Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
        }
        if (entry.entryType === 'first-input') {
        }
        if (entry.entryType === 'layout-shift') {
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

    return () => observer.disconnect();
  }, [shouldShow]);

  // Log slow components
  useEffect(() => {
    if (!shouldShow) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.duration > 16) {
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-50"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Performance indicator */}
      <div className="bg-green-500 text-white px-3 py-2 rounded-full cursor-pointer shadow-lg">
        ⚡ {metrics.renderTime}ms
      </div>

      {/* Detailed metrics panel */}
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 min-w-64">
          <h3 className="font-bold text-sm mb-3 text-gray-800 dark:text-gray-200">
            Performance Metrics
          </h3>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Render Time:</span>
              <span className={`font-mono ${metrics.renderTime > 2000 ? 'text-red-500' : 'text-green-500'}`}>
                {metrics.renderTime}ms
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">API Requests:</span>
              <span className="font-mono text-blue-500">{metrics.apiRequests}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Cache Hit Rate:</span>
              <span className={`font-mono ${metrics.cacheHitRate > 50 ? 'text-green-500' : 'text-orange-500'}`}>
                {metrics.cacheHitRate}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Memory Usage:</span>
              <span className={`font-mono ${metrics.memoryUsage > 100 ? 'text-red-500' : 'text-green-500'}`}>
                {metrics.memoryUsage}MB
              </span>
            </div>
            
            {metrics.networkSpeed > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Network Speed:</span>
                <span className="font-mono text-purple-500">{metrics.networkSpeed} Mbps</span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={measurePerformance}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
            >
              Refresh Metrics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// HOC moved to separate file to avoid fast refresh warning

export default PerformanceMonitor;
