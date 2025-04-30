ALTER TABLE "complaints" DROP CONSTRAINT "fk_from_user_id";
--> statement-breakpoint
ALTER TABLE "complaints" DROP CONSTRAINT "fk_against_user_id";
--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_from_user_users_id_fk" FOREIGN KEY ("from_user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_against_user_users_id_fk" FOREIGN KEY ("against_user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;