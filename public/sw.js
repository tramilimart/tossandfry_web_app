// Service Worker Lifecycle Events

const cacheName = "app-shell-rsrs";
const assets = [
    "/",
    "/home"
];

// Event: Install
self.addEventListener('install', evt => {
    console.log('Service Worker: Installed');
    evt.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(assets)
                .then(() => {
                    console.log('Resources cached successfully');
                })
                .catch(error => {
                    console.error('Cache.addAll error:', error);
                });
        })
    );
});

// Event: Activate
self.addEventListener('activate', evt => {
    console.log('Service Worker: Activated');
});

// Event: Fetch
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.open(cacheName).then(cache => {
            return cache.match(evt.request).then(cacheRes => {
                if (cacheRes) {
                    return cacheRes;
                }
                return fetch(evt.request).then(networkRes => {
                    cache.put(evt.request, networkRes.clone());
                    return networkRes;
                }).catch(error => {
                    // Handle fetch errors gracefully
                    console.error('Fetch error:', error);
                    throw error;
                });
            });
        })
    );
});



