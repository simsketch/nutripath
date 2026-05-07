import type { Gender, Goal } from "@/lib/db/schema";

const ACTIVITY_MULTIPLIER = 1.55; // moderate activity
const ASSUMED_AGE = 30;
const BULKING_DELTA = 400;
const CUTTING_DELTA = -400;

export type Stats = {
  gender: Gender;
  weightKg: number;
  heightCm: number;
};

export function bmr({ gender, weightKg, heightCm }: Stats): number {
  // Mifflin-St Jeor with assumed age = 30
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ASSUMED_AGE;
  return gender === "male" ? base + 5 : base - 161;
}

export function tdee(stats: Stats): number {
  return bmr(stats) * ACTIVITY_MULTIPLIER;
}

export function targetCalories(stats: Stats, goal: Goal): number {
  const t = tdee(stats);
  const adjusted =
    goal === "bulking" ? t + BULKING_DELTA : goal === "cutting" ? t + CUTTING_DELTA : t;
  return Math.round(adjusted);
}
