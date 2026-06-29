# Fitness Health Guidelines Reference
## For Fitness Tracking App — Exercise Review Engine

This file contains evidence-based exercise guidelines sourced from the world's leading health and sports science organizations. All recommendations are personalized to the user's **age**, **weight (kg)**, and **height (cm)** where applicable.

---

## AUTHORITATIVE SOURCES

| Organization | Abbreviation | Scope | Key Publication |
|---|---|---|---|
| World Health Organization | **WHO** | Global public health | *WHO Guidelines on Physical Activity and Sedentary Behaviour* (2020) |
| American College of Sports Medicine | **ACSM** | Exercise science & prescription | *Guidelines for Exercise Testing and Prescription*, 11th Ed. (2021); *Resistance Training Position Stand* (2026) |
| American Heart Association | **AHA** | Cardiovascular health | *Physical Activity Recommendations for Adults* (2023) |
| National Strength & Conditioning Association | **NSCA** | Strength training & performance | *NSCA Essentials of Strength Training and Conditioning*, 4th Ed. |
| International Society of Sports Nutrition | **ISSN** | Sports nutrition & recovery | *Position Stand: Protein and Exercise* (2017, updated) |
| U.S. Dept. of Health & Human Services | **HHS** | National public health | *Physical Activity Guidelines for Americans*, 2nd Ed. (2018) |
| Mayo Clinic | **Mayo** | Clinical exercise medicine | Exercise intensity and heart rate guidance |

> **Important:** These guidelines are for healthy adults. Users with cardiovascular disease, metabolic conditions, musculoskeletal injuries, or other health conditions should consult a qualified healthcare provider before following these guidelines.

---

## PART 1 — USER BIOMETRIC CALCULATIONS

These formulas run on user inputs: **age**, **weight (kg)**, **height (cm)**, **resting heart rate (bpm)** (optional).

---

### 1A. BMI (Body Mass Index)

**Formula:**
```
BMI = weight (kg) / height (m)²
Example: 70 kg, 175 cm → BMI = 70 / (1.75²) = 22.9
```

**WHO BMI Classification:**

| BMI Range | Classification | Exercise Note |
|-----------|---------------|---------------|
| < 18.5 | Underweight | Prioritize strength training + caloric support |
| 18.5 – 24.9 | Normal weight | Full range of exercise appropriate |
| 25.0 – 29.9 | Overweight | Emphasize low-impact cardio + resistance training |
| 30.0 – 34.9 | Obese Class I | Physician clearance recommended; start low-intensity |
| 35.0 – 39.9 | Obese Class II | Physician clearance required; joint-friendly exercise |
| ≥ 40.0 | Obese Class III | Medical supervision recommended |

> Source: WHO (2020)

---

### 1B. Maximum Heart Rate (MHR)

Two formulas — use the more accurate Tanaka formula by default:

**Classic formula (common, less accurate for older adults):**
```
MHR = 220 − age
```

**Tanaka formula (more accurate across all ages):**
```
MHR = 208 − (0.7 × age)
Example: Age 35 → MHR = 208 − (0.7 × 35) = 183.5 bpm
```

> Source: Mayo Clinic; REI Expert Advice; *Medicine & Science in Sports & Exercise*

---

### 1C. Heart Rate Reserve (HRR) — Karvonen Method

More personalized than % MHR alone. Requires resting heart rate (RHR):

**Formula:**
```
HRR = MHR − RHR
Target HR at X% intensity = (HRR × X%) + RHR
```

**Example:** Age 30, RHR 60, MHR 190:
```
HRR = 190 − 60 = 130
Zone 2 target (60–70%) = (130 × 0.60) + 60 = 138 bpm to (130 × 0.70) + 60 = 151 bpm
```

> Source: Mayo Clinic; ACSM GETP 11th Ed.

---

### 1D. Age-Group Classification (for guideline selection)

| Age Range | Group | Guideline Set Applied |
|-----------|-------|-----------------------|
| 6 – 17 | Children & Adolescents | WHO Youth / HHS Youth |
| 18 – 64 | Adults | WHO Adult / ACSM Adult / AHA Adult |
| 65+ | Older Adults | WHO Older Adult / ACSM Older Adult |

---

## PART 2 — CARDIO EXERCISE GUIDELINES

---

### 2A. Weekly Cardio Volume by Age Group

#### Adults (18–64 years)

| Intensity | Minimum | Optimal (additional benefit) | Source |
|-----------|---------|------------------------------|--------|
| Moderate | 150 min/week | 300 min/week | WHO 2020, AHA, HHS 2018 |
| Vigorous | 75 min/week | 150 min/week | WHO 2020, AHA, HHS 2018 |
| Combined | Equivalent mix | Equivalent mix | WHO 2020 |

> **ACSM:** Minimum 30 min/day moderate on ≥5 days/week, OR minimum 20 min/day vigorous on ≥3 days/week. Source: ACSM Physical Activity Guidelines.

#### Older Adults (65+)

Same aerobic minimums as adults (150 min moderate / 75 min vigorous per week), **plus:**
- Balance and fall-prevention exercise: ≥3 days/week
- Multi-component activity (aerobic + strength + balance in one session): ≥3 days/week
- Reduce sedentary time as much as possible

> Source: WHO 2020; AHA 2023

#### Children & Adolescents (6–17)

- **60 minutes/day** of moderate-to-vigorous activity
- Include vigorous activity ≥3 days/week
- Include muscle- and bone-strengthening activities ≥3 days/week

> Source: WHO 2020; HHS 2018; AHA

---

### 2B. Cardio Intensity Definitions

#### By MET (Metabolic Equivalent of Task)

| Intensity | MET Range | Description |
|-----------|-----------|-------------|
| Sedentary | < 1.5 METs | Sitting, lying down |
| Light | 1.5 – < 3.0 METs | Slow walking, light housework |
| Moderate | 3.0 – < 6.0 METs | Brisk walking, easy cycling, swimming |
| Vigorous | ≥ 6.0 METs | Running, fast cycling, hard swimming |

> Source: WHO 2020 Guidelines

#### By % Maximum Heart Rate (% MHR)

| Intensity | % MHR | RPE (0–10 scale) | Talk Test |
|-----------|--------|------------------|-----------|
| Very Light | < 57% | 1–2 | Full comfortable conversation |
| Light | 57–63% | 2–3 | Easy conversation |
| Moderate | 64–76% | 4–5 | Conversation possible |
| Vigorous | 77–95% | 6–8 | Only a few words |
| Near Max | 96–100% | 9–10 | Cannot speak |

> Source: ACSM GETP 11th Ed.; AHA Target Heart Rates Chart

---

### 2C. Heart Rate Training Zones (Zones 1–5)

**Calculation:** Zones are based on % of MHR (or Karvonen if RHR is known).
Use Tanaka formula: `MHR = 208 − (0.7 × age)`.

| Zone | Name | % MHR | % HRR (Karvonen) | Primary Benefit | Fuel Source | Session Duration |
|------|------|--------|------------------|-----------------|-------------|-----------------|
| **Zone 1** | Recovery / Very Light | 50–60% | 50–60% | Active recovery, blood flow | Fat (90%+) | 20–60 min |
| **Zone 2** | Aerobic Base / Light | 60–70% | 60–70% | Fat oxidation, aerobic base, mitochondria | Fat (85%) | 30–90 min |
| **Zone 3** | Aerobic / Moderate | 70–80% | 70–80% | Aerobic fitness, ventilatory threshold | Fat + Carbs | 20–60 min |
| **Zone 4** | Threshold / Hard | 80–90% | 80–90% | Lactate threshold, speed, endurance | Carbs (75%+) | 10–30 min |
| **Zone 5** | VO2 Max / Max Effort | 90–100% | 90–100% | Max power, anaerobic capacity | Carbs (90%+) | 1–8 min intervals |

> Source: Cleveland Clinic; REI Expert Advice; ACSM; BarBell Medicine Zone Guide

**Zone calculation example — Age 30, RHR 65:**
```
MHR = 208 − (0.7 × 30) = 187 bpm
HRR = 187 − 65 = 122

Zone 1: (122 × 0.50) + 65 = 126 bpm to (122 × 0.60) + 65 = 138 bpm
Zone 2: (122 × 0.60) + 65 = 138 bpm to (122 × 0.70) + 65 = 150 bpm
Zone 3: (122 × 0.70) + 65 = 150 bpm to (122 × 0.80) + 65 = 163 bpm
Zone 4: (122 × 0.80) + 65 = 163 bpm to (122 × 0.90) + 65 = 175 bpm
Zone 5: (122 × 0.90) + 65 = 175 bpm to 187 bpm
```

**If RHR is not provided**, use simple % MHR method:
```
Zone 1: MHR × 0.50 to MHR × 0.60
Zone 2: MHR × 0.60 to MHR × 0.70
Zone 3: MHR × 0.70 to MHR × 0.80
Zone 4: MHR × 0.80 to MHR × 0.90
Zone 5: MHR × 0.90 to MHR × 1.00
```

---

### 2D. Zone Training Distribution — The 80/20 Rule

Based on endurance athlete research and sports science evidence:

| Zone | Recommended Weekly % | Rationale |
|------|---------------------|-----------|
| Zones 1–2 | ~80% of cardio time | Builds aerobic base, promotes fat oxidation, allows recovery |
| Zones 3–5 | ~20% of cardio time | Improves VO2 max, lactate threshold, speed |

> **Health note:** For general health (non-athletes), most cardio should be in Zone 2–3 (moderate intensity). Zone 4–5 without an aerobic base increases injury and overtraining risk.
> Source: BarBell Medicine; VO2 Master; sports science meta-analyses

---

### 2E. Cardio by Exercise Mode

Zone targets may differ by activity. Cycling HR zones are typically 5–8 bpm lower than running for the same effort.

| Mode | Zone 2 Feel | Notes |
|------|-------------|-------|
| Running / Jogging | Conversational pace; light sweat | Most common Zone 2 reference |
| Cycling | Steady effort; able to hold a sentence | HR ~5–8 bpm lower than running equivalent |
| Swimming | Steady stroke; breathing every 2–3 strokes | Full-body; lower HR than running at same effort |
| Rowing | Consistent stroke rate; light/moderate breathlessness | Full-body; high energy demand |
| Walking | Brisk pace; slightly elevated breathing | Typically Zone 1–2 for most adults |
| HIIT | Alternating Zone 4–5 with Zone 1–2 recovery | Not recommended >2x/week for most |

> Source: REI Expert Advice; Cleveland Clinic; VO2 Master

---

## PART 3 — STRENGTH TRAINING GUIDELINES

---

### 3A. Frequency Recommendations

| Age Group | Minimum Frequency | Optimal Frequency | Source |
|-----------|------------------|-------------------|--------|
| Adults (18–64) | ≥ 2 days/week | 2–4 days/week | WHO 2020; ACSM 2026; AHA |
| Older Adults (65+) | ≥ 2 days/week | 2–3 days/week | WHO 2020; ACSM |
| Youth (6–17) | ≥ 3 days/week | 3 days/week | WHO 2020; HHS 2018 |

> ACSM 2026 Position Stand: "The most meaningful gains come from moving from no resistance training to any resistance training. Specific variables matter less than consistent participation." Source: ACSM Position Stand (2026).

---

### 3B. Volume & Intensity by Goal

#### For Hypertrophy (Muscle Growth)

| Variable | Recommendation | Source |
|----------|---------------|--------|
| Sets per muscle per week | 10–20 sets | NSCA; ACSM 2026 |
| Rep range | 6–12 reps | ACSM 2026; NSCA |
| Load | 65–80% 1RM | ACSM; NSCA |
| Rest between sets | 60–90 seconds | ACSM; NSCA |
| Frequency per muscle | 2–3x per week | ACSM 2026 |

#### For Strength

| Variable | Recommendation | Source |
|----------|---------------|--------|
| Sets per muscle per week | 5–10 sets | NSCA |
| Rep range | 1–6 reps | NSCA; ACSM |
| Load | 80–100% 1RM | NSCA |
| Rest between sets | 3–5 minutes | NSCA |
| Frequency per muscle | 2–3x per week | NSCA |

#### For Muscular Endurance

| Variable | Recommendation | Source |
|----------|---------------|--------|
| Sets per muscle per week | 12–20 sets | ACSM; NSCA |
| Rep range | 15–25+ reps | ACSM; NSCA |
| Load | < 65% 1RM | ACSM |
| Rest between sets | 30–60 seconds | ACSM |

#### For General Health / Maintenance

| Variable | Recommendation | Source |
|----------|---------------|--------|
| Sets per muscle per week | 6–10 sets | ACSM 2026 |
| Rep range | 8–15 reps | ACSM; HHS 2018 |
| Sessions per week | ≥ 2 | WHO 2020; ACSM |

---

### 3C. Age-Adjusted Strength Training Considerations

#### Adults 18–40
- Full progressive overload applicable
- Prioritize compound lifts, progressive overload, and recovery
- Can handle higher volume and intensity

#### Adults 41–64
- Recovery time between sessions increases slightly
- Greater emphasis on joint health (avoid extreme ranges with poor mobility)
- Maintain or slightly reduce volume per session; spread over more days if needed
- Flexibility and mobility work becomes more important

#### Older Adults 65+
- **ACSM and WHO both recommend 2+ days/week strength training**
- Focus: functional movements (squat, hinge, push, pull, carry) to support daily life
- Add balance training to all sessions (single-leg stands, heel-to-toe walks)
- Emphasize muscle-strengthening for fall prevention and bone health
- Slower progression; allow extra recovery time (72+ hours between muscle groups)
- Higher rep ranges (10–15) with moderate weight preferred for joint safety

> Source: WHO 2020; ACSM GETP 11th Ed.; ACSM Recovery Guide for Older Adults

---

### 3D. Progressive Overload Principles

Progressive overload is the gradual increase of stress on the body to drive continued adaptation.

**Overload variables (from any single one):**
- **Weight/load** — increase by 2.5–5 kg when top of rep range is consistently achieved
- **Reps** — add 1–2 reps per set each session
- **Sets** — add one extra set per week
- **Frequency** — train the same muscle group one additional day per week
- **Tempo** — slow eccentric (lowering) phase (e.g. 3–4 seconds down)
- **Density** — reduce rest periods over time
- **Exercise difficulty** — move to a harder variation (especially for calisthenics)

> Source: ACSM 2026 Position Stand; NSCA; Wikipedia — Progressive Overload

**Signs of stalling:** No increase in reps, weight, or variation in 3+ consecutive weeks.
**Deload:** Reduce training volume by 40–50% every 4–8 weeks to allow systemic recovery.

---

## PART 4 — RECOVERY GUIDELINES

---

### 4A. Rest Between Sessions (Same Muscle Group)

| Population | Minimum Recovery Time | Source |
|------------|----------------------|--------|
| Adults (general) | 48 hours | ACSM; NSCA |
| Adults (high intensity) | 72 hours | NSCA |
| Older Adults (65+) | 72+ hours | ACSM |

---

### 4B. Sleep Recommendations

| Age Group | Recommended Sleep | Minimum for Recovery | Source |
|-----------|------------------|---------------------|--------|
| 18–25 | 7–9 hours | 7 hours | NSF; CDC |
| 26–64 | 7–9 hours | 7 hours | NSF; CDC |
| 65+ | 7–8 hours | 7 hours | NSF; CDC |

> Sleep deprivation reduces muscle protein synthesis, impairs recovery, and increases injury risk. ACSM recognizes sleep as a core component of exercise recovery.

---

### 4C. Protein Intake by Goal and Age (ISSN, ACSM, NSCA)

**General daily protein intake guidelines:**

| Population | Protein (g per kg body weight/day) | Source |
|---|---|---|
| Sedentary adults | 0.8 g/kg | RDA; WHO |
| Recreationally active adults | 1.2–1.4 g/kg | ACSM; ISSN |
| Strength / resistance training | 1.4–2.0 g/kg | ISSN 2017; ACSM |
| Endurance athletes | 1.2–1.6 g/kg | ISSN; ACSM |
| Muscle growth (hypertrophy focus) | 1.6–2.2 g/kg | ISSN; ACSM 2026 |
| Cutting / caloric deficit | 2.3–3.1 g/kg | ISSN (to preserve lean mass) |
| Adults 50+ (general) | 1.0–1.2 g/kg | ACSM; Gerontology literature |
| Adults 50+ (active/training) | 1.2–1.5 g/kg | ACSM Recovery Guide |

**Per-meal dose (to maximize muscle protein synthesis):**
- 0.25 g of high-quality protein per kg body weight per meal
- Or an absolute dose of 20–40 g per meal
- Distribute protein across 3–5 meals, every 3–4 hours

> Source: ISSN Position Stand: Protein and Exercise (2017); ACSM; NSCA

**Calculation for user:**
```
Minimum daily protein (training) = weight (kg) × 1.6 g
Optimal daily protein (hypertrophy) = weight (kg) × 2.0 g
Per-meal dose = weight (kg) × 0.25 g (minimum 20 g, maximum ~40 g)

Example: 75 kg user
  Minimum: 75 × 1.6 = 120 g/day
  Optimal: 75 × 2.0 = 150 g/day
  Per meal: 75 × 0.25 = 18.75 g → round to 20–25 g/meal
```

---

### 4D. Hydration Guidelines

| Activity Level | Water Intake Guidance |
|---------------|----------------------|
| Baseline (sedentary) | ~2.0 L/day (women) / ~2.5 L/day (men) |
| Exercise < 60 min | Add 400–600 ml around exercise |
| Exercise > 60 min | 150–250 ml every 15–20 min during activity |
| Post-exercise | 450–675 ml per 0.5 kg body weight lost |

> Source: ACSM; Academy of Nutrition and Dietetics

---

### 4E. Deload Protocol

A deload is a planned reduction in training volume or intensity to allow full systemic recovery.

| Trigger | Recommended Deload |
|---------|-------------------|
| Every 4–8 weeks proactively | 1 week at 40–50% normal volume, same exercises |
| After 5+ consecutive high-intensity days | Full rest day OR Zone 1 active recovery |
| Stalled progress for 3+ weeks | Deload week before retesting |
| Joint pain, excessive fatigue | Immediate deload; assess sleep/nutrition |

> Source: ACSM; NSCA Periodization Principles

---

## PART 5 — AGE × WEIGHT × HEIGHT PERSONALIZATION LOGIC

This section tells the review engine how to adjust recommendations based on user biometrics.

---

### 5A. Heart Rate Zone Personalization

**Input required:** `age`
**Optional:** `resting_heart_rate`

```
Step 1: MHR = 208 − (0.7 × age)                        [Tanaka formula]
Step 2 (if RHR known): HRR = MHR − RHR                  [Karvonen]
Step 3: Calculate zones using % HRR + RHR (or % MHR if no RHR)
Step 4: Output personalized BPM ranges for Zones 1–5
```

**Age-based MHR reference table:**

| Age | MHR (Tanaka) | Zone 1 (~55%) | Zone 2 (~65%) | Zone 3 (~75%) | Zone 4 (~85%) | Zone 5 (~95%) |
|-----|------------|--------------|--------------|--------------|--------------|--------------|
| 20 | 194 bpm | 107 bpm | 126 bpm | 146 bpm | 165 bpm | 184 bpm |
| 25 | 190 bpm | 105 bpm | 124 bpm | 143 bpm | 162 bpm | 181 bpm |
| 30 | 187 bpm | 103 bpm | 122 bpm | 140 bpm | 159 bpm | 178 bpm |
| 35 | 184 bpm | 101 bpm | 120 bpm | 138 bpm | 156 bpm | 175 bpm |
| 40 | 180 bpm | 99 bpm | 117 bpm | 135 bpm | 153 bpm | 171 bpm |
| 45 | 177 bpm | 97 bpm | 115 bpm | 133 bpm | 150 bpm | 168 bpm |
| 50 | 173 bpm | 95 bpm | 113 bpm | 130 bpm | 147 bpm | 164 bpm |
| 55 | 170 bpm | 94 bpm | 111 bpm | 128 bpm | 145 bpm | 162 bpm |
| 60 | 166 bpm | 91 bpm | 108 bpm | 125 bpm | 141 bpm | 158 bpm |
| 65 | 163 bpm | 90 bpm | 106 bpm | 122 bpm | 139 bpm | 155 bpm |
| 70 | 159 bpm | 87 bpm | 103 bpm | 119 bpm | 135 bpm | 151 bpm |

---

### 5B. Weekly Cardio Volume Personalization by Age

| Age Group | Min. Moderate Cardio | Min. Vigorous Cardio | Additional Recommendations |
|-----------|---------------------|---------------------|---------------------------|
| 18–64 | 150 min/week | 75 min/week | More = more benefit (up to 300 min moderate) |
| 65+ | 150 min/week | 75 min/week | + Balance training ≥3x/week + multi-component activity |
| 65+ (poor mobility) | As able | As able | Prioritize fall prevention; lighter intensity acceptable |

---

### 5C. Strength Training Volume Personalization by Age

| Age | Sets per Muscle per Week | Recovery per Muscle | Intensity Guidance |
|-----|------------------------|--------------------|--------------------|
| 18–40 | 10–20 sets (hypertrophy) | 48 hours | Full load progression; all rep ranges |
| 41–64 | 8–16 sets | 48–72 hours | Moderate-heavy; add mobility work |
| 65+ | 6–12 sets | 72+ hours | Functional movements; moderate load; balance work |

---

### 5D. Protein Intake Personalization by Weight and Age

**Formula per user:**
```
If age < 50 and training:
  Daily protein = weight_kg × 1.6  (minimum)
  Daily protein = weight_kg × 2.0  (optimal for muscle growth)

If age ≥ 50 and active:
  Daily protein = weight_kg × 1.2  (minimum)
  Daily protein = weight_kg × 1.5  (optimal for active older adults)

Per-meal protein dose = weight_kg × 0.25 g (minimum 20 g)
```

**Quick protein reference table:**

| Body Weight | Daily Protein (training, <50) | Daily Protein (active, 50+) | Per-Meal Dose |
|-------------|------------------------------|----------------------------|---------------|
| 55 kg | 88–110 g | 66–83 g | 20 g |
| 65 kg | 104–130 g | 78–98 g | 20–22 g |
| 75 kg | 120–150 g | 90–113 g | 22–25 g |
| 85 kg | 136–170 g | 102–128 g | 25–28 g |
| 95 kg | 152–190 g | 114–143 g | 28–32 g |
| 105 kg | 168–210 g | 126–158 g | 32–36 g |

---

### 5E. BMI-Based Exercise Intensity Adjustment

| BMI | Recommended Starting Intensity | Notes |
|-----|-------------------------------|-------|
| < 18.5 (Underweight) | Moderate (Zone 2–3) | Emphasize resistance over cardio; caloric surplus needed |
| 18.5–24.9 (Normal) | Any zone appropriate | Follow standard guidelines above |
| 25–29.9 (Overweight) | Zone 1–3; low-impact preferred | Walking, cycling, swimming; build base before high intensity |
| 30–34.9 (Obese I) | Zone 1–2; low-impact only | Avoid high-impact (running, jumping) until base fitness established |
| ≥ 35 (Obese II–III) | Zone 1; physician guidance | Chair-based or pool exercise; medical clearance recommended |

---

## PART 6 — FLEXIBILITY & MOBILITY GUIDELINES

| Component | Minimum Recommendation | Source |
|-----------|----------------------|--------|
| Static stretching | 60 seconds total per muscle group, ≥2 days/week | ACSM GETP 11th Ed. |
| Dynamic warm-up | 5–10 min before any exercise session | ACSM; NSCA |
| Flexibility frequency | ≥2–3 days/week | ACSM |
| Older adults (65+) | Daily balance + flexibility work | WHO 2020; ACSM |

---

## PART 7 — SEDENTARY BEHAVIOUR RISK

| Daily Sedentary Time | Health Risk Increase | Recommendation |
|---------------------|---------------------|----------------|
| < 7.5 hours | Low risk | Maintain activity levels |
| 7.5–9.5 hours | Moderate risk | Break up sitting every 30–60 min |
| > 9.5 hours | High risk | Actively reduce sitting time; standing/walking breaks |
| > 12 hours | Significantly elevated risk | Medical concern; major lifestyle change needed |

> Source: WHO 2020 — hazard ratios rise sharply above 9.5 hours sedentary time per day.

---

## QUICK REFERENCE — APP REVIEW INPUTS AND OUTPUTS

### Inputs the app should capture:
- `age` — for MHR, zone calculation, age-adjusted guidelines
- `weight_kg` — for protein calculation, BMI
- `height_cm` — for BMI
- `resting_heart_rate` (optional) — for Karvonen zones
- `goal` — hypertrophy / strength / endurance / fat loss / general health
- `exercises_logged` — list of exercises, sets, reps, weight
- `cardio_logged` — mode, duration, perceived zone or HR
- `previous_session` — for progressive overload check

### Outputs the review should generate:
- Personalized heart rate zones (Zone 1–5 in bpm)
- Weekly cardio volume status (vs WHO/ACSM recommendation)
- Strength volume status per muscle group (vs ACSM/NSCA)
- Progressive overload signal (up / stalled / decreased)
- Protein intake recommendation (based on weight + age + goal)
- Recovery status (hours since last session for each muscle group)
- Flagged imbalances (push:pull ratio, upper:lower ratio)
- Goal alignment score (are exercises appropriate for stated goal?)

---

*Sources: WHO (2020), ACSM GETP 11th Ed. (2021), ACSM Resistance Training Position Stand (2026), AHA Physical Activity Recommendations (2023), HHS Physical Activity Guidelines for Americans 2nd Ed. (2018), NSCA Essentials of Strength Training 4th Ed., ISSN Position Stand Protein & Exercise (2017), Mayo Clinic Exercise Intensity Guide, Cleveland Clinic Heart Rate Zones.*
