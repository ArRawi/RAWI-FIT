/**
 * Rawi Fit – local sync server
 * Zero npm dependencies — pure Node.js built-ins only.
 * Run: node server.js
 * Then open: http://localhost:3000
 */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT     = process.env.PORT || 3000;
const DIR      = __dirname;
const DATA_DIR = path.join(DIR, 'data');

fs.mkdirSync(DATA_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

// ── helpers ──────────────────────────────────────────────────────────────────

// One file per user_id — every device must supply its own user_id so
// syncs never merge into another person's data.
const USER_ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

function sanitizeUserId(id) {
  return typeof id === 'string' && USER_ID_RE.test(id) ? id : null;
}

function dataFile(userId) {
  return path.join(DATA_DIR, `${userId}.json`);
}

function readData(userId) {
  try { return JSON.parse(fs.readFileSync(dataFile(userId), 'utf8')); }
  catch { return { workouts: {}, profile: null, _ts: 0 }; }
}

function writeData(userId, obj) {
  fs.writeFileSync(dataFile(userId), JSON.stringify(obj, null, 2));
}

/**
 * Merge two workout maps.
 * For each date, keep whichever entry has the newer _ts.
 * Dates only in one map are kept as-is.
 */
function mergeWorkouts(local, remote) {
  const merged = { ...remote };
  for (const [date, entry] of Object.entries(local)) {
    if (!merged[date] || (entry._ts || 0) >= (merged[date]._ts || 0)) {
      merged[date] = entry;
    }
  }
  return merged;
}

function mergePayload(stored, incoming) {
  return {
    workouts: mergeWorkouts(stored.workouts || {}, incoming.workouts || {}),
    profile:  (incoming._ts || 0) >= (stored._ts || 0) ? incoming.profile : stored.profile,
    _ts:      Math.max(stored._ts || 0, incoming._ts || 0),
  };
}

// ── request handler ───────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  // CORS headers (needed when app is accessed from any origin)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const url       = parsedUrl.pathname;

  // ── GET /api/sync?user_id=... ── pull latest backup for this user only
  if (url === '/api/sync' && req.method === 'GET') {
    const userId = sanitizeUserId(parsedUrl.searchParams.get('user_id'));
    if (!userId) {
      res.writeHead(400); res.end(JSON.stringify({ error: 'Missing or invalid user_id' }));
      return;
    }
    const data = readData(userId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  // ── POST /api/sync ── receive and merge data, scoped to the sender's user_id
  if (url === '/api/sync' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const incoming = JSON.parse(body);
        const userId   = sanitizeUserId(parsedUrl.searchParams.get('user_id'))
          || sanitizeUserId(incoming.profile && incoming.profile.user_id);
        if (!userId) {
          res.writeHead(400); res.end(JSON.stringify({ error: 'Missing or invalid user_id' }));
          return;
        }
        const stored = readData(userId);
        const merged = mergePayload(stored, incoming);
        writeData(userId, merged);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, data: merged }));
        console.log(`[sync] ${new Date().toISOString()} — merged OK for ${userId}`);
      } catch (e) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'Bad JSON' }));
      }
    });
    return;
  }

  // ── static files ──
  let filePath = url === '/' ? '/index.html' : url;
  const fullPath = path.join(DIR, filePath);

  // Security: prevent directory traversal
  if (!fullPath.startsWith(DIR)) { res.writeHead(403); res.end(); return; }

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    const ext  = path.extname(fullPath).toLowerCase();
    const mime = MIME[ext] || 'text/plain';
    // Tell browsers not to cache the SW itself
    if (filePath === '/sw.js') {
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Service-Worker-Allowed', '/');
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(fs.readFileSync(fullPath));
  } else {
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('  🏋️  Rawi Fit is running!');
  console.log(`  Open on this device:  http://localhost:${PORT}`);
  console.log('');
  console.log('  To access from your phone on the same Wi-Fi,');
  console.log('  replace localhost with this machine\'s IP address.');
  console.log('  (Run `ipconfig` on Windows to find your IPv4 address)');
  console.log('');
});
