import { useRef, useCallback } from 'react';

function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef<number>(0);
  const lastCallTimer = useRef<NodeJS.Timeout | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      } else {
        if (lastCallTimer.current) {
          clearTimeout(lastCallTimer.current);
        }
        
        lastCallTimer.current = setTimeout(() => {
          lastCall.current = Date.now();
          callback(...args);
        }, delay - (now - lastCall.current));
      }
    },
    [callback, delay]
  ) as T;

  return throttledCallback;
}

export default useThrottle;





