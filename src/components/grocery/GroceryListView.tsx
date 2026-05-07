"use client";

import { useEffect, useState, useTransition } from "react";
import {
  ArrowLeft,
  Beef,
  Carrot,
  Check,
  Milk,
  Package,
  RefreshCw,
  Snowflake,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { GroceryCategory, GroceryItem, GroceryList } from "@/lib/db/schema";

const CATEGORY_META: Record<
  GroceryCategory,
  { label: string; Icon: typeof Carrot; tint: string }
> = {
  produce: { label: "Produce", Icon: Carrot, tint: "text-emerald-600" },
  protein: { label: "Protein", Icon: Beef, tint: "text-rose-500" },
  dairy: { label: "Dairy", Icon: Milk, tint: "text-sky-500" },
  pantry: { label: "Pantry", Icon: Package, tint: "text-amber-600" },
  frozen: { label: "Frozen", Icon: Snowflake, tint: "text-cyan-500" },
  other: { label: "Other", Icon: Package, tint: "text-muted-foreground" },
};

const CATEGORY_ORDER: GroceryCategory[] = [
  "produce",
  "protein",
  "dairy",
  "pantry",
  "frozen",
  "other",
];

export function GroceryListView({ planId }: { planId: string }) {
  const [list, setList] = useState<GroceryList | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, startGen] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/meal-plan/grocery-list", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ planId }),
        });
        if (cancelled) return;
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          setError(body?.error ?? "Could not load grocery list.");
          return;
        }
        const data = await res.json();
        setList(data.groceryList ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [planId]);

  function regenerate() {
    setError(null);
    startGen(async () => {
      const res = await fetch("/api/meal-plan/grocery-list", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ planId, regenerate: true }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Regeneration failed.");
        return;
      }
      const data = await res.json();
      setList(data.groceryList ?? null);
      setChecked(new Set());
    });
  }

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const grouped: Partial<Record<GroceryCategory, GroceryItem[]>> =
    list?.items.reduce<Partial<Record<GroceryCategory, GroceryItem[]>>>(
      (acc, item) => {
        (acc[item.category] ??= []).push(item);
        return acc;
      },
      {},
    ) ?? {};

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </Button>
        {list && (
          <Button
            variant="outline"
            size="sm"
            onClick={regenerate}
            disabled={generating}
          >
            <RefreshCw className={generating ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Regenerate
          </Button>
        )}
      </div>

      <header className="reveal reveal-1 mb-4">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          This week&apos;s groceries
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Aggregated across all 28 meals — combine, swap, or strike through what
          you already have.
        </p>
      </header>

      {loading && (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Loading…
        </p>
      )}

      {!loading && !list && (
        <Card className="reveal reveal-2 mt-6 p-6 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">
            {error ?? "No grocery list yet."}
          </p>
          <Button className="mt-4" onClick={regenerate} disabled={generating}>
            {generating ? "Generating…" : "Generate grocery list"}
          </Button>
        </Card>
      )}

      {!loading && list && (
        <div className="reveal reveal-2 space-y-4">
          {CATEGORY_ORDER.map((cat) => {
            const items = grouped[cat] ?? [];
            if (items.length === 0) return null;
            const meta = CATEGORY_META[cat];
            return (
              <Card key={cat} className="overflow-hidden">
                <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-2.5 text-sm font-semibold">
                  <meta.Icon className={`h-4 w-4 ${meta.tint}`} />
                  {meta.label}
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <ul className="divide-y divide-border">
                  {items.map((item, idx) => {
                    const key = `${cat}-${idx}-${item.name}`;
                    const isChecked = checked.has(key);
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => toggle(key)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-secondary/40"
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              isChecked
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border"
                            }`}
                            aria-hidden
                          >
                            {isChecked && <Check className="h-3 w-3" />}
                          </span>
                          <div
                            className={`flex-1 ${
                              isChecked
                                ? "text-muted-foreground line-through"
                                : ""
                            }`}
                          >
                            <span className="font-medium">{item.name}</span>{" "}
                            <span className="text-sm text-muted-foreground">
                              · {item.quantity}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            );
          })}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}
    </main>
  );
}
