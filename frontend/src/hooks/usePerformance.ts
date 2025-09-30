import { useEffect, useRef, useCallback, useState } from 'react';

// Hook for performance optimization
export const usePerformance = () => {
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Throttle function for high-frequency events
  const throttle = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    
    return (...args: any[]) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }, []);

  // Debounce function for search and input events
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Request animation frame with fallback
  const requestAnimationFrame = useCallback((callback: FrameRequestCallback) => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    
    frameRef.current = window.requestAnimationFrame((time) => {
      // Limit to 60fps
      if (time - lastTimeRef.current >= 16.67) {
        callback(time);
        lastTimeRef.current = time;
      } else {
        requestAnimationFrame(callback);
      }
    });
  }, []);

  // Cancel animation frame
  const cancelAnimationFrame = useCallback(() => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame();
    };
  }, [cancelAnimationFrame]);

  // Check if user prefers reduced motion
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Get optimal animation duration based on user preference
  const getOptimalDuration = useCallback((baseDuration: number) => {
    return prefersReducedMotion() ? 0.1 : baseDuration;
  }, [prefersReducedMotion]);

  // Check if element is in viewport for lazy loading
  const isInViewport = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, []);

  // Intersection Observer for performance
  const useIntersectionObserver = useCallback((
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) => {
    const observerRef = useRef<IntersectionObserver>();
    
    useEffect(() => {
      if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        observerRef.current = new IntersectionObserver(callback, {
          rootMargin: '50px',
          threshold: 0.1,
          ...options
        });
      }
      
      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, [callback, options]);
    
    return observerRef.current;
  }, []);

  return {
    throttle,
    debounce,
    requestAnimationFrame,
    cancelAnimationFrame,
    prefersReducedMotion,
    getOptimalDuration,
    isInViewport,
    useIntersectionObserver
  };
};

// Hook for lazy loading with intersection observer
export const useLazyLoad = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const { useIntersectionObserver } = usePerformance();

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsVisible(true);
    }
  }, []);

  useIntersectionObserver(observerCallback, { threshold });

  return [elementRef, isVisible] as const;
};

// Hook for scroll performance
export const useScrollPerformance = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const { throttle } = usePerformance();

  const handleScroll = useCallback(
    throttle(() => {
      setScrollY(window.scrollY);
      setIsScrolling(true);
      
      // Reset scrolling state after scroll ends
      setTimeout(() => setIsScrolling(false), 150);
    }, 16), // ~60fps
    [throttle]
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { scrollY, isScrolling };
};