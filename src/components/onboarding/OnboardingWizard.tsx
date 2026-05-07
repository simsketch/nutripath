"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Ruler, User as UserIcon, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepIndicator } from "@/components/ui/step-indicator";
import { GOALS } from "@/lib/content/goals";
import type { Gender, Goal } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { saveOnboarding } from "@/app/(app)/onboarding/actions";

type Defaults = Partial<{
  gender: Gender;
  weightKg: number;
  heightCm: number;
  goal: Goal;
}>;

export function OnboardingWizard({ defaults }: { defaults?: Defaults }) {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<Gender | undefined>(defaults?.gender);
  const [weight, setWeight] = useState<string>(
    defaults?.weightKg ? String(defaults.weightKg) : "",
  );
  const [height, setHeight] = useState<string>(
    defaults?.heightCm ? String(defaults.heightCm) : "",
  );
  const [goal, setGoal] = useState<Goal | undefined>(defaults?.goal);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const weightNum = Number(weight);
  const heightNum = Number(height);
  const step1Valid =
    gender &&
    Number.isFinite(weightNum) &&
    weightNum > 0 &&
    Number.isFinite(heightNum) &&
    heightNum > 0;

  function submit() {
    if (!gender || !goal) return;
    setError(null);
    startTransition(async () => {
      try {
        await saveOnboarding({
          gender,
          weightKg: weightNum,
          heightCm: heightNum,
          goal,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <div className="mb-8 flex justify-center">
        <StepIndicator current={step} total={2} />
      </div>

      {step === 1 && (
        <div className="reveal reveal-1 text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
            <UserIcon className="h-5 w-5" />
          </div>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Tell us about you
          </h1>
          <p className="mt-3 text-muted-foreground">
            We&apos;ll use this to calculate your personalised calorie and macro
            targets.
          </p>

          <Card className="mt-8 p-6 text-left">
            <div className="mb-4">
              <Label className="mb-2 block">Gender</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={cn(
                      "rounded-xl border bg-card px-4 py-3 text-left transition-all",
                      gender === g
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-foreground/30",
                    )}
                  >
                    <span className="text-base">
                      {g === "male" ? "👨 Male" : "👩 Female"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="weight" className="mb-2 flex items-center gap-2">
                <Weight className="h-4 w-4" /> Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                inputMode="decimal"
                min={20}
                max={500}
                placeholder="e.g. 75"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="height" className="mb-2 flex items-center gap-2">
                <Ruler className="h-4 w-4" /> Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                inputMode="decimal"
                min={80}
                max={300}
                placeholder="e.g. 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </Card>

          <div className="mt-6 flex justify-end">
            <Button disabled={!step1Valid} onClick={() => setStep(2)}>
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="reveal reveal-1 text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
            🍽️
          </div>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            What&apos;s your goal?
          </h1>
          <p className="mt-3 text-muted-foreground">
            We&apos;ll create a personalised weekly meal plan tailored to your
            fitness journey.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {GOALS.map((g) => {
              const Icon = g.icon;
              const selected = goal === g.slug;
              return (
                <button
                  key={g.slug}
                  type="button"
                  onClick={() => setGoal(g.slug)}
                  className={cn(
                    "rounded-2xl border p-5 text-left transition-all",
                    g.badgeVariant === "bulking" && "bg-bulking/60",
                    g.badgeVariant === "cutting" && "bg-cutting/60",
                    g.badgeVariant === "healthy" && "bg-healthy/60",
                    selected
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent hover:border-foreground/20",
                  )}
                >
                  <Icon className="mb-3 h-6 w-6" />
                  <div className="font-display text-lg font-semibold">
                    {g.label}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {g.description}
                  </p>
                  <div className="mt-3 inline-block rounded-full bg-card/80 px-3 py-1 text-xs text-foreground/80">
                    {g.range}
                  </div>
                </button>
              );
            })}
          </div>

          {error && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          )}

          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(1)} disabled={pending}>
              Back
            </Button>
            <Button onClick={submit} disabled={!goal || pending}>
              {pending ? "Saving…" : "Get Started"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
