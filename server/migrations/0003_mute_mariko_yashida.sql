CREATE TABLE IF NOT EXISTS "post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "applications" RENAME TO "comments";--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "int1" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "parentId" uuid;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "postId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "likes" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "dislikes" integer DEFAULT 0;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_post_id_fk" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
