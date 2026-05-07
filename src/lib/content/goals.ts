import { Dumbbell, Leaf, Scissors } from "lucide-react";
import type { Goal } from "@/lib/db/schema";

export type GoalMeta = {
  slug: Goal;
  label: string;
  description: string;
  range: string;
  icon: typeof Dumbbell;
  badgeVariant: "bulking" | "cutting" | "healthy";
};

export const GOALS: GoalMeta[] = [
  {
    slug: "bulking",
    label: "Bulking",
    description: "High-calorie meals to build muscle mass",
    range: "~3,000–3,500 cal/day",
    icon: Dumbbell,
    badgeVariant: "bulking",
  },
  {
    slug: "cutting",
    label: "Cutting",
    description: "Lean meals to shred fat while keeping muscle",
    range: "~1,800–2,200 cal/day",
    icon: Scissors,
    badgeVariant: "cutting",
  },
  {
    slug: "healthy",
    label: "Healthy Eating",
    description: "Balanced nutrition for overall wellness",
    range: "~2,200–2,600 cal/day",
    icon: Leaf,
    badgeVariant: "healthy",
  },
];

export function goalMeta(slug: Goal): GoalMeta {
  const m = GOALS.find((g) => g.slug === slug);
  if (!m) throw new Error(`Unknown goal: ${slug}`);
  return m;
}
