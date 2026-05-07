import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { getCurrentUser } from "@/lib/auth/currentUser";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (user.onboardedAt) {
    redirect("/dashboard");
  }
  return (
    <main className="min-h-dvh">
      <OnboardingWizard
        defaults={{
          gender: user.gender ?? undefined,
          weightKg: user.weightKg ? Number(user.weightKg) : undefined,
          heightCm: user.heightCm ? Number(user.heightCm) : undefined,
          goal: user.goal ?? undefined,
        }}
      />
    </main>
  );
}
