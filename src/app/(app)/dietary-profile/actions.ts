"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/currentUser";

export type DietaryInput = {
  healthConditions: string[];
  dietaryPreferences: string[];
  cravings: string[];
};

export async function saveDietaryProfile(input: DietaryInput) {
  const user = await getCurrentUser();
  await db
    .update(users)
    .set({
      healthConditions: input.healthConditions,
      dietaryPreferences: input.dietaryPreferences,
      cravings: input.cravings,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
