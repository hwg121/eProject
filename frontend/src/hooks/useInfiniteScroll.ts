import { useState, useEffect, useCallback, useRef } from 'react';

interface MetaData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface InfiniteScrollOptions<T> {
  apiFunction: (params: Record<string, unknown>) => Promise<{ data: T[]; meta: MetaData }>;
  initialParams?: Record<string, unknown>;
  perPage?: number;
  enabled?: boolean;
  onSuccess?: (data: T[], meta: MetaData | null) => void;
  onError?: (error: Error) => void;
}

interface InfiniteScrollReturn<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  meta: MetaData | null;
}

/**
 * Custom hook for infinite scroll with pagination
 * 
 * Features:
 * - Load data in pages
 * - Automatically detect when to load more (intersection observer)
 * - Support for filters and search
 * - Loading states
 * - Error handling
 * 
 * @example
 * const { data, loading, hasMore, loadMore, refresh } = useInfiniteScroll({
 *   apiFunction: productService.getAll,
 *   perPage: 20,
 *   initialParams: { status: 'published' }
 * });
 */
export function useInfiniteScroll<T = unknown>(
  options: InfiniteScrollOptions<T>
): InfiniteScrollReturn<T> {
  const {
    apiFunction,
    initialParams = {},
    perPage = 20,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<MetaData | null>(null);
  
  // Track if we're currently fetching to prevent duplicate requests
  const isFetchingRef = useRef(false);
  
  // Track last params to detect changes
  const lastParamsRef = useRef(initialParams);

  const hasMore = meta ? currentPage < meta.last_page : true;

  /**
   * Fetch data for a specific page
   */
  const fetchPage = useCallback(async (page: number, append: boolean = true) => {
    if (isFetchingRef.current || !enabled) return;
    
    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      const params = {
        ...initialParams,
        page,
        per_page: perPage,
      };

      console.log('🔍 useInfiniteScroll: Fetching page', page, 'with params:', params);
      const response = await apiFunction(params);
      console.log('📦 useInfiniteScroll: Raw API response:', response);
      
      // Handle different response formats
      let items: T[] = [];
      let metadata = null;

      if (response && typeof response === 'object') {
        if ('data' in response && Array.isArray(response.data)) {
          items = response.data;
          metadata = response.meta || null;
          console.log('✅ useInfiniteScroll: Found data array with', items.length, 'items');
          console.log('📊 useInfiniteScroll: First item structure:', items[0] ? Object.keys(items[0]) : 'No items');
        } else if (Array.isArray(response)) {
          items = response;
          console.log('✅ useInfiniteScroll: Response is direct array with', items.length, 'items');
        } else {
          console.error('❌ useInfiniteScroll: Unexpected response format:', response);
        }
      } else {
        console.error('❌ useInfiniteScroll: Response is not an object:', response);
      }

      setMeta(metadata);
      
      if (append) {
        setData(prev => [...prev, ...items]);
      } else {
        setData(items);
      }

      if (onSuccess) {
        onSuccess(items, metadata);
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load data');
      setError(error);
      
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [apiFunction, initialParams, perPage, enabled, onSuccess, onError]);

  /**
   * Load next page of data
   */
  const loadMore = useCallback(() => {
    if (hasMore && !loading && !isFetchingRef.current) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchPage(nextPage, true);
    }
  }, [hasMore, loading, currentPage, fetchPage]);

  /**
   * Refresh data from first page
   */
  const refresh = useCallback(() => {
    setCurrentPage(1);
    setData([]);
    setMeta(null);
    fetchPage(1, false);
  }, [fetchPage]);

  /**
   * Load initial data
   */
  useEffect(() => {
    if (enabled) {
      fetchPage(1, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]); // Only run on mount and when enabled changes

  /**
   * Detect when params change and refresh
   */
  useEffect(() => {
    const paramsChanged = JSON.stringify(initialParams) !== JSON.stringify(lastParamsRef.current);
    
    if (paramsChanged && enabled) {
      lastParamsRef.current = initialParams;
      refresh();
    }
  }, [initialParams, enabled, refresh]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    meta,
  };
}

/**
 * Hook to detect when user scrolls to bottom of container
 * Triggers loadMore callback
 */
export function useScrollTrigger(
  loadMore: () => void,
  hasMore: boolean,
  loading: boolean,
  threshold: number = 200
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        // When the trigger element is visible and we have more data to load
        if (entry.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        rootMargin: `${threshold}px`, // Trigger before reaching bottom
        threshold: 0.1,
      }
    );

    // Observe the trigger element
    const currentTrigger = triggerRef.current;
    if (currentTrigger && observerRef.current) {
      observerRef.current.observe(currentTrigger);
    }

    // Cleanup
    return () => {
      if (observerRef.current && currentTrigger) {
        observerRef.current.unobserve(currentTrigger);
      }
    };
  }, [loadMore, hasMore, loading, threshold]);

  return triggerRef;
}

export default useInfiniteScroll;


