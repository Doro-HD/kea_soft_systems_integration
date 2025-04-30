ALTER TABLE "complaints" DROP CONSTRAINT "complaints_from_user_users_id_fk";
--> statement-breakpoint
ALTER TABLE "complaints" DROP CONSTRAINT "complaints_against_user_users_id_fk";
--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "fk_from_user" FOREIGN KEY ("from_user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;