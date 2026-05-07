"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ShoppingBasket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeekSelector } from "./WeekSelector";
import { WeekOverview } from "./WeekOverview";
import { DayCard } from "./DayCard";
import { TodayHero } from "./TodayHero";
import { todayDay, type WeekRef } from "@/lib/nutrition/week";
import { goalMeta } from "@/lib/content/goals";
import {
  dayOfWeekEnum,
  type DayPlan,
  type Goal,
  type Meal,
} from "@/lib/db/schema";

type LoadedPlan = {
  id: string;
  year: number;
  weekNumber: number;
  goal: Goal;
  targetCalories: number;
  days: DayPlan[];
};

export function Dashboard({
  initialWeek,
  goal,
}: {
  initialWeek: WeekRef;
  goal: Goal;
}) {
  const [week, setWeek] = useState<WeekRef>(initialWeek);
  const [plan, setPlan] = useState<LoadedPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, startGeneration] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const url = new URL("/api/meal-plan/lookup", window.location.origin);
        url.searchParams.set("year", String(week.year));
        url.searchParams.set("weekNumber", String(week.weekNumber));
        const res = await fetch(url, { cache: "no-store" });
        if (cancelled) return;
        if (res.status === 404) {
          setPlan(null);
        } else if (!res.ok) {
          setError("Could not load this week.");
        } else {
          const data = await res.json();
          setPlan(data.plan ?? null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [week.year, week.weekNumber]);

  function generate(regenerate = false) {
    setError(null);
    startGeneration(async () => {
      const res = await fetch("/api/meal-plan/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...week, regenerate }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Generation failed.");
        return;
      }
      const data = await res.json();
      setPlan(data.plan ?? null);
    });
  }

  async function swapMealAt({
    day,
    mealType,
    dislike,
  }: {
    day: DayPlan["day"];
    mealType: Meal["type"];
    dislike: boolean;
  }) {
    if (!plan) return;
    const res = await fetch("/api/meal-plan/swap-meal", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ planId: plan.id, day, mealType, dislike }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ?? "Swap failed");
    }
    const data = await res.json();
    if (data.plan) setPlan(data.plan);
  }

  const meta = goalMeta(goal);
  const today = todayDay();
  const todayPlan = plan?.days.find((d) => d.day === today);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <WeekSelector week={week} onChange={setWeek} />

      {plan && todayPlan && <TodayHero plan={todayPlan} />}

      {loading && (
        <div className="mt-12 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      )}

      {!loading && !plan && (
        <EmptyState
          goalLabel={meta.label.toLowerCase()}
          generating={generating}
          onGenerate={() => generate(false)}
          error={error}
        />
      )}

      {!loading && plan && (
        <div className="mt-6 space-y-6">
          <WeekOverview
            days={plan.days}
            onRegenerate={() => generate(true)}
            regenerating={generating}
          />
          <div className="-mt-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/grocery-list?planId=${plan.id}`}>
                <ShoppingBasket className="h-4 w-4" />
                Grocery list for this week
              </Link>
            </Button>
          </div>
          <section>
            <h2 className="font-display text-xl font-semibold">Daily Meals</h2>
            <div className="mt-3 space-y-3">
              {dayOfWeekEnum.map((day) => {
                const d = plan.days.find((dp) => dp.day === day);
                if (!d) return null;
                return (
                  <DayCard
                    key={day}
                    plan={d}
                    isToday={day === today}
                    defaultOpen={day === today}
                    onSwap={swapMealAt}
                  />
                );
              })}
            </div>
          </section>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}
    </main>
  );
}

function EmptyState({
  goalLabel,
  generating,
  onGenerate,
  error,
}: {
  goalLabel: string;
  generating: boolean;
  onGenerate: () => void;
  error: string | null;
}) {
  return (
    <div className="reveal reveal-1 mt-16 text-center">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary">
        <Sparkles className="h-6 w-6" />
      </div>
      <h2 className="font-display text-2xl font-semibold">No meal plan yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-balance text-muted-foreground">
        Generate a personalized {goalLabel} meal plan for this week using AI.
      </p>
      <Button className="mt-5" onClick={onGenerate} disabled={generating}>
        <Sparkles className="h-4 w-4" />
        {generating ? "Generating…" : "Generate Meal Plan"}
      </Button>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </div>
  );
}
