/**
 * Rawi Fit – local sync server
 * Zero npm dependencies — pure Node.js built-ins only.
 * Run: node server.js
 * Then open: http://localhost:3000
 */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT      = process.env.PORT || 3000;
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

// ── AI-assisted review (Replicate API — see CLAUDE.md accountability note) ────

const KNOWLEDGE_DIR = path.join(DIR, 'knowledge_base');
const MAX_KB_CHARS_PER_FILE = 2000;

function knowledgeFilesForGoal(goal) {
  const files = [
    'health_guidelines_reference.md',
    'progress_metrics_and_benchmarks.md',
    'glossary_and_terminology.md',
  ];
  if (goal === 'hypertrophy' || goal === 'strength' || goal === 'fat_loss') {
    files.push('nutrition_and_fueling.md');
  }
  if (goal === 'calisthenics' || goal === 'general_health' || goal === 'endurance') {
    files.push('goal_programs.md');
  }
  return files;
}

function loadKnowledgeBase(goal) {
  let knowledgeBase = '';
  for (const file of knowledgeFilesForGoal(goal)) {
    try {
      const content = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), 'utf8');
      knowledgeBase += `\n--- ${file} ---\n${content.slice(0, MAX_KB_CHARS_PER_FILE)}\n`;
    } catch (err) {
      console.error(`[review] could not read ${file}:`, err.message);
    }
  }
  return knowledgeBase;
}

async function getReview(workout, profile) {
  if (!profile || typeof profile !== 'object') {
    return { error: 'Missing profile' };
  }
  if (!workout || typeof workout !== 'object') {
    return { error: 'Missing workout' };
  }

  const knowledgeBase = loadKnowledgeBase(profile.goal);

  const prompt = `You are an expert fitness coach. Analyze this workout and provide personalized feedback based on the user's goal and knowledge base.

User Profile:
- Goal: ${profile.goal ?? 'unspecified'}
- Experience: ${profile.experience ?? 'unspecified'}
- Equipment: ${profile.equipment ?? 'unspecified'}
- Age: ${profile.age ?? 'unspecified'}
- Weight: ${profile.weight_kg ?? 'unspecified'} kg

Workout Logged:
${JSON.stringify(workout, null, 2)}

Knowledge Base (reference for accuracy):
${knowledgeBase}

Provide feedback in this format:
1. Summary (1-2 sentences on what they did well)
2. One specific improvement
3. One tip based on their goal
4. One motivational comment

Keep it concise, encouraging, and goal-specific. Do NOT make up fitness numbers - only use numbers from the knowledge base provided.`;

  const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
  if (!REPLICATE_TOKEN) {
    return { error: 'REPLICATE_API_TOKEN is not set on the server' };
  }

  // Cap the wait so an unreachable/slow API fails fast with valid JSON
  // instead of stalling until a reverse proxy kills the connection and
  // leaves the client an empty body.
  const REPLICATE_TIMEOUT_MS = 30000;
  const timeoutSignal = AbortSignal.timeout(REPLICATE_TIMEOUT_MS);

  let createResp;
  try {
    createResp = await fetch('https://api.replicate.com/v1/models/meta/llama-2-70b-chat/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${REPLICATE_TOKEN}`,
        Prefer: 'wait',
      },
      body: JSON.stringify({ input: { prompt, temperature: 0.7 } }),
      signal: timeoutSignal,
    });
  } catch (err) {
    console.error('[review] Replicate connection error:', err.message);
    return { error: 'Could not connect to AI service.' };
  }

  if (!createResp.ok) {
    console.error('[review] Replicate request failed:', createResp.status);
    return { error: 'AI service unavailable' };
  }

  let prediction;
  try {
    prediction = await createResp.json();
  } catch (err) {
    return { error: 'AI service returned an invalid response' };
  }

  // "Prefer: wait" resolves most predictions synchronously, but poll the
  // prediction URL as a fallback for slower runs (still bounded by the
  // shared timeoutSignal above).
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && prediction.status !== 'canceled') {
    await new Promise(r => setTimeout(r, 1000));
    let pollResp;
    try {
      pollResp = await fetch(prediction.urls.get, {
        headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
        signal: timeoutSignal,
      });
    } catch (err) {
      return { error: 'Could not connect to AI service.' };
    }
    if (!pollResp.ok) {
      return { error: 'AI service unavailable' };
    }
    try {
      prediction = await pollResp.json();
    } catch (err) {
      return { error: 'AI service returned an invalid response' };
    }
  }

  if (prediction.status !== 'succeeded') {
    console.error('[review] Replicate prediction did not succeed:', prediction.status, prediction.error);
    return { error: 'AI service could not generate a review' };
  }

  const output = Array.isArray(prediction.output) ? prediction.output.join('') : prediction.output;
  return { feedback: output || 'Could not generate feedback' };
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

  // ── POST /api/review ── AI-assisted workout feedback via Replicate
  if (url === '/api/review' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      let workout, profile;
      try {
        ({ workout, profile } = JSON.parse(body));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad JSON' }));
        return;
      }
      try {
        const review = await getReview(workout, profile);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(review));
      } catch (err) {
        console.error('[review] unexpected error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal error generating review' }));
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
