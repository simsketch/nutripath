"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users, type Gender, type Goal } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/currentUser";

export type OnboardingInput = {
  gender: Gender;
  weightKg: number;
  heightCm: number;
  goal: Goal;
};

export async function saveOnboarding(input: OnboardingInput) {
  const user = await getCurrentUser();

  if (!Number.isFinite(input.weightKg) || input.weightKg <= 0 || input.weightKg > 500) {
    throw new Error("Weight must be between 0 and 500 kg");
  }
  if (!Number.isFinite(input.heightCm) || input.heightCm <= 0 || input.heightCm > 300) {
    throw new Error("Height must be between 0 and 300 cm");
  }

  await db
    .update(users)
    .set({
      gender: input.gender,
      weightKg: input.weightKg.toString(),
      heightCm: input.heightCm.toString(),
      goal: input.goal,
      onboardedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
