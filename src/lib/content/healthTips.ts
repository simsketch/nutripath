export type TipCategory = "nutrition" | "movement" | "sleep" | "mindset";

export type Tip = {
  id: string;
  title: string;
  description: string;
  category: TipCategory;
  tag: string;
  links: { label: string; url: string }[];
};

export const TIP_CATEGORIES: { slug: TipCategory; label: string; emoji: string }[] = [
  { slug: "nutrition", label: "Nutrition", emoji: "🥗" },
  { slug: "movement", label: "Movement", emoji: "🏃" },
  { slug: "sleep", label: "Sleep", emoji: "😴" },
  { slug: "mindset", label: "Mindset", emoji: "🧠" },
];

export const TIPS: Tip[] = [
  // Nutrition
  {
    id: "fiber-30",
    title: "Aim for 30g of fibre a day",
    description:
      "Fibre supports gut health, keeps you full, and lowers cholesterol. Most adults eat half what's recommended.",
    category: "nutrition",
    tag: "Gut health",
    links: [
      { label: "NHS — Fibre", url: "https://www.nhs.uk/live-well/eat-well/digestive-health/how-to-get-more-fibre-in-your-diet/" },
      { label: "Healthline — 22 high-fibre foods", url: "https://www.healthline.com/nutrition/22-high-fiber-foods" },
    ],
  },
  {
    id: "protein-per-meal",
    title: "Spread protein across the day",
    description:
      "30g of protein per meal beats one big serving. Muscle protein synthesis maxes out per meal — distribute it.",
    category: "nutrition",
    tag: "Protein",
    links: [
      { label: "Healthline — Protein per meal", url: "https://www.healthline.com/nutrition/how-much-protein-per-day" },
      { label: "Mayo Clinic — Protein", url: "https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/healthy-diet/art-20043411" },
    ],
  },
  {
    id: "hydration",
    title: "Hydrate before you eat",
    description:
      "A glass of water before meals supports digestion and reduces unnecessary snacking from confused thirst cues.",
    category: "nutrition",
    tag: "Hydration",
    links: [
      { label: "Mayo Clinic — Water", url: "https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256" },
      { label: "NHS — Drink well", url: "https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/water-drinks-nutrition/" },
    ],
  },
  // Movement
  {
    id: "10k-steps",
    title: "Walk 7–10k steps daily",
    description:
      "Daily walking is a near-magic intervention: it improves mood, sleep, glucose control, and longevity.",
    category: "movement",
    tag: "Cardio",
    links: [
      { label: "Healthline — Walking benefits", url: "https://www.healthline.com/health/exercise-fitness/benefits-of-walking" },
      { label: "Mayo Clinic — Walking guide", url: "https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/walking/art-20046261" },
    ],
  },
  {
    id: "lift-2x",
    title: "Lift weights twice a week",
    description:
      "Resistance training preserves muscle, bone density, and metabolic health. Two 30-minute sessions go a long way.",
    category: "movement",
    tag: "Strength",
    links: [
      { label: "NHS — Strength activities", url: "https://www.nhs.uk/live-well/exercise/strength-and-flex-exercise-plan/" },
      { label: "Mayo Clinic — Strength training", url: "https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/strength-training/art-20046670" },
    ],
  },
  {
    id: "stand-often",
    title: "Break up long sitting bouts",
    description:
      "Stand or walk for two minutes every 30 minutes. Frequent micro-breaks soften the metabolic cost of desk work.",
    category: "movement",
    tag: "Posture",
    links: [
      { label: "Mayo Clinic — Sitting risks", url: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/expert-answers/sitting/faq-20058005" },
      { label: "Healthline — Sitting hazards", url: "https://www.healthline.com/health/sitting-and-your-health" },
    ],
  },
  // Sleep
  {
    id: "sleep-7-9",
    title: "Sleep 7–9 hours, consistently",
    description:
      "Consistency beats catch-up. Same wake time every day anchors your circadian rhythm more than total hours.",
    category: "sleep",
    tag: "Recovery",
    links: [
      { label: "NHS — How to sleep better", url: "https://www.nhs.uk/live-well/sleep-and-tiredness/how-to-get-to-sleep/" },
      { label: "Healthline — Sleep tips", url: "https://www.healthline.com/nutrition/17-tips-to-sleep-better" },
    ],
  },
  {
    id: "no-caffeine-pm",
    title: "Cap caffeine 8 hours before bed",
    description:
      "Caffeine has a six-hour half-life. A 2pm coffee still has a quarter circulating at 10pm.",
    category: "sleep",
    tag: "Caffeine",
    links: [
      { label: "Healthline — Caffeine & sleep", url: "https://www.healthline.com/nutrition/caffeine-and-sleep" },
      { label: "Mayo Clinic — Caffeine", url: "https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/caffeine/art-20045678" },
    ],
  },
  {
    id: "wind-down",
    title: "Build a 30-minute wind-down",
    description:
      "Dim lights, no screens, light reading. Your brain needs a runway to descend into sleep.",
    category: "sleep",
    tag: "Routine",
    links: [
      { label: "NHS — Bedtime routine", url: "https://www.nhs.uk/live-well/sleep-and-tiredness/" },
      { label: "Healthline — Wind-down", url: "https://www.healthline.com/health/healthy-sleep/sleep-routine" },
    ],
  },
  // Mindset
  {
    id: "no-all-or-nothing",
    title: "Drop all-or-nothing thinking",
    description:
      "One off-plan meal isn't a failure. Consistency over weeks beats perfection over days.",
    category: "mindset",
    tag: "Habits",
    links: [
      { label: "Healthline — Black & white thinking", url: "https://www.healthline.com/health/mental-health/black-and-white-thinking" },
      { label: "Mayo Clinic — Resilience", url: "https://www.mayoclinic.org/tests-procedures/resilience-training/in-depth/resilience/art-20046311" },
    ],
  },
  {
    id: "track-don't-judge",
    title: "Track without judgement",
    description:
      "Logging is information, not a moral grade. The goal is awareness — patterns, not punishment.",
    category: "mindset",
    tag: "Awareness",
    links: [
      { label: "Healthline — Mindful eating", url: "https://www.healthline.com/nutrition/mindful-eating-guide" },
      { label: "Harvard — Mindful eating", url: "https://www.health.harvard.edu/blog/distracted-eating-may-add-to-weight-gain-201303296037" },
    ],
  },
  {
    id: "stress-meals",
    title: "Identify your trigger meals",
    description:
      "Stress, boredom, and low blood sugar all look the same in the moment. Naming the trigger weakens its grip.",
    category: "mindset",
    tag: "Emotional eating",
    links: [
      { label: "Mayo Clinic — Stress eating", url: "https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/weight-loss/art-20047342" },
      { label: "Healthline — Emotional eating", url: "https://www.healthline.com/nutrition/emotional-eating" },
    ],
  },
];

export const FURTHER_READING: { label: string; url: string; source: string }[] = [
  { label: "NHS Eatwell Guide", url: "https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/", source: "NHS" },
  { label: "Mayo Clinic — Healthy Lifestyle", url: "https://www.mayoclinic.org/healthy-lifestyle", source: "Mayo Clinic" },
  { label: "Healthline — Nutrition", url: "https://www.healthline.com/nutrition", source: "Healthline" },
  { label: "British Nutrition Foundation", url: "https://www.nutrition.org.uk/", source: "BNF" },
  { label: "USDA MyPlate", url: "https://www.myplate.gov/", source: "USDA" },
  { label: "Harvard Healthy Eating Plate", url: "https://www.hsph.harvard.edu/nutritionsource/healthy-eating-plate/", source: "Harvard" },
];
