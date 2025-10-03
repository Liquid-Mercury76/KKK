// Service Worker for Gemini GPS Navigator

const APP_SHELL_CACHE = 'app-shell-cache-v1';
const API_CACHE = 'api-cache-v1';
const TILE_CACHE = 'tile-cache-v1';

// A list of core files to cache on install for the app to work offline.
const appShellFiles = [
  '/',
  '/index.html',
  '/icon.svg',
  // In a real build, these would be the hashed JS/CSS output files.
  // The fetch handler will cache other assets as they are requested.
];

// Base URLs for map tiles that we want to cache aggressively.
const TILE_URL_PATTERNS = [
  'https://{s}.basemaps.cartocdn.com/',
  'https://server.arcgisonline.com/'
];

// Base URL for the Gemini API.
const API_URL_PATTERN = 'https://alkalimakersuite-pa.clients6.google.com/';

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      console.log('Service Worker: Caching app shell');
      return cache.addAll(appShellFiles).catch(err => {
        console.error("Failed to cache app shell files:", err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== APP_SHELL_CACHE && cacheName !== API_CACHE && cacheName !== TILE_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strategy 1: Cache-first for map tiles.
  if (TILE_URL_PATTERNS.some(pattern => url.href.startsWith(pattern.replace('{s}', url.hostname.split('.')[0])))) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      })
    );
    return;
  }
  
  // Strategy 2: Network-first, then cache for API calls.
  if (url.href.startsWith(API_URL_PATTERN)) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        try {
          const networkResponse = await fetch(event.request);
          // Cache successful Gemini API calls.
          if (event.request.method === 'POST' && networkResponse && networkResponse.status === 200) {
             cache.put(event.request.clone(), networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          console.log('Service Worker: Network fetch failed, trying cache for API call.');
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // If not in cache and network fails, return a generic error response.
          return new Response(JSON.stringify({ error: 'You are offline and this data is not in your cache.' }), {
            status: 503, // Service Unavailable
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })
    );
    return;
  }

  // Strategy 3: Stale-while-revalidate for app shell and other resources.
  event.respondWith(
    caches.open(APP_SHELL_CACHE).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      const networkFetch = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(err => console.warn('Service Worker: Failed to fetch and update cache for', event.request.url));
      
      return cachedResponse || networkFetch;
    })
  );
});