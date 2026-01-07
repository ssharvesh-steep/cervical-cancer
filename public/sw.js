// Service Worker for Cervical Cancer Care PWA
const CACHE_NAME = 'cc-care-v1';
const STATIC_CACHE = 'cc-care-static-v1';
const DYNAMIC_CACHE = 'cc-care-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/login',
    '/register',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[Service Worker] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );

    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                    .map((name) => {
                        console.log('[Service Worker] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );

    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip Appwrite API calls (always fetch fresh)
    if (url.hostname.includes('appwrite.io')) {
        event.respondWith(
            fetch(request).catch(() => {
                return new Response(
                    JSON.stringify({ error: 'Offline - API unavailable' }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        status: 503,
                    }
                );
            })
        );
        return;
    }

    // Cache-first strategy for static assets
    if (request.destination === 'image' || request.destination === 'font' || request.destination === 'style') {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request).then((response) => {
                    return caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(request, response.clone());
                        return response;
                    });
                });
            })
        );
        return;
    }

    // Network-first strategy for HTML pages
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Clone the response
                const responseClone = response.clone();

                // Cache the response
                caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(request, responseClone);
                });

                return response;
            })
            .catch(() => {
                // If network fails, try cache
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // If no cache, return offline page
                    return caches.match('/').then((offlinePage) => {
                        return offlinePage || new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable',
                        });
                    });
                });
            })
    );
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);

    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    // Implement data synchronization logic here
    console.log('[Service Worker] Syncing data...');
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push received');

    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Cervical Cancer Care';
    const options = {
        body: data.body || 'You have a new notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        data: data.url || '/',
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data || '/')
    );
});
