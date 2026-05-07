"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepIndicator } from "@/components/ui/step-indicator";
import {
  CRAVINGS,
  DIETARY_PREFERENCES,
  HEALTH_CONDITIONS,
  findOption,
  type Option,
} from "@/lib/content/dietaryFixes";
import { cn } from "@/lib/utils";
import { saveDietaryProfile } from "@/app/(app)/dietary-profile/actions";

type Defaults = Partial<{
  healthConditions: string[];
  dietaryPreferences: string[];
  cravings: string[];
}>;

export function DietaryWizard({ defaults }: { defaults?: Defaults }) {
  const [step, setStep] = useState(1);
  const [conditions, setConditions] = useState<string[]>(
    defaults?.healthConditions ?? [],
  );
  const [preferences, setPreferences] = useState<string[]>(
    defaults?.dietaryPreferences ?? [],
  );
  const [cravings, setCravings] = useState<string[]>(defaults?.cravings ?? []);
  const [pending, startTransition] = useTransition();

  function toggle(list: string[], slug: string) {
    return list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
  }

  function submit() {
    startTransition(async () => {
      await saveDietaryProfile({
        healthConditions: conditions,
        dietaryPreferences: preferences,
        cravings,
      });
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8 flex justify-center">
        <StepIndicator current={step} total={4} />
      </div>

      {step === 1 && (
        <Section
          icon={<Stethoscope className="h-6 w-6" />}
          title="Any health conditions?"
          subtitle="Select any that apply — we'll tailor your meal plan and share specific tips. Skip if none apply."
        >
          <Grid
            options={HEALTH_CONDITIONS}
            selected={conditions}
            onToggle={(slug) => setConditions(toggle(conditions, slug))}
            showHint
          />
          <InlineTips selected={conditions} options={HEALTH_CONDITIONS} />
        </Section>
      )}

      {step === 2 && (
        <Section
          icon={<span className="text-2xl">🥗</span>}
          title="Dietary preferences?"
          subtitle="We'll make sure your meal plan fits your lifestyle. Pick all that apply."
        >
          <Grid
            options={DIETARY_PREFERENCES}
            selected={preferences}
            onToggle={(slug) => setPreferences(toggle(preferences, slug))}
            columns={4}
          />
        </Section>
      )}

      {step === 3 && (
        <Section
          icon={<span className="text-2xl">🍩</span>}
          title="Any habits or cravings?"
          subtitle="Be honest — we'll give you practical tips to manage these without suffering."
        >
          <Grid
            options={CRAVINGS}
            selected={cravings}
            onToggle={(slug) => setCravings(toggle(cravings, slug))}
            secondaryLine="Tap to select"
          />
          <InlineTips selected={cravings} options={CRAVINGS} />
        </Section>
      )}

      {step === 4 && (
        <Section
          icon={<span className="text-2xl">✅</span>}
          title="Your dietary profile"
          subtitle="Here's a summary of what we'll keep in mind for your meal plan."
        >
          <SummaryRow
            label="Health Conditions"
            emoji="🩺"
            values={conditions.map((s) => findOption(HEALTH_CONDITIONS, s)?.label ?? s)}
            empty="None selected"
          />
          <SummaryRow
            label="Dietary Preferences"
            emoji="🥬"
            values={preferences.map((s) => findOption(DIETARY_PREFERENCES, s)?.label ?? s)}
            empty="No restrictions"
          />
          <SummaryRow
            label="Cravings & Habits"
            emoji="🍩"
            values={cravings.map((s) => findOption(CRAVINGS, s)?.label ?? s)}
            empty="None selected"
          />
        </Section>
      )}

      <div className="mt-8 flex items-center justify-between">
        {step > 1 ? (
          <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={pending}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        ) : (
          <span />
        )}
        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)}>
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : "Save & Continue"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="reveal reveal-1 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
        {icon}
      </div>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{subtitle}</p>
      <div className="mt-8 text-left">{children}</div>
    </div>
  );
}

function Grid({
  options,
  selected,
  onToggle,
  columns = 2,
  showHint,
  secondaryLine,
}: {
  options: Option[];
  selected: string[];
  onToggle: (slug: string) => void;
  columns?: 2 | 4;
  showHint?: boolean;
  secondaryLine?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 4 ? "sm:grid-cols-4" : "sm:grid-cols-2",
      )}
    >
      {options.map((opt) => {
        const sel = selected.includes(opt.slug);
        return (
          <button
            key={opt.slug}
            type="button"
            onClick={() => onToggle(opt.slug)}
            className={cn(
              "rounded-xl border bg-card p-4 text-left transition-all",
              sel
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-foreground/30",
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{opt.emoji}</span>
              <span className="font-semibold">{opt.label}</span>
              {sel && (
                <Check className="ml-auto h-4 w-4 text-primary" aria-hidden />
              )}
            </div>
            {showHint && opt.hint && (
              <p className="mt-1 text-sm text-muted-foreground">{opt.hint}</p>
            )}
            {secondaryLine && !showHint && (
              <p className="mt-1 text-xs text-muted-foreground">
                {sel ? "Selected" : secondaryLine}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

function InlineTips({
  selected,
  options,
}: {
  selected: string[];
  options: Option[];
}) {
  if (selected.length === 0) return null;
  const tips = selected
    .map((s) => options.find((o) => o.slug === s))
    .filter((o): o is Option => Boolean(o?.tip));
  if (tips.length === 0) return null;

  return (
    <div className="mt-6 grid gap-3">
      {tips.map((tip) => (
        <Card key={tip.slug} className="bg-accent/40 p-4">
          <div className="flex gap-3">
            <span className="text-xl leading-none">{tip.emoji}</span>
            <div>
              <div className="font-semibold">{tip.label}</div>
              <p className="mt-1 text-sm text-muted-foreground">{tip.tip}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SummaryRow({
  label,
  emoji,
  values,
  empty,
}: {
  label: string;
  emoji: string;
  values: string[];
  empty: string;
}) {
  return (
    <Card className="mb-3 p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl">{emoji}</span>
        <div className="flex-1">
          <div className="font-semibold">{label}</div>
          {values.length === 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">{empty}</p>
          ) : (
            <p className="mt-1 text-sm">{values.join(", ")}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
