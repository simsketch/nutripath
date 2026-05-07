import { AppHeader } from "@/components/dashboard/AppHeader";
import { HealthTipsView } from "@/components/health-tips/HealthTipsView";
import { getCurrentUser } from "@/lib/auth/currentUser";

export default async function HealthTipsPage() {
  const user = await getCurrentUser();
  return (
    <div className="min-h-dvh">
      <AppHeader user={user} />
      <HealthTipsView />
    </div>
  );
}
