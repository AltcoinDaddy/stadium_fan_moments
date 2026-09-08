CREATE TABLE "moments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"media_url" text NOT NULL,
	"metadata_url" text,
	"category" text NOT NULL,
	"rarity" text NOT NULL,
	"price" integer NOT NULL,
	"token_symbol" text NOT NULL,
	"match" text NOT NULL,
	"minute" text NOT NULL,
	"location" text NOT NULL,
	"txn_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"privy_id" text NOT NULL,
	"email" text,
	"username" text NOT NULL,
	"avatar" text,
	"wallet_address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_privy_id_unique" UNIQUE("privy_id")
);
--> statement-breakpoint
ALTER TABLE "moments" ADD CONSTRAINT "moments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;