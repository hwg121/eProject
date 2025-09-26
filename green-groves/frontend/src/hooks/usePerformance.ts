import { useEffect, useCallback, useRef, useState } from 'react';

// Hook for image lazy loading
export const useLazyLoading = (threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold]);

  return [ref, isIntersecting] as const;
};

// Hook for debouncing search inputs
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for API request caching
export const useApiCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { ttl?: number; enabled?: boolean } = {}
) => {
  const { ttl = 300000, enabled = true } = options; // 5 minutes default TTL
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCachedData = useCallback(() => {
    if (!enabled) return null;
    
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    try {
      const { data: cachedData, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > ttl;
      
      if (isExpired) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }
      
      return cachedData;
    } catch {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
  }, [key, ttl, enabled]);

  const setCachedData = useCallback((data: T) => {
    if (!enabled) return;
    
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }, [key, enabled]);

  const fetchData = useCallback(async (force = false) => {
    if (!enabled && !force) return;

    // Check cache first
    if (!force) {
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      setCachedData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [enabled, getCachedData, setCachedData, fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    clearCache: () => localStorage.removeItem(`cache_${key}`),
  };
};

// Hook for virtual scrolling (for large lists)
export const useVirtualScroll = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemsCount, items.length);

  const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
    item,
    index: startIndex + index,
  }));

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    setScrollTop(target.scrollTop);
  }, []);

  useEffect(() => {
    if (!containerRef) return;

    containerRef.addEventListener('scroll', handleScroll, { passive: true });
    return () => containerRef.removeEventListener('scroll', handleScroll);
  }, [containerRef, handleScroll]);

  return {
    visibleItems,
    totalHeight,
    startIndex,
    setContainerRef,
  };
};

// Hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(Date.now());
  const [renderTime, setRenderTime] = useState<number>(0);

  useEffect(() => {
    const endTime = Date.now();
    const duration = endTime - renderStartTime.current;
    setRenderTime(duration);

    // Log slow renders (> 16ms for 60fps)
    if (duration > 16) {
      console.warn(`Slow render detected in ${componentName}: ${duration}ms`);
    }

    // Update start time for next render
    renderStartTime.current = Date.now();
  });

  const measureAsync = useCallback(async (fn: () => Promise<void>, operation: string) => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    const duration = end - start;
    
    console.log(`${componentName} - ${operation}: ${duration.toFixed(2)}ms`);
    
    return duration;
  }, [componentName]);

  return {
    renderTime,
    measureAsync,
  };
};

// Hook for image preloading
export const useImagePreload = (imageSrcs: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.has(src)) {
        resolve();
        return;
      }

      setLoadingImages(prev => new Set(prev).add(src));

      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(src));
        setLoadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(src);
          return newSet;
        });
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }, [loadedImages]);

  useEffect(() => {
    imageSrcs.forEach(src => {
      if (!loadedImages.has(src) && !loadingImages.has(src)) {
        preloadImage(src).catch(console.error);
      }
    });
  }, [imageSrcs, loadedImages, loadingImages, preloadImage]);

  return {
    loadedImages,
    loadingImages,
    preloadImage,
    isLoaded: (src: string) => loadedImages.has(src),
    isLoading: (src: string) => loadingImages.has(src),
  };
};
