import { pgTable, uuid, timestamp, varchar, integer, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("profiles", {
  user_id: uuid("user_id").primaryKey().defaultRandom(),
  username: text("username").unique().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  post_id: uuid("post_id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.user_id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable('comments', {
    comment_id: uuid('comment_id').primaryKey().defaultRandom(),
    level: integer("level").notNull(),
    parent_id: uuid('parent_id'),
    user_id: uuid('user_id').references(() => users.user_id).notNull(),
    post_id: uuid('post_id').references(() => posts.post_id).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    content: text('content').notNull(),
    likes: integer('likes').default(0),
    dislikes: integer('dislikes').default(0)
});

export const createUserInput = createInsertSchema(users).omit({ user_id: true, created_at: true });
export const createPostInput = createInsertSchema(posts).omit({ post_id: true, created_at: true });
export const createCommentInput = createInsertSchema(comments).omit({
  comment_id: true,
  dislikes: true,
  likes: true,
  created_at: true,
});
export const deleteComment = createSelectSchema(comments).pick({ comment_id: true });

export const getPostInput = createSelectSchema(posts).pick({ post_id: true });
export const getAllCommentsInput = createSelectSchema(comments).pick({ post_id: true });

export const getPost = createSelectSchema(posts).extend({ created_at: z.string() });