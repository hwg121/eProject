// Comprehensive Responsive Design System
export const responsiveDesign = {
  // Breakpoints
  breakpoints: {
    xs: '320px',   // Small phones
    sm: '640px',   // Large phones
    md: '768px',   // Tablets
    lg: '1024px',  // Small laptops
    xl: '1280px',  // Large laptops
    '2xl': '1536px' // Desktops
  },

  // Typography Scale
  typography: {
    // Hero titles
    hero: {
      xs: 'text-2xl',      // 24px - Small phones
      sm: 'text-3xl',      // 30px - Large phones
      md: 'text-4xl',      // 36px - Tablets
      lg: 'text-5xl',      // 48px - Small laptops
      xl: 'text-6xl',      // 60px - Large laptops
      '2xl': 'text-7xl'    // 72px - Desktops
    },
    
    // Subheadings
    subheading: {
      xs: 'text-lg',       // 18px
      sm: 'text-xl',       // 20px
      md: 'text-2xl',      // 24px
      lg: 'text-3xl',      // 30px
      xl: 'text-4xl',      // 36px
      '2xl': 'text-5xl'    // 48px
    },
    
    // Body text
    body: {
      xs: 'text-sm',       // 14px
      sm: 'text-base',     // 16px
      md: 'text-lg',       // 18px
      lg: 'text-xl',       // 20px
      xl: 'text-2xl',      // 24px
      '2xl': 'text-3xl'    // 30px
    },
    
    // Small text
    small: {
      xs: 'text-xs',       // 12px
      sm: 'text-sm',       // 14px
      md: 'text-base',     // 16px
      lg: 'text-lg',       // 18px
      xl: 'text-xl',       // 20px
      '2xl': 'text-2xl'    // 24px
    }
  },

  // Spacing Scale
  spacing: {
    // Section padding
    section: {
      xs: 'py-8',          // 32px
      sm: 'py-12',         // 48px
      md: 'py-16',         // 64px
      lg: 'py-20',         // 80px
      xl: 'py-24',         // 96px
      '2xl': 'py-32'       // 128px
    },
    
    // Container padding
    container: {
      xs: 'px-4',          // 16px
      sm: 'px-6',          // 24px
      md: 'px-8',          // 32px
      lg: 'px-12',         // 48px
      xl: 'px-16',         // 64px
      '2xl': 'px-20'       // 80px
    },
    
    // Element spacing
    element: {
      xs: 'space-y-4',     // 16px
      sm: 'space-y-6',     // 24px
      md: 'space-y-8',     // 32px
      lg: 'space-y-12',    // 48px
      xl: 'space-y-16',    // 64px
      '2xl': 'space-y-20'  // 80px
    }
  },

  // Grid System
  grid: {
    // Columns
    columns: {
      xs: 'grid-cols-1',   // 1 column
      sm: 'sm:grid-cols-2', // 2 columns on sm+
      md: 'md:grid-cols-3', // 3 columns on md+
      lg: 'lg:grid-cols-4', // 4 columns on lg+
      xl: 'xl:grid-cols-5', // 5 columns on xl+
      '2xl': '2xl:grid-cols-6' // 6 columns on 2xl+
    },
    
    // Gaps
    gap: {
      xs: 'gap-4',         // 16px
      sm: 'gap-6',         // 24px
      md: 'gap-8',         // 32px
      lg: 'gap-10',        // 40px
      xl: 'gap-12',        // 48px
      '2xl': 'gap-16'      // 64px
    }
  },

  // Button Sizes
  buttons: {
    // Primary buttons
    primary: {
      xs: 'px-4 py-2 text-sm',      // Small
      sm: 'px-6 py-3 text-base',    // Medium
      md: 'px-8 py-4 text-lg',      // Large
      lg: 'px-10 py-5 text-xl',     // Extra large
      xl: 'px-12 py-6 text-2xl'     // Huge
    },
    
    // Secondary buttons
    secondary: {
      xs: 'px-3 py-2 text-sm',
      sm: 'px-4 py-3 text-base',
      md: 'px-6 py-4 text-lg',
      lg: 'px-8 py-5 text-xl',
      xl: 'px-10 py-6 text-2xl'
    }
  },

  // Card Sizes
  cards: {
    // Card padding
    padding: {
      xs: 'p-4',           // 16px
      sm: 'p-6',           // 24px
      md: 'p-8',           // 32px
      lg: 'p-10',          // 40px
      xl: 'p-12'           // 48px
    },
    
    // Card spacing
    spacing: {
      xs: 'space-y-3',     // 12px
      sm: 'space-y-4',     // 16px
      md: 'space-y-6',     // 24px
      lg: 'space-y-8',     // 32px
      xl: 'space-y-10'     // 40px
    }
  },

  // Icon Sizes
  icons: {
    xs: 'h-4 w-4',         // 16px
    sm: 'h-5 w-5',         // 20px
    md: 'h-6 w-6',         // 24px
    lg: 'h-8 w-8',         // 32px
    xl: 'h-10 w-10',       // 40px
    '2xl': 'h-12 w-12',    // 48px
    '3xl': 'h-16 w-16'     // 64px
  },

  // Responsive Classes Generator
  generateResponsiveClass: (property: string, values: Record<string, string>) => {
    return Object.entries(values)
      .map(([breakpoint, value]) => {
        if (breakpoint === 'xs') return value;
        return `${breakpoint}:${value}`;
      })
      .join(' ');
  },

  // Get responsive class for current breakpoint
  getResponsiveClass: (property: string, values: Record<string, string>, currentBreakpoint: string) => {
    const sortedBreakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = sortedBreakpoints.indexOf(currentBreakpoint);
    
    // Find the appropriate value for current breakpoint or smaller
    for (let i = currentIndex; i >= 0; i--) {
      const bp = sortedBreakpoints[i];
      if (values[bp]) {
        return values[bp];
      }
    }
    
    return values.xs || '';
  }
};

// Hook for responsive design
export const useResponsiveDesign = () => {
  const [breakpoint, setBreakpoint] = React.useState('md');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('xs');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else if (width < 1536) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
    responsiveDesign
  };
};

// Import React for the hook
import React from 'react';



