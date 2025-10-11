// Mobile-specific performance optimizations
export const mobileOptimizations = {
  // Detect mobile device
  isMobile: () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  },

  // Mobile-optimized animation configs
  mobileAnimations: {
    // Beautiful but optimized animations for mobile
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.4, ease: "easeOut" }
    },

    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: "easeOut" }
    },

    scale: {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { duration: 0.4, ease: "easeOut" }
    },

    // Beautiful hero animation
    hero: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, ease: "easeOut" }
    },

    // Smooth button animation
    button: {
      whileHover: { scale: 1.02, y: -2 },
      whileTap: { scale: 0.98 },
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },

    // Only disable on very low-end devices
    disabled: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      transition: { duration: 0 }
    }
  },

  // Mobile-specific CSS classes
  mobileClasses: {
    // Beautiful blur effects for mobile
    blurLight: 'blur-sm',
    blurMedium: 'blur-md',
    blurHeavy: 'blur-lg',
    
    // Beautiful responsive text sizes
    heroTitle: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
    heroSubtitle: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
    
    // Beautiful spacing
    sectionPadding: 'py-16 sm:py-20 md:py-24 lg:py-32',
    containerPadding: 'px-6 sm:px-8 md:px-12',
    
    // Beautiful gradients
    gradientSimple: 'bg-gradient-to-br from-emerald-600 to-green-700',
    gradientComplex: 'bg-gradient-to-br from-emerald-600 via-green-600 via-teal-600 to-emerald-700',
    gradientBeautiful: 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500'
  },

  // Performance utilities
  performance: {
    // Reduce motion for mobile
    shouldReduceMotion: () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches || mobileOptimizations.isMobile();
    },

    // Intersection observer for lazy animations
    createIntersectionObserver: (callback: IntersectionObserverCallback) => {
      if (typeof window === 'undefined') return null;
      
      return new IntersectionObserver(callback, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      });
    },

    // Throttle function for scroll events
    throttle: (func: Function, limit: number) => {
      let inThrottle: boolean;
      return function(this: any, ...args: any[]) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    // Debounce function for resize events
    debounce: (func: Function, wait: number) => {
      let timeout: NodeJS.Timeout;
      return function(this: any, ...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }
  },

  // Mobile-specific component props
  getMobileProps: () => {
    const isMobile = mobileOptimizations.isMobile();
    const shouldReduceMotion = mobileOptimizations.performance.shouldReduceMotion();
    
    // Check for very low-end devices
    const isLowEndDevice = () => {
      if (typeof window === 'undefined') return false;
      // Check for older devices or very small screens
      return window.innerWidth <= 480 || 
             (navigator.userAgent.includes('Android') && navigator.userAgent.includes('4.')) ||
             (navigator.userAgent.includes('iPhone') && navigator.userAgent.includes('OS 9'));
    };

    return {
      // Only disable animations on very low-end devices or when user prefers reduced motion
      disableAnimations: isLowEndDevice() || shouldReduceMotion,
      
      // Use beautiful classes for mobile
      useSimpleClasses: false,
      
      // Use lighter blur effects on mobile but keep them
      useLightBlur: isMobile,
      
      // Use responsive text sizes
      useMobileText: false,
      
      // Use beautiful gradients
      useSimpleGradients: false
    };
  }
};

// Hook for mobile optimizations
export const useMobileOptimizations = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(mobileOptimizations.isMobile());
      setShouldReduceMotion(mobileOptimizations.performance.shouldReduceMotion());
    };

    checkMobile();
    window.addEventListener('resize', mobileOptimizations.performance.debounce(checkMobile, 250));

    return () => {
      window.removeEventListener('resize', mobileOptimizations.performance.debounce(checkMobile, 250));
    };
  }, []);

  return {
    isMobile,
    shouldReduceMotion,
    mobileProps: mobileOptimizations.getMobileProps(),
    mobileClasses: mobileOptimizations.mobileClasses,
    mobileAnimations: mobileOptimizations.mobileAnimations
  };
};

// Import React for the hook
import React from 'react';
