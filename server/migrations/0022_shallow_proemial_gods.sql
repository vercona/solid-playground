ALTER TABLE "comments" RENAME COLUMN "num_of_replies" TO "num_of_children";--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN IF EXISTS "id_path";