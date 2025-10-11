import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LazyMotionProps {
  children: React.ReactNode;
  className?: string;
  animationProps?: any;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

const LazyMotion: React.FC<LazyMotionProps> = ({
  children,
  className = '',
  animationProps = {},
  fallback = null,
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin, hasAnimated]);

  // Check if we should disable animations (mobile or reduced motion)
  const shouldDisableAnimations = () => {
    if (typeof window === 'undefined') return false;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return isMobile || prefersReducedMotion;
  };

  const disabledAnimationProps = {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0 }
  };

  const finalAnimationProps = shouldDisableAnimations() 
    ? disabledAnimationProps 
    : animationProps;

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? (
        <motion.div {...finalAnimationProps}>
          {children}
        </motion.div>
      ) : (
        fallback || <div className="opacity-0">{children}</div>
      )}
    </div>
  );
};

export default LazyMotion;



