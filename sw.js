/**
 * Rawi Fit – Service Worker
 * Handles offline caching and background sync.
 */
const CACHE     = 'rawifit-v1.2.0'; //
const SYNC_TAG  = 'workout-sync';
const SYNC_URL  = '/api/sync';

const APP_SHELL = [
  '/',
  '/manifest.json',
  '/icon.png', // Changed from icon.svg to icon.png
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

// ── Periodic Background Sync — fires the daily log reminder while the app
// is closed. Chrome/Android-only (installed PWA + engagement heuristics);
// browsers without support never fire this tag, so this is a bonus channel
// on top of the foreground checkNotifications() loop, not a replacement.
const REMINDER_TAG = 'daily-reminder';

self.addEventListener('periodicsync', e => {
  if (e.tag === REMINDER_TAG) {
    e.waitUntil(checkDailyReminder());
  }
});

async function checkDailyReminder() {
  const db   = await openIDB();
  const snap = await idbGet(db, 'notifSnapshot');
  if (!snap || !snap.notif) return;

  const ns = snap.notif;
  if (!ns.enabled) return;
  if (ns.toggles && ns.toggles.daily === false) return;

  const today = new Date().toISOString().slice(0, 10);
  if (ns.lastFired === today) return;
  if (snap.lastWorkoutDate === today) return; // already logged today

  const [h, m] = (ns.dailyTime || '19:00').split(':').map(Number);
  const now = new Date();
  if (now.getHours() < h || (now.getHours() === h && now.getMinutes() < m)) return;

  const last = snap.lastWorkoutDate;
  const daysSince = last
    ? Math.round((new Date(today + ' 12:00') - new Date(last + ' 12:00')) / 864e5)
    : 999;

  // Day state machine — mirrors _chkDayState() in index.html (system_prompt.md Section 3)
  let title, body;
  if (daysSince >= 30) {
    title = 'Welcome back to Rawi Fit \u{1F44B}';
    body  = 'It’s been a while — that’s completely okay. Whenever you’re ready, we’ll start fresh. No pressure, no catching up needed.';
  } else if (daysSince >= 14) {
    title = 'Still here for you \u{1F499}';
    body  = `It's been ${daysSince} days. No guilt — just here whenever you're ready to pick it back up.`;
  } else if (daysSince >= 7) {
    title = 'Heads up \u{1F4A1}';
    body  = `After ${daysSince} days without training, the body starts to lose some gains. Even one session this week helps maintain your progress.`;
  } else if (daysSince >= 3) {
    title = 'Haven’t seen a log in a few days';
    body  = 'Rest day, or did we miss something? Tap to log today’s session.';
  } else {
    title = 'Time to train? \u{1F4AA}';
    body  = 'You haven’t logged today’s session yet. Tap to add it.';
  }

  await self.registration.showNotification(title, { body, icon: '/icon.png', tag: 'daily-reminder' });

  snap.notif.lastFired = today;
  await idbPut(db, 'notifSnapshot', snap);

  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  clients.forEach(c => c.postMessage({ type: 'NOTIF_FIRED', lastFired: today }));
}

// ── Tapping a notification focuses/opens the app ────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      for (const c of clients) { if ('focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
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
