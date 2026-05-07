CREATE SCHEMA "nutripath";
--> statement-breakpoint
CREATE TABLE "nutripath"."meal_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"week_number" integer NOT NULL,
	"goal" text NOT NULL,
	"target_calories" integer NOT NULL,
	"days" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nutripath"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	"image_url" text,
	"gender" text,
	"weight_kg" numeric(5, 2),
	"height_cm" numeric(5, 2),
	"goal" text,
	"health_conditions" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"dietary_preferences" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"cravings" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"onboarded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
ALTER TABLE "nutripath"."meal_plans" ADD CONSTRAINT "meal_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "nutripath"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "meal_plans_user_year_week_goal_idx" ON "nutripath"."meal_plans" USING btree ("user_id","year","week_number","goal");