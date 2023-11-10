ALTER TABLE "post" RENAME TO "posts";--> statement-breakpoint
ALTER TABLE "user" RENAME TO "profiles";--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "user_username_unique";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_post_id_post_post_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "post_user_id_user_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_username_unique" UNIQUE("username");