# CLAUDE.md
# Instructions for Claude Code
# Place this file in the project root. Claude Code reads it automatically.
# ─────────────────────────────────────────────────────────────────────────────

## WHAT THIS PROJECT IS

A fitness tracker PWA (Progressive Web App). Users log workouts, track
progress, and get smart notifications. All logic is coded — there is no
AI running at runtime. Claude Code's job is to write the app's code,
using the knowledge base files as the source of truth for all fitness
logic, numbers, and rules.

---

## STACK

```
Frontend  : Vanilla HTML + CSS + JavaScript
            Single file: index.html
            No React. No Vue. No framework. No npm. No imports.
            All JS in <script> tags or linked .js files.
            All CSS in <style> tags or linked .css files.

Backend   : Node.js — server.js
            Zero npm dependencies — Node built-ins only (http, fs, path)
            One endpoint: POST /api/sync
            Deployed on Railway

Database  : localStorage (primary — all app data lives here)
              rw_workouts  — object keyed by ISO date: { "2026-06-29": { ...session } }
              rw_profile   — biometrics, settings, derived values
              rw_notif     — notification state machine data
              rw_goals     — program, weekly volume, streaks, PBs
            IndexedDB (secondary — Service Worker sync queue only)

PWA       : sw.js — Service Worker (offline cache + background sync)
            manifest.json — PWA metadata
```

**Hard rule:** No npm packages. No CDN libraries. No external dependencies.
If something needs doing, write it in vanilla JS.

---

## PROJECT FILE STRUCTURE

```
/
├── index.html            ← full frontend
├── server.js             ← Node.js backend
├── sw.js                 ← Service Worker
├── manifest.json         ← PWA manifest
├── CLAUDE.md             ← this file
└── /knowledge_base/
    ├── weightlifting_exercises.md
    ├── health_guidelines_reference.md
    ├── nutrition_and_fueling.md
    ├── goal_programs.md
    ├── injury_prevention_and_common_mistakes.md
    ├── progress_metrics_and_benchmarks.md
    ├── glossary_and_terminology.md
    └── onboarding_spec.md
```

---

## KNOWLEDGE BASE — READ BEFORE WRITING FITNESS LOGIC

The `/knowledge_base/` folder is the source of truth for all fitness rules,
formulas, and numbers. Before writing any function that contains a fitness
value, read the relevant file first. Never invent a fitness number from memory.

| File | Read it when writing... |
|---|---|
| `weightlifting_exercises.md` | Exercise recognition, movement pattern tags, muscle group mapping |
| `health_guidelines_reference.md` | Any calculation: BMI, MHR, HR zones, protein targets, cardio minimums |
| `nutrition_and_fueling.md` | Calorie targets, TDEE, macro splits, nutrient timing |
| `goal_programs.md` | Program templates, weekly schedules, progression rules |
| `injury_prevention_and_common_mistakes.md` | Safety flags, form error detection, overtraining warnings |
| `progress_metrics_and_benchmarks.md` | Strength tier checks, VO2 max norms, milestone detection |
| `glossary_and_terminology.md` | Any fitness term you are about to use in code or UI copy |
| `onboarding_spec.md` | Onboarding screens, profile validation, data shapes, derived values |

After reading the relevant file, add a comment in the code citing it:
```javascript
// 1.6 g/kg — ISSN protein minimum for active adults under 50
// Source: health_guidelines_reference.md Part 4C
const proteinRate = 1.6;
```

---

## DATA MODELS

All data lives in localStorage under four keys.
Always read and write through the helper functions below — never call
localStorage directly elsewhere in the codebase.

### rw_profile

```javascript
{
  // Set during onboarding — Screen 1
  user_id:          "uuid-string",
  age:              25,
  sex:              "male",        // "male" | "female"
  weight_kg:        75.0,
  height_cm:        175.0,

  // Set during onboarding — Screen 2
  goal:             "hypertrophy", // "fat_loss"|"hypertrophy"|"strength"|
                                   // "endurance"|"general_health"|
                                   // "calisthenics"|"recomp"
  training_days:    4,             // 1–7
  experience:       "intermediate",// "beginner"|"novice"|
                                   // "intermediate"|"advanced"

  // Set during onboarding — Screen 3
  equipment:        "full_gym",    // "full_gym"|"dumbbells"|
                                   // "bodyweight"|"mixed"
  training_method:  "volume",      // "failure"|"volume"|
                                   // "strength"|"endurance"
  resting_hr:       62,            // integer or null if skipped
  barbell_available: true,         // false when equipment === "bodyweight"

  // Computed after onboarding — never ask user for these
  bmi:              24.5,
  mhr:              190,
  bmr:              1820,
  tdee:             2821,
  protein_target:   150,
  hr_zones: {
    z1: { low: 95,  high: 114 },
    z2: { low: 114, high: 133 },
    z3: { low: 133, high: 152 },
    z4: { low: 152, high: 171 },
    z5: { low: 171, high: 190 }
  },

  // Updated over time
  last_logged:      null,          // ISO date string
  weight_history:   [],            // [{ date, weight_kg }]
  created_at:       "ISO string"
}
```

### rw_workouts

**Shape: date-keyed object** (not an array — enables O(1) date lookups without scanning).

```javascript
{
  "2026-06-29": {
    type:     "workout",   // "workout" | "rest"
    items: [               // unified lift + cardio items
      {
        kind:    "lift",
        name:    "Back Squat",
        cat:     "legs",   // "push" | "pull" | "legs" | "core"
        muscle:  "Quads",
        sets: [{ weight: 80, reps: 8 }]
      },
      {
        kind:       "cardio",
        cardioType: "run",
        data:       { duration: 20, distance: 4, hr: 145 }
      }
    ],
    notes:    "",
    recovery: null,        // "sore" | "good" | "great" — rest days only
    _ts:      1234567890   // unix ms timestamp of last save
    notes:  "",
    review: null                   // filled by generateReview() after logging
  }
]
```

### rw_goals

```javascript
{
  program:             "PPL 6x/Week",
  program_week:        1,
  weekly_cardio_min:   0,
  weekly_sets: {
    chest: 0, back: 0, shoulders: 0,
    biceps: 0, triceps: 0, quads: 0,
    hamstrings: 0, glutes: 0, core: 0, calves: 0
  },
  streak_days:         0,
  last_streak_date:    null,
  personal_bests:      {},         // { "Back Squat": { weight_kg, date } }
  weeks_since_deload:  0,
  last_week_reset:     "ISO date"  // reset weekly_sets every Monday
}
```

### rw_notif

```javascript
{
  day_state:                 "REST_ASSUMED",
  last_state_change:         "ISO date",
  last_notif_sent:           null,        // enforce 1 notification/day max
  last_notif_type:           null,
  checkin_response:          null,        // "logged"|"rest"|"break"|null
  consecutive_hard_sessions: 0,
  weeks_since_deload:        0,
  permission_granted:        false
}
```

---

## CORE FUNCTIONS TO BUILD

Implement each as a plain JavaScript function.
Pure calculation functions must accept values as parameters —
they must not read from localStorage directly.

### localStorage helpers (write these first — everything else uses them)

```javascript
function rwGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); }
  catch { return null; }
}

function rwSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    // localStorage cap reached (~5–10MB) — handle gracefully
    console.error('Storage full:', e);
    showStorageWarning();
    return false;
  }
}

function rwUpdate(key, updaterFn) {
  const current = rwGet(key) || {};
  const updated = updaterFn(current);
  return rwSet(key, updated);
}
```

---

### Profile functions

```javascript
saveProfile(profileData)
// Validate → compute derived values → write to rw_profile
// Read: onboarding_spec.md Part 6A for computeDerivedValues

getProfile()
// Return rwGet('rw_profile') or null

isProfileComplete(profile)
// Check all Screen 1–3 fields are non-null
// Return { complete: bool, missing: [] }
// Read: onboarding_spec.md Part 8

computeDerivedValues(profile)
// Calculate BMI, MHR, BMR, TDEE, protein_target, hr_zones
// Read: health_guidelines_reference.md Part 1 before writing
// Formulas: Tanaka MHR, Mifflin-St Jeor BMR, Karvonen zones
```

---

### Workout functions

```javascript
logWorkout(sessionData)
// Append to rw_workouts array
// Then call generateReview() and store result in session.review
// Then call updateWeeklyStats() and updateStreaks()

getWorkouts()
// Return rwGet('rw_workouts') or []

getLastSession()
// Return most recent entry from rw_workouts

getSessionsByMuscle(muscle)
// Return sessions where any exercise targets the given muscle

getWeeklyVolume()
// Return total sets per muscle group for the current week (Mon–Sun)
// Source for volume targets: health_guidelines_reference.md Part 3B
```

---

### Review engine

Called automatically by logWorkout(). Returns a review object stored in
session.review. Pure function — takes data in, returns result out.

```javascript
generateReview(session, profile, workoutHistory)
```

Run these steps in order. Read the source file before writing each step:

```
Step 1 — Classify session type
  Map exercises to movement patterns (weightlifting_exercises.md)
  Determine: Full Body | Push | Pull | Legs | Upper | Core | Cardio | Mixed

Step 2 — Session checklist
  □ At least one compound movement?
  □ Push:pull ratio ≥ 1:1? Flag if push-heavy
  □ Lower body included? (if full body or leg day)
  □ Same muscle group not trained within 48 hours?
  □ Rep range matches goal?
  □ Any improvement vs last session on same exercises?
  □ Equipment-appropriate exercises only?
  (Source: health_guidelines_reference.md Part 3)

Step 3 — Score each dimension 1–5
  Volume, Balance, Intensity, Progression, Variety, Recovery
  (Source: health_guidelines_reference.md Part 3B)

Step 4 — Strength tier check
  ratio = weight_lifted_kg / profile.weight_kg
  Look up tier from progress_metrics_and_benchmarks.md Part 1
  Flag if a tier boundary was crossed

Step 5 — Injury risk flags
  Same muscle on consecutive days, volume spike > 10%, push:pull imbalance
  (Source: injury_prevention_and_common_mistakes.md)

Step 6 — Goal alignment
  Compare session to program prescription
  (Source: goal_programs.md)

Step 7 — Return review object:
{
  summary:      "string — one positive sentence",
  scores: { volume, balance, intensity, progression, variety, recovery }, // 1–5 each
  improvements: ["string", "string"],   // max 2
  highlight:    "string — one win",
  flags:        []  // "injury_risk" | "stall" | "imbalance" | "tier_up"
}
```

---

### Notification engine

Run on every app open and daily via Service Worker.
Returns at most ONE notification per day.

```javascript
checkNotifications(profile, notifState, goals, workouts)
```

Check triggers in this priority order — return the first one that fires:

```
1. Safety: red flag symptom reported by user
2. CONSECUTIVE_SAME_MUSCLE: same muscle on consecutive days (> 6 sets)
3. OVERTRAINING_WARNING: 5+ hard sessions (RPE ≥ 8) with no rest
4. Day state machine (SOFT_CHECKIN → DECONDITIONING_ALERT → REENGAGEMENT → RETURN_WELCOME)
5. PUSH_PULL_IMBALANCE: weekly push > 2× weekly pull
6. DELOAD_REMINDER: 6 weeks without a deload
7. STALL_ALERT: same weight + reps on same exercise 3+ sessions in a row
8. CARDIO_WEEKLY_TARGET: Wed/Thu check vs WHO 150 min/week minimum
9. LEGS_NEGLECT: no lower body in 10+ days
10. PROGRESSION_WIN: weight or reps increased vs last session
11. STRENGTH_TIER_UP: lift crossed a tier boundary
12. CONSISTENCY_STREAK: 7 / 30 / 90 day milestones
```

Before firing any notification, check:
- `notifState.last_notif_sent` — if already sent today, return null
- `notifState.permission_granted` — if false, return null

```javascript
// Notification object shape
{
  type:    "SOFT_CHECKIN",
  title:   "string",
  body:    "string — max 3 sentences",
  buttons: ["string", "string"] // or null
}
```

---

### Day state machine

```javascript
function getDayState(profile, notifState) {
  // Read: onboarding_spec.md Part 1 and CLAUDE.md notification section
  // for full state definitions and age-adjusted thresholds
  const daysSince = daysBetween(profile.last_logged, today());
  const expectedRest = 7 - profile.training_days;
  const gap = daysSince - expectedRest;

  // Age-adjusted threshold — older adults decondition faster
  // Source: health_guidelines_reference.md Part 2A (older adult guidelines)
  const extendedThreshold = profile.age >= 65 ? 4 : profile.age >= 50 ? 5 : 7;

  if (daysSince === 0)                                  return 'LOGGED';
  if (gap <= 0)                                         return 'REST_SCHEDULED';
  if (gap <= 2)                                         return 'REST_ASSUMED';
  if (gap === 3 && !notifState.checkin_response)        return 'AMBIGUOUS';
  if (gap >= extendedThreshold && !notifState.checkin_response) return 'EXTENDED_GAP';
  if (daysSince >= 14 && daysSince < 30)                return 'INACTIVE';
  if (daysSince >= 30)                                  return 'CHURNED';
  return 'AMBIGUOUS';
}
```

---

### Calculation functions (pure — no localStorage reads)

```javascript
calcBMI(weight_kg, height_cm)
calcMHR(age)                           // Tanaka: 208 - (0.7 * age)
calcBMR(weight_kg, height_cm, age, sex)// Mifflin-St Jeor
calcTDEE(bmr, training_days)           // BMR × activity multiplier
calcHRZones(mhr, resting_hr)           // Karvonen if resting_hr, else % MHR
calcProteinTarget(weight_kg, age, goal)// g/day from ISSN/ACSM tables
calcStrengthTier(exercise, lifted_kg, bodyweight_kg, sex) // from benchmarks.md
estimate1RM(weight_kg, reps)           // Epley: weight * (1 + reps/30)
daysBetween(dateStr1, dateStr2)        // returns integer days
today()                                // returns ISO date string "YYYY-MM-DD"
```

All formulas come from `health_guidelines_reference.md` and
`progress_metrics_and_benchmarks.md`. Read those files before implementing.

---

## ONBOARDING

4 steps + welcome summary screen (5 total). Each step has a ← Back button.
Progress dots at top show all 5 positions.

- **Step 1** — About You: sex, age, weight, height
- **Step 2** — Your Goal: goal card + training days stepper
- **Step 3** — Your Experience: experience level card
- **Step 4** — How You Train: equipment, training_method, optional resting HR
- **Summary** — computed numbers (BMR/TDEE/protein/HR zones) + optional weight target + date

After Step 4: run `computeDerivedValues()`, run `autoAssignProgram(goal, experience, training_days, equipment)`,
render welcome summary. `obFinish()` saves everything to localStorage.
- Profile completeness gate: run `isProfileComplete()` on every page load
- Notification permission: ask on summary screen, never before

---

## NOTIFICATION DELIVERY

**While app is open:**
Call `checkNotifications()` on page load and after every workout log.
Render result as an in-app banner — not a browser notification.

**While app is closed:**
Service Worker (`sw.js`) uses Background Sync API to run
`checkNotifications()` periodically. If a notification is due, call:
```javascript
self.registration.showNotification(notif.title, { body: notif.body });
```

---

## server.js — /api/sync

The only backend endpoint. Receives localStorage data and saves it
server-side as a backup file. No processing, no auth, no packages.

```
POST /api/sync
Body:     { rw_workouts, rw_profile, rw_notif, rw_goals }
Response: { ok: true, synced_at: "ISO date" }
```

Use Node's built-in `http` and `fs` modules only.
Save as `/data/{user_id}.json`. Create `/data/` directory if it doesn't exist.

---

## CODING CONVENTIONS

**JavaScript:**
- ES6+ (const/let, arrow functions, template literals, async/await, spread)
- Plain functions and objects — no classes required
- camelCase for functions and variables
- UPPER_SNAKE_CASE for constants
- Every localStorage operation must handle parse errors and storage-full
- Pure calculation functions take parameters — never read localStorage directly

**HTML / CSS:**
- Mobile-first layout — this is primarily a phone app
- No external CSS frameworks
- CSS custom properties for colors and spacing
- Keep UI simple — this is a tracker, not a portfolio piece

**Comments:**
- Comment the "why", not the "what"
- Always cite the knowledge base file when using a fitness number:
  `// Source: health_guidelines_reference.md Part 4C`

**Data safety:**
- localStorage cap is ~5–10MB — always check rwSet() return value
- Never delete workout entries — mark deleted: true if needed
- Validate all user input before writing to localStorage
- Provide a JSON export/download function so users can back up their data

---

## CHECKLIST BEFORE WRITING ANY FITNESS FUNCTION

  □ Have I read the relevant knowledge base file?
  □ Is every number sourced from the files, not from memory?
  □ Have I added a source comment citing the file?
  □ Does the logic adjust for age (under 50, 50–64, 65+)?
  □ Does the logic adjust for sex where benchmarks differ?
  □ Does the logic respect the user's equipment setting?
  □ Does the function handle null / missing profile fields gracefully?
  □ Is feedback tone encouraging — not guilt-based?

---

## WHAT NOT TO BUILD

- No user accounts or server-side authentication
- No real-time features or WebSockets
- No external API calls at runtime
- No charting libraries — use SVG or CSS bar charts if needed
- No AI API calls — all logic is coded functions
