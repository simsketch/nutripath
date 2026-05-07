import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { mealPlans } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/currentUser";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user.goal) {
    return NextResponse.json({ error: "Profile incomplete" }, { status: 400 });
  }

  const url = new URL(req.url);
  const year = Number(url.searchParams.get("year"));
  const weekNumber = Number(url.searchParams.get("weekNumber"));
  if (!Number.isInteger(year) || !Number.isInteger(weekNumber)) {
    return NextResponse.json({ error: "Invalid year/weekNumber" }, { status: 400 });
  }

  const [plan] = await db
    .select()
    .from(mealPlans)
    .where(
      and(
        eq(mealPlans.userId, user.id),
        eq(mealPlans.year, year),
        eq(mealPlans.weekNumber, weekNumber),
        eq(mealPlans.goal, user.goal),
      ),
    )
    .limit(1);

  if (!plan) {
    return NextResponse.json({ plan: null }, { status: 404 });
  }

  return NextResponse.json({ plan });
}
