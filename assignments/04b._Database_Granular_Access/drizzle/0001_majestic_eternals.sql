CREATE TABLE "complaints" (
	"id" text PRIMARY KEY NOT NULL,
	"from_user" text NOT NULL,
	"against_user" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "fk_from_user_id" FOREIGN KEY ("from_user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "fk_against_user_id" FOREIGN KEY ("against_user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;