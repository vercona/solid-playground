ALTER TABLE "comments" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "content" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "path" text DEFAULT '' NOT NULL;