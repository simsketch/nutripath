"use client";

import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FURTHER_READING,
  TIPS,
  TIP_CATEGORIES,
  type TipCategory,
  type Tip,
} from "@/lib/content/healthTips";

export function HealthTipsView() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <header className="reveal reveal-1 mb-6 text-center">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Health & wellness tips
        </h1>
        <p className="mt-2 text-muted-foreground">
          Quick wins from trusted sources — small habits, real impact.
        </p>
      </header>

      <Tabs defaultValue="all" className="reveal reveal-2">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {TIP_CATEGORIES.map((c) => (
              <TabsTrigger key={c.slug} value={c.slug}>
                <span className="mr-1">{c.emoji}</span>
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all">
          <TipGrid tips={TIPS} />
        </TabsContent>
        {TIP_CATEGORIES.map((c) => (
          <TabsContent key={c.slug} value={c.slug}>
            <TipGrid tips={TIPS.filter((t) => t.category === c.slug)} />
          </TabsContent>
        ))}
      </Tabs>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold">Further reading</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {FURTHER_READING.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 hover:border-foreground/20"
            >
              <div>
                <div className="font-semibold">{r.label}</div>
                <div className="text-xs text-muted-foreground">{r.source}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function TipGrid({ tips }: { tips: Tip[] }) {
  return (
    <div className="mt-2 grid gap-4 sm:grid-cols-2">
      {tips.map((tip) => (
        <Card key={tip.id} className="p-5">
          <div className="mb-2 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {categoryEmoji(tip.category)} {tip.tag}
          </div>
          <h3 className="font-display text-lg font-semibold">{tip.title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{tip.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tip.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {l.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function categoryEmoji(c: TipCategory) {
  return TIP_CATEGORIES.find((tc) => tc.slug === c)?.emoji ?? "";
}
