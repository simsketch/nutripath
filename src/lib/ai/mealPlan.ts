import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  dayOfWeekEnum,
  mealTypeEnum,
  type DayPlan,
  type Goal,
} from "@/lib/db/schema";
import {
  CRAVINGS,
  DIETARY_PREFERENCES,
  HEALTH_CONDITIONS,
  findOption,
} from "@/lib/content/dietaryFixes";

const MODEL = "claude-haiku-4-5-20251001";

const MealSchema = z.object({
  type: z.enum(mealTypeEnum),
  name: z.string().min(1).max(80),
  description: z.string().min(1).max(280),
  calories: z.number().int().nonnegative(),
  protein: z.number().int().nonnegative(),
  carbs: z.number().int().nonnegative(),
  fat: z.number().int().nonnegative(),
});

const DayPlanSchema = z.object({
  day: z.enum(dayOfWeekEnum),
  meals: z.array(MealSchema).length(4),
});

const PlanSchema = z.object({
  days: z.array(DayPlanSchema).length(7),
});

export type GenerateInput = {
  gender: "male" | "female";
  weightKg: number;
  heightCm: number;
  goal: Goal;
  targetCalories: number;
  healthConditions: string[];
  dietaryPreferences: string[];
  cravings: string[];
};

const goalGuidance: Record<Goal, string> = {
  bulking:
    "Surplus calories with high protein (1.6–2.2g/kg). Emphasise nutrient-dense calorie sources: oats, rice, eggs, salmon, nut butters, full-fat dairy.",
  cutting:
    "Sustained moderate deficit with high protein (2.0–2.4g/kg) to preserve lean mass. Prioritise volume foods (vegetables, lean protein, whole grains, legumes).",
  healthy:
    "Balanced macros centred on whole foods, plenty of vegetables, lean proteins, and slow-release carbs. Variety across the week.",
};

function buildPrompt(input: GenerateInput): string {
  const conditions = input.healthConditions
    .map((s) => findOption(HEALTH_CONDITIONS, s)?.label)
    .filter(Boolean);
  const prefs = input.dietaryPreferences
    .map((s) => findOption(DIETARY_PREFERENCES, s)?.label)
    .filter(Boolean);
  const cravings = input.cravings
    .map((s) => findOption(CRAVINGS, s)?.label)
    .filter(Boolean);

  return [
    `You are a registered dietitian generating a 7-day meal plan.`,
    `User profile:`,
    `- ${input.gender}, ${input.weightKg}kg, ${input.heightCm}cm`,
    `- Goal: ${input.goal}. ${goalGuidance[input.goal]}`,
    `- Daily calorie target: ${input.targetCalories} kcal (each day's meals must sum within ±5%).`,
    conditions.length ? `- Health conditions: ${conditions.join(", ")}` : null,
    prefs.length ? `- Dietary restrictions (must respect strictly): ${prefs.join(", ")}` : null,
    cravings.length ? `- Habits to manage gently: ${cravings.join(", ")}` : null,
    ``,
    `Rules:`,
    `1. Produce exactly 7 days, Monday through Sunday in order.`,
    `2. Each day must have exactly 4 meals: breakfast, lunch, dinner, snack (in that order).`,
    `3. Variety: do not repeat the same meal name twice across the week.`,
    `4. Macros are integers in grams. Calories per meal are integers.`,
    `5. Descriptions are concise (one sentence) and concrete (key ingredients + cooking style).`,
    `6. Strictly respect all dietary restrictions — do not include forbidden ingredients.`,
    ``,
    `Submit your plan via the submit_meal_plan tool. Do not include any prose outside the tool call.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function generateMealPlan(input: GenerateInput): Promise<DayPlan[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const client = new Anthropic({ apiKey });

  const tool = {
    name: "submit_meal_plan",
    description: "Submit the finalised 7-day meal plan.",
    input_schema: {
      type: "object" as const,
      properties: {
        days: {
          type: "array",
          minItems: 7,
          maxItems: 7,
          items: {
            type: "object",
            properties: {
              day: { type: "string", enum: dayOfWeekEnum },
              meals: {
                type: "array",
                minItems: 4,
                maxItems: 4,
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: mealTypeEnum },
                    name: { type: "string" },
                    description: { type: "string" },
                    calories: { type: "integer" },
                    protein: { type: "integer" },
                    carbs: { type: "integer" },
                    fat: { type: "integer" },
                  },
                  required: ["type", "name", "description", "calories", "protein", "carbs", "fat"],
                },
              },
            },
            required: ["day", "meals"],
          },
        },
      },
      required: ["days"],
    },
  };

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    tools: [tool],
    tool_choice: { type: "tool", name: "submit_meal_plan" },
    messages: [{ role: "user", content: buildPrompt(input) }],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );
  if (!toolUse) {
    throw new Error("LLM did not return a tool_use block");
  }

  const parsed = PlanSchema.safeParse(toolUse.input);
  if (!parsed.success) {
    throw new Error(
      `LLM produced invalid plan shape: ${parsed.error.message.slice(0, 200)}`,
    );
  }

  return parsed.data.days;
}
