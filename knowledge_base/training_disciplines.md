# Training Disciplines Reference

This file defines all available training disciplines users can select in Rawi Fit. Each discipline has specific characteristics, feedback priorities, and training approaches.

---

## Powerlifting

**Description:** Competitive strength sport focused on three lifts: squat, bench press, deadlift.

**Training characteristics:**
- Very heavy loads (1-6 rep range)
- Long rest periods (3-5 minutes between sets)
- Compound lift emphasis
- Low volume, high intensity
- Meet cycles and periodisation
- CNS recovery critical (48-72h between heavy sessions)

**Feedback priorities:**
- Strength progression on main lifts
- Technical form on compound movements
- Recovery adequacy between sessions
- Accessory lift balance (push:pull ratio)
- Peak performance timing

**Weekly structure:** 3-4 sessions, heavy singles/doubles/triples, accessory work

---

## Weightlifting (Olympic)

**Description:** Competitive Olympic lifting: snatch and clean & jerk.

**Training characteristics:**
- Explosive power and speed
- Technical precision critical
- Moderate to heavy loads (70-90% 1RM)
- 1-3 rep range for main lifts
- High mobility and coordination demands
- Regular mobility sessions essential

**Feedback priorities:**
- Technical execution on Olympic lifts
- Explosive power development
- Mobility and flexibility maintenance
- Movement consistency and stability
- Accessory lift relevance to Olympic lifts

**Weekly structure:** 4-5 sessions, technique focus + power work, accessory pulls/legs

---

## Bodybuilding

**Description:** Focus on aesthetic muscle development through hypertrophy and symmetry.

**Training characteristics:**
- Moderate to heavy loads (70-85% 1RM)
- Higher rep ranges (8-15 reps)
- Higher volume (15-25 sets per muscle/week)
- Time-under-tension emphasis (3-4s eccentric)
- Exercise variety and isolation work
- Mind-muscle connection priority
- Frequent training (5-6 days/week)

**Feedback priorities:**
- Volume targets by muscle group
- Exercise variety and rotation
- Rep range consistency (8-15)
- Isolation vs compound balance
- Time-under-tension on isolation work
- Recovery and frequency adequacy

**Weekly structure:** 5-6 sessions, body-part split or PPL, heavy compound + isolation accessories

---

## Strength Training

**Description:** General strength development with emphasis on progressive overload.

**Training characteristics:**
- Heavy loads (80-90% 1RM)
- Low to moderate reps (3-8)
- Compound lift focus
- Moderate volume (8-12 sets per session)
- Rest days for recovery
- Periodisation common (blocks, waves, linear)

**Feedback priorities:**
- Strength progression week-to-week
- Compound lift mastery (squat, bench, deadlift, OHP)
- Recovery between sessions
- Accessory relevance to main lifts
- Plateau breaking strategies

**Weekly structure:** 3-4 sessions, main lifts + accessory work, progressive overload focus

---

## Calisthenics

**Description:** Bodyweight and gymnastic movements focusing on skill mastery and progressions.

**Training characteristics:**
- Bodyweight primary
- Skill progressions (handstand, L-sit, muscle-up, front lever)
- Low rep ranges for skill work (3-8 reps)
- Higher rep ranges for strength endurance (8-20 reps)
- Negatives and holds common
- Mobility critical for advanced movements
- 3-5 sessions per week

**Feedback priorities:**
- Skill progression (moving to harder variations)
- Movement quality and control
- Negative rep practice
- Hold time improvements
- Strength endurance balance
- Recovery between skill sessions

**Weekly structure:** 3-5 sessions, skill work + strength work + conditioning

---

## Running

**Description:** Endurance sports focused on continuous aerobic movement.

**Training characteristics:**
- Aerobic base building (Zone 1-2, 80% of volume)
- Threshold work (Zone 3-4, 1-2x per week)
- VO2 max intervals (Zone 5, 1x per week max)
- Weekly mileage accumulation
- Easy recovery runs essential
- Long run once per week
- Cross-training common (cycling, swimming)

**Feedback priorities:**
- Weekly mileage and 10% rule adherence
- Zone distribution (80% easy, 20% hard)
- Recovery run adequacy
- Long run progression
- VO2 max workout frequency (max 1-2x/week)
- Cross-training for injury prevention
- Resting heart rate trends

**Weekly structure:** 4-5 runs, 1-2 easy runs + 1 threshold/long run + 1 VO2 max session + recovery days

---

## Swimming

**Description:** Endurance water-based training with technique focus.

**Training characteristics:**
- Aerobic conditioning (Zone 1-2)
- Technique sessions with drills
- Recovery swims essential
- Total distance accumulation
- Low impact
- Cross-training with running/cycling common
- 4-6 sessions per week

**Feedback priorities:**
- Technique consistency and efficiency
- Total weekly volume/distance
- Recovery swim balance
- Cross-training adequacy
- Stroke progression
- Intensity distribution

**Weekly structure:** 4-6 swims, 2-3 easy recovery + 1-2 moderate intensity + 1 hard session

---

## Cycling

**Description:** Endurance sport with power development and aerobic capacity focus.

**Training characteristics:**
- Aerobic base (Zone 1-2, 80% volume)
- Threshold work (Zone 3-4)
- VO2 max intervals (Zone 5, high intensity)
- Power development (sprints, anaerobic)
- Long rides for aerobic capacity
- Weekly mileage accumulation
- 3-5 sessions per week

**Feedback priorities:**
- Weekly volume and TSS (Training Stress Score)
- Zone distribution and intensity
- Endurance ride progression
- Interval session frequency (max 1-2x/week)
- Power development work
- Recovery ride adequacy
- Cross-training for balance

**Weekly structure:** 3-5 rides, easy + 1-2 moderate intensity + 1 hard interval session + 1 long ride

---

## CrossFit

**Description:** Functional fitness combining weightlifting, gymnastics, and metabolic conditioning.

**Training characteristics:**
- Mixed modalities (lifting, gymnastics, cardio)
- High intensity and intensity variation
- Functional movement patterns
- Moderate to high volume
- Community-based training
- Varied workout structures (AMRAP, EMOM, For Time)
- 3-5 sessions per week + mobility

**Feedback priorities:**
- Movement quality across modalities
- Intensity and effort consistency
- Recovery adequacy for mixed training
- Gymnastics skill progression
- Strength maintenance
- Metabolic conditioning balance
- Injury prevention (joint health)

**Weekly structure:** 3-5 classes, varied WODs, skill + strength + conditioning mix

---

## General Fitness

**Description:** Balanced approach across all fitness dimensions without specialization.

**Training characteristics:**
- Strength, endurance, and flexibility blend
- WHO guidelines (150 min moderate cardio + 2 resistance sessions/week)
- Moderate intensity overall
- Balanced across all movement patterns
- Sustainable long-term approach
- 3-4 sessions per week
- Emphasis on consistency and adherence

**Feedback priorities:**
- WHO compliance (cardio + strength minimum)
- Push:pull balance
- Consistency and frequency
- All movement patterns represented
- Recovery adequacy
- Long-term sustainability
- Holistic health metrics

**Weekly structure:** 2-3 resistance + 2-3 cardio, balanced approach

---

## Feedback Integration Rules

When generating reviews, the app should:

1. **Single discipline:** Use discipline-specific feedback logic
2. **Multiple disciplines (hybrid):** Combine feedback, prioritize by frequency
   - Example: Powerlifting + Running = focus on strength recovery + cardio conditioning balance
3. **Always combine with:** Goal-based feedback, push:pull balance, overtraining detection, consistency metrics
4. **Volume targets vary by discipline:**
   - Powerlifting: 8-12 sets/week per lift
   - Bodybuilding: 15-25 sets/muscle/week
   - Calisthenics: 3-5 skill sessions + strength work
   - Running: weekly mileage progression
   - General: WHO minimums

---

## Migration Notes

- Old profiles with `training_method = "volume"` → map to "bodybuilding"
- Old profiles with `training_method = "strength"` → map to "strength training"
- Old profiles with `training_method = "failure"` → map to "bodybuilding"
- Old profiles with `training_method = "endurance"` → map to "running" or "general"
- New users can multi-select, default to "general fitness" if none selected
