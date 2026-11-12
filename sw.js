const CACHE_NAME = 'yorunge-app-v3';
const APP_SHELL = [
  './',
  './home.html',
  './index.html',
  './planlayici.html',
  './notlar.html',
  './pomodoro.html',
  './manifest.webmanifest',
  './app-tools.js',
  './pwa.js',
  './assets/yorunge-emblem.png',
  './assets/pwa-icon-192.png',
  './assets/pwa-icon-512.png',
  './assets/pomo-alarm.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith('yorunge-app-') && key !== CACHE_NAME)
      .map((key) => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response.ok) cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) return cachedResponse;
      if (request.mode === 'navigate') {
        const appHome = await cache.match(new URL('./home.html', self.registration.scope).href);
        if (appHome) return appHome;
      }
      throw error;
    }
  })());
});
