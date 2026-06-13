const CACHE_NAME = 'reset-emocional-v1';
const ASSETS = [
  '/projeto_reset/',
  '/projeto_reset/index.html',
  '/projeto_reset/manifest.json',
  '/projeto_reset/icon-192.png',
  '/projeto_reset/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => caches.match('/projeto_reset/'));
    })
  );
});
