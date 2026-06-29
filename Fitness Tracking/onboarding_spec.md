# Onboarding Spec
## Fitness Tracker App — Reference File 9 of 9

Defines the first-time user onboarding flow: what to collect, in what order,
how to validate it, and what to do with it after.

---

## PART 1 — FLOW OVERVIEW

3 screens. Keep each screen under 60 seconds to complete.

```
┌──────────────────────────────────────────────────────────┐
│  SCREEN 1        SCREEN 2        SCREEN 3                │
│  About You  →    Your Goal  →    How You Train           │
│  (4 fields)      (3 fields)      (2 fields + 1 optional) │
└──────────────────────────────────────────────────────────┘
         ↓
  Validate all fields
         ↓
  Run computeDerivedValues()
         ↓
  Save everything to localStorage → rw_profile
         ↓
  Auto-assign program → rw_goals
         ↓
  Show welcome summary screen
         ↓
  App unlocked — user lands on dashboard
```

---

## PART 2 — SCREEN 1: ABOUT YOU

**Purpose:** Biometric data. Powers all calculations — BMI, BMR, MHR,
protein targets, heart rate zones.

| Field | Input Type | Validation | Notes |
|---|---|---|---|
| `age` | Number stepper | Integer, 13–100 | Under 18: show youth disclaimer |
| `sex` | Toggle: Male / Female | Required | BMR formula + strength benchmarks differ |
| `weight_kg` | Number input | 30–300 kg | Offer kg / lbs toggle; always store as kg |
| `height_cm` | Number input | 100–250 cm | Offer cm / ft+in toggle; always store as cm |

**UI notes:**
- Progress indicator: Step 1 of 3
- Weight and height work well as scroll pickers on mobile
- No explanations needed — these are objective facts

---

## PART 3 — SCREEN 2: YOUR GOAL

**Purpose:** What the user wants to achieve, how often they can train,
and how experienced they are. Drives program selection and review logic.

| Field | Input Type | Validation | Notes |
|---|---|---|---|
| `goal` | Card picker | Required, one of 7 values | Show icon + short description per card |
| `training_days` | Number stepper | Integer, 1–7 | Default: 3 |
| `experience` | Card picker | Required, one of 4 values | Plain language — no gym jargon |

**Goal cards:**

| Stored value | Display label | Card description |
|---|---|---|
| `fat_loss` | Lose Fat | Burn fat while keeping your muscle |
| `hypertrophy` | Build Muscle | Get bigger and more defined |
| `strength` | Get Stronger | Lift heavier, build raw power |
| `endurance` | Improve Fitness | Run further, breathe easier, last longer |
| `general_health` | Stay Healthy | Feel good and move well every day |
| `calisthenics` | Master Bodyweight | Pull-ups, handstands, and beyond |
| `recomp` | Body Recomp | Lose fat and build muscle at the same time |

**Experience cards:**

| Stored value | Display label | Card description |
|---|---|---|
| `beginner` | Just Starting | New to training, or back after 6+ months off |
| `novice` | Some Experience | Training consistently for 6–18 months |
| `intermediate` | Training Regularly | 1–3 years of structured training |
| `advanced` | Very Experienced | 3+ years of serious, structured training |

**UI notes:**
- Cards with icons scan faster than dropdowns — use cards
- Training days: "I can train X days per week" with a +/− stepper
- If user picks `recomp` + `beginner`, show inline note:
  "Good news — beginners naturally build muscle and lose fat at the same time."

---

## PART 4 — SCREEN 3: HOW YOU TRAIN

**Purpose:** Equipment access and preferred training style.
Controls which exercises get suggested and how sessions are reviewed.

| Field | Input Type | Validation | Notes |
|---|---|---|---|
| `equipment` | Card picker | Required, one of 4 values | |
| `training_method` | Card picker | Required, one of 4 values | |
| `resting_hr` | Number input | 30–120 bpm, optional | Make skipping obvious |

**Equipment cards:**

| Stored value | Display label | Description |
|---|---|---|
| `full_gym` | Full Gym | Barbells, machines, cables, dumbbells |
| `dumbbells` | Dumbbells Only | Home setup or basic gym |
| `bodyweight` | No Equipment | Just my bodyweight |
| `mixed` | Mixed Setup | Some equipment, not a full gym |

**Training method cards:**

| Stored value | Display label | Description |
|---|---|---|
| `failure` | Until Failure | Push every set to the max |
| `volume` | Volume Training | Lots of sets and reps, moderate weight |
| `strength` | Strength Focus | Heavy weight, low reps, long rest |
| `endurance` | Endurance / Cardio | Lighter weights, high reps, cardio-heavy |

**Resting heart rate (optional):**
- Label: "What's your resting heart rate?" with a visible [Skip] button
- Helper text: "Check your pulse first thing in the morning, or read it
  from a smartwatch. Makes your cardio zones more accurate."
- If skipped: store as `null` — zones calculated from % MHR only

**UI notes:**
- Tell the user they're nearly done: "2 quick picks and you're done"
- If `bodyweight` selected: flag `barbell_available: false` in profile
  so the review engine never suggests barbell exercises

---

## PART 5 — VALIDATION RULES

Run before saving. Show inline errors per field — not a single alert.

| Field | Rule | Error message |
|---|---|---|
| `age` | 13 ≤ age ≤ 100 | "Please enter a valid age (13–100)." |
| `weight_kg` | 30 ≤ weight ≤ 300 | "Please enter a weight between 30 and 300 kg." |
| `height_cm` | 100 ≤ height ≤ 250 | "Please enter a height between 100 and 250 cm." |
| `training_days` | 1 ≤ days ≤ 7 | "Training days must be between 1 and 7." |
| `resting_hr` | 30 ≤ hr ≤ 120 if provided | "That heart rate looks unusual — please recheck." |
| All required fields | Not null, not empty | "This field is required." |

**Under-18 handling:**
Show below the age field: "This app is designed for adults. If you're under 18,
check with a parent or coach before starting a training program."
Store `youth: true` in the profile. The review engine applies conservative
recommendations for youth users.

---

## PART 6 — POST-ONBOARDING: WHAT RUNS IMMEDIATELY

### 6A. Compute and store derived values

Run `computeDerivedValues(profile)` right after saving.
Store results back into `rw_profile`.

```javascript
function computeDerivedValues(profile) {
  const heightM = profile.height_cm / 100;

  // BMI — WHO formula
  const bmi = parseFloat((profile.weight_kg / (heightM * heightM)).toFixed(1));

  // Max Heart Rate — Tanaka formula (more accurate than 220-age)
  // Source: health_guidelines_reference.md Part 1B
  const mhr = Math.round(208 - (0.7 * profile.age));

  // BMR — Mifflin-St Jeor
  // Source: health_guidelines_reference.md Part 1 / nutrition_and_fueling.md Part 1A
  const bmr = profile.sex === 'male'
    ? Math.round((10 * profile.weight_kg) + (6.25 * profile.height_cm) - (5 * profile.age) + 5)
    : Math.round((10 * profile.weight_kg) + (6.25 * profile.height_cm) - (5 * profile.age) - 161);

  // TDEE — activity multiplier from training_days
  // Source: nutrition_and_fueling.md Part 1B
  const multiplier =
    profile.training_days <= 2 ? 1.375 :
    profile.training_days <= 4 ? 1.55  :
    profile.training_days <= 6 ? 1.725 : 1.9;
  const tdee = Math.round(bmr * multiplier);

  // Protein target — ISSN/ACSM guidelines
  // Source: health_guidelines_reference.md Part 4C
  const proteinRate = profile.age >= 50 ? 1.2 : 1.6;
  const protein_target = Math.round(profile.weight_kg * proteinRate);

  // HR Zones — Karvonen if resting_hr known, else % MHR
  // Source: health_guidelines_reference.md Part 2C
  const hrr = profile.resting_hr ? mhr - profile.resting_hr : null;
  const zone = (low, high) => hrr
    ? { low: Math.round(hrr * low + profile.resting_hr),
        high: Math.round(hrr * high + profile.resting_hr) }
    : { low: Math.round(mhr * low), high: Math.round(mhr * high) };

  const hr_zones = {
    z1: zone(0.50, 0.60),
    z2: zone(0.60, 0.70),
    z3: zone(0.70, 0.80),
    z4: zone(0.80, 0.90),
    z5: zone(0.90, 1.00)
  };

  return { bmi, mhr, bmr, tdee, protein_target, hr_zones };
}
```

### 6B. Auto-assign program

Look up the right program from this table and store in `rw_goals.program`.
Source: `goal_programs.md`.

| Goal | Experience | Equipment | Program assigned |
|---|---|---|---|
| `general_health` | any | any | Full Body 3x/Week |
| `hypertrophy` | beginner / novice | full_gym / mixed | Full Body Hypertrophy 3x/Week |
| `hypertrophy` | intermediate / advanced | full_gym | PPL 6x/Week |
| `hypertrophy` | any | bodyweight / dumbbells | Full Body Hypertrophy (modified) |
| `strength` | beginner / novice | full_gym / mixed | Linear Progression A/B |
| `strength` | intermediate / advanced | full_gym | 5/3/1-style Weekly |
| `fat_loss` | any | any | Fat Loss Resistance + Cardio Split |
| `endurance` | any | any | Cardio Base Building 8-Week Block |
| `calisthenics` | any | any | Calisthenics Foundation |
| `recomp` | any | any | Full Body 3x/Week |

```javascript
function autoAssignProgram(goal, experience, equipment) {
  if (goal === 'hypertrophy') {
    if (['bodyweight', 'dumbbells'].includes(equipment))
      return 'Full Body Hypertrophy (modified)';
    if (['intermediate', 'advanced'].includes(experience) && equipment === 'full_gym')
      return 'PPL 6x/Week';
    return 'Full Body Hypertrophy 3x/Week';
  }
  if (goal === 'strength') {
    if (['intermediate', 'advanced'].includes(experience) && equipment === 'full_gym')
      return '5/3/1-style Weekly';
    return 'Linear Progression A/B';
  }
  const map = {
    fat_loss:       'Fat Loss Resistance + Cardio Split',
    endurance:      'Cardio Base Building 8-Week Block',
    calisthenics:   'Calisthenics Foundation',
    recomp:         'Full Body 3x/Week',
    general_health: 'Full Body 3x/Week'
  };
  return map[goal] || 'Full Body 3x/Week';
}
```

### 6C. Show welcome summary screen

After saving, show the user their numbers before taking them to the dashboard.
This confirms the app is set up correctly and builds trust immediately.

```
┌─────────────────────────────────────┐
│  You're all set!                    │
│                                     │
│  Goal:     Build Muscle             │
│  Program:  PPL 6x/Week              │
│                                     │
│  Daily calories:  2,820 kcal        │
│  Daily protein:   150g              │
│                                     │
│  Your heart rate zones:             │
│  Zone 1 (Recovery)   95 – 114 bpm   │
│  Zone 2 (Base)      114 – 133 bpm   │
│  Zone 3 (Moderate)  133 – 152 bpm   │
│  Zone 4 (Hard)      152 – 171 bpm   │
│  Zone 5 (Max)       171 – 190 bpm   │
│                                     │
│  [Start tracking →]                 │
└─────────────────────────────────────┘
```

---

## PART 7 — localStorage STRUCTURE AFTER ONBOARDING

### rw_profile (complete shape after onboarding)

```javascript
{
  // Collected in onboarding
  user_id:         "uuid-string",
  age:             25,
  sex:             "male",           // "male" | "female"
  weight_kg:       75.0,
  height_cm:       175.0,
  goal:            "hypertrophy",
  training_days:   4,
  experience:      "intermediate",
  equipment:       "full_gym",
  training_method: "volume",
  resting_hr:      62,               // null if skipped
  barbell_available: true,           // false if equipment === "bodyweight"

  // Computed immediately after onboarding
  bmi:             24.5,
  mhr:             190,
  bmr:             1820,
  tdee:            2821,
  protein_target:  150,
  hr_zones: {
    z1: { low: 95,  high: 114 },
    z2: { low: 114, high: 133 },
    z3: { low: 133, high: 152 },
    z4: { low: 152, high: 171 },
    z5: { low: 171, high: 190 }
  },

  // Updated over time — null at start
  last_logged:     null,
  weight_history:  [],               // [{ date, weight_kg }]
  created_at:      "2026-06-29T00:00:00.000Z"
}
```

### rw_goals (initial state after onboarding)

```javascript
{
  program:              "PPL 6x/Week",
  program_week:         1,
  weekly_cardio_min:    0,
  weekly_sets: {
    chest: 0, back: 0, shoulders: 0,
    biceps: 0, triceps: 0, quads: 0,
    hamstrings: 0, glutes: 0, core: 0, calves: 0
  },
  streak_days:          0,
  last_streak_date:     null,
  personal_bests:       {},
  weeks_since_deload:   0,
  last_week_reset:      "2026-06-29"  // reset weekly counters each Monday
}
```

### rw_workouts (empty at start)

```javascript
[]
```

### rw_notif (initial state)

```javascript
{
  day_state:                  "REST_ASSUMED",
  last_state_change:          "2026-06-29",
  last_notif_sent:            null,
  last_notif_type:            null,
  checkin_response:           null,
  consecutive_hard_sessions:  0,
  weeks_since_deload:         0,
  permission_granted:         false   // updated after user grants notification permission
}
```

---

## PART 8 — PROFILE COMPLETENESS CHECK

Before any feature runs (review, notification, dashboard stats), call this.
If incomplete, route the user back to the correct screen.

```javascript
const REQUIRED_FIELDS = [
  'age', 'sex', 'weight_kg', 'height_cm',    // Screen 1
  'goal', 'training_days', 'experience',      // Screen 2
  'equipment', 'training_method'              // Screen 3
];

function isProfileComplete(profile) {
  if (!profile) return { complete: false, missing: REQUIRED_FIELDS };
  const missing = REQUIRED_FIELDS.filter(f =>
    profile[f] === null || profile[f] === undefined || profile[f] === ''
  );
  return { complete: missing.length === 0, missing };
}

// Usage — call this on every page load
const profile = rwGet('rw_profile');
const { complete, missing } = isProfileComplete(profile);
if (!complete) {
  const screen = missing[0];
  const SCREEN_MAP = {
    age: 1, sex: 1, weight_kg: 1, height_cm: 1,
    goal: 2, training_days: 2, experience: 2,
    equipment: 3, training_method: 3
  };
  showOnboardingScreen(SCREEN_MAP[screen]);
}
```

---

## PART 9 — FIELDS THAT UPDATE OVER TIME

These are not collected during onboarding — they change as the user trains.

| Field | Where stored | When updated |
|---|---|---|
| `last_logged` | rw_profile | After every workout log |
| `weight_history` | rw_profile | When user logs a new weigh-in |
| `tdee` | rw_profile | Recalculate every 4 weeks or after 3%+ weight change |
| `resting_hr` | rw_profile | When user updates it in settings |
| `program` | rw_goals | When user advances to next phase |
| `weekly_sets` | rw_goals | After every workout log; reset each Monday |
| `streak_days` | rw_goals | After every logged session or confirmed rest day |
| `personal_bests` | rw_goals | When a new max weight is logged on any lift |
| `day_state` | rw_notif | Evaluated daily by notification engine |

---

## PART 10 — NOTIFICATION PERMISSION

Ask for notification permission after the welcome summary screen —
never before or during onboarding.

```javascript
async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  // Only ask if permission is 'default' (not yet asked)
  const result = await Notification.requestPermission();
  const granted = result === 'granted';

  // Store result so we don't ask again
  rwUpdate('rw_notif', n => ({ ...n, permission_granted: granted }));
  return granted;
}
```

Show this prompt on the welcome summary screen below the [Start tracking] button:
"Enable notifications to get reminders and progress updates."
with a [Turn on notifications] button that calls this function.
Make it easy to skip — do not block the user from proceeding.

---

## PART 11 — FILE ROLES AT A GLANCE

| File | What it is | When Claude Code reads it |
|---|---|---|
| `CLAUDE.md` | Project instructions for Claude Code | Always — read first |
| `weightlifting_exercises.md` | Exercise list with movement pattern tags | Writing exercise classification logic |
| `health_guidelines_reference.md` | WHO/ACSM/AHA formulas and guidelines | Writing any calculation |
| `nutrition_and_fueling.md` | Calorie and macro calculations | Writing TDEE, protein, nutrition logic |
| `goal_programs.md` | Program templates and weekly schedules | Writing program assignment and compliance |
| `injury_prevention_and_common_mistakes.md` | Safety flags and form errors | Writing injury risk detection |
| `progress_metrics_and_benchmarks.md` | Strength tiers and fitness norms | Writing tier checks and milestones |
| `glossary_and_terminology.md` | Definitions of all fitness terms | Clarifying any term before using it in code |
| `onboarding_spec.md` | This file — onboarding flow and data shapes | Building onboarding screens and data layer |
