import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  numeric,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const nutripath = pgSchema("nutripath");

export const genderEnum = ["male", "female"] as const;
export type Gender = (typeof genderEnum)[number];

export const goalEnum = ["bulking", "cutting", "healthy"] as const;
export type Goal = (typeof goalEnum)[number];

export const mealTypeEnum = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
] as const;
export type MealType = (typeof mealTypeEnum)[number];

export const dayOfWeekEnum = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
export type DayOfWeek = (typeof dayOfWeekEnum)[number];

export type Meal = {
  type: MealType;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type DayPlan = {
  day: DayOfWeek;
  meals: Meal[];
};

export const users = nutripath.table("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  imageUrl: text("image_url"),

  gender: text("gender", { enum: genderEnum }),
  weightKg: numeric("weight_kg", { precision: 5, scale: 2 }),
  heightCm: numeric("height_cm", { precision: 5, scale: 2 }),
  goal: text("goal", { enum: goalEnum }),

  healthConditions: text("health_conditions")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  dietaryPreferences: text("dietary_preferences")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  cravings: text("cravings")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),

  onboardedAt: timestamp("onboarded_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mealPlans = nutripath.table(
  "meal_plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    year: integer("year").notNull(),
    weekNumber: integer("week_number").notNull(),
    goal: text("goal", { enum: goalEnum }).notNull(),
    targetCalories: integer("target_calories").notNull(),
    days: jsonb("days").$type<DayPlan[]>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    uniqueWeek: uniqueIndex("meal_plans_user_year_week_goal_idx").on(
      t.userId,
      t.year,
      t.weekNumber,
      t.goal,
    ),
  }),
);

export type DbUser = typeof users.$inferSelect;
export type DbUserInsert = typeof users.$inferInsert;
export type DbMealPlan = typeof mealPlans.$inferSelect;
export type DbMealPlanInsert = typeof mealPlans.$inferInsert;
