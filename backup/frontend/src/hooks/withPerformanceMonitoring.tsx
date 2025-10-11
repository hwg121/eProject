import React from 'react';

// HOC for measuring component render time
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    React.useEffect(() => {
      performance.mark(`${componentName}-start`);
      
      return () => {
        performance.mark(`${componentName}-end`);
        performance.measure(
          `${componentName}-render`,
          `${componentName}-start`,
          `${componentName}-end`
        );
      };
    });

    return <WrappedComponent {...props} />;
  });
};
