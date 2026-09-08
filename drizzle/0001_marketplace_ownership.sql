ALTER TABLE "moments" ADD COLUMN "owner_id" text;
ALTER TABLE "moments" ADD COLUMN "serial" integer DEFAULT 1 NOT NULL;
ALTER TABLE "moments" ADD COLUMN "max_serial" integer DEFAULT 2500 NOT NULL;
ALTER TABLE "moments" ADD COLUMN "likes" integer DEFAULT 0 NOT NULL;
ALTER TABLE "moments" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;
ALTER TABLE "moments" ADD COLUMN "is_listed" integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
UPDATE "moments" SET "owner_id" = "user_id" WHERE "owner_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "moments" ALTER COLUMN "owner_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "moments" ADD CONSTRAINT "moments_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
