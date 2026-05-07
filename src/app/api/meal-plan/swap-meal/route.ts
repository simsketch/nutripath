import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import {
  dayOfWeekEnum,
  mealPlans,
  mealTypeEnum,
  users,
  type DayPlan,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { swapMeal } from "@/lib/ai/swapMeal";

export const runtime = "nodejs";
export const maxDuration = 60;

const BodySchema = z.object({
  planId: z.string().uuid(),
  day: z.enum(dayOfWeekEnum),
  mealType: z.enum(mealTypeEnum),
  /** When true, also persist the disliked meal name onto user.dislikedMeals. */
  dislike: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { planId, day, mealType, dislike } = parsed.data;

  const [plan] = await db
    .select()
    .from(mealPlans)
    .where(and(eq(mealPlans.id, planId), eq(mealPlans.userId, user.id)))
    .limit(1);
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const days = plan.days;
  const dayPlan = days.find((d) => d.day === day);
  if (!dayPlan) {
    return NextResponse.json({ error: "Day not in plan" }, { status: 400 });
  }
  const slotIndex = dayPlan.meals.findIndex((m) => m.type === mealType);
  if (slotIndex < 0) {
    return NextResponse.json({ error: "Meal type not in day" }, { status: 400 });
  }
  const currentMeal = dayPlan.meals[slotIndex];

  // Optionally persist a dislike for the meal we're replacing.
  let dislikedMeals = user.dislikedMeals ?? [];
  if (dislike && !dislikedMeals.includes(currentMeal.name)) {
    dislikedMeals = [currentMeal.name, ...dislikedMeals].slice(0, 100);
  }

  const otherMealNames = days
    .flatMap((d) => d.meals.map((m) => m.name))
    .filter((n) => n !== currentMeal.name);

  const replacement = await swapMeal({
    goal: plan.goal,
    targetCalories: plan.targetCalories,
    day,
    mealType,
    currentMeal,
    otherMealNamesInWeek: otherMealNames,
    healthConditions: user.healthConditions,
    dietaryPreferences: user.dietaryPreferences,
    cravings: user.cravings,
    dislikedMeals,
  });

  // Splice the new meal into the days array.
  const updatedDays: DayPlan[] = days.map((d) =>
    d.day === day
      ? {
          ...d,
          meals: d.meals.map((m, i) => (i === slotIndex ? replacement : m)),
        }
      : d,
  );

  // Invalidate any cached grocery list — the meal set changed.
  const [updated] = await db
    .update(mealPlans)
    .set({ days: updatedDays, groceryList: null })
    .where(eq(mealPlans.id, planId))
    .returning();

  if (dislike && dislikedMeals !== user.dislikedMeals) {
    await db
      .update(users)
      .set({ dislikedMeals, updatedAt: new Date() })
      .where(eq(users.id, user.id));
  }

  return NextResponse.json({ plan: updated, replaced: { day, mealType } });
}
