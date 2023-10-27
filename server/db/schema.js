import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";

export const applications = pgTable('applications', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', {length: 256}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
