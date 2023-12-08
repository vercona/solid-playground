import { sql } from "drizzle-orm";
import {
  SelectedFields,
  pgTable,
  uuid,
  timestamp,
  integer,
  text,
  pgView,
  boolean,
  QueryBuilder,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { customType } from "drizzle-orm/pg-core";

const ltree = customType<{ data: string }>({
  dataType() {
    return 'ltree';
  },
});

export const usersTableName = "profiles";
export const postsTableName = "posts";
export const commentsTableName = "comments";

// const qb = new QueryBuilder();

export const users = pgTable(usersTableName, {
  user_id: uuid("user_id").primaryKey().defaultRandom().notNull(),
  username: text("username").unique().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable(postsTableName, {
  post_id: uuid("post_id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.user_id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  num_of_children: integer("num_of_children").notNull().default(0),
});

export const comments = pgTable(commentsTableName, {
  comment_id: uuid("comment_id").primaryKey().defaultRandom(),
  comment_num: integer("comment_num").notNull(),
  level: integer("level").notNull(),
  parent_id: uuid("parent_id"),
  user_id: uuid("user_id").references(() => users.user_id),
  post_id: uuid("post_id")
    .references(() => posts.post_id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  body: text("body"),
  likes: integer("likes").default(0).notNull(),
  dislikes: integer("dislikes").default(0).notNull(),
  is_deleted: boolean("is_deleted").notNull().default(false),
  // num_of_replies: integer('num_of_replies').notNull().default(0)
  num_of_children: integer("num_of_children").notNull().default(0),
});


// {
//   comment_id: comments.comment_id,
//   level: comments.level,
//   parent_id: comments.parent_id,
//   user_id: comments.user_id,
//   post_id: comments.post_id,
//   created_at: comments.created_at,
//   content: sql<string>`"content"`,
//   likes: comments.likes,
//   dislikes: comments.dislikes,
//   is_deleted: comments.is_deleted
// }

// export const commentsView = pgView("comments_view", {
//   comment_id: uuid("comment_id"),
//   level: integer("level").notNull(),
//   parent_id: uuid("parent_id"),
//   user_id: uuid("user_id")
//     .references(() => users.user_id)
//     .notNull(),
//   post_id: uuid("post_id")
//     .references(() => posts.post_id)
//     .notNull(),
//   created_at: timestamp("created_at"),
//   content: text("content").notNull(),
//   likes: integer("likes").default(0),
//   dislikes: integer("dislikes").default(0),
//   is_deleted: boolean("is_deleted"),
// }).as(sql`select * from ${comments}`);

// export const commentsView = pgView("comments_view").as((qb) => qb.select().from(comments));


export const createUserInput = createInsertSchema(users).omit({ user_id: true, created_at: true });
export const createPostInput = createInsertSchema(posts).omit({ post_id: true, created_at: true });
export const createCommentInput = createInsertSchema(comments).omit({
  comment_id: true,
  dislikes: true,
  likes: true,
  created_at: true,
  comment_num: true
});
export const deleteComment = createSelectSchema(comments).pick({ comment_id: true });


export const getPostInput = createSelectSchema(posts).pick({ post_id: true });
export const getAllCommentsInput = createSelectSchema(comments).pick({ post_id: true });
export const getRepliedComments = createSelectSchema(comments)
  .pick({ post_id: true, parent_id: true })
  .extend({
    beginCommentNum: z.number(),
    endCommentNum: z.number(),
    levelLimit: z.number().optional(),
    startUuidKey: z.string(),
  });

const userSchema = createSelectSchema(users)
  .omit({ created_at: true });
export const getPost = createSelectSchema(posts).omit({user_id: true}).extend({ created_at: z.date(), user: userSchema });