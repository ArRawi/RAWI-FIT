/**
 * Rawi Fit – Service Worker
 * Handles offline caching and background sync.
 */
const CACHE     = 'rawfit-v2';
const SYNC_TAG  = 'workout-sync';
const SYNC_URL  = '/api/sync';

const APP_SHELL = [
  '/',
  '/manifest.json',
  '/icon.svg',
];

// ── Install: cache app shell ───────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ── Activate: remove old caches ───────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: serve from cache, update in background (stale-while-revalidate) ─
self.addEventListener('fetch', e => {
  // Pass API calls straight through — never cache them
  if (e.request.url.includes('/api/')) return;

  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        const fresh = fetch(e.request).then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => null);
        return cached || fresh;
      })
    )
  );
});

// ── Background Sync ────────────────────────────────────────────────────────
self.addEventListener('sync', e => {
  if (e.tag === SYNC_TAG) {
    e.waitUntil(pushToServer());
  }
});

async function pushToServer() {
  const db      = await openIDB();
  const pending = await idbGet(db, 'pending');
  if (!pending) return;

  const res = await fetch(SYNC_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(pending),
  });

  if (!res.ok) throw new Error('Sync failed — will retry');

  const { data } = await res.json();

  // Store the merged result so the page can pick it up on next load
  await idbPut(db, 'lastSync', data);
  await idbDelete(db, 'pending');

  // Notify open tabs
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  clients.forEach(c => c.postMessage({ type: 'SYNC_COMPLETE', data }));
}

// ── Minimal IndexedDB helpers ──────────────────────────────────────────────
function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('rawfit-sync', 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('kv');
    req.onsuccess  = e => resolve(e.target.result);
    req.onerror    = () => reject(req.error);
  });
}
function idbGet(db, key) {
  return new Promise((res, rej) => {
    const r = db.transaction('kv', 'readonly').objectStore('kv').get(key);
    r.onsuccess = () => res(r.result);
    r.onerror   = () => rej(r.error);
  });
}
function idbPut(db, key, value) {
  return new Promise((res, rej) => {
    const r = db.transaction('kv', 'readwrite').objectStore('kv').put(value, key);
    r.onsuccess = () => res();
    r.onerror   = () => rej(r.error);
  });
}
function idbDelete(db, key) {
  return new Promise((res, rej) => {
    const r = db.transaction('kv', 'readwrite').objectStore('kv').delete(key);
    r.onsuccess = () => res();
    r.onerror   = () => rej(r.error);
  });
}
