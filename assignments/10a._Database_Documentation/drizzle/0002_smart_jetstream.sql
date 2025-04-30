ALTER TABLE "complaints" DROP CONSTRAINT "fk_from_user";
--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "fk_against_user" FOREIGN KEY ("against_user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "fk_from_user" FOREIGN KEY ("from_user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;