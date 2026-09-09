CREATE TABLE "stadium_checkins" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"venue_id" text NOT NULL,
	"venue_name" text NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stadium_checkins_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "moments" ADD COLUMN "owner_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "moments" ADD COLUMN "media_type" text DEFAULT 'image' NOT NULL;--> statement-breakpoint
ALTER TABLE "moments" ADD COLUMN "token_id" text;--> statement-breakpoint
ALTER TABLE "moments" ADD COLUMN "serial" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "moments" ADD COLUMN "max_serial" integer DEFAULT 2500 NOT NULL;--> statement-breakpoint
ALTER TABLE "moments" ADD COLUMN "likes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "moments" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "moments" ADD COLUMN "is_listed" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "stadium_checkins" ADD CONSTRAINT "stadium_checkins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moments" ADD CONSTRAINT "moments_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;