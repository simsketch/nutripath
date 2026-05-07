import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((step, idx) => {
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                done && "bg-primary text-primary-foreground",
                active && "bg-primary text-primary-foreground ring-4 ring-primary/15",
                !done && !active && "bg-secondary text-muted-foreground",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : step}
            </div>
            {idx < total - 1 && (
              <div
                className={cn(
                  "h-px w-10 transition-colors",
                  step < current ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
