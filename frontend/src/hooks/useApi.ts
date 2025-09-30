import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { immediate = false, onSuccess, onError } = options;

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Specialized hooks for common patterns
export function usePagination<T = any>(
  apiFunction: (params: any) => Promise<{ data: T[]; meta: any }>,
  initialParams: any = {}
) {
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    ...initialParams,
  });

  const { data, loading, error, execute } = useApi(apiFunction);

  const loadPage = useCallback((page: number) => {
    const newParams = { ...params, page };
    setParams(newParams);
    return execute(newParams);
  }, [params, execute]);

  const updateParams = useCallback((newParams: any) => {
    const updatedParams = { ...params, ...newParams, page: 1 };
    setParams(updatedParams);
    return execute(updatedParams);
  }, [params, execute]);

  const refresh = useCallback(() => {
    return execute(params);
  }, [params, execute]);

  useEffect(() => {
    execute(params);
  }, []);

  return {
    data: data?.data || [],
    meta: data?.meta || {},
    loading,
    error,
    params,
    loadPage,
    updateParams,
    refresh,
  };
}

export function useSearch<T = any>(
  apiFunction: (params: any) => Promise<T>,
  debounceMs: number = 300
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const { data, loading, error, execute } = useApi(apiFunction);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Execute search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      execute({ search: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm, execute]);

  return {
    data,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    execute,
  };
}