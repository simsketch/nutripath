import { Apple } from "lucide-react";
import type { Meal } from "@/lib/db/schema";
import { Card } from "@/components/ui/card";

export function MealCard({ meal }: { meal: Meal }) {
  return (
    <Card className="p-4">
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
          <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
            <span>P: {meal.protein}g</span>
            <span>C: {meal.carbs}g</span>
            <span>F: {meal.fat}g</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
