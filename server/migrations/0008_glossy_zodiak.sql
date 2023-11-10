ALTER TABLE "comments" RENAME COLUMN "commentId" TO "comment_id";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "parentId" TO "parent_id";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "postId" TO "post_id";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "post" RENAME COLUMN "postId" TO "post_id";--> statement-breakpoint
ALTER TABLE "post" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "post" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_user_userId_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_postId_post_postId_fk";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "post_userId_user_userId_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_post_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "post"("post_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
