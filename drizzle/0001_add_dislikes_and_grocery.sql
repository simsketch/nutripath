ALTER TABLE "nutripath"."meal_plans" ADD COLUMN "grocery_list" jsonb;--> statement-breakpoint
ALTER TABLE "nutripath"."users" ADD COLUMN "disliked_meals" text[] DEFAULT ARRAY[]::text[] NOT NULL;