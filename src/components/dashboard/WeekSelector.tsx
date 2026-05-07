"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatWeekLabel, shiftWeek, type WeekRef } from "@/lib/nutrition/week";

export function WeekSelector({
  week,
  onChange,
}: {
  week: WeekRef;
  onChange: (w: WeekRef) => void;
}) {
  return (
    <Card className="flex items-center justify-between p-2">
      <button
        type="button"
        onClick={() => onChange(shiftWeek(week, -1))}
        aria-label="Previous week"
        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          Week {week.weekNumber}
        </div>
        <div className="mt-0.5 font-display text-base font-semibold sm:text-lg">
          {formatWeekLabel(week)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(shiftWeek(week, 1))}
        aria-label="Next week"
        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </Card>
  );
}
