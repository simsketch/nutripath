import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  groceryCategoryEnum,
  type DayPlan,
  type GroceryList,
} from "@/lib/db/schema";

const MODEL = "claude-haiku-4-5-20251001";

const ItemSchema = z.object({
  name: z.string().min(1).max(80),
  quantity: z.string().min(1).max(40),
  category: z.enum(groceryCategoryEnum),
});

const ListSchema = z.object({
  items: z.array(ItemSchema).min(1).max(120),
});

function buildPrompt(days: DayPlan[]): string {
  const meals = days
    .flatMap((d) =>
      d.meals.map((m) => `${d.day} ${m.type}: ${m.name} — ${m.description}`),
    )
    .join("\n");

  return [
    `You are a grocery list assistant. Aggregate the ingredients needed to cook all 28 meals below into a shopping list for ONE week, for ONE person.`,
    ``,
    `Meals:`,
    meals,
    ``,
    `Rules:`,
    `1. Combine quantities for ingredients that appear across meals (e.g. eggs across multiple breakfasts → "Eggs: 1 dozen").`,
    `2. Use practical store quantities (e.g. "1 lb", "1 bag", "1 dozen", "2 jars", "8 oz"). Default to imperial.`,
    `3. Categorise each item as exactly one of: produce, protein, dairy, pantry, frozen, other.`,
    `4. Skip seasoning staples someone almost certainly already has (salt, pepper, basic dried herbs, cooking oil) UNLESS a meal calls out an unusual one.`,
    `5. Be concise — names like "Chicken breast", not "Boneless skinless chicken breast (~6oz)".`,
    `6. Aim for under 40 items total. Combine ruthlessly.`,
    ``,
    `Submit via the submit_grocery_list tool. No prose outside the tool call.`,
  ].join("\n");
}

export async function generateGroceryList(
  days: DayPlan[],
): Promise<GroceryList> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const client = new Anthropic({ apiKey });

  const tool = {
    name: "submit_grocery_list",
    description: "Submit the categorised grocery list.",
    input_schema: {
      type: "object" as const,
      properties: {
        items: {
          type: "array",
          minItems: 1,
          maxItems: 120,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              quantity: { type: "string" },
              category: { type: "string", enum: groceryCategoryEnum },
            },
            required: ["name", "quantity", "category"],
          },
        },
      },
      required: ["items"],
    },
  };

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    tools: [tool],
    tool_choice: { type: "tool", name: "submit_grocery_list" },
    messages: [{ role: "user", content: buildPrompt(days) }],
  });

  const toolUse = response.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
  );
  if (!toolUse) throw new Error("LLM did not return a tool_use block");

  const parsed = ListSchema.safeParse(toolUse.input);
  if (!parsed.success) {
    throw new Error(
      `LLM produced invalid grocery list: ${parsed.error.message.slice(0, 200)}`,
    );
  }

  return {
    items: parsed.data.items,
    generatedAt: new Date().toISOString(),
  };
}
