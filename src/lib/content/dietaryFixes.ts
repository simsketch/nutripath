export type Slug = string;

export type Option<T extends Slug = Slug> = {
  slug: T;
  label: string;
  emoji: string;
  hint?: string;
  tip?: string;
};

export const HEALTH_CONDITIONS: Option[] = [
  {
    slug: "diabetes",
    label: "Diabetes",
    emoji: "🩸",
    hint: "Blood sugar management is key",
    tip: "Prioritise low-glycaemic carbs (oats, lentils, quinoa) and pair carbs with protein and fibre to flatten glucose spikes.",
  },
  {
    slug: "hypertension",
    label: "High Blood Pressure",
    emoji: "💓",
    hint: "Watch your sodium intake",
    tip: "Aim for under 1,500mg of sodium per day. Lean on potassium-rich foods (banana, sweet potato, spinach) and skip the salt shaker at the table.",
  },
  {
    slug: "ibs",
    label: "IBS / Gut Issues",
    emoji: "🧸",
    hint: "Digestive sensitivity",
    tip: "A low-FODMAP approach helps most people: limit onion, garlic, beans, apples and dairy in flares; lean on rice, oats, carrots and zucchini.",
  },
  {
    slug: "cholesterol",
    label: "High Cholesterol",
    emoji: "🫀",
    hint: "Heart health focus",
    tip: "Soluble fibre (oats, beans, psyllium) and unsaturated fats (olive oil, nuts, salmon) lower LDL. Trim saturated fat from butter and red meat.",
  },
  {
    slug: "thyroid",
    label: "Thyroid Issues",
    emoji: "🧠",
    hint: "Metabolism can be affected",
    tip: "Selenium (Brazil nuts), zinc (pumpkin seeds), and iodine (seaweed, eggs) support thyroid function. Be careful with raw cruciferous veg in large amounts.",
  },
  {
    slug: "pcos",
    label: "PCOS",
    emoji: "🌸",
    hint: "Hormonal & insulin balance",
    tip: "Build plates around protein + fibre + healthy fats to stabilise insulin. Inositol-rich foods (citrus, beans) and magnesium can help too.",
  },
];

export const DIETARY_PREFERENCES: Option[] = [
  { slug: "vegetarian", label: "Vegetarian", emoji: "🥬" },
  { slug: "vegan", label: "Vegan", emoji: "🌱" },
  { slug: "gluten-free", label: "Gluten-Free", emoji: "🌾" },
  { slug: "dairy-free", label: "Dairy-Free", emoji: "🥛" },
  { slug: "pescatarian", label: "Pescatarian", emoji: "🐟" },
  { slug: "nut-free", label: "Nut-Free", emoji: "🚫" },
  { slug: "halal", label: "Halal", emoji: "🤲" },
  { slug: "keto", label: "Keto / Low Carb", emoji: "🥑" },
];

export const CRAVINGS: Option[] = [
  {
    slug: "sweet-tooth",
    label: "Sweet Tooth 🍬",
    emoji: "🍬",
    tip: "Try fruit + Greek yoghurt or 85% dark chocolate. A small planned dessert beats unplanned binges.",
  },
  {
    slug: "salty-snacks",
    label: "Salty Snacks 🧂",
    emoji: "🧂",
    tip: "Reach for roasted chickpeas, edamame with sea salt, or salted popcorn (low-cal, high volume).",
  },
  {
    slug: "emotional-eating",
    label: "Emotional Eating 😔",
    emoji: "😔",
    tip: "Pause + name the feeling before eating. A 5-minute walk or glass of water often resets the urge.",
  },
  {
    slug: "late-night-snacking",
    label: "Late Night Snacking 🌙",
    emoji: "🌙",
    tip: "Front-load protein at dinner and keep low-cal snacks (cottage cheese, berries) ready so a craving doesn't derail the week.",
  },
  {
    slug: "caffeine",
    label: "Caffeine Dependent ☕",
    emoji: "☕",
    tip: "Cap caffeine before 2pm and pair coffee with a protein snack to avoid afternoon crashes.",
  },
  {
    slug: "alcohol",
    label: "Regular Alcohol 🍷",
    emoji: "🍷",
    tip: "Treat alcohol calories like dessert: budget for them on planned days and alternate each drink with water.",
  },
];

export function findOption(list: Option[], slug: string): Option | undefined {
  return list.find((o) => o.slug === slug);
}
