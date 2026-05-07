import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { mealPlans } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { generateGroceryList } from "@/lib/ai/groceryList";

export const runtime = "nodejs";
export const maxDuration = 60;

const BodySchema = z.object({
  planId: z.string().uuid(),
  regenerate: z.boolean().optional().default(false),
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

  const { planId, regenerate } = parsed.data;

  const [plan] = await db
    .select()
    .from(mealPlans)
    .where(and(eq(mealPlans.id, planId), eq(mealPlans.userId, user.id)))
    .limit(1);

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  if (plan.groceryList && !regenerate) {
    return NextResponse.json({ groceryList: plan.groceryList, cached: true });
  }

  const list = await generateGroceryList(plan.days);

  await db
    .update(mealPlans)
    .set({ groceryList: list })
    .where(eq(mealPlans.id, planId));

  return NextResponse.json({ groceryList: list, cached: false });
}
