ALTER TABLE "comments" RENAME COLUMN "id" TO "commentId";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "post" RENAME COLUMN "id" TO "postId";--> statement-breakpoint
ALTER TABLE "post" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "id" TO "userId";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_postId_post_id_fk";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "post_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_post_postId_fk" FOREIGN KEY ("postId") REFERENCES "post"("postId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
