import {pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";

export const EventSchema = pgTable("event", {
  id: serial('id').primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  feature_image: text("feature_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export type EventType = typeof EventSchema.$inferSelect
export const EventInsertSchema = createInsertSchema(EventSchema);