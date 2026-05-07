import { redirect } from "next/navigation";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { currentWeek } from "@/lib/nutrition/week";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user.onboardedAt || !user.goal) {
    redirect("/onboarding");
  }

  const week = currentWeek();

  return (
    <div className="min-h-dvh">
      <AppHeader user={user} />
      <Dashboard initialWeek={week} goal={user.goal} />
    </div>
  );
}
