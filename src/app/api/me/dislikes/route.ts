import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/currentUser";

export const runtime = "nodejs";

const MAX_DISLIKES = 100; // keep prompt size bounded

const BodySchema = z.object({
  mealName: z.string().min(1).max(120),
  action: z.enum(["add", "remove"]).default("add"),
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

  const { mealName, action } = parsed.data;
  const current = user.dislikedMeals ?? [];
  let next: string[];
  if (action === "add") {
    if (current.includes(mealName)) {
      next = current;
    } else {
      next = [mealName, ...current].slice(0, MAX_DISLIKES);
    }
  } else {
    next = current.filter((m) => m !== mealName);
  }

  await db
    .update(users)
    .set({ dislikedMeals: next, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  return NextResponse.json({ dislikedMeals: next });
}
