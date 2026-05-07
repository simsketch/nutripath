import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth/currentUser";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Onboarding gate. Allow /onboarding itself even if not yet onboarded.
  const h = await headers();
  const pathname = h.get("x-pathname") ?? h.get("next-url") ?? "";
  const isOnboarding = pathname.startsWith("/onboarding");

  if (!user.onboardedAt && !isOnboarding) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
