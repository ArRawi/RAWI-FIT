/**
 * Rawi Fit – local sync server
 * Zero npm dependencies — pure Node.js built-ins only.
 * Run: node server.js
 * Then open: http://localhost:3000
 */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT      = 3000;
const DIR       = __dirname;
const DATA_FILE = path.join(DIR, 'backup.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

// ── helpers ──────────────────────────────────────────────────────────────────

function readData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return { workouts: {}, profile: null, _ts: 0 }; }
}

function writeData(obj) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
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

  const url = req.url.split('?')[0];

  // ── GET /api/sync ── pull latest backup
  if (url === '/api/sync' && req.method === 'GET') {
    const data = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  // ── POST /api/sync ── receive and merge data
  if (url === '/api/sync' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const incoming = JSON.parse(body);
        const stored   = readData();
        const merged   = mergePayload(stored, incoming);
        writeData(merged);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, data: merged }));
        console.log(`[sync] ${new Date().toISOString()} — merged OK`);
      } catch (e) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'Bad JSON' }));
      }
    });
    return;
  }

  // ── static files ──
  let filePath = url === '/' ? '/fitness-tracker-no-ai.html' : url;
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
