import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const interests = pgTable("interests", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  source: text("source"),
  metadata: jsonb("metadata"),
});
