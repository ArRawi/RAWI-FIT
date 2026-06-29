# RAWI-FIT

Personal fitness tracker PWA — log workouts, track progress, and get smart training reminders. Vanilla JS, offline-first, no dependencies.

## What it does
- Log gym sessions, cardio, and rest days
- Get evidence-based feedback on push:pull balance, overtraining, deload timing, and goal alignment
- Track strength tiers, HR zones, and body composition
- Smart notifications based on rest day state machine
- Runs fully offline — data stored in localStorage with background sync

## Stack
- **Frontend** — Vanilla HTML/CSS/JS, single `index.html`, no framework
- **Backend** — Node.js `server.js`, zero dependencies, one `/api/sync` endpoint
- **Database** — localStorage (primary) + IndexedDB (sync queue)
- **PWA** — Service Worker + manifest for offline and background sync
- **Deployed on** — Railway

## Files
## Development
Open in GitHub Codespaces or clone and open `index.html` directly in a browser.
