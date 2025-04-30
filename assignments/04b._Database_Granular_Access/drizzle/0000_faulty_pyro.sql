CREATE TYPE "public"."role" AS ENUM('tenant', 'superintendent');--> statement-breakpoint
CREATE TABLE "db_users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"social_security_number" text NOT NULL,
	"role" "role" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "db_users" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;