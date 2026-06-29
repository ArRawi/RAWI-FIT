# Nutrition & Fueling Reference
## Fitness Tracker App — Knowledge Base File 4 of 8

Covers calorie needs, macronutrient targets, nutrient timing, and body composition strategies.
All formulas use user inputs: **weight (kg)**, **height (cm)**, **age**, **sex**, **activity level**, **goal**.

Sources: ISSN, ACSM, NSCA, HHS Dietary Guidelines, Mifflin-St Jeor / Katch-McArdle equations.

---

## PART 1 — CALORIE CALCULATIONS

### 1A. Basal Metabolic Rate (BMR)

BMR = calories your body needs at complete rest (breathing, circulation, cell repair).

**Mifflin-St Jeor Equation** — most accurate for general population:
```
Men:   BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5
Women: BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161

Example (Male, 25y, 75kg, 175cm):
  BMR = (10×75) + (6.25×175) − (5×25) + 5 = 750 + 1093.75 − 125 + 5 = 1723.75 kcal
```

> Source: Mifflin-St Jeor (1990); validated as most accurate general-population BMR formula.

---

### 1B. Total Daily Energy Expenditure (TDEE)

TDEE = BMR × Activity Multiplier. This is your **maintenance calorie** level.

| Activity Level | Description | Multiplier |
|---|---|---|
| Sedentary | Desk job, little/no exercise | × 1.2 |
| Lightly Active | 1–3 workouts/week | × 1.375 |
| Moderately Active | 3–5 workouts/week | × 1.55 |
| Very Active | 6–7 hard workouts/week | × 1.725 |
| Extra Active | Physical job + hard training / 2x/day | × 1.9 |

```
TDEE = BMR × multiplier
Example: BMR 1724, Moderately Active → TDEE = 1724 × 1.55 = 2672 kcal/day
```

> Source: Harris-Benedict Activity Multipliers; TDEE Calculator standards; ACSM

---

### 1C. Calorie Targets by Goal

| Goal | Calorie Target | Expected Rate of Change |
|---|---|---|
| Fat Loss (moderate) | TDEE − 300 to 500 kcal | ~0.3–0.5 kg/week |
| Fat Loss (aggressive) | TDEE − 500 to 750 kcal | ~0.5–0.75 kg/week |
| Maintenance | = TDEE | Stable weight |
| Lean Bulk | TDEE + 200 to 300 kcal | ~0.25–0.5 kg/week |
| Aggressive Bulk | TDEE + 400 to 500 kcal | ~0.5–1.0 kg/week |

**Safety floors — never go below:**
```
Men:   1500 kcal/day minimum
Women: 1200 kcal/day minimum
(Lower requires medical supervision)
```

> Source: Built With Science; Gravitus; NSCA; HHS Dietary Guidelines

**Recalculate TDEE every 2–4 weeks** or after every 3–5% change in body weight.

---

## PART 2 — MACRONUTRIENT TARGETS

### 2A. Protein

Most important macro for training. Already covered in detail in `health_guidelines_reference.md`.

| Goal / Population | Daily Protein (g/kg body weight) | Source |
|---|---|---|
| Sedentary adult | 0.8 g/kg | RDA / WHO |
| Recreationally active | 1.2–1.4 g/kg | ACSM / ISSN |
| Muscle growth (hypertrophy) | 1.6–2.2 g/kg | ISSN 2017; ACSM 2026 |
| Strength focus | 1.6–2.0 g/kg | ISSN; NSCA |
| Endurance athlete | 1.2–1.6 g/kg | ISSN; ACSM |
| Fat loss / cutting | 2.2–3.1 g/kg | ISSN (preserving lean mass) |
| Adults 50+ (active) | 1.2–1.5 g/kg | ACSM |

**Per-meal protein dose:** 0.25 g/kg or 20–40 g absolute, every 3–4 hours.

---

### 2B. Carbohydrates

Primary fuel source for moderate-to-high intensity exercise. Scales with training volume.

| Training Level / Goal | Daily Carbs (g/kg body weight) | Source |
|---|---|---|
| Low activity / fat loss | 2–3 g/kg | General nutrition guidelines |
| Moderate training (3–4x/week) | 3–5 g/kg | ISSN; ACSM |
| High volume training (5–6x/week) | 5–7 g/kg | ISSN Nutrient Timing Position Stand |
| Endurance athlete (high volume) | 6–10 g/kg | ISSN; ACSM |
| Glycogen maximization (load) | 8–12 g/kg | ISSN Nutrient Timing Position Stand |

> "Endogenous glycogen stores are maximized by following a high-carbohydrate diet (8–12 g/kg/day); these stores are depleted most by high volume exercise." — ISSN Nutrient Timing Position Stand (2017)

**Carb quality:** Prioritize complex carbohydrates (oats, rice, sweet potato, whole grains) for sustained energy. Reserve simple carbs (fruit, sports drinks) for peri-workout windows.

---

### 2C. Fats

Essential for hormones, joint health, fat-soluble vitamins. Not to be excessively restricted.

| Population | Daily Fat Target | Notes |
|---|---|---|
| General adult | 20–35% of total calories | HHS Dietary Guidelines |
| Athlete (performance focus) | 20–30% of total calories | ISSN |
| Minimum fat intake | ≥ 0.5 g/kg body weight | Below this impairs hormone function |

**Fat types:**
- **Prioritize:** Monounsaturated (olive oil, avocado, nuts) + Polyunsaturated omega-3 (fatty fish, flaxseed)
- **Limit:** Saturated fats < 10% of total calories
- **Avoid:** Trans fats entirely

> Source: HHS Dietary Guidelines for Americans (2020–2025); ISSN

---

### 2D. Macro Split Templates by Goal

Use as starting points; adjust based on 2–4 week body weight trend.

| Goal | Protein | Carbs | Fat |
|---|---|---|---|
| Fat Loss | 35–40% | 30–35% | 25–30% |
| Maintenance / Recomp | 25–30% | 40–45% | 25–30% |
| Muscle Growth (Bulk) | 25–30% | 45–50% | 20–25% |
| Endurance / Cardio Focus | 20–25% | 50–60% | 20–25% |
| Strength Focus | 30–35% | 40–45% | 20–25% |

**Macro calculation from TDEE:**
```
Protein calories  = weight_kg × protein_g × 4 kcal/g
Fat calories      = TDEE × fat_%
Carb calories     = Remaining calories (TDEE − protein kcal − fat kcal)
Carbs in grams    = carb_calories / 4

Example: 75kg male, TDEE 2700, muscle growth goal
  Protein: 75 × 2.0g = 150g → 150 × 4 = 600 kcal
  Fat: 2700 × 0.25 = 675 kcal → 675 / 9 = 75g fat
  Carbs: 2700 − 600 − 675 = 1425 kcal → 1425 / 4 = 356g carbs
```

---

## PART 3 — NUTRIENT TIMING

### 3A. Pre-Workout Nutrition

| Timing | Recommendation | Goal |
|---|---|---|
| 2–4 hours before | Full mixed meal (carbs + protein + fat) | Optimal fuel and digestion |
| 1–2 hours before | Smaller meal (carbs + protein, low fat/fibre) | Common timing for most people |
| < 60 min before | Light snack: 30–50g carbs + ~20g protein | If no earlier meal possible |
| Early morning (fasted) | 300–400 kcal snack with carbs | Prevents performance drop |

**Pre-workout meal composition:**
- Carbohydrates: Primary content — refuels muscle glycogen
- Moderate protein: Starts amino acid availability for post-workout
- Low fat + low fibre: Speeds gastric emptying; avoids GI discomfort during exercise

> Source: ISSN Nutrient Timing Position Stand (2017); NASM; ACSM

---

### 3B. Intra-Workout Nutrition

| Session Type | Intra-Workout Carbs | Notes |
|---|---|---|
| < 60 min strength | None needed | Pre-workout meal sufficient |
| > 60 min moderate/high intensity | 30–60 g carbs/hour | Sports drink, banana, gels |
| > 90 min endurance | 60–90 g carbs/hour | May combine glucose + fructose |
| Multi-session same day | Carbs + protein between sessions | Accelerates glycogen resynthesis |

> Source: ACSM Guidelines; ISSN Nutrient Timing Position Stand (2017)

---

### 3C. Post-Workout Nutrition

**The "anabolic window" is real but wider than once believed — up to 24 hours post-exercise.**
However, consuming protein + carbs within 0–2 hours post-workout is optimal practice.

| Component | Recommendation | Timing |
|---|---|---|
| Protein | 20–40 g high-quality protein (0.25 g/kg) | Within 0–2 hours post-exercise |
| Carbohydrates | 0.5–1.0 g/kg body weight | Within 30–60 min (glycogen replenishment) |
| Combined | Carb + protein co-ingestion enhances both MPS and glycogen synthesis | ISSN recommends combined intake |
| Fluid | 450–675 ml per 0.5 kg body weight lost during session | Rehydration priority |

> "Post-exercise ingestion (immediately to 2-h post) of high-quality protein sources stimulates robust increases in muscle protein synthesis." — ISSN Nutrient Timing Position Stand (2017)

**Post-workout meal ideas:**
- Chicken + rice + vegetables
- Greek yoghurt + fruit + granola
- Protein shake + banana
- Eggs + toast + orange juice

---

### 3D. Daily Meal Frequency and Distribution

| Strategy | Recommendation | Source |
|---|---|---|
| Meals per day | 3–6 meals | ISSN; practical evidence |
| Protein distribution | Every 3–4 hours | ISSN (maximizes MPS throughout day) |
| Pre-sleep protein | 30–40 g casein protein ~30 min before bed | ISSN; supports overnight MPS |
| Skipping meals | Avoid > 5–6 hour gaps without protein during active periods | ISSN |

> "Meeting total daily protein intake, preferably with evenly spaced protein feedings (approximately every 3 hours), should be viewed as a primary area of emphasis for exercising individuals." — ISSN Nutrient Timing Position Stand (2017)

---

## PART 4 — BODY COMPOSITION STRATEGIES

### 4A. Fat Loss (Cutting)

| Variable | Guideline |
|---|---|
| Calorie deficit | 300–500 kcal/day below TDEE (moderate) |
| Rate of loss | 0.5–0.75% of body weight per week (optimal to preserve muscle) |
| Protein | 2.2–3.1 g/kg (higher end preserves lean mass in deficit) |
| Training | Maintain intensity; reduce volume slightly if needed |
| Minimum cut duration | 6–8 weeks |
| Maximum cut duration | 16–24 weeks (incorporate diet breaks every 4–8 weeks) |
| Diet breaks | 1–2 weeks at maintenance every 4–8 weeks during long cuts |

> Source: Gravitus Cutting Guide; ISSN; NSCA

**Warning signs of too-aggressive cut:**
- Losing > 1% body weight/week
- Significant strength loss (> 10% on major lifts)
- Persistent fatigue, poor recovery, mood decline

---

### 4B. Muscle Growth (Bulking / Lean Bulk)

| Variable | Guideline |
|---|---|
| Calorie surplus | +200–300 kcal/day (lean bulk) |
| Rate of gain | 0.25–0.5% of body weight per week |
| Protein | 1.6–2.2 g/kg |
| Carbs | High (5–7+ g/kg) to fuel training and glycogen |
| Bulk duration | 3–6 months typical |
| Stop bulking when | Body fat reaches ~15–20% (men) / ~25–30% (women) |

**Beginner exception:** New lifters can gain muscle and lose fat simultaneously ("newbie gains") — a caloric surplus is not always required in the first 6–12 months.

> Source: Gravitus Bulking Guide; Built With Science; ISSN

---

### 4C. Body Recomposition (Simultaneous Fat Loss + Muscle Gain)

Possible for: beginners, detrained individuals, those returning after a break, those with higher body fat.
Difficult for: intermediate/advanced lifters with low body fat.

| Variable | Guideline |
|---|---|
| Calories | At or slightly below maintenance (−0 to −200 kcal) |
| Protein | 2.0–2.4 g/kg (higher end) |
| Training | Progressive resistance training 3–5x/week required |
| Expectations | Slow — weight may stay similar; body composition changes |
| Timeline | 3–6+ months to see measurable changes |

---

### 4D. Maintenance

| Variable | Guideline |
|---|---|
| Calories | = TDEE |
| Protein | 1.6–2.0 g/kg (maintain muscle) |
| Carbs / Fat | Flexible — adjust to preference within total calorie target |
| Recalculate | Every 8–12 weeks or with activity level changes |

---

## PART 5 — PERSONALIZED CALORIE & MACRO CALCULATOR

### Step-by-Step for App

```
INPUT:  age, sex, weight_kg, height_cm, activity_level, goal

STEP 1: Calculate BMR
  Men:   BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5
  Women: BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161

STEP 2: Calculate TDEE
  TDEE = BMR × activity_multiplier (see Part 1B)

STEP 3: Apply goal adjustment
  Fat loss:    Target = TDEE − 400 (moderate deficit default)
  Maintenance: Target = TDEE
  Lean bulk:   Target = TDEE + 250

STEP 4: Calculate macros
  Protein (g) = weight_kg × protein_target (see Part 2A by goal)
  Protein kcal = protein_g × 4
  Fat (g)     = (Target_kcal × 0.25) / 9
  Carb kcal   = Target_kcal − protein_kcal − fat_kcal
  Carbs (g)   = carb_kcal / 4

OUTPUT: daily kcal target, protein g, carbs g, fat g, per-meal protein dose
```

### Quick Reference Output Table (75 kg male, moderately active)

| Goal | Calories | Protein | Carbs | Fat |
|---|---|---|---|---|
| Fat Loss | 2272 kcal | 165g | 245g | 63g |
| Maintenance | 2672 kcal | 150g | 320g | 74g |
| Lean Bulk | 2922 kcal | 165g | 371g | 73g |

---

## PART 6 — RED FLAGS FOR NUTRITION REVIEW

Flag these patterns in user logs:

| Issue | Trigger | Feedback |
|---|---|---|
| Too low calories | Logged intake < safety floor (1200/1500 kcal) | Warn about muscle loss, metabolic adaptation, health risk |
| Too low protein | < 1.2 g/kg for active user | Flag; explain muscle preservation risk |
| No post-workout food logged | Session logged, no meal within 2 hours | Suggest post-workout protein + carbs |
| Very long fast | > 6 hours gap during active day | Suggest protein feeding to protect MPS |
| Excessive deficit | > 750 kcal/day below TDEE | Flag aggressive cut; suggest slowing pace |
| Excessive surplus | > 500 kcal above TDEE | Flag fat gain risk; suggest lean bulk approach |

---

*Sources: ISSN Nutrient Timing Position Stand (2017); ISSN Protein & Exercise Position Stand (2017); ACSM GETP 11th Ed. (2021); HHS Dietary Guidelines for Americans (2020–2025); Mifflin-St Jeor equation; Built With Science; Gravitus.*
