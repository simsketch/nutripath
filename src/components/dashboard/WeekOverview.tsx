"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { macroIconMap } from "./MacroIcons";
import type { DayPlan } from "@/lib/db/schema";

export function WeekOverview({
  days,
  onRegenerate,
  regenerating,
}: {
  days: DayPlan[];
  onRegenerate: () => void;
  regenerating: boolean;
}) {
  const totals = days.reduce(
    (acc, d) => {
      for (const m of d.meals) {
        acc.calories += m.calories;
        acc.protein += m.protein;
        acc.carbs += m.carbs;
        acc.fat += m.fat;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
  const n = days.length || 1;
  const avg = {
    calories: Math.round(totals.calories / n),
    protein: Math.round(totals.protein / n),
    carbs: Math.round(totals.carbs / n),
    fat: Math.round(totals.fat / n),
  };

  const items = [
    { key: "calories" as const, label: "Avg Calories", value: avg.calories, unit: "kcal/day" },
    { key: "protein" as const, label: "Avg Protein", value: avg.protein, unit: "g/day" },
    { key: "carbs" as const, label: "Avg Carbs", value: avg.carbs, unit: "g/day" },
    { key: "fat" as const, label: "Avg Fat", value: avg.fat, unit: "g/day" },
  ];

  return (
    <section className="reveal reveal-1">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Weekly Overview</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          disabled={regenerating}
        >
          <Sparkles className="h-4 w-4" />
          {regenerating ? "Generating…" : "Regenerate"}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map(({ key, label, value, unit }) => {
          const { Icon, color } = macroIconMap[key];
          return (
            <Card key={key} className="p-4">
              <div className={`mb-2 flex items-center gap-1.5 text-xs text-muted-foreground`}>
                <Icon className={`h-3.5 w-3.5 ${color}`} />
                {label}
              </div>
              <div className="font-display text-2xl font-semibold">{value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{unit}</div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
