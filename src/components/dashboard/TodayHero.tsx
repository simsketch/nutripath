"use client";

import { useEffect, useState } from "react";
import { ChefHat, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DayPlan, Meal, MealType } from "@/lib/db/schema";

const MEAL_LABEL: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

/**
 * Returns which meal slot is "current" for the local hour, plus a boolean
 * indicating whether the user is mid-window (true) or it's an upcoming meal (false).
 *
 * Windows (local time):
 *  - 04:00–10:30  breakfast
 *  - 10:30–14:30  lunch
 *  - 14:30–17:30  snack
 *  - 17:30–22:00  dinner
 *  - else         next is breakfast tomorrow (we still show today's breakfast as preview)
 */
function currentSlot(now: Date): { type: MealType; nowOrNext: "now" | "next" } {
  const m = now.getHours() * 60 + now.getMinutes();
  if (m >= 240 && m < 630) return { type: "breakfast", nowOrNext: "now" };
  if (m >= 630 && m < 870) return { type: "lunch", nowOrNext: "now" };
  if (m >= 870 && m < 1050) return { type: "snack", nowOrNext: "now" };
  if (m >= 1050 && m < 1320) return { type: "dinner", nowOrNext: "now" };
  return { type: "breakfast", nowOrNext: "next" };
}

export function TodayHero({ plan }: { plan: DayPlan }) {
  // Render time-dependent UI on the client only to avoid hydration mismatches.
  const [slot, setSlot] = useState<{ type: MealType; nowOrNext: "now" | "next" } | null>(
    null,
  );
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer time-dependent state to after mount to avoid SSR/CSR mismatch
    setSlot(currentSlot(new Date()));
    const id = setInterval(() => setSlot(currentSlot(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!slot) return null;

  const meal: Meal | undefined = plan.meals.find((m) => m.type === slot.type);
  if (!meal) return null;

  const upcomingTypes: MealType[] = ["breakfast", "lunch", "snack", "dinner"];
  const upIdx = upcomingTypes.indexOf(slot.type);
  const nextType = upcomingTypes[upIdx + 1];
  const nextMeal = nextType ? plan.meals.find((m) => m.type === nextType) : undefined;

  const heading = slot.nowOrNext === "now" ? "Right now" : "Up next";

  return (
    <Card className="reveal reveal-1 mt-4 overflow-hidden bg-primary text-primary-foreground">
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-80">
          <Clock className="h-3.5 w-3.5" />
          {heading} · {MEAL_LABEL[slot.type]}
        </div>
        <div className="mt-2 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
            <ChefHat className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold leading-tight">
              {meal.name}
            </h2>
            <p className="mt-1 text-sm opacity-90">{meal.description}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-80">
              <span>{meal.calories} kcal</span>
              <span>P {meal.protein}g</span>
              <span>C {meal.carbs}g</span>
              <span>F {meal.fat}g</span>
            </div>
          </div>
        </div>

        {nextMeal && (
          <div className="mt-4 border-t border-primary-foreground/15 pt-3 text-sm opacity-90">
            <span className="font-semibold">Then for {MEAL_LABEL[nextMeal.type]}:</span>{" "}
            {nextMeal.name}
          </div>
        )}
      </div>
    </Card>
  );
}
