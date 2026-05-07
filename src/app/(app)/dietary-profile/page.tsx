import { DietaryWizard } from "@/components/dietary/DietaryWizard";
import { getCurrentUser } from "@/lib/auth/currentUser";

export default async function DietaryProfilePage() {
  const user = await getCurrentUser();
  return (
    <main className="min-h-dvh">
      <DietaryWizard
        defaults={{
          healthConditions: user.healthConditions,
          dietaryPreferences: user.dietaryPreferences,
          cravings: user.cravings,
        }}
      />
    </main>
  );
}
