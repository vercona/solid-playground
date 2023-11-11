import { pgTable, uuid, timestamp, varchar, integer, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const user = pgTable("profiles", {
  user_id: uuid("user_id").primaryKey().defaultRandom(),
  username: text("username").unique().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const post = pgTable("posts", {
  post_id: uuid("post_id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => user.user_id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const comment = pgTable('comments', {
    comment_id: uuid('comment_id').primaryKey().defaultRandom(),
    level: integer("level").notNull(),
    parent_id: uuid('parent_id'),
    user_id: uuid('user_id').references(() => user.user_id).notNull(),
    post_id: uuid('post_id').references(() => post.post_id).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    content: text('content').notNull(),
    likes: integer('likes').default(0),
    dislikes: integer('dislikes').default(0)
});

export const createUserInput = createInsertSchema(user).omit({ user_id: true, created_at: true });
export const createPostInput = createInsertSchema(post).omit({ post_id: true, created_at: true });
export const createCommentInput = createInsertSchema(comment).omit({
  comment_id: true,
  dislikes: true,
  likes: true,
  createdAt: true,
});

export const getPostInput = createSelectSchema(post).pick({ post_id: true });
export const getAllCommentsInput = createSelectSchema(comment).pick({ post_id: true });

export const getPost = createSelectSchema(post).extend({ created_at: z.string() });
