import { AppHeader } from "@/components/dashboard/AppHeader";
import { DietaryWizard } from "@/components/dietary/DietaryWizard";
import { getCurrentUser } from "@/lib/auth/currentUser";

export default async function DietaryProfilePage() {
  const user = await getCurrentUser();
  return (
    <div className="min-h-dvh">
      <AppHeader user={user} />
      <DietaryWizard
        defaults={{
          healthConditions: user.healthConditions,
          dietaryPreferences: user.dietaryPreferences,
          cravings: user.cravings,
        }}
      />
    </div>
  );
}
