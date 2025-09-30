const CACHE_NAME = 'green-groves-v1';
const STATIC_CACHE = 'green-groves-static-v1';
const DYNAMIC_CACHE = 'green-groves-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: ['/assets/', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2'],
  // Network first for API calls
  NETWORK_FIRST: ['/api/'],
  // Stale while revalidate for pages
  STALE_WHILE_REVALIDATE: ['/techniques', '/tools', '/essentials', '/pots', '/accessories', '/suggestions', '/videos', '/books', '/about-us']
};

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Only delete old caches, not current ones
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Determine cache strategy
  const strategy = getCacheStrategy(pathname);

  switch (strategy) {
    case 'CACHE_FIRST':
      return cacheFirst(request);
    case 'NETWORK_FIRST':
      return networkFirst(request);
    case 'STALE_WHILE_REVALIDATE':
      return staleWhileRevalidate(request);
    default:
      return fetch(request);
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network request failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

function getCacheStrategy(pathname) {
  // Check for static assets
  for (const pattern of CACHE_STRATEGIES.CACHE_FIRST) {
    if (pathname.includes(pattern)) {
      return 'CACHE_FIRST';
    }
  }

  // Check for API calls
  for (const pattern of CACHE_STRATEGIES.NETWORK_FIRST) {
    if (pathname.includes(pattern)) {
      return 'NETWORK_FIRST';
    }
  }

  // Check for pages
  for (const pattern of CACHE_STRATEGIES.STALE_WHILE_REVALIDATE) {
    if (pathname.includes(pattern)) {
      return 'STALE_WHILE_REVALIDATE';
    }
  }

  return 'NETWORK_FIRST'; // Default strategy
}