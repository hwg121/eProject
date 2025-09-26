const CACHE_NAME = 'green-groves-v1.0.0';
const STATIC_CACHE = 'green-groves-static-v1.0.0';
const DYNAMIC_CACHE = 'green-groves-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/articles/,
  /\/api\/suggestions/,
  /\/api\/pots/,
  /\/api\/books/,
  /\/api\/tools/,
  /\/api\/accessories/,
  /\/api\/essentials/,
  /\/api\/videos/,
  /\/api\/categories/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) return;

  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
  } else if (isNavigationRequest(request)) {
    event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE));
  } else {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
  }
});

// Helper functions
function isStaticAsset(request) {
  return request.destination === 'image' || 
         request.destination === 'font' ||
         request.destination === 'style' ||
         request.destination === 'script' ||
         request.url.includes('/assets/');
}

function isAPIRequest(request) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(request.url));
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Cache strategies
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Network error', { status: 408 });
  }
}

async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      // Only cache successful responses and limit cache size
      if (networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
        limitCacheSize(cacheName, 50); // Limit to 50 items
      }
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline - No cached version available', { 
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = caches.match(request);
  
  const networkResponse = fetch(request)
    .then(response => {
      if (response.ok) {
        const cache = caches.open(cacheName);
        cache.then(c => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => cachedResponse);

  return (await cachedResponse) || networkResponse;
}

// Utility function to limit cache size
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    // Remove oldest entries
    const keysToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions when connection is restored
  console.log('Service Worker: Performing background sync');
}
