import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { mealPlans } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { generateMealPlan } from "@/lib/ai/mealPlan";
import { targetCalories } from "@/lib/nutrition/calorie";

export const runtime = "nodejs";
export const maxDuration = 60;

const BodySchema = z.object({
  year: z.number().int().min(2024).max(2100),
  weekNumber: z.number().int().min(1).max(53),
  regenerate: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user.gender || !user.weightKg || !user.heightCm || !user.goal) {
    return NextResponse.json(
      { error: "Profile incomplete — finish onboarding first." },
      { status: 400 },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { year, weekNumber, regenerate } = parsed.data;
  const goal = user.goal;

  const existing = await db
    .select()
    .from(mealPlans)
    .where(
      and(
        eq(mealPlans.userId, user.id),
        eq(mealPlans.year, year),
        eq(mealPlans.weekNumber, weekNumber),
        eq(mealPlans.goal, goal),
      ),
    )
    .limit(1);

  if (existing[0] && !regenerate) {
    return NextResponse.json({ plan: existing[0], cached: true });
  }

  const stats = {
    gender: user.gender,
    weightKg: Number(user.weightKg),
    heightCm: Number(user.heightCm),
  };
  const target = targetCalories(stats, goal);

  const days = await generateMealPlan({
    gender: stats.gender,
    weightKg: stats.weightKg,
    heightCm: stats.heightCm,
    goal,
    targetCalories: target,
    healthConditions: user.healthConditions,
    dietaryPreferences: user.dietaryPreferences,
    cravings: user.cravings,
  });

  if (existing[0]) {
    await db
      .delete(mealPlans)
      .where(eq(mealPlans.id, existing[0].id));
  }

  const [created] = await db
    .insert(mealPlans)
    .values({
      userId: user.id,
      year,
      weekNumber,
      goal,
      targetCalories: target,
      days,
    })
    .returning();

  return NextResponse.json({ plan: created, cached: false });
}
