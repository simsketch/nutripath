import { AppHeader } from "@/components/dashboard/AppHeader";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { getCurrentUser } from "@/lib/auth/currentUser";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  return (
    <div className="min-h-dvh">
      <AppHeader user={user} />
      <OnboardingWizard
        defaults={{
          gender: user.gender ?? undefined,
          weightKg: user.weightKg ? Number(user.weightKg) : undefined,
          heightCm: user.heightCm ? Number(user.heightCm) : undefined,
          goal: user.goal ?? undefined,
        }}
      />
    </div>
  );
}
