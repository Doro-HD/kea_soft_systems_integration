CREATE TYPE "public"."role" AS ENUM('tenant', 'superintendent', 'admin');--> statement-breakpoint
CREATE TABLE "complaints" (
	"id" text PRIMARY KEY NOT NULL,
	"from_user" text NOT NULL,
	"against_user" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" text PRIMARY KEY NOT NULL,
	"room_number" integer NOT NULL,
	"tenant_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" "role" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "fk_from_user" FOREIGN KEY ("from_user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;