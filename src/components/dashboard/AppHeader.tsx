import Link from "next/link";
import { ClipboardList, HeartPulse, Settings, ShoppingBasket, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { goalMeta } from "@/lib/content/goals";
import type { DbUser } from "@/lib/db/schema";

export function AppHeader({ user }: { user: DbUser }) {
  const meta = user.goal ? goalMeta(user.goal) : null;

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold leading-none">
              Meal Planner
            </div>
            {meta && (
              <Badge variant={meta.badgeVariant} className="mt-1">
                <meta.icon className="h-3 w-3" />
                {meta.label}
              </Badge>
            )}
          </div>
        </Link>

        <nav className="flex items-center gap-2 text-muted-foreground">
          <Link
            href="/grocery-list"
            aria-label="Grocery list"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary hover:text-foreground"
          >
            <ShoppingBasket className="h-5 w-5" />
          </Link>
          <Link
            href="/health-tips"
            aria-label="Health tips"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary hover:text-foreground"
          >
            <HeartPulse className="h-5 w-5" />
          </Link>
          <Link
            href="/dietary-profile"
            aria-label="Dietary profile"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary hover:text-foreground"
          >
            <ClipboardList className="h-5 w-5" />
          </Link>
          <Link
            href="/settings"
            aria-label="Settings"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
