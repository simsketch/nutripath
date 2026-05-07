import { redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { GroceryListView } from "@/components/grocery/GroceryListView";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { db } from "@/lib/db/client";
import { mealPlans } from "@/lib/db/schema";

export default async function GroceryListPage({
  searchParams,
}: {
  searchParams: Promise<{ planId?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;

  let planId = params.planId;

  // If no planId given, fall back to the user's most recent plan.
  if (!planId) {
    const [latest] = await db
      .select({ id: mealPlans.id })
      .from(mealPlans)
      .where(eq(mealPlans.userId, user.id))
      .orderBy(desc(mealPlans.createdAt))
      .limit(1);
    if (!latest) {
      redirect("/dashboard");
    }
    planId = latest.id;
  } else {
    // Ensure the plan belongs to this user.
    const [plan] = await db
      .select({ id: mealPlans.id })
      .from(mealPlans)
      .where(and(eq(mealPlans.id, planId), eq(mealPlans.userId, user.id)))
      .limit(1);
    if (!plan) redirect("/dashboard");
  }

  return (
    <div className="min-h-dvh">
      <AppHeader user={user} />
      <GroceryListView planId={planId} />
    </div>
  );
}
