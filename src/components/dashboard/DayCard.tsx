"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MealCard } from "./MealCard";
import { macroIconMap } from "./MacroIcons";
import type { DayPlan, Meal } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

const DAY_LABELS: Record<DayPlan["day"], string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function DayCard({
  plan,
  isToday,
  defaultOpen,
  onSwap,
}: {
  plan: DayPlan;
  isToday?: boolean;
  defaultOpen?: boolean;
  onSwap?: (args: { day: DayPlan["day"]; mealType: Meal["type"]; dislike: boolean }) => Promise<void>;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));

  const totals = plan.meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return (
    <Card className={cn("overflow-hidden", open && "bg-secondary/40")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          {isToday && (
            <span className="h-2 w-2 rounded-full bg-primary" aria-label="Today" />
          )}
          <span className="font-display text-lg font-semibold">
            {DAY_LABELS[plan.day]}
          </span>
          <span className="text-sm text-muted-foreground">
            {totals.calories} kcal
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5">
          <div className="mb-4 grid grid-cols-4 gap-2">
            {(
              [
                { key: "calories", value: totals.calories, unit: "kcal" },
                { key: "protein", value: totals.protein, unit: "g" },
                { key: "carbs", value: totals.carbs, unit: "g" },
                { key: "fat", value: totals.fat, unit: "g" },
              ] as const
            ).map(({ key, value, unit }) => {
              const { Icon, color } = macroIconMap[key];
              return (
                <Card key={key} className="px-3 py-3 text-center">
                  <Icon className={`mx-auto h-4 w-4 ${color}`} />
                  <div className="mt-1.5 font-display text-lg font-semibold leading-none">
                    {value}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {unit}
                  </div>
                </Card>
              );
            })}
          </div>
          <div className="space-y-3">
            {plan.meals.map((m, idx) => (
              <MealCard
                key={`${plan.day}-${m.type}-${idx}`}
                meal={m}
                day={plan.day}
                onSwap={onSwap}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
