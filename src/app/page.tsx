import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-primary">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">
          Eat with intention.
        </h1>
        <p className="mt-4 text-balance text-muted-foreground">
          NutriPath builds a personalised weekly meal plan tailored to your
          body, your goals, and your dietary needs.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/sign-up">Get started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
