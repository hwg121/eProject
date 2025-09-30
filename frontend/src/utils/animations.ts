// Optimized animation configurations for better performance
export const animationConfig = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.46, 0.45, 0.94],
      // Use transform instead of layout changes
      type: "tween"
    }
  },

  // Card hover animations
  cardHover: {
    scale: 1.02,
    y: -4,
    transition: { 
      duration: 0.2, 
      ease: "easeOut",
      type: "tween"
    }
  },

  // Button interactions
  buttonTap: {
    scale: 0.95,
    transition: { 
      duration: 0.1, 
      ease: "easeInOut",
      type: "tween"
    }
  },

  // Fade in animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { 
      duration: 0.6, 
      ease: "easeOut",
      type: "tween"
    }
  },

  // Slide up animations
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "tween"
    }
  },

  // Stagger animations for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        type: "tween"
      }
    }
  },

  // Header animations
  headerSlide: {
    initial: { y: -100 },
    animate: { y: 0 },
    transition: { 
      duration: 0.6, 
      type: "spring", 
      stiffness: 100,
      damping: 20
    }
  },

  // Background animations (optimized for performance)
  backgroundFloat: {
    animate: {
      x: [0, 20, 0],
      y: [0, -10, 0],
      rotate: [0, 2, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        type: "tween"
      }
    }
  },

  // Logo animations
  logoHover: {
    scale: 1.05,
    rotate: [0, -5, 5, 0],
    transition: { 
      duration: 0.3, 
      ease: "easeInOut",
      type: "tween"
    }
  },

  // Menu animations
  menuSlide: {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100%" },
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "tween"
    }
  }
};

// Performance-optimized animation variants
export const optimizedVariants = {
  // Reduce motion for users who prefer it
  reducedMotion: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 }
  },

  // High performance animations using transform only
  transformOnly: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { 
      duration: 0.3, 
      ease: "easeOut",
      type: "tween"
    }
  }
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

// Get appropriate animation config based on user preference
export const getAnimationConfig = (config: any) => {
  if (prefersReducedMotion()) {
    return optimizedVariants.reducedMotion;
  }
  return config;
};

// Performance utilities
export const performanceUtils = {
  // Use will-change for elements that will animate
  willChange: (property: string) => ({
    willChange: property,
    transform: 'translateZ(0)', // Force hardware acceleration
  }),

  // Optimize for 60fps
  frameRate: {
    duration: 0.016, // ~60fps
    ease: "linear"
  },

  // Use transform3d for hardware acceleration
  hardwareAcceleration: {
    transform: 'translate3d(0, 0, 0)',
    backfaceVisibility: 'hidden',
    perspective: '1000px'
  }
};

