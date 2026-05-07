import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  mealTypeEnum,
  type DayPlan,
  type Goal,
  type Meal,
  type MealType,
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

export type SwapMealInput = {
  goal: Goal;
  targetCalories: number;
  day: DayPlan["day"];
  mealType: MealType;
  /** The meal currently in this slot — the LLM should produce a clearly different alternative. */
  currentMeal: Meal;
  /** Names of all other meals in the week, so we don't suggest a duplicate. */
  otherMealNamesInWeek: string[];
  healthConditions: string[];
  dietaryPreferences: string[];
  cravings: string[];
  dislikedMeals?: string[];
};

function buildPrompt(input: SwapMealInput): string {
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
    `You are a registered dietitian. The user wants to swap one meal in their weekly plan.`,
    ``,
    `Slot: ${input.day} — ${input.mealType}`,
    `Current meal in this slot (replace with something different): "${input.currentMeal.name}" — ${input.currentMeal.description} (${input.currentMeal.calories} kcal, P${input.currentMeal.protein}g/C${input.currentMeal.carbs}g/F${input.currentMeal.fat}g)`,
    ``,
    `Constraints:`,
    `- Goal: ${input.goal}.`,
    `- Day total target: ~${input.targetCalories} kcal (this single meal should hit roughly the same calorie + macro envelope as the meal it replaces, ±15%).`,
    `- Meal type must be: ${input.mealType}.`,
    `- Do not suggest "${input.currentMeal.name}" or a near-duplicate of it.`,
    input.otherMealNamesInWeek.length
      ? `- Do not duplicate any other meal already in the week: ${input.otherMealNamesInWeek.join("; ")}`
      : null,
    conditions.length ? `- Health conditions: ${conditions.join(", ")}` : null,
    prefs.length
      ? `- Dietary restrictions (strictly respect): ${prefs.join(", ")}`
      : null,
    cravings.length ? `- Habits to manage gently: ${cravings.join(", ")}` : null,
    input.dislikedMeals?.length
      ? `- Disliked meals to avoid: ${input.dislikedMeals.join("; ")}`
      : null,
    ``,
    `Submit the replacement via the submit_swap tool. No prose outside the tool call.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function swapMeal(input: SwapMealInput): Promise<Meal> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const client = new Anthropic({ apiKey });

  const tool = {
    name: "submit_swap",
    description: "Submit the replacement meal.",
    input_schema: {
      type: "object" as const,
      properties: {
        meal: {
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
          required: [
            "type",
            "name",
            "description",
            "calories",
            "protein",
            "carbs",
            "fat",
          ],
        },
      },
      required: ["meal"],
    },
  };

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    tools: [tool],
    tool_choice: { type: "tool", name: "submit_swap" },
    messages: [{ role: "user", content: buildPrompt(input) }],
  });

  const toolUse = response.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
  );
  if (!toolUse) throw new Error("LLM did not return a tool_use block");

  const Wrapper = z.object({ meal: MealSchema });
  const parsed = Wrapper.safeParse(toolUse.input);
  if (!parsed.success) {
    throw new Error(
      `LLM produced invalid swap shape: ${parsed.error.message.slice(0, 200)}`,
    );
  }

  // Force the meal type to match the slot, even if the LLM swapped it.
  return { ...parsed.data.meal, type: input.mealType };
}
