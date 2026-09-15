// Bump this when you want to be certain every client re-fetches everything.
const CACHE = 'meatlog-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

// Network first, cache as the offline fallback.
// The page itself is fetched with cache:'no-store' so Safari's own HTTP cache
// (GitHub Pages sends max-age=600 on HTML) can't serve a stale copy.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const isPage = req.mode === 'navigate' ||
                 (req.destination === 'document') ||
                 req.url.endsWith('/') ||
                 req.url.endsWith('index.html');

  e.respondWith(
    fetch(isPage ? new Request(req.url, { cache: 'no-store' }) : req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
