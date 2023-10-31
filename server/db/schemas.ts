import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";

export const commentsSchema = pgTable('applications', {
    id: uuid('id').primaryKey().defaultRandom(),
    user: varchar('name', {length: 256}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
