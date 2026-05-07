"use client";

import { useState, useTransition } from "react";
import { Apple, RefreshCw, ThumbsDown } from "lucide-react";
import type { DayOfWeek, Meal } from "@/lib/db/schema";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MealCard({
  meal,
  day,
  onSwap,
}: {
  meal: Meal;
  day?: DayOfWeek;
  onSwap?: (args: { day: DayOfWeek; mealType: Meal["type"]; dislike: boolean }) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function trigger(dislike: boolean) {
    if (!onSwap || !day) return;
    setError(null);
    startTransition(async () => {
      try {
        await onSwap({ day, mealType: meal.type, dislike });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Swap failed");
      }
    });
  }

  return (
    <Card className={cn("p-4", pending && "opacity-60")}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cutting/60 text-cutting-foreground">
          <Apple className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold">{meal.name}</h4>
            <span className="shrink-0 text-sm font-medium text-cutting-foreground">
              {meal.calories} kcal
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{meal.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>P: {meal.protein}g</span>
              <span>C: {meal.carbs}g</span>
              <span>F: {meal.fat}g</span>
            </div>
            {onSwap && day && (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => trigger(false)}
                  disabled={pending}
                  aria-label="Swap this meal"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", pending && "animate-spin")} />
                </button>
                <button
                  type="button"
                  onClick={() => trigger(true)}
                  disabled={pending}
                  aria-label="Don't suggest this again"
                  title="Don't suggest this again"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
          {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </Card>
  );
}
