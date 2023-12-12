DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_comment_id_fk" FOREIGN KEY ("parent_id") REFERENCES "comments"("comment_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
