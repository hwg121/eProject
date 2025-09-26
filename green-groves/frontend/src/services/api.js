import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with performance optimizations
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Enable compression
  decompress: true,
  // Connection pooling
  maxRedirects: 3,
  // Performance optimizations
  validateStatus: (status) => status < 500,
});

// Request cache for GET requests
const requestCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Request interceptor with caching and performance optimizations
api.interceptors.request.use(
  (config) => {
    // Add timestamp for cache busting when needed
    config.metadata = { startTime: new Date() };

    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add performance headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    // Enable caching for GET requests
    if (config.method === 'get') {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cachedResponse = requestCache.get(cacheKey);
      
      if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
        // Return cached response as a resolved promise
        return Promise.resolve({
          ...config,
          adapter: () => Promise.resolve(cachedResponse.data)
        });
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with caching and error handling
api.interceptors.response.use(
  (response) => {
    // Log response time for monitoring
    const responseTime = new Date() - response.config.metadata.startTime;
    if (responseTime > 2000) { // Log slow requests (> 2s)
      console.warn(`Slow API request: ${response.config.url} took ${responseTime}ms`);
    }

    // Cache successful GET responses
    if (response.config.method === 'get' && response.status === 200) {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      requestCache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });

      // Clean up old cache entries
      if (requestCache.size > 100) {
        const oldestKey = requestCache.keys().next().value;
        requestCache.delete(oldestKey);
      }
    }

    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }

    // Log network errors for monitoring
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    // Retry logic for network errors (except for POST/PUT/DELETE)
    if (!error.response && !error.config._retry && error.config.method === 'get') {
      error.config._retry = true;
      return api.request(error.config);
    }

    return Promise.reject(error);
  }
);

// Performance monitoring
let requestCount = 0;
let totalResponseTime = 0;

// Add performance tracking
const originalRequest = api.request;
api.request = function(...args) {
  requestCount++;
  const startTime = performance.now();
  
  return originalRequest.apply(this, args).finally(() => {
    const endTime = performance.now();
    totalResponseTime += (endTime - startTime);
    
    // Log performance stats every 50 requests
    if (requestCount % 50 === 0) {
      const avgResponseTime = totalResponseTime / requestCount;
      console.log(`API Performance: ${requestCount} requests, avg response time: ${avgResponseTime.toFixed(2)}ms`);
    }
  });
};

// Helper function to clear cache
export const clearApiCache = () => {
  requestCache.clear();
};

// Helper function to get cache stats
export const getCacheStats = () => ({
  size: requestCache.size,
  requests: requestCount,
  avgResponseTime: totalResponseTime / requestCount || 0
});

export default api;
